import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

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

      // ✅ THIS is what controls the email + removes "Sign in to www..."
      async sendVerificationRequest({ identifier, url, provider }) {
        const { server, from } = provider;

        // transporter uses your EMAIL_SERVER (Resend SMTP)
        const transport = nodemailer.createTransport(server);

        const host = "Digital Profit HQ";
        const subject = `Sign in to ${host}`;

        const html = `
          <div style="font-family:Arial,sans-serif;background:#000;padding:40px 16px;">
            <div style="max-width:520px;margin:0 auto;background:#0b0b0b;border:1px solid #262626;border-radius:18px;padding:28px;text-align:center;">
              <div style="letter-spacing:0.18em;font-size:12px;color:#a3a3a3;margin-bottom:14px;">
                DIGITAL PROFIT HQ
              </div>

              <h1 style="color:#fff;margin:0 0 10px;font-size:28px;line-height:1.2;">
                Sign in to Digital Profit HQ
              </h1>

              <p style="color:#a3a3a3;margin:0 0 22px;font-size:16px;line-height:1.6;">
                Click the button below to securely sign in. This link expires shortly for your safety.
              </p>

              <a href="${url}"
                style="
                  display:inline-block;
                  padding:14px 26px;
                  border-radius:999px;
                  background:linear-gradient(90deg,#d946ef,#ec4899);
                  color:#ffffff !important;
                  text-decoration:none;
                  font-weight:700;
                  font-size:16px;
                ">
                Sign in
              </a>

              <p style="color:#737373;margin:22px 0 8px;font-size:13px;line-height:1.5;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all;margin:0;">
                <a href="${url}" style="color:#60a5fa;text-decoration:underline;font-size:12px;">
                  ${url}
                </a>
              </p>

              <p style="color:#737373;margin-top:22px;font-size:12px;">
                If you didn’t request this email, you can safely ignore it.
              </p>

              <div style="margin-top:26px;color:#525252;font-size:12px;">
                © ${new Date().getFullYear()} Digital Profit HQ
              </div>
            </div>
          </div>
        `;

        await transport.sendMail({
          to: identifier,
          from,
          subject,
          html,
        });
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
};

export default NextAuth(authOptions);
