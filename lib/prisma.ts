import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const isSqlite = databaseUrl.startsWith("file:") || databaseUrl.endsWith(".db");

console.log(`[Prisma] Using ${isSqlite ? 'SQLite' : 'Remote'} database.`);

function createPrismaClient() {
  try {
    if (isSqlite) {
      console.log("[Prisma] Initializing with SQLite adapter.");
      const adapter = new PrismaBetterSqlite3({
        url: databaseUrl,
      });
      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
    }
    
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("[Prisma] Failed to initialize client:", error);
    // Return a dummy client or throw? Better to throw so it's caught in the route
    throw error;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
