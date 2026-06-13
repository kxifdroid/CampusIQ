import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};

function createPrismaClient() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const maskedUrl = databaseUrl.replace(/:[^:@]+@/, ":****@");
    console.log(`[Prisma] Initializing with URL: ${maskedUrl}`);

    if (!globalForPrisma.pgPool) {
      globalForPrisma.pgPool = new pg.Pool({
        connectionString: databaseUrl,
      });
    }

    const adapter = new PrismaPg(globalForPrisma.pgPool);
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

  } catch (error) {
    console.error("[Prisma] Failed to initialize client:", error);
    throw error;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
