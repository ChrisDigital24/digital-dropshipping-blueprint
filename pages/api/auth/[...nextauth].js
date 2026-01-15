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

      async sendVerificationRequest({ identifier, url, provider }) {
        const { server, from } = provider;

        const transport = nodemailer.createTransport(server);

        const brand = "Digital Profit HQ";
        const host = new URL(url).host;

        const html = `
<!doctype html>
<html>
  <body style="margin:0;background:#0b0b0f;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111827;border:1px solid #1f2937;border-radius:18px;overflow:hidden;">
            
            <tr>
              <td style="padding:22px 24px;background:linear-gradient(90deg,#d946ef,#ec4899);">
                <div style="font-weight:800;color:#ffffff;font-size:16px;letter-spacing:.08em;text-transform:uppercase;">
                  ${brand}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 24px 10px;color:#ffffff;">
                <div style="font-size:22px;font-weight:800;margin:0 0 10px;">
                  Sign in to ${brand}
                </div>
                <div style="color:#cbd5e1;font-size:14px;line-height:1.6;">
                  Click the button below to securely sign in. This link expires shortly for your safety.
                </div>

                <div style="padding:18px 0 6px;">
                  <a href="${url}"
                     style="display:inline-block;background:linear-gradient(90deg,#d946ef,#ec4899);
                            color:#ffffff !important;text-decoration:none;
                            padding:14px 18px;border-radius:999px;
                            font-weight:700;font-size:14px;">
                    Sign in
                  </a>
                </div>

                <div style="color:#94a3b8;font-size:12px;line-height:1.6;margin-top:14px;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </div>

                <div style="margin-top:8px;word-break:break-all;background:#0b1220;border:1px solid #1f2937;border-radius:12px;padding:12px;">
                  <a href="${url}" style="color:#93c5fd;text-decoration:underline;font-size:12px;">
                    ${url}
                  </a>
                </div>

                <div style="color:#94a3b8;font-size:12px;line-height:1.6;margin-top:16px;">
                  If you didn’t request this email, you can safely ignore it.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px 22px;color:#6b7280;font-size:12px;">
                Sent to <span style="color:#9ca3af;">${identifier}</span> · ${host}<br/>
                © ${new Date().getFullYear()} ${brand}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

        await transport.sendMail({
          to: identifier,
          from,
          subject: `Your sign-in link for ${brand}`,
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
