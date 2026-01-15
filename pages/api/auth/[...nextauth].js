// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

// ✅ Prisma singleton (prevents too many connections in dev)
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ Resend for branded magic-link email
const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,

      // ✅ Custom branded magic-link email (ONLY added code)
      async sendVerificationRequest({ identifier, url }) {
        const host = new URL(url).host;

        // Simple, clean, branded HTML. No external assets required.
        const html = `
          <div style="background:#0b0b0f;padding:32px 12px;font-family:Inter,Arial,sans-serif;">
            <div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
              <div style="padding:28px 28px 16px;">
                <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#9ca3af;">
                  Digital Profit HQ
                </div>
                <h1 style="margin:14px 0 10px;font-size:22px;line-height:1.3;color:#ffffff;">
                  Sign in to ${host}
                </h1>
                <p style="margin:0 0 18px;color:#cbd5e1;font-size:14px;line-height:1.6;">
                  Click the button below to securely sign in. This link expires shortly for your safety.
                </p>

                <div style="margin:22px 0 18px;">
                  <a href="${url}"
                     style="display:inline-block;background:linear-gradient(90deg,#d946ef,#ec4899);color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700;font-size:14px;">
                    Sign in
                  </a>
                </div>

                <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>
                <p style="margin:8px 0 0;color:#e2e8f0;font-size:12px;word-break:break-all;">
                  ${url}
                </p>
              </div>

              <div style="padding:16px 28px;border-top:1px solid #1f2937;background:#0f172a;">
                <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                  If you didn’t request this email, you can safely ignore it.
                </p>
              </div>
            </div>

            <div style="max-width:560px;margin:14px auto 0;text-align:center;color:#6b7280;font-size:12px;">
              © ${new Date().getFullYear()} Digital Profit HQ
            </div>
          </div>
        `;

        const subject = `Sign in to ${host} • Digital Profit HQ`;

        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: identifier,
          subject,
          html,
          // Nice-to-have plain text fallback
          text: `Sign in to ${host}\n\nUse this link to sign in:\n${url}\n\nIf you didn’t request this, you can ignore this email.`,
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
