import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
  console.warn("[NextAuth] Warning: NEXTAUTH_SECRET is not set. Sign-in will likely fail in production.");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        guest: { label: "Guest", type: "text" },
      },
      async authorize(credentials) {
        // Guest sign-in: create a temporary guest user with a unique guest email
        if (credentials?.guest === "true" || credentials?.guest === "1") {
          try {
            const guestName = `Guest-${Math.random().toString(36).substring(2, 8)}`;
            const guestEmail = `guest_${Date.now()}_${Math.random().toString(36).slice(2,8)}@guest.local`;
            console.log(`[NextAuth] Attempting to create guest user: ${guestEmail}`);
            const guestUser = await prisma.user.create({
              data: {
                name: guestName,
                email: guestEmail,
              },
            });

            return {
              id: guestUser.id,
              name: guestUser.name,
              email: guestUser.email,
              image: guestUser.image,
            };
          } catch (error) {
            console.error("[NextAuth] Guest login error:", error);
            return null;
          }
        }

    const email = credentials?.email?.toLowerCase().trim();
    const password = credentials?.password;

    if (!email || !password) {
      return null;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.password) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  },
}),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
};
