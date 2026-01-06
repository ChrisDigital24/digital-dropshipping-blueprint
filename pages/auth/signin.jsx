import Head from "next/head";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    await signIn("email", {
      email,
      callbackUrl: "/dashboard",
    });

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Sign In – Digital Profit HQ</title>
      </Head>

      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8">
          <Link href="/">
            <span className="text-sm text-neutral-400 hover:text-white underline">
              ← Back home
            </span>
          </Link>

          <h1 className="mt-6 text-3xl font-bold">Sign in</h1>
          <p className="mt-2 text-neutral-400 text-sm">
            Enter your email and we’ll send you a magic link.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full px-4 py-3 bg-black border border-neutral-700 text-white focus:border-pink-500 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full py-3 font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send magic link"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
