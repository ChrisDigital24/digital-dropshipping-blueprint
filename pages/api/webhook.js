import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe needs the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];

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
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("✅ Payment verified for:", session.customer_email);

    // 🔥 THIS is where you:
    // - grant course access
    // - save buyer to DB
    // - send confirmation email
  }

  res.json({ received: true });
}
