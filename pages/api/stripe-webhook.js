import { buffer } from "micro";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // ❗ required for webhooks
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // we'll add this later
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("Payment verified:", session.id);

    // TODO:
    // grant course access
    // store payment in DB
    // send email confirmation

  }

  res.json({ received: true });
}
