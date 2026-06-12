import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const isSqlite = databaseUrl.startsWith("file:") || databaseUrl.endsWith(".db");

const maskedUrl = databaseUrl.includes(":") 
  ? `${databaseUrl.split(":")[0]}:****` 
  : "****";
console.log(`[Prisma] Using ${isSqlite ? 'SQLite' : 'Remote'} database. URL: ${maskedUrl}`);

if (isSqlite && process.env.VERCEL) {
  console.warn("[Prisma] WARNING: You are using SQLite on Vercel. This database is read-only and ephemeral. Registration and sign-in will fail. Please use a remote database like Vercel Postgres or Supabase.");
}

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
