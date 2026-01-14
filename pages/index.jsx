import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

function Button({ children, className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center font-medium transition rounded-full px-8 py-4 text-lg";

  const variants = {
    primary:
      "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-pink-500/20",
    secondary: "bg-neutral-800 text-white hover:bg-neutral-700",
    outline: "border border-neutral-700 text-white hover:bg-neutral-800",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );

    reveals.forEach((el) => observer.observe(el));
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .visible {
          animation: fadeInUp .5s ease-out forwards;
        }

        .modal-bg {
          backdrop-filter: blur(8px);
        }
      `}</style>

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Digital Dropshipping Blueprint</title>
        <meta
          name="description"
          content="Build a profitable digital dropshipping store without inventory, ads, or complicated tech."
        />
      </Head>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 modal-bg flex items-center justify-center z-50 px-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 max-w-md w-full text-center relative">
            <h2 className="text-2xl font-bold">Get the Starter Kit</h2>
            <p className="mt-3 text-neutral-400 text-sm leading-relaxed">
              Receive the full digital starter kit instantly:
              <br />– 30-Minute Mini-Course
              <br />– 7-Day Launch Checklist
              <br />– Beginner Mistakes Guide
              <br />– Dropshipping Terms Cheat Sheet
            </p>

            <form
              action="https://app.convertkit.com/forms/8884395/subscriptions"
              method="post"
              className="mt-6 flex flex-col gap-3"
            >
              <input
                type="email"
                name="email_address"
                required
                placeholder="Enter your email"
                className="w-full rounded-full px-4 py-3 bg-black border border-neutral-700 text-white focus:border-pink-500 outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full py-3 font-medium text-white w-full hover:opacity-90"
              >
                Send Starter Kit
              </button>
            </form>

            <button
              className="absolute top-3 right-3 text-neutral-500 hover:text-white text-lg"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 🌸 global glow background – mobile safe */}
      <main
        className="
          relative text-white overflow-hidden bg-black
          min-h-screen
          min-h-[100vh]
          pt-safe
        "
        style={{
          backgroundColor: "#000",
          backgroundImage: `
      radial-gradient(circle at 50% 0%, rgba(217,70,239,0.18) 0%, transparent 65%),
      radial-gradient(circle at 50% 25%, rgba(236,72,153,0.12) 0%, transparent 75%)
    `,
          backgroundSize: "1900px 1900px, 2000px 2000px",
          backgroundRepeat: "no-repeat",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
          WebkitBackgroundClip: "border-box",
        }}
      >
        {/* HERO */}
        <section
          className="relative px-6 pt-24 pb-12 max-w-6xl mx-auto text-center"
          style={{
            animation: "fadeInUp 1.2s ease-out both",
          }}
        >
          <span className="text-sm uppercase tracking-widest text-neutral-400">
            Free Mini-Course Available
          </span>

          <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight">
            Digital Dropshipping{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
              Blueprint
            </span>
          </h1>

          <p className="mt-6 text-xl text-neutral-400 max-w-3xl mx-auto">
            Build a profitable digital store without inventory, ads, or
            complicated tech — even if you’re starting from zero.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setIsOpen(true)}>Get the Free Starter Kit</Button>
            <Button
  variant="outline"
  onClick={() => {
    document.getElementById("learn")?.scrollIntoView({ behavior: "smooth" });
  }}
>
  See What You’ll Learn
</Button>

          </div>
        </section>

        {/* FEATURES */}
        <section className="reveal px-6 pt-6 md:pt-10 pb-20 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[ 
            { title: "No Inventory", text: "Sell digital products without storage, shipping, or suppliers." },
            { title: "Beginner Friendly", text: "No tech skills required. Everything is explained step by step." },
            { title: "Scalable Income", text: "Build once and sell repeatedly without increasing workload." },
          ].map((item, i) => (
            <div key={i} className="bg-neutral-900/70 border border-neutral-800 rounded-2xl">
              <div className="p-8">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-neutral-400">{item.text}</p>
              </div>
            </div>
          ))}
        </section>

        {/* 🔥 WHAT YOU’LL LEARN */}
<section
  id="learn"
className="reveal px-6 py-24 max-w-6xl mx-auto text-center">
  <h2 className="text-4xl font-bold">What You’ll Learn Inside the Blueprint</h2>
  <div className="mt-4 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" />

  <p className="mt-6 text-neutral-400 max-w-2xl mx-auto leading-relaxed text-lg">
    Inside the Blueprint, you'll learn the exact systems and tools that allow you 
    to build a profitable digital store that runs almost hands-free.
  </p>

  <div className="mt-12 grid gap-8 md:grid-cols-3 text-left">
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-8">
      <h3 className="text-xl font-semibold">✔ Launch Your Store Fast</h3>
      <p className="mt-3 text-neutral-400">
        The complete step-by-step process to launch your first digital product
      </p>
    </div>

    <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-8">
      <h3 className="text-xl font-semibold">✔ Automate Your Sales Systems</h3>
      <p className="mt-3 text-neutral-400">
        Deliver products instantly without touching files, customer messages, 
        or complicated integrations.
      </p>
    </div>

    <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-8">
      <h3 className="text-xl font-semibold">✔ Scale to $10K+/mo</h3>
      <p className="mt-3 text-neutral-400">
        Grow using repeatable traffic systems that don't require paid ads.
      </p>
    </div>
  </div>

  <Link href="/blueprint">
    <Button className="mt-10">View the Course Curriculum</Button>
  </Link>
</section>

        {/* OFFER STACK */}
        <section className="reveal px-6 py-24 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold">Choose the Path That Fits You</h2>
          <div className="mt-4 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" />

          <p className="mt-4 text-neutral-400">
            Start free, upgrade when you’re ready, or let us do the work for you.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl">
              <div className="p-8">
                <h3 className="text-2xl font-semibold">Free Starter Kit</h3>
                <p className="mt-4 text-neutral-400">
                  Learn the basics of digital dropshipping and how the system works.
                </p>
                <p className="mt-6 text-3xl font-bold">FREE</p>
                <Button className="mt-6 w-full" onClick={() => setIsOpen(true)}>
                  Get Instant Access
                </Button>
              </div>
            </div>

            <div className="bg-neutral-900 border-2 border-white rounded-2xl">
              <div className="p-8">
                <h3 className="text-2xl font-semibold">Digital Dropshipping Blueprint</h3>
                <p className="mt-4 text-neutral-400">
                  The complete step-by-step system to launch and scale your digital store.
                </p>
                <p className="mt-6 text-3xl font-bold text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.4)]">
                  $297
                </p>
                <Button
  className="mt-6 w-full"
  onClick={() => (window.location.href = "/blueprint")}
>
  Enroll Now
</Button>
              </div>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl">
              <div className="p-8">
                <h3 className="text-2xl font-semibold">Private DFY Build</h3>
                <p className="mt-4 text-neutral-400">
                  A service for students who want their store built, launched and optimized for them.
                </p>
                <p className="mt-6 text-3xl font-bold">$1,497</p>
                <Button variant="secondary" className="mt-6 w-full">
                  Opening Soon
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="reveal px-6 py-24 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold">Ready to Build Your Digital Store?</h2>

          <p className="mt-4 text-neutral-400">
            Start with the free mini-course and upgrade only when it makes sense.
          </p>

          <Button className="mt-8" onClick={() => setIsOpen(true)}>
            Get the Free Starter Kit
          </Button>
        </section>

        <footer className="px-6 py-12 text-center text-neutral-500 text-sm">
          © {new Date().getFullYear()} Digital Dropshipping Blueprint. All rights reserved.
        </footer>
      </main>
    </>
  );
}
