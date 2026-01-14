import Head from "next/head";
import Link from "next/link";

export default function Blueprint() {
  return (
    <>
      <Head>
        <title>Digital Dropshipping Blueprint – Course Curriculum</title>
      </Head>

      <main
        className="relative text-white overflow-hidden bg-black min-h-screen pt-safe"
        style={{
          backgroundColor: "#000",
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(217,70,239,0.18) 0%, transparent 65%),
            radial-gradient(circle at 50% 25%, rgba(236,72,153,0.12) 0%, transparent 75%)
          `,
          backgroundSize: "1900px 1900px, 2000px 2000px",
          backgroundRepeat: "no-repeat",
        }}
      >
        <section className="px-6 pt-24 pb-12 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            The Digital Dropshipping{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
              Blueprint
            </span>
          </h1>

          <p className="mt-6 text-xl text-neutral-400 max-w-3xl mx-auto">
            The exact system to build, launch, and automate a digital dropshipping
            business without inventory, ads, or complicated tech.
          </p>

          <Link href="/">
            <button className="mt-8 underline text-neutral-400 hover:text-white">
              ← Back to homepage
            </button>
          </Link>
        </section>

        {/* curriculum */}
        <section className="px-6 pb-32 max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-bold">Course Curriculum</h2>

          <div className="mt-12 space-y-8">
            {[
              {
                module: "Module 1: System Foundations",
                lessons: [
                  "How digital dropshipping works",
                  "Selecting profitable digital product niches",
                  "Pricing strategy + value stacking",
                ],
              },
              {
                module: "Module 2: Build the Store",
                lessons: [
                  "Choose your platform + tech walkthrough",
                  "Store setup templates",
                  "Automated fulfillment setup",
                ],
              },
              {
                module: "Module 3: Create Irresistable Offers",
                lessons: [
                  "Types of digital products that sell best",
                  "Fast creation blueprint",
                  "How to package + position digital offers",
                ],
              },
              {
                module: "Module 4: Launch & Get Sales Fast",
                lessons: [
                  "Automated traffic systems",
                  "Content-to-product method",
                  "Free traffic channels that scale",
                ],
              },
              {
                module: "Module 5: Sales Machine",
                lessons: [
                  "Conversion page formula",
                  "Email automation setup",
                  "Upsells + order bumps for digital products",
                ],
              },
              {
                module: "Module 6: Scale + Automation",
                lessons: [
                  "Automate fulfillment + onboarding",
                  "Scaling past $10k/month",
                  "Hiring + outsourcing framework",
                ],
              },
              {
                module: "Bonuses",
                lessons: [
                  "Step-By-Step High-Converting Store Creation",
                  "7-Figure Offer Formula",
                  "30 plug-and-play video hooks",
                ],
              },
            ].map((section, i) => (
              <div
                key={i}
                className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8"
              >
                <h3 className="text-xl font-semibold">{section.module}</h3>
                <ul className="mt-4 space-y-2 text-neutral-400">
                  {section.lessons.map((lesson, index) => (
                    <li key={index}>• {lesson}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a href="/checkout">
              <button className="bg-gradient-to-r from-fuchsia-500 to-pink-500 px-10 py-4 rounded-full text-lg font-medium hover:opacity-90 shadow-lg shadow-pink-500/20">
                Enroll Now – Start Building
              </button>
            </a>
            <p className="text-neutral-400 text-sm mt-2">
              No risk – full access.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
