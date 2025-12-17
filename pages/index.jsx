import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* NAV */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="font-semibold tracking-wide">Grow</div>
        <nav className="hidden md:flex gap-6 text-sm text-neutral-300">
          <a className="hover:text-white" href="#">Home</a>
          <a className="hover:text-white" href="#">Courses</a>
          <a className="hover:text-white" href="#">Resources</a>
        </nav>
        <Button variant="secondary" className="rounded-full">Sign up</Button>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 via-indigo-500/10 to-cyan-400/20" />
        <div className="relative mx-auto max-w-6xl px-6 py-28">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl"
          >
            Let’s improve your skills <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">with us</span>
          </motion.h1>
          <p className="mt-5 max-w-xl text-neutral-300">
            Step‑by‑step online courses designed to help you build real, sellable skills — even if you’re starting from zero.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="rounded-full px-7">Get Started</Button>
            <Button variant="outline" className="rounded-full px-7 border-neutral-700">View Courses</Button>
          </div>

          {/* TAG PILLS */}
          <div className="mt-14 flex flex-wrap gap-3 max-w-4xl">
            {["Web Development", "UI/UX", "Copywriting", "Product Design", "Software Engineer", "Graphic Design"].map((tag, i) => (
              <span
                key={i}
                className="rounded-full px-4 py-2 text-sm bg-gradient-to-r from-fuchsia-500 to-rose-500 text-black"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-6 -mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Students", value: "15k+" },
            { label: "Courses", value: "27+" },
            { label: "Expert Mentors", value: "20+" },
          ].map((s, i) => (
            <Card key={i} className="bg-neutral-900/70 border-neutral-800 rounded-2xl">
              <CardContent className="p-8">
                <div className="text-4xl font-bold">{s.value}</div>
                <div className="mt-2 text-neutral-400">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 px-6 py-10 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Grow. All rights reserved.
      </footer>
    </div>
  );
}