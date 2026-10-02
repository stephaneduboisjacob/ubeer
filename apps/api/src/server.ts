import { randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Fastify, { type FastifyRequest } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import { Prisma, PrismaClient, OrderStatus, UserRole, DriverApplicationStatus } from "@prisma/client";
import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
import { z, ZodError } from "zod";
import { checkoutSchema, loginSchema, regionCheckSchema, waitlistSchema } from "@ubeer/shared";
import { BtcpayClient, BtcpayConfigurationError, verifyWebhookSignature } from "./btcpay.js";
import { distanceBetween, pointInRegion } from "./geofence.js";
import { clearSession, hashPassword, issueSession, passwordMatches, requireRole, sessionUser, tokenHash, verifyTotp } from "./auth.js";
import { sendMail } from "./email.js";
import { loadEnv } from "./env.js";

loadEnv();

const db = new PrismaClient();
const btcpay = new BtcpayClient();
const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? "info" }, trustProxy: true, bodyLimit: 10 * 1024 * 1024 });
const publicUrl = (process.env.BTCPAY_BASE_URL || process.env.PUBLIC_BASE_URL || "https://ubeer.btcpay.exchange").replace(/\/$/, "");
const redisUrl = process.env.REDIS_URL;
let rateLimitRedis: Redis | undefined;
if (redisUrl) {
  rateLimitRedis = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1, retryStrategy: () => null });
  rateLimitRedis.on("error", (error: Error) => app.log.warn({ err: error }, "Redis rate-limit store unavailable"));
  try { await rateLimitRedis.connect(); }
  catch { rateLimitRedis.disconnect(); rateLimitRedis = undefined; }
}

app.decorate("db", db);
app.removeContentTypeParser("application/json");
app.addContentTypeParser("application/json", { parseAs: "string" }, (request, body, done) => {
  const raw = body.toString();
  request.rawBody = raw;
  try { done(null, raw.length ? JSON.parse(raw) : {}); }
  catch (error) { done(error as Error, undefined); }
});

await app.register(cookie);
await app.register(cors, { origin: process.env.WEB_ORIGIN || "https://ubeer.btcpay.exchange", credentials: true });
await app.register(helmet, { contentSecurityPolicy: false });
await app.register(rateLimit, { max: 300, timeWindow: "5 minutes", redis: rateLimitRedis });
await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 12 } });

const zodJson = (schema: z.ZodTypeAny, value: unknown) => schema.safeParse(value);
const idParam = z.object({ id: z.string().uuid() });
const coordinateQuery = z.object({ latitude: z.coerce.number().min(-90).max(90), longitude: z.coerce.number().min(-180).max(180) });
const writeAudit = (request: FastifyRequest, actorId: string | null, action: string, targetType: string, targetId?: string, metadata?: Prisma.InputJsonValue) =>
  db.auditLog.create({ data: { actorId, action, targetType, targetId, metadata, ipAddress: request.ip } });
const safeEqualString = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};

app.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, "request failed");
  if (error instanceof ZodError) return reply.code(400).send({ error: "Invalid request", details: error.flatten() });
  if (error instanceof BtcpayConfigurationError) return reply.code(503).send({ error: error.message });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return reply.code(409).send({ error: "A record with these details already exists" });
  const errorWithStatus = error as Error & { statusCode?: unknown };
  const statusCode = typeof errorWithStatus.statusCode === "number" ? errorWithStatus.statusCode : 500;
  if (statusCode >= 400 && statusCode < 500) return reply.code(statusCode).send({ error: errorWithStatus.message });
  return reply.code(500).send({ error: "Internal server error" });
});

app.get("/api/health", async () => ({ status: "ok", service: "ubeer-api" }));

app.get("/api/regions", async () => {
  const regions = await db.region.findMany({ where: { active: true }, select: { id: true, name: true, geometry: true, minimumOrderCents: true, deliveryFeeCents: true, ageGate: true } });
  return { regions };
});

app.get("/api/regions/check", async (request, reply) => {
  const parsed = coordinateQuery.safeParse(request.query);
  if (!parsed.success) return reply.code(400).send({ error: "Valid latitude and longitude are required" });
  const coordinate = { latitude: parsed.data.latitude, longitude: parsed.data.longitude };
  const regions = await db.region.findMany({ where: { active: true } });
  const region = regions.find((candidate) => pointInRegion(coordinate, candidate.geometry));
  return region ? { available: true, region: { id: region.id, name: region.name, minimumOrderCents: region.minimumOrderCents, deliveryFeeCents: region.deliveryFeeCents, ageGate: region.ageGate } } : { available: false, region: null };
});

