import { randomBytes } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { PrismaClient, UserRole, DriverApplicationStatus } from "@prisma/client";
import { authenticator } from "otplib";
import { hashPassword } from "../src/auth.js";
import { loadEnv } from "../src/env.js";

loadEnv();

const prisma = new PrismaClient();

async function main() {
  const geometry = JSON.parse(await readFile(new URL("./data/montreal-island.geojson", import.meta.url), "utf8"));
  const seededRegion = await prisma.region.findFirst({
    where: { name: { in: ["Test Region — Montréal Island", "Test Region — Downtown"] } },
    orderBy: { createdAt: "asc" },
  });
  const region = seededRegion
    ? await prisma.region.update({
      where: { id: seededRegion.id },
      data: { name: "Test Region — Montréal Island", geometry, active: true, ageGate: 19, minimumOrderCents: 0, deliveryFeeCents: 500 },
    })
    : await prisma.region.create({
      data: { name: "Test Region — Montréal Island", geometry, active: true, ageGate: 19, minimumOrderCents: 0, deliveryFeeCents: 500 },
    });

  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@ubeer.local" } });
  if (!existingAdmin) {
    const password = randomBytes(24).toString("base64url");
    const totpSecret = authenticator.generateSecret();
    const admin = await prisma.user.create({
      data: { email: "admin@ubeer.local", passwordHash: await hashPassword(password), role: UserRole.ADMIN, name: "uBeer Admin", totpSecret, totpEnabled: true },
    });
    const credentialText = [
      "uBeer initial administrator account",
      `Email: ${admin.email}`,
      `Password: ${password}`,
      `TOTP secret: ${totpSecret}`,
      `Authenticator URI: ${authenticator.keyuri(admin.email, "uBeer", totpSecret)}`,
      "Store this file securely and delete it after configuring an authenticator.",
    ].join("\n") + "\n";
    const credentialsPath = process.env.ADMIN_CREDENTIALS_PATH ?? "/root/ubeer-admin-credentials.txt";
    await mkdir(dirname(credentialsPath), { recursive: true, mode: 0o700 });
    await writeFile(credentialsPath, credentialText, { mode: 0o600, flag: "wx" });
    process.stdout.write(`${credentialText}\nCredentials written to ${credentialsPath}\n`);
  }

  const product = await prisma.product.findFirst({ where: { name: "6-Pack Heineken Beer" } });
  const seededProduct = product ?? await prisma.product.create({
    data: {
      name: "6-Pack Heineken Beer", description: "Test listing: six-pack of Heineken beer.", priceCents: 3000,
      currency: "USD", stock: 999, isTest: true, active: true,
    },
  });
  await prisma.productRegion.upsert({
    where: { productId_regionId: { productId: seededProduct.id, regionId: region.id } },
    update: {}, create: { productId: seededProduct.id, regionId: region.id },
  });

  const application = await prisma.driverApplication.findFirst({ where: { email: "driver@ubeer.local" } });
  if (!application) await prisma.driverApplication.create({
    data: {
      name: "Test Driver", email: "driver@ubeer.local", phone: "+1-555-0100", vehicle: "Bicycle",
      licenseNumber: "TEST-DRIVER-APPLICATION", regionId: region.id, status: DriverApplicationStatus.pending,
    },
  });
  await prisma.setting.upsert({ where: { key: "platform_fee_percent" }, update: {}, create: { key: "platform_fee_percent", value: process.env.PLATFORM_FEE_PERCENT ?? "15" } });
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
