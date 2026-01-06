import Stripe from "stripe";
import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Prisma singleton (prevents too many connections in dev)
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Stripe needs the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res.status(400).send("Missing stripe-signature header");
  }

  let event;

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks);

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // ✅ Handle successful checkout
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // ✅ Email fallback order (important!)
      const email =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.email ||
        null;

      if (!email) {
        console.error("⚠️ checkout.session.completed but no email found", {
          sessionId: session.id,
        });
        return res.status(200).json({ received: true });
      }

      // ✅ Idempotency: if we already processed this session, do nothing
      const existing = await prisma.user.findFirst({
        where: { stripeSessionId: session.id },
        select: { id: true },
      });

      if (existing) {
        console.log("↩️ Webhook already processed for session:", session.id);
        return res.status(200).json({ received: true });
      }

      // ✅ 1) Grant access in DB (create or update user)
      await prisma.user.upsert({
        where: { email },
        update: {
          hasAccess: true,
          stripeCustomerId: session.customer ? String(session.customer) : null,
          stripeSessionId: session.id,
        },
        create: {
          email,
          hasAccess: true,
          stripeCustomerId: session.customer ? String(session.customer) : null,
          stripeSessionId: session.id,
        },
      });

      // ✅ 2) Email them the dashboard link
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Your access to Digital Profit HQ ✅",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="margin:0 0 12px;">Welcome to Digital Profit HQ 🎉</h1>
            <p style="margin:0 0 12px;">Your payment was successful, and your course access is ready.</p>
            <p style="margin:0 0 18px;">
              Click below to log in and access your dashboard:
            </p>
            <p style="margin:0 0 18px;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard"
                 style="display:inline-block;background:#ec4899;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600;">
                Go to Dashboard
              </a>
            </p>
            <p style="margin:0;color:#888;font-size:12px;">
              If the button doesn’t work, copy/paste this link: ${process.env.NEXTAUTH_URL}/dashboard
            </p>
          </div>
        `,
      });

      console.log("✅ Payment verified + access granted for:", email);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return res.status(500).json({ error: "Webhook handler failed" });
  }
}