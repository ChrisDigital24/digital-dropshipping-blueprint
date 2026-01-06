import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleCheckout() {
    if (!email.trim()) {
      alert("Please enter your email to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ send email so webhook can grant access + send login link
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create checkout session");
      }

      if (!data?.url) {
        throw new Error("Stripe URL missing from response");
      }

      window.location.href = data.url; // send user to Stripe
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong redirecting to checkout.");
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Enroll – Digital Dropshipping Blueprint</title>
      </Head>

      <main
        className="relative text-white overflow-hidden min-h-screen pt-safe"
        style={{
          backgroundColor: "#000",
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(217,70,239,0.17) 0%, transparent 60%),
            radial-gradient(circle at 50% 25%, rgba(236,72,153,0.12) 0%, transparent 75%)
          `,
          backgroundSize: "1900px 1900px, 2000px 2000px",
          backgroundRepeat: "no-repeat",
        }}
      >
        <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto">
          <Link href="/blueprint">
            <button className="underline text-neutral-400 hover:text-white">
              ← Back to curriculum
            </button>
          </Link>

          <h1 className="mt-10 text-5xl md:text-6xl font-bold">
            Secure Your{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
              Enrollment
            </span>
          </h1>

          <p className="mt-6 text-xl text-neutral-400 max-w-2xl">
            You’re moments away from getting full access to the Digital Dropshipping Blueprint
            and the systems that can change the trajectory of your income.
          </p>

          <div className="mt-14 grid md:grid-cols-2 gap-10">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold">Order Summary</h2>

              <ul className="mt-6 space-y-4 text-neutral-300">
                <li className="flex justify-between">
                  <span>Digital Dropshipping Blueprint</span>
                  <span>$297</span>
                </li>

                <li className="flex justify-between">
                  <span>Lifetime Access</span>
                  <span>Included</span>
                </li>

                <li className="flex justify-between">
                  <span>All Premium Add-ons </span>
                  <span>Included</span>
                </li>

                <li className="flex justify-between border-t border-neutral-800 pt-4 text-lg">
                  <span>Total</span>
                  <span className="font-bold">$297</span>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold">Payment Details</h2>

              {/* ✅ Email input (required for access delivery) */}
              <div className="mt-6">
                <label className="block text-sm text-neutral-400 mb-2">
                  Email for access + receipts
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-full px-4 py-3 bg-black border border-neutral-700 text-white focus:border-pink-500 outline-none"
                  autoComplete="email"
                  inputMode="email"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  We’ll use this email to send your login link and course access.
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-10 bg-gradient-to-r from-fuchsia-500 to-pink-500 px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Redirecting…" : "Complete Enrollment"}
              </button>

              <p className="mt-4 text-xs text-neutral-500">
                * By completing your enrollment, you agree to the terms.
              </p>
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
            {[
              "Instant Access",
              "Lifetime Updates Included",
              "Proven Systems & Automation",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl py-6 px-4"
              >
                <p className="text-neutral-300">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}