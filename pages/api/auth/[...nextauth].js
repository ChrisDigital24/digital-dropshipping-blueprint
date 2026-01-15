// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// ✅ Prisma singleton (prevents too many connections in dev)
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
  server: process.env.EMAIL_SERVER,
  from: process.env.EMAIL_FROM,
  maxAge: 10 * 60, // 10 minutes
  normalizeIdentifier: (email) => email.toLowerCase(),

  sendVerificationRequest: async ({ identifier, url, provider }) => {
    const html = `
      <div style="font-family: Arial, sans-serif; background:#000; padding:40px;">
        <div style="max-width:520px;margin:0 auto;background:#0a0a0a;border:1px solid #262626;border-radius:16px;padding:32px;text-align:center;">
          
          <h1 style="color:#ffffff;margin-bottom:12px;">
            Sign in to Digital Profit HQ
          </h1>

          <p style="color:#a3a3a3;font-size:16px;margin-bottom:28px;">
            Click the button below to securely access your dashboard.
          </p>

          <a href="${url}"
             style="
               display:inline-block;
               background:linear-gradient(90deg,#d946ef,#ec4899);
               color:#ffffff !important;
               text-decoration:none;
               padding:14px 26px;
               border-radius:999px;
               font-size:16px;
               font-weight:600;
             ">
            Sign in
          </a>

          <p style="color:#737373;font-size:13px;margin-top:32px;">
            If you did not request this email, you can safely ignore it.
          </p>
        </div>
      </div>
    `;

    await fetch(provider.server, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(provider.server.split("://")[1]).toString("base64"),
      },
      body: JSON.stringify({
        from: provider.from,
        to: identifier,
        subject: "Sign in to Digital Profit HQ",
        html,
      }),
    });
  },
});

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
};

export default NextAuth(authOptions);
