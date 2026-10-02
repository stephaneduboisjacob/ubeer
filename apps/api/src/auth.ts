import { createHash, randomBytes } from "node:crypto";
import argon2 from "argon2";
import { authenticator } from "otplib";
import { SignJWT, jwtVerify } from "jose";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { PrismaClient, User, UserRole } from "@prisma/client";

const ACCESS_COOKIE = "ubeer_access";
const REFRESH_COOKIE = "ubeer_refresh";
const accessLifetimeSeconds = 15 * 60;
const refreshLifetimeMs = 30 * 24 * 60 * 60 * 1000;

function jwtKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) throw new Error("JWT_SECRET must contain at least 32 bytes");
  return new TextEncoder().encode(secret);
}

export function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function passwordMatches(password: string, hash: string): Promise<boolean> {
  try { return await argon2.verify(hash, password); } catch { return false; }
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function issueSession(db: PrismaClient, reply: FastifyReply, user: User): Promise<void> {
  const access = await new SignJWT({ role: user.role, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${accessLifetimeSeconds}s`)
    .sign(jwtKey());
  const refresh = randomBytes(48).toString("base64url");
  await db.refreshToken.create({ data: { userId: user.id, tokenHash: tokenHash(refresh), expiresAt: new Date(Date.now() + refreshLifetimeMs) } });
  const secure = process.env.NODE_ENV === "production";
  reply.setCookie(ACCESS_COOKIE, access, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: accessLifetimeSeconds });
  reply.setCookie(REFRESH_COOKIE, refresh, { httpOnly: true, secure, sameSite: "lax", path: "/api/auth", maxAge: refreshLifetimeMs / 1000 });
}

export async function clearSession(reply: FastifyReply): Promise<void> {
  const secure = process.env.NODE_ENV === "production";
  reply.clearCookie(ACCESS_COOKIE, { httpOnly: true, secure, sameSite: "lax", path: "/" });
  reply.clearCookie(REFRESH_COOKIE, { httpOnly: true, secure, sameSite: "lax", path: "/api/auth" });
}

export async function sessionUser(request: FastifyRequest, db: PrismaClient): Promise<User | null> {
  const token = request.cookies[ACCESS_COOKIE];
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, jwtKey());
    if (!verified.payload.sub) return null;
    const user = await db.user.findUnique({ where: { id: verified.payload.sub } });
    return user && !user.isBanned ? user : null;
  } catch { return null; }
}

export async function requireRole(request: FastifyRequest, db: PrismaClient, roles: UserRole[]): Promise<User | null> {
  const user = await sessionUser(request, db);
  return user && roles.includes(user.role) ? user : null;
}

export function verifyTotp(token: string, secret: string): boolean {
  return authenticator.check(token, secret);
}
