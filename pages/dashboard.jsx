// pages/dashboard.jsx
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "./api/auth/[...nextauth]";

// ✅ Prisma singleton (prevents too many connections in dev)
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // 1) Must be signed in
  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  // 2) Must have access in DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { hasAccess: true },
  });

  if (!user?.hasAccess) {
    return {
      redirect: {
        destination: "/checkout",
        permanent: false,
      },
    };
  }

  return {
    props: {
      email: session.user.email,
    },
  };
}

export default function Dashboard({ email }) {
  return (
    <>
      <Head>
        <title>Dashboard – Digital Profit HQ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
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
        <section className="px-6 pt-20 pb-24 max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <Link href="/">
              <span className="underline text-neutral-400 hover:text-white">
                ← Back home
              </span>
            </Link>

            <Link href="/api/auth/signout">
              <span className="underline text-neutral-400 hover:text-white">
                Sign out
              </span>
            </Link>
          </div>

          <h1 className="mt-10 text-4xl md:text-5xl font-bold">
            Your{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>

          <p className="mt-4 text-neutral-400">
            Signed in as <span className="text-neutral-200">{email}</span>
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold">Start Here</h2>
              <p className="mt-3 text-neutral-400">
                Welcome to the Blueprint. Your course content will live here.
              </p>

              <div className="mt-6 space-y-3 text-neutral-300">
                <div className="bg-black/40 border border-neutral-800 rounded-xl p-4">
                  Module 1 — Foundation + Niche Selection
                </div>
                <div className="bg-black/40 border border-neutral-800 rounded-xl p-4">
                  Module 2 — Product & Offer Creation
                </div>
                <div className="bg-black/40 border border-neutral-800 rounded-xl p-4">
                  Module 3 — Store Setup + Launch
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold">Downloads</h2>
              <p className="mt-3 text-neutral-400">
                Add your PDFs + resources here (you can link to files, Drive, or your own hosting).
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between bg-black/40 border border-neutral-800 rounded-xl p-4">
                  <span className="text-neutral-300">Quickstart Checklist</span>
                  <span className="text-neutral-500 text-sm">PDF</span>
                </div>

                <div className="flex items-center justify-between bg-black/40 border border-neutral-800 rounded-xl p-4">
                  <span className="text-neutral-300">Terms Cheat Sheet</span>
                  <span className="text-neutral-500 text-sm">PDF</span>
                </div>

                <div className="flex items-center justify-between bg-black/40 border border-neutral-800 rounded-xl p-4">
                  <span className="text-neutral-300">Beginner Mistakes Guide</span>
                  <span className="text-neutral-500 text-sm">PDF</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold">Next step</h3>
            <p className="mt-2 text-neutral-400">
              If you want, we can replace these placeholders with your real video embeds + gated download links.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}