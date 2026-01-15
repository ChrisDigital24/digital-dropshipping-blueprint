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
  <div style="background:#0b0b0b;padding:40px 0;font-family:Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#111;border-radius:16px;padding:32px;color:#ffffff;">
      
      <h1 style="margin:0 0 16px;font-size:24px;">
        Welcome to Digital Profit HQ 🎉
      </h1>

      <p style="margin:0 0 20px;color:#cfcfcf;font-size:15px;line-height:1.6;">
        Your payment was successful and your course access is now unlocked.
      </p>

      <div style="margin:24px 0;text-align:center;">
        <a
          href="${process.env.NEXTAUTH_URL}/dashboard"
          style="
            display:inline-block;
            background:linear-gradient(90deg,#d946ef,#ec4899);
            color:#ffffff;
            text-decoration:none;
            padding:14px 22px;
            border-radius:999px;
            font-weight:600;
            font-size:15px;
          "
        >
          Go to Your Dashboard →
        </a>
      </div>

      <p style="margin:24px 0 0;color:#a3a3a3;font-size:13px;line-height:1.5;">
        If the button doesn’t work, copy and paste this link into your browser:
        <br />
        <span style="color:#ffffff;">
          ${process.env.NEXTAUTH_URL}/dashboard
        </span>
      </p>

      <hr style="border:none;border-top:1px solid #222;margin:32px 0;" />

      <p style="margin:0;color:#777;font-size:12px;">
        Need help? Just reply to this email — we read every message.
      </p>

    </div>
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
