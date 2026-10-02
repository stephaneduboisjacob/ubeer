import "fastify";
import type { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    db: PrismaClient;
  }
  interface FastifyRequest {
    rawBody: string;
  }
}
