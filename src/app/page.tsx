"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Minimal Step Component
function Step({ 
  number, 
  title, 
  description,
  delay = 0
}: { 
  number: string;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center"
    >
      <div className="text-xs text-zinc-600 mb-2">{number}</div>
      <h3 className="text-white font-medium mb-1">{title}</h3>
      <p className="text-sm text-zinc-500">{description}</p>
    </motion.div>
  );
}

// Clean Metrics Demo
function MetricsDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInView) setTimeout(() => setShow(true), 200);
  }, [isInView]);

  return (
    <div ref={ref} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-zinc-800/50">
        <span className="text-sm text-zinc-400">Session Overview</span>
      </div>
      
      <div className="p-5 space-y-6">
        {/* Speaking ratio */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-500">Talk time</span>
            <span className="text-zinc-300">You 78% · Student 22%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={show ? { width: "78%" } : {}}
              transition={{ duration: 0.8 }}
              className="bg-zinc-400 rounded-full"
            />
          </div>
        </div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="p-3 bg-zinc-800/30 rounded-lg"
        >
          <p className="text-sm text-zinc-400">
            <span className="text-zinc-300">3 moments</span> where student attention dropped
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="space-y-2">
          <p className="text-sm text-zinc-500">Explanation effectiveness</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between p-3 bg-zinc-800/20 rounded-lg"
          >
            <span className="text-sm text-zinc-300">Visual diagram</span>
            <span className="text-sm text-zinc-300">85%</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between p-3 bg-zinc-800/20 rounded-lg"
          >
            <span className="text-sm text-zinc-500">Verbal only</span>
            <span className="text-sm text-zinc-500">62%</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// FAQ
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  
  const items = [
    { q: "How does it work?", a: "Connect Zoom or upload recordings. AI transcribes and analyzes speaking patterns, engagement, and teaching effectiveness." },
    { q: "Is my data safe?", a: "Yes. Recordings are processed securely and deleted after analysis. Only you can access your data." },
    { q: "What do you measure?", a: "Talk time balance, engagement patterns, explanation clarity, and student comprehension signals." },
  ];

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-zinc-800/50 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-900/30 transition-colors"
          >
            <span className="text-sm text-zinc-300">{item.q}</span>
            <svg className={`w-4 h-4 text-zinc-600 transition-transform ${open === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 text-sm text-zinc-500 leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/waitlist").then(r => r.json()).then(d => d.count && setCount(d.count)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || status === "loading") return;
    
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setCount(c => c + 1);
      }
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      {/* Subtle gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-800/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-2xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-white">Chalk</Link>
        <span className="text-xs text-zinc-600">for tutors</span>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-2xl mx-auto px-6">
        
        {/* Hero */}
        <section className="py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-medium leading-tight mb-4"
          >
            See what works
            <br />
            <span className="text-zinc-500">in your teaching</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 mb-10"
          >
            AI analyzes your sessions. Find out which explanations get results.
          </motion.p>

          {/* Email signup */}
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg"
            >
              <p className="text-zinc-300">You're on the list</p>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex gap-2 max-w-sm mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Join beta
              </button>
            </motion.form>
          )}
          
          {count > 0 && (
            <p className="text-xs text-zinc-700 mt-4">{count} on waitlist</p>
          )}
        </section>

        {/* How it works */}
        <section className="py-20 border-t border-zinc-800/50">
          <h2 className="text-sm text-zinc-500 text-center mb-12">How it works</h2>
          <div className="grid grid-cols-3 gap-8">
            <Step number="01" title="Connect" description="Zoom or upload" delay={0} />
            <Step number="02" title="Analyze" description="AI processes" delay={0.1} />
            <Step number="03" title="Learn" description="See what works" delay={0.2} />
          </div>
        </section>

        {/* Demo */}
        <section className="py-20">
          <h2 className="text-sm text-zinc-500 text-center mb-8">What you'll see</h2>
          <MetricsDemo />
        </section>

        {/* Privacy */}
        <section className="py-20 border-t border-zinc-800/50">
          <h2 className="text-sm text-zinc-500 text-center mb-10">Your data stays private</h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            {["Processed locally", "Deleted after analysis", "Only you have access"].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-sm text-zinc-600"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 border-t border-zinc-800/50">
          <h2 className="text-sm text-zinc-500 text-center mb-10">Questions</h2>
          <FAQ />
        </section>

        {/* Final CTA */}
        <section className="py-20 text-center">
          <p className="text-zinc-500 mb-6">Free during beta</p>
          
          {status === "success" ? (
            <p className="text-zinc-400">We'll be in touch</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Join
              </button>
            </form>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-2xl mx-auto px-6 py-8 text-center">
        <p className="text-xs text-zinc-700">© 2025 Chalk</p>
      </footer>
    </div>
  );
}
