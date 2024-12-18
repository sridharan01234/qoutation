// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

console.log("Initializing Prisma client...");

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  console.log("Prisma client initialized");
}
