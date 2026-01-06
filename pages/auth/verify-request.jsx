import Head from "next/head";
import Link from "next/link";

export default function VerifyRequest() {
  return (
    <>
      <Head>
        <title>Check your email – Digital Profit HQ</title>
      </Head>

      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="mt-3 text-neutral-400 text-sm">
            We just sent you a sign-in link. Open it to finish logging in.
          </p>

          <Link href="/">
            <button className="mt-8 underline text-neutral-400 hover:text-white">
              Back to home
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
