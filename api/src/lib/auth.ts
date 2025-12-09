import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "your-secret-key-here-at-least-32-characters-long-dev-mode-only",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3333",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    process.env.CLIENT_ORIGIN || "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3333",
  ],
  advanced: {
    generateId: false,
  },
});
