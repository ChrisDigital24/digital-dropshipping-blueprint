import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body || {};

    // Optional but recommended: require email so webhook can reliably grant access
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      // ✅ Always create a Stripe Customer
      customer_creation: "always",

      // ✅ Make email available directly on the session
      customer_email: email,

      // ✅ Backup: store email in metadata (super reliable)
      metadata: {
        email,
      },

      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Digital Dropshipping Blueprint",
            },
            unit_amount: 29700, // $297.00
          },
          quantity: 1,
        },
      ],

      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/checkout`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