app.get("/api/geocode", { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } }, async (request, reply) => {
  const parsed = z.object({ query: z.string().trim().min(3).max(180) }).safeParse(request.query);
  if (!parsed.success) return reply.code(400).send({ error: "Enter a street address, city, or postal code" });
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(parsed.data.query)}`, {
      headers: { "User-Agent": "uBeer/0.1 (regional delivery lookup)" }, signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return reply.code(502).send({ error: "Address lookup is temporarily unavailable" });
    const results = z.array(z.object({ lat: z.string(), lon: z.string(), display_name: z.string().optional() })).safeParse(await response.json());
    const first = results.success ? results.data[0] : undefined;
    if (!first) return reply.code(404).send({ error: "We could not find that location" });
    return { latitude: Number(first.lat), longitude: Number(first.lon), label: first.display_name ?? parsed.data.query };
  } catch (error) {
    request.log.warn({ err: error }, "geocoder request failed");
    return reply.code(502).send({ error: "Address lookup is temporarily unavailable" });
  }
});

app.post("/api/waitlist", async (request, reply) => {
  const parsed = zodJson(waitlistSchema, request.body);
  if (!parsed.success) return reply.code(400).send({ error: "Please enter a valid email address" });
  const data = parsed.data;
  await db.waitlistEntry.create({ data: { email: data.email.toLowerCase(), latitude: data.latitude, longitude: data.longitude } });
  return reply.code(201).send({ accepted: true });
});

app.get("/api/catalog", async (request, reply) => {
  const parsed = z.object({ regionId: z.string().uuid() }).safeParse(request.query);
  if (!parsed.success) return reply.code(400).send({ error: "A valid regionId is required" });
  const region = await db.region.findFirst({ where: { id: parsed.data.regionId, active: true } });
  if (!region) return reply.code(404).send({ error: "Region not found or inactive" });
  const products = await db.product.findMany({ where: { active: true, stock: { gt: 0 }, regions: { some: { regionId: region.id } } }, orderBy: { name: "asc" } });
  return { region: { id: region.id, name: region.name, ageGate: region.ageGate, minimumOrderCents: region.minimumOrderCents, deliveryFeeCents: region.deliveryFeeCents }, products };
});

app.post("/api/cart/validate", async (request, reply) => {
  const schema = z.object({
    regionId: z.string().uuid(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(24) })).min(1),
  });
  const parsed = schema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error: "Invalid cart" });
  const region = await db.region.findFirst({ where: { id: parsed.data.regionId, active: true } });
  if (!region || !pointInRegion(parsed.data, region.geometry)) return reply.code(403).send({ error: "Delivery is not available at this location" });
  const quantities = new Map<string, number>();
  for (const item of parsed.data.items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  const products = await db.product.findMany({ where: { id: { in: [...quantities.keys()] }, active: true, regions: { some: { regionId: region.id } } }, select: { id: true, name: true, stock: true } });
  if (products.length !== quantities.size) return reply.code(409).send({ error: "A product is unavailable in this region" });
  const unavailable = products.find((product) => product.stock < quantities.get(product.id)!);
  if (unavailable) return reply.code(409).send({ error: `${unavailable.name} has insufficient stock` });
  return { valid: true };
});

app.post("/api/auth/register", { config: { rateLimit: { max: 5, timeWindow: "10 minutes" } } }, async (request, reply) => {
  const schema = z.object({ name: z.string().trim().min(2).max(120), email: z.string().email().max(254), password: z.string().min(12).max(200) });
  const parsed = schema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error: "Enter your name, a valid email, and a password of at least 12 characters" });
  const user = await db.user.create({ data: { name: parsed.data.name, email: parsed.data.email.toLowerCase(), passwordHash: await hashPassword(parsed.data.password), role: UserRole.CUSTOMER } });
  await issueSession(db, reply, user);
  return reply.code(201).send({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post("/api/auth/login", { config: { rateLimit: { max: 8, timeWindow: "10 minutes" } } }, async (request, reply) => {
  const schema = loginSchema.extend({ totp: z.string().regex(/^\d{6}$/).optional() });
  const parsed = schema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error: "Invalid login details" });
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || user.isBanned || !(await passwordMatches(parsed.data.password, user.passwordHash))) return reply.code(401).send({ error: "Email or password is incorrect" });
  if (user.role === UserRole.ADMIN && (!user.totpEnabled || !user.totpSecret || !parsed.data.totp || !verifyTotp(parsed.data.totp, user.totpSecret))) return reply.code(401).send({ error: "A valid administrator authenticator code is required" });
  if (user.role === UserRole.DRIVER && !(await db.driverProfile.findFirst({ where: { userId: user.id, approved: true } }))) return reply.code(403).send({ error: "Driver account is awaiting approval" });
  await issueSession(db, reply, user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
});

app.post("/api/auth/refresh", async (request, reply) => {
  const token = request.cookies.ubeer_refresh;
  if (!token) return reply.code(401).send({ error: "Session expired" });
  const stored = await db.refreshToken.findUnique({ where: { tokenHash: tokenHash(token) }, include: { user: true } });
  if (!stored || stored.revokedAt || stored.expiresAt <= new Date() || stored.user.isBanned) {
    await clearSession(reply);
    return reply.code(401).send({ error: "Session expired" });
  }
  await db.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
  await issueSession(db, reply, stored.user);
  return { user: { id: stored.user.id, name: stored.user.name, email: stored.user.email, role: stored.user.role } };
});

app.post("/api/auth/logout", async (request, reply) => {
  const token = request.cookies.ubeer_refresh;
  if (token) await db.refreshToken.updateMany({ where: { tokenHash: tokenHash(token), revokedAt: null }, data: { revokedAt: new Date() } });
  await clearSession(reply);
  return { ok: true };
});

app.get("/api/auth/me", async (request, reply) => {
  const user = await sessionUser(request, db);
  if (!user) return reply.code(401).send({ error: "Authentication required" });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
});

app.post("/api/checkout", { config: { rateLimit: { max: 8, timeWindow: "10 minutes" } } }, async (request, reply) => {
  const parsed = checkoutSchema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error: "Check your delivery area, age confirmation, email, and cart" });
  const data = parsed.data;
  const region = await db.region.findFirst({ where: { id: data.regionId, active: true } });
  const coordinate = { latitude: data.latitude, longitude: data.longitude };
  if (!region || !pointInRegion(coordinate, region.geometry)) return reply.code(403).send({ error: "Delivery is not available at this location" });
  const user = await sessionUser(request, db);
  const grouped = new Map<string, number>();
  for (const item of data.items) grouped.set(item.productId, (grouped.get(item.productId) ?? 0) + item.quantity);
  const products = await db.product.findMany({ where: { id: { in: [...grouped.keys()] }, active: true, regions: { some: { regionId: region.id } } } });
  if (products.length !== grouped.size) return reply.code(400).send({ error: "One or more products are unavailable in this region" });
  const lines = products.map((product) => ({ product, quantity: grouped.get(product.id)! }));
  if (lines.some(({ product, quantity }) => product.stock < quantity)) return reply.code(409).send({ error: "A product has insufficient stock" });
  const subtotalCents = lines.reduce((sum, line) => sum + line.product.priceCents * line.quantity, 0);
  if (subtotalCents < region.minimumOrderCents) return reply.code(400).send({ error: `Minimum order is $${(region.minimumOrderCents / 100).toFixed(2)}` });
  const totalCents = subtotalCents + region.deliveryFeeCents;
  const deliveryCode = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const deliveryOtpHash = await hashPassword(deliveryCode);
  const accessToken = randomBytes(32).toString("base64url");

  let order;
  try {
    order = await db.$transaction(async (tx) => {
      for (const line of lines) {
        const changed = await tx.product.updateMany({ where: { id: line.product.id, active: true, stock: { gte: line.quantity } }, data: { stock: { decrement: line.quantity } } });
        if (changed.count !== 1) throw new Error("STOCK_CHANGED");
      }
      return tx.order.create({
        data: {
          customerId: user?.id,
          customerEmail: data.customerEmail.toLowerCase(),
          regionId: region.id,
          latitude: data.latitude,
          longitude: data.longitude,
          subtotalCents,
          deliveryFeeCents: region.deliveryFeeCents,
          totalCents,
          currency: "USD",
          ageVerifiedAt: new Date(),
          deliveryOtpHash,
          statusAccessTokenHash: tokenHash(accessToken),
          items: { create: lines.map(({ product, quantity }) => ({ productId: product.id, productName: product.name, unitPriceCents: product.priceCents, quantity })) },
          events: { create: { fromStatus: null, toStatus: OrderStatus.pending_payment, note: "Order created" } },
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "STOCK_CHANGED") return reply.code(409).send({ error: "A product has insufficient stock" });
    throw error;
  }

  try {
    const invoice = await btcpay.createInvoice({ orderId: order.id, amount: (totalCents / 100).toFixed(2), currency: "USD", redirectURL: `${publicUrl}/orders/${order.id}/status` });
    await db.order.update({ where: { id: order.id }, data: { btcpayInvoiceId: invoice.id, btcpayCheckoutLink: invoice.checkoutLink } });
    return reply.code(201).send({ orderId: order.id, checkoutLink: invoice.checkoutLink, statusToken: accessToken, deliveryCode });
  } catch (error) {
    await db.$transaction([
      db.order.update({ where: { id: order.id }, data: { status: OrderStatus.failed } }),
      db.orderStatusEvent.create({ data: { orderId: order.id, fromStatus: OrderStatus.pending_payment, toStatus: OrderStatus.failed, note: "BTCPay invoice could not be created" } }),
      ...lines.map(({ product, quantity }) => db.product.update({ where: { id: product.id }, data: { stock: { increment: quantity } } })),
    ]);
    throw error;
  }
});

app.get("/api/orders/:id/status", async (request, reply) => {
  const params = idParam.safeParse(request.params);
  const query = z.object({ token: z.string().min(32).max(200).optional() }).safeParse(request.query);
  if (!params.success || !query.success) return reply.code(400).send({ error: "Invalid order access" });
  const order = await db.order.findUnique({ where: { id: params.data.id }, include: { items: true, region: { select: { name: true } } } });
  const user = await sessionUser(request, db);
  const hasToken = query.data.token ? safeEqualString(order?.statusAccessTokenHash ?? "", tokenHash(query.data.token)) : false;
  if (!order || (order.customerId !== user?.id && !hasToken)) return reply.code(404).send({ error: "Order not found" });
  return { id: order.id, status: order.status, createdAt: order.createdAt, totalCents: order.totalCents, currency: order.currency, items: order.items.map(({ productName, quantity, unitPriceCents }) => ({ productName, quantity, unitPriceCents })), regionName: order.region.name };
});

app.get("/api/orders", async (request, reply) => {
  const user = await sessionUser(request, db);
  if (!user) return reply.code(401).send({ error: "Authentication required" });
  const orders = await db.order.findMany({ where: { customerId: user.id }, orderBy: { createdAt: "desc" }, select: { id: true, status: true, createdAt: true, paidAt: true, totalCents: true, currency: true, region: { select: { name: true } }, items: { select: { productName: true, quantity: true, unitPriceCents: true } } } });
  return { orders };
});

const statusByInvoiceEvent: Record<string, OrderStatus | undefined> = {
  InvoiceSettled: OrderStatus.paid,
  InvoiceExpired: OrderStatus.failed,
  InvoiceInvalid: OrderStatus.failed,
  InvoiceCreated: undefined,
  InvoiceReceivedPayment: undefined,
  InvoiceProcessing: undefined,
};

async function findEligibleDriver(orderId: string, excludedDriverIds = new Set<string>()) {
  const order = await db.order.findUnique({ where: { id: orderId }, include: { region: true } });
  if (!order || order.status !== OrderStatus.paid || order.driverId) return;
  const previousDeclines = await db.driverDecline.findMany({ where: { orderId }, select: { driverId: true } });
  const excluded = new Set([...excludedDriverIds, ...previousDeclines.map((decline) => decline.driverId)]);
  const candidates = await db.driverProfile.findMany({ where: { regionId: order.regionId, approved: true, online: true, latitude: { not: null }, longitude: { not: null } }, include: { user: true } });
  const origin = { latitude: order.latitude, longitude: order.longitude };
  const eligible = candidates
    .filter((driver) => !excluded.has(driver.userId))
    .filter((driver) => driver.latitude !== null && driver.longitude !== null && pointInRegion({ latitude: driver.latitude, longitude: driver.longitude }, order.region.geometry))
    .sort((a, b) => distanceBetween(origin, { latitude: a.latitude!, longitude: a.longitude! }) - distanceBetween(origin, { latitude: b.latitude!, longitude: b.longitude! }));
  const chosen = eligible[0];
  if (chosen) await db.order.updateMany({ where: { id: order.id, status: OrderStatus.paid, driverId: null }, data: { driverId: chosen.userId } });
}

async function transitionInvoice(deliveryId: string, eventType: string, invoiceId: string | undefined) {
  let settledOrderId: string | undefined;
  let result = "ignored";
  try {
    await db.$transaction(async (tx) => {
      await tx.btcpayEvent.create({ data: { deliveryId, eventType, invoiceId } });
      if (!invoiceId) {
        await tx.btcpayEvent.update({ where: { deliveryId }, data: { processedAt: new Date() } });
        return;
      }
      const order = await tx.order.findUnique({ where: { btcpayInvoiceId: invoiceId }, include: { items: true } });
      if (!order) {
        result = "unmatched";
        await tx.btcpayEvent.update({ where: { deliveryId }, data: { processedAt: new Date() } });
        return;
      }
      const desired = statusByInvoiceEvent[eventType];
      if (desired && order.status === OrderStatus.pending_payment) {
        await tx.order.update({ where: { id: order.id }, data: { status: desired, ...(desired === OrderStatus.paid ? { paidAt: new Date() } : {}) } });
        await tx.orderStatusEvent.create({ data: { orderId: order.id, fromStatus: OrderStatus.pending_payment, toStatus: desired, note: `BTCPay ${eventType}` } });
        if (desired === OrderStatus.failed) {
          for (const item of order.items) await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
        }
        if (desired === OrderStatus.paid) settledOrderId = order.id;
      }
      result = "processed";
      await tx.btcpayEvent.update({ where: { deliveryId }, data: { processedAt: new Date() } });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return "duplicate";
    throw error;
  }
  if (settledOrderId) {
    app.log.info({ orderId: settledOrderId, eventType }, "payment settled");
    await findEligibleDriver(settledOrderId);
    const order = await db.order.findUnique({ where: { id: settledOrderId }, include: { region: true, items: true } });
    if (order) {
      const admins = await db.user.findMany({ where: { role: UserRole.ADMIN, isBanned: false }, select: { email: true } });
      const drivers = await db.driverProfile.findMany({ where: { regionId: order.regionId, approved: true }, include: { user: { select: { email: true } } } });
      const summary = order.items.map((item) => `${item.quantity} × ${item.productName}`).join(", ");
      const messages = [
        { to: order.customerEmail, subject: "uBeer order paid", text: `Your order ${order.id} is paid and being prepared. Items: ${summary}.` },
        ...admins.map(({ email }) => ({ to: email, subject: "uBeer payment received", text: `Order ${order.id} is paid in ${order.region.name}.` })),
        ...drivers.map(({ user }) => ({ to: user.email, subject: "uBeer order available", text: `A paid order is available in ${order.region.name}. Sign in to check assignments.` })),
      ];
      await Promise.all(messages.map((message) => sendMail(message).catch((error: unknown) => app.log.warn({ err: error }, "notification transport failed"))));
    }
  }
  return result;
}

app.post("/api/webhooks/btcpay", { config: { rateLimit: { max: 120, timeWindow: "1 minute" } } }, async (request, reply) => {
  if (!process.env.BTCPAY_WEBHOOK_SECRET) return reply.code(503).send({ error: "BTCPay webhook secret is not configured" });
  const signature = request.headers["btcpay-webhook-sig"] as string | undefined;
  if (!verifyWebhookSignature(request.rawBody, signature)) return reply.code(401).send({ error: "Invalid webhook signature" });
  const schema = z.object({ deliveryId: z.string().min(1).max(200), type: z.string().min(1).max(100), invoiceId: z.string().min(1).max(200).optional() });
  const event = schema.safeParse(request.body);
  if (!event.success) return reply.code(400).send({ error: "Malformed BTCPay webhook payload" });
  const result = await transitionInvoice(event.data.deliveryId, event.data.type, event.data.invoiceId);
  return { received: true, result };
});

app.get("/api/admin/dashboard", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  if (!admin || !admin.totpEnabled) return reply.code(403).send({ error: "Administrator access required" });
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const [ordersToday, paidToday, activeDrivers, failedPayments] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: start } } }),
    db.order.aggregate({ where: { paidAt: { gte: start } }, _sum: { totalCents: true }, _count: true }),
    db.driverProfile.count({ where: { approved: true, online: true } }),
    db.order.count({ where: { status: OrderStatus.failed, createdAt: { gte: start } } }),
  ]);
  return { ordersToday, revenueCents: paidToday._sum.totalCents ?? 0, paidOrdersToday: paidToday._count, activeDrivers, failedPayments };
});

app.get("/api/admin/settings", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  const setting = await db.setting.findUnique({ where: { key: "platform_fee_percent" } });
  return {
    platformFeePercent: Number(setting?.value ?? process.env.PLATFORM_FEE_PERCENT ?? 15),
    btcpay: {
      host: process.env.BTCPAY_HOST ?? "https://payments.btcpay.exchange",
      storeId: process.env.BTCPAY_STORE_ID ? `${process.env.BTCPAY_STORE_ID.slice(0, 4)}••••` : null,
      apiKeyConfigured: Boolean(process.env.BTCPAY_API_KEY),
      webhookSecretConfigured: Boolean(process.env.BTCPAY_WEBHOOK_SECRET),
    },
  };
});

app.patch("/api/admin/settings", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const parsed = z.object({ platformFeePercent: z.number().min(0).max(50) }).safeParse(request.body);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!parsed.success) return reply.code(400).send({ error: "Platform fee must be from 0% to 50%" });
  const setting = await db.setting.upsert({ where: { key: "platform_fee_percent" }, update: { value: String(parsed.data.platformFeePercent) }, create: { key: "platform_fee_percent", value: String(parsed.data.platformFeePercent) } });
  await writeAudit(request, admin.id, "settings.platform_fee.update", "Setting", setting.key, { platformFeePercent: parsed.data.platformFeePercent });
  return { platformFeePercent: Number(setting.value) };
});

app.get("/api/admin/regions", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  return { regions: await db.region.findMany({ orderBy: { createdAt: "desc" } }) };
});

app.post("/api/admin/regions", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  const schema = z.object({ name: z.string().trim().min(2).max(120), active: z.boolean().default(false), geometry: z.record(z.unknown()), minimumOrderCents: z.number().int().min(0), deliveryFeeCents: z.number().int().min(0), ageGate: z.union([z.literal(19), z.literal(21)]) });
  const parsed = schema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error: "Invalid region details" });
  const region = await db.region.create({ data: { ...parsed.data, geometry: parsed.data.geometry as Prisma.InputJsonValue } });
  await writeAudit(request, admin.id, "region.create", "Region", region.id);
  return reply.code(201).send({ region });
});

app.patch("/api/admin/regions/:id", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const params = idParam.safeParse(request.params);
  const schema = z.object({ name: z.string().trim().min(2).max(120).optional(), active: z.boolean().optional(), geometry: z.record(z.unknown()).optional(), minimumOrderCents: z.number().int().min(0).optional(), deliveryFeeCents: z.number().int().min(0).optional(), ageGate: z.union([z.literal(19), z.literal(21)]).optional() }).strict();
  const parsed = schema.safeParse(request.body);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!params.success || !parsed.success || Object.keys(parsed.data).length === 0) return reply.code(400).send({ error: "Invalid region update" });
  const { geometry, ...fields } = parsed.data;
  const region = await db.region.update({ where: { id: params.data.id }, data: { ...fields, ...(geometry ? { geometry: geometry as Prisma.InputJsonValue } : {}) } });
  await writeAudit(request, admin.id, "region.update", "Region", region.id, parsed.data as Prisma.InputJsonValue);
  return { region };
});

app.get("/api/admin/products", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  return { products: await db.product.findMany({ include: { regions: true }, orderBy: { name: "asc" } }) };
});

const productInputSchema = z.object({ name: z.string().trim().min(2).max(160), description: z.string().max(5000).default(""), priceCents: z.number().int().positive(), currency: z.literal("USD").default("USD"), stock: z.number().int().min(0), isTest: z.boolean().default(false), active: z.boolean().default(true), regionIds: z.array(z.string().uuid()).min(1) });
app.post("/api/admin/products", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const parsed = productInputSchema.safeParse(request.body);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!parsed.success) return reply.code(400).send({ error: "Invalid product details" });
  const { regionIds, ...data } = parsed.data;
  const product = await db.product.create({ data: { ...data, regions: { create: regionIds.map((regionId) => ({ regionId })) } } });
  await writeAudit(request, admin.id, "product.create", "Product", product.id);
  return reply.code(201).send({ product });
});

app.patch("/api/admin/products/:id", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const params = idParam.safeParse(request.params);
  const parsed = productInputSchema.partial().safeParse(request.body);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!params.success || !parsed.success || Object.keys(parsed.data).length === 0) return reply.code(400).send({ error: "Invalid product update" });
  const { regionIds, ...data } = parsed.data;
  const product = await db.$transaction(async (tx) => {
    if (regionIds) await tx.productRegion.deleteMany({ where: { productId: params.data.id } });
    return tx.product.update({ where: { id: params.data.id }, data: { ...data, ...(regionIds ? { regions: { create: regionIds.map((regionId) => ({ regionId })) } } : {}) } });
  });
  await writeAudit(request, admin.id, "product.update", "Product", product.id, parsed.data as Prisma.InputJsonValue);
  return { product };
});

app.delete("/api/admin/products/:id", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const params = idParam.safeParse(request.params);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!params.success) return reply.code(400).send({ error: "Invalid product id" });
  const product = await db.product.update({ where: { id: params.data.id }, data: { active: false } });
  await writeAudit(request, admin.id, "product.archive", "Product", product.id);
  return { ok: true };
});

app.get("/api/admin/orders", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const query = z.object({ status: z.nativeEnum(OrderStatus).optional(), limit: z.coerce.number().int().min(1).max(100).default(50), cursor: z.string().uuid().optional() }).safeParse(request.query);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!query.success) return reply.code(400).send({ error: "Invalid filters" });
  const orders = await db.order.findMany({ where: { status: query.data.status }, orderBy: { createdAt: "desc" }, take: query.data.limit, ...(query.data.cursor ? { skip: 1, cursor: { id: query.data.cursor } } : {}), include: { items: true, region: { select: { name: true } }, driver: { select: { id: true, name: true, email: true } } } });
  return { orders };
});

app.patch("/api/admin/orders/:id/status", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const params = idParam.safeParse(request.params);
  const parsed = z.object({ status: z.nativeEnum(OrderStatus), note: z.string().trim().min(3).max(500) }).safeParse(request.body);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!params.success || !parsed.success) return reply.code(400).send({ error: "Invalid status change" });
  const order = await db.order.findUnique({ where: { id: params.data.id } });
  if (!order) return reply.code(404).send({ error: "Order not found" });
  await db.$transaction([
    db.order.update({ where: { id: order.id }, data: { status: parsed.data.status } }),
    db.orderStatusEvent.create({ data: { orderId: order.id, actorId: admin.id, fromStatus: order.status, toStatus: parsed.data.status, note: `Admin override: ${parsed.data.note}` } }),
    db.auditLog.create({ data: { actorId: admin.id, action: "order.status_override", targetType: "Order", targetId: order.id, metadata: parsed.data, ipAddress: request.ip } }),
  ]);
  return { ok: true };
});

app.post("/api/admin/orders/:id/refund-note", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const params = idParam.safeParse(request.params);
  const parsed = z.object({ note: z.string().trim().min(3).max(1000) }).safeParse(request.body);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!params.success || !parsed.success) return reply.code(400).send({ error: "A refund note is required" });
  const order = await db.order.update({ where: { id: params.data.id }, data: { status: OrderStatus.refunded, refundNote: parsed.data.note } });
  await db.$transaction([
    db.orderStatusEvent.create({ data: { orderId: order.id, actorId: admin.id, fromStatus: order.status, toStatus: OrderStatus.refunded, note: parsed.data.note } }),
    db.auditLog.create({ data: { actorId: admin.id, action: "order.refund_note", targetType: "Order", targetId: order.id, metadata: parsed.data, ipAddress: request.ip } }),
  ]);
  return { ok: true };
});

app.get("/api/admin/drivers", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const query = z.object({ status: z.nativeEnum(DriverApplicationStatus).optional() }).safeParse(request.query);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!query.success) return reply.code(400).send({ error: "Invalid filter" });
  const applications = await db.driverApplication.findMany({ where: { status: query.data.status }, include: { region: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } });
  const drivers = await db.driverProfile.findMany({ include: { user: { select: { id: true, email: true, name: true } }, region: { select: { name: true } } } });
  return { applications, drivers };
});

app.get("/api/admin/drivers/applications/:id/document", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const params = idParam.safeParse(request.params);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!params.success) return reply.code(400).send({ error: "Invalid application id" });
  const application = await db.driverApplication.findUnique({ where: { id: params.data.id }, select: { id: true, idDocumentPath: true } });
  if (!application?.idDocumentPath) return reply.code(404).send({ error: "ID document not found" });
  const uploadRoot = path.resolve(process.env.UPLOAD_DIR ?? "/var/lib/ubeer/uploads");
  const documentPath = path.resolve(application.idDocumentPath);
  const relativePath = path.relative(uploadRoot, documentPath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) return reply.code(404).send({ error: "ID document not found" });
  const extension = path.extname(documentPath).toLowerCase();
  const contentType = extension === ".pdf" ? "application/pdf" : extension === ".png" ? "image/png" : "image/jpeg";
  return reply.header("Content-Type", contentType).header("Content-Disposition", `attachment; filename="driver-id-${application.id}${extension}"`).send(createReadStream(documentPath));
});

app.patch("/api/admin/drivers/applications/:id", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const params = idParam.safeParse(request.params);
  const parsed = z.object({ status: z.enum(["approved", "rejected", "suspended"]), note: z.string().max(500).optional() }).safeParse(request.body);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!params.success || !parsed.success) return reply.code(400).send({ error: "Invalid application review" });
  const application = await db.driverApplication.findUnique({ where: { id: params.data.id } });
  if (!application) return reply.code(404).send({ error: "Application not found" });
  let temporaryPassword: string | undefined;
  await db.$transaction(async (tx) => {
    await tx.driverApplication.update({ where: { id: application.id }, data: { status: parsed.data.status, reviewerId: admin.id, reviewNote: parsed.data.note } });
    if (parsed.data.status === "approved") {
      temporaryPassword = randomBytes(18).toString("base64url");
      let user = await tx.user.findUnique({ where: { email: application.email.toLowerCase() } });
      if (!user) user = await tx.user.create({ data: { email: application.email.toLowerCase(), name: application.name, phone: application.phone, role: UserRole.DRIVER, passwordHash: await hashPassword(temporaryPassword) } });
      await tx.user.update({ where: { id: user.id }, data: { role: UserRole.DRIVER, passwordHash: await hashPassword(temporaryPassword), name: application.name, phone: application.phone } });
      await tx.driverProfile.upsert({ where: { userId: user.id }, update: { approved: true, regionId: application.regionId }, create: { userId: user.id, regionId: application.regionId, approved: true } });
    }
    await tx.auditLog.create({ data: { actorId: admin.id, action: `driver_application.${parsed.data.status}`, targetType: "DriverApplication", targetId: application.id, metadata: { note: parsed.data.note ?? null }, ipAddress: request.ip } });
  });
  return { ok: true, ...(temporaryPassword ? { temporaryPassword, deliveryNote: "Give this temporary password to the approved driver over a secure channel." } : {}) };
});

app.post("/api/drivers/applications", async (request, reply) => {
  const fields: Record<string, string> = {};
  let documentPath: string | undefined;
  for await (const part of request.parts()) {
    if (part.type === "file") {
      if (part.fieldname !== "idDocument") return reply.code(400).send({ error: "Unexpected file field" });
      if (!["image/jpeg", "image/png", "application/pdf"].includes(part.mimetype)) return reply.code(400).send({ error: "ID must be a JPEG, PNG, or PDF" });
      const buffer = await part.toBuffer();
      const validContent = part.mimetype === "image/jpeg" ? buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff : part.mimetype === "image/png" ? buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) : buffer.subarray(0, 5).toString() === "%PDF-";
      if (!validContent) return reply.code(400).send({ error: "The uploaded file does not match its declared type" });
      const extension = part.mimetype === "application/pdf" ? ".pdf" : part.mimetype === "image/png" ? ".png" : ".jpg";
      const filename = `${randomBytes(24).toString("hex")}${extension}`;
      const uploadDir = process.env.UPLOAD_DIR ?? "/var/lib/ubeer/uploads";
      await mkdir(uploadDir, { recursive: true, mode: 0o700 });
      const destination = path.join(uploadDir, filename);
      await writeFile(destination, buffer, { mode: 0o600, flag: "wx" });
      documentPath = destination;
    } else fields[part.fieldname] = String(part.value);
  }
  const parsed = z.object({ name: z.string().trim().min(2).max(120), email: z.string().email().max(254), phone: z.string().trim().min(7).max(30), vehicle: z.string().trim().min(2).max(100), licenseNumber: z.string().trim().min(3).max(100), regionId: z.string().uuid() }).safeParse(fields);
  if (!parsed.success || !documentPath) return reply.code(400).send({ error: "Complete all required fields and upload a valid ID document" });
  if (!(await db.region.findFirst({ where: { id: parsed.data.regionId, active: true } }))) return reply.code(400).send({ error: "Select an active delivery region" });
  const application = await db.driverApplication.create({ data: { ...parsed.data, email: parsed.data.email.toLowerCase(), idDocumentPath: documentPath } });
  return reply.code(201).send({ accepted: true, applicationId: application.id });
});

app.post("/api/driver/online", async (request, reply) => {
  const driver = await requireRole(request, db, [UserRole.DRIVER]);
  const parsed = z.object({ online: z.boolean() }).safeParse(request.body);
  if (!driver) return reply.code(403).send({ error: "Approved driver access required" });
  if (!parsed.success) return reply.code(400).send({ error: "online must be true or false" });
  const profile = await db.driverProfile.findUnique({ where: { userId: driver.id } });
  if (!profile?.approved) return reply.code(403).send({ error: "Driver approval required" });
  await db.driverProfile.update({ where: { id: profile.id }, data: { online: parsed.data.online } });
  if (parsed.data.online) {
    const unassigned = await db.order.findMany({ where: { regionId: profile.regionId, status: OrderStatus.paid, driverId: null }, select: { id: true }, take: 25 });
    for (const order of unassigned) await findEligibleDriver(order.id);
  }
  return { online: parsed.data.online };
});

app.post("/api/driver/location", async (request, reply) => {
  const driver = await requireRole(request, db, [UserRole.DRIVER]);
  const parsed = regionCheckSchema.safeParse(request.body);
  if (!driver || !parsed.success) return reply.code(driver ? 400 : 403).send({ error: driver ? "Invalid coordinates" : "Approved driver access required" });
  const profile = await db.driverProfile.findUnique({ where: { userId: driver.id }, include: { region: true } });
  if (!profile?.approved || !pointInRegion(parsed.data, profile.region.geometry)) return reply.code(403).send({ error: "Location is outside your assigned service region" });
  await db.driverProfile.update({ where: { id: profile.id }, data: { latitude: parsed.data.latitude, longitude: parsed.data.longitude, locationUpdated: new Date() } });
  return { received: true };
});

app.get("/api/driver/orders", async (request, reply) => {
  const driver = await requireRole(request, db, [UserRole.DRIVER]);
  if (!driver) return reply.code(403).send({ error: "Approved driver access required" });
  return { orders: await db.order.findMany({ where: { driverId: driver.id, status: { in: [OrderStatus.paid, OrderStatus.accepted, OrderStatus.preparing, OrderStatus.out_for_delivery] } }, include: { items: true, region: { select: { name: true } } }, orderBy: { createdAt: "asc" } }) };
});

app.post("/api/driver/orders/:id/status", async (request, reply) => {
  const driver = await requireRole(request, db, [UserRole.DRIVER]);
  const params = idParam.safeParse(request.params);
  const parsed = z.object({ status: z.enum(["accepted", "preparing", "out_for_delivery", "delivered"]), deliveryCode: z.string().regex(/^\d{6}$/).optional() }).safeParse(request.body);
  if (!driver) return reply.code(403).send({ error: "Approved driver access required" });
  if (!params.success || !parsed.success) return reply.code(400).send({ error: "Invalid order status update" });
  const order = await db.order.findFirst({ where: { id: params.data.id, driverId: driver.id } });
  if (!order) return reply.code(404).send({ error: "Assigned order not found" });
  const transitions: Record<string, OrderStatus[]> = {
    [OrderStatus.paid]: [OrderStatus.accepted],
    [OrderStatus.accepted]: [OrderStatus.preparing],
    [OrderStatus.preparing]: [OrderStatus.out_for_delivery],
    [OrderStatus.out_for_delivery]: [OrderStatus.delivered],
  };
  const next = parsed.data.status as OrderStatus;
  if (!transitions[order.status]?.includes(next)) return reply.code(409).send({ error: `Cannot change order from ${order.status} to ${next}` });
  if (next === OrderStatus.delivered && (!parsed.data.deliveryCode || !(await passwordMatches(parsed.data.deliveryCode, order.deliveryOtpHash)))) return reply.code(403).send({ error: "Enter the six-digit customer delivery code to complete delivery" });
  await db.$transaction([
    db.order.update({ where: { id: order.id }, data: { status: next, ...(next === OrderStatus.delivered ? { deliveredAt: new Date() } : {}) } }),
    db.orderStatusEvent.create({ data: { orderId: order.id, actorId: driver.id, fromStatus: order.status, toStatus: next } }),
  ]);
  return { status: next };
});

app.post("/api/driver/orders/:id/decline", async (request, reply) => {
  const driver = await requireRole(request, db, [UserRole.DRIVER]);
  const params = idParam.safeParse(request.params);
  if (!driver) return reply.code(403).send({ error: "Approved driver access required" });
  if (!params.success) return reply.code(400).send({ error: "Invalid order id" });
  const order = await db.order.findFirst({ where: { id: params.data.id, driverId: driver.id, status: OrderStatus.paid } });
  if (!order) return reply.code(404).send({ error: "Assigned order not found" });
  await db.$transaction([
    db.order.updateMany({ where: { id: order.id, driverId: driver.id, status: OrderStatus.paid }, data: { driverId: null } }),
    db.driverDecline.create({ data: { orderId: order.id, driverId: driver.id } }),
  ]);
  await findEligibleDriver(order.id);
  return { ok: true };
});

app.get("/api/driver/earnings", async (request, reply) => {
  const driver = await requireRole(request, db, [UserRole.DRIVER]);
  if (!driver) return reply.code(403).send({ error: "Approved driver access required" });
  const [setting, orders] = await Promise.all([
    db.setting.findUnique({ where: { key: "platform_fee_percent" } }),
    db.order.findMany({ where: { driverId: driver.id, status: OrderStatus.delivered }, select: { id: true, totalCents: true, deliveredAt: true, createdAt: true } }),
  ]);
  const feePercent = Number(setting?.value ?? process.env.PLATFORM_FEE_PERCENT ?? 15);
  const entries = orders.map((order) => ({ ...order, platformFeeCents: Math.round(order.totalCents * feePercent / 100), earningsCents: order.totalCents - Math.round(order.totalCents * feePercent / 100) }));
  return { platformFeePercent: feePercent, totalEarningsCents: entries.reduce((total, entry) => total + entry.earningsCents, 0), orders: entries };
});

app.get("/api/admin/users", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const query = z.object({ limit: z.coerce.number().int().min(1).max(100).default(50), q: z.string().max(254).optional() }).safeParse(request.query);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!query.success) return reply.code(400).send({ error: "Invalid user search" });
  const users = await db.user.findMany({ where: query.data.q ? { email: { contains: query.data.q, mode: "insensitive" } } : {}, select: { id: true, email: true, name: true, role: true, isBanned: true, createdAt: true }, take: query.data.limit, orderBy: { createdAt: "desc" } });
  return { users };
});

app.patch("/api/admin/users/:id/ban", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const params = idParam.safeParse(request.params);
  const parsed = z.object({ isBanned: z.boolean() }).safeParse(request.body);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!params.success || !parsed.success) return reply.code(400).send({ error: "Invalid ban update" });
  const user = await db.user.update({ where: { id: params.data.id }, data: { isBanned: parsed.data.isBanned } });
  await db.$transaction([
    db.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } }),
    db.auditLog.create({ data: { actorId: admin.id, action: parsed.data.isBanned ? "user.ban" : "user.unban", targetType: "User", targetId: user.id, ipAddress: request.ip } }),
  ]);
  return { ok: true };
});

app.get("/api/admin/audit-log", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const query = z.object({ limit: z.coerce.number().int().min(1).max(100).default(50) }).safeParse(request.query);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!query.success) return reply.code(400).send({ error: "Invalid limit" });
  return { entries: await db.auditLog.findMany({ take: query.data.limit, orderBy: { createdAt: "desc" }, include: { actor: { select: { email: true } } } }) };
});

app.get("/api/admin/payouts", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  return { payouts: await db.payout.findMany({ include: { driverProfile: { include: { user: { select: { email: true, name: true } } } } }, orderBy: { createdAt: "desc" } }) };
});

app.post("/api/admin/payouts", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const parsed = z.object({ driverProfileId: z.string().uuid(), amountCents: z.number().int().positive(), note: z.string().max(500).optional() }).safeParse(request.body);
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!parsed.success) return reply.code(400).send({ error: "Invalid payout" });
  const payout = await db.payout.create({ data: parsed.data });
  await writeAudit(request, admin.id, "payout.create", "Payout", payout.id, parsed.data as Prisma.InputJsonValue);
  return reply.code(201).send({ payout });
});

app.patch("/api/admin/payouts/:id/paid", async (request, reply) => {
  const admin = await requireRole(request, db, [UserRole.ADMIN]);
  const params = idParam.safeParse(request.params);
  const parsed = z.object({ note: z.string().max(500).optional() }).safeParse(request.body ?? {});
  if (!admin) return reply.code(403).send({ error: "Administrator access required" });
  if (!params.success || !parsed.success) return reply.code(400).send({ error: "Invalid payout update" });
  const payout = await db.payout.update({ where: { id: params.data.id }, data: { paidAt: new Date(), note: parsed.data.note } });
  await writeAudit(request, admin.id, "payout.mark_paid", "Payout", payout.id);
  return { payout };
});

const makeRedisConnection = () => {
  if (!redisUrl) return undefined;
  const url = new URL(redisUrl);
  return { host: url.hostname, port: Number(url.port || 6379), username: url.username || undefined, password: url.password || undefined, maxRetriesPerRequest: null as null };
};

let reconcileWorker: Worker | undefined;
let reconcileQueue: Queue | undefined;
const connection = makeRedisConnection();
if (connection) {
  try {
    reconcileQueue = new Queue("ubeer-reconciliation", { connection });
    reconcileWorker = new Worker("ubeer-reconciliation", async () => {
      const olderThan = new Date(Date.now() - 10 * 60 * 1000);
      const orders = await db.order.findMany({ where: { status: OrderStatus.pending_payment, createdAt: { lt: olderThan }, btcpayInvoiceId: { not: null } }, select: { id: true, btcpayInvoiceId: true } });
      for (const order of orders) {
        try {
          const invoice = await btcpay.getInvoice(order.btcpayInvoiceId!);
          const eventType = invoice.status === "Settled" ? "InvoiceSettled" : invoice.status === "Expired" ? "InvoiceExpired" : invoice.status === "Invalid" ? "InvoiceInvalid" : undefined;
          if (eventType) await transitionInvoice(`reconcile:${order.btcpayInvoiceId}:${invoice.status}`, eventType, order.btcpayInvoiceId!);
        } catch (error) { app.log.warn({ err: error, orderId: order.id }, "invoice reconciliation failed"); }
      }
    }, { connection });
    await reconcileQueue.upsertJobScheduler("btcpay-reconciliation-every-5-minutes", { every: 5 * 60 * 1000 }, { name: "reconcile-pending-invoices" });
    app.log.info("BTCPay reconciliation job scheduled");
  } catch (error) { app.log.error({ err: error }, "Redis queue unavailable; reconciliation worker is not running"); }
}

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "127.0.0.1";
await app.listen({ port, host });
app.log.info({ host, port }, "uBeer API listening");

const shutdown = async () => {
  await app.close();
  await reconcileWorker?.close();
  await reconcileQueue?.close();
  if (rateLimitRedis?.status === "ready") await rateLimitRedis.quit();
  await db.$disconnect();
  process.exit(0);
};
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
