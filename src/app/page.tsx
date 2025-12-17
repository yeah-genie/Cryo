"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Section wrapper
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Mini result preview for Hero
function ResultPreview() {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-left">
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        Analysis complete
      </div>
      <div className="space-y-2.5">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          className="flex justify-between items-center"
        >
          <span className="text-zinc-400 text-sm">Demand</span>
          <span className="text-emerald-400 font-semibold">82/100</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          className="flex justify-between items-center"
        >
          <span className="text-zinc-400 text-sm">Competition</span>
          <span className="text-yellow-400 font-semibold">Medium</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          className="flex justify-between items-center"
        >
          <span className="text-zinc-400 text-sm">Revenue potential</span>
          <span className="text-white font-semibold">$3-8K/mo</span>
        </motion.div>
      </div>
    </div>
  );
}

// FAQ
function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      q: "How does this work?",
      a: "Enter your course topic. We analyze search trends, existing courses, and market data to estimate demand, competition, and revenue potential. Takes about 30 seconds."
    },
    {
      q: "Is it free?",
      a: "Yes, the validator is completely free. We're building paid features (student tracking, lesson testing) and will notify you when they're ready."
    },
    {
      q: "How accurate is it?",
      a: "We use real market data and proven heuristics. It won't guarantee success, but it'll save you from obvious mistakes — like building a course in a saturated market."
    },
    {
      q: "What platforms do you support?",
      a: "The validator works for any course topic. Platform integrations (Teachable, Thinkific, Kajabi) are coming soon for the paid version."
    },
  ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-zinc-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-900/50 transition-colors"
          >
            <span className="text-sm font-medium text-white">{faq.q}</span>
            <svg 
              className={`w-4 h-4 text-zinc-500 transition-transform ${openIndex === i ? "rotate-180" : ""}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [courseIdea, setCourseIdea] = useState("");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistCount, setWaitlistCount] = useState(127);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/waitlist");
        const data = await res.json();
        if (res.ok && data.count) {
          setWaitlistCount(data.count);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCount();
  }, []);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseIdea.trim()) return;
    router.push(`/app?topic=${encodeURIComponent(courseIdea.trim())}`);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    
    setEmailStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setEmailStatus("success");
        setWaitlistCount(prev => prev + 1);
        setEmail("");
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-500/[0.08] to-transparent blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            CourseOS
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-14">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy + Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold leading-[1.15] tracking-tight mb-5">
                Validate your course idea
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400"> before you build it</span>
              </h1>
              
              <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                See demand, competition, and revenue potential in 30 seconds. Stop guessing.
              </p>

              {/* Course Idea Input */}
              <form onSubmit={handleValidate}>
                <div className="relative">
                  <input
                    type="text"
                    value={courseIdea}
                    onChange={(e) => setCourseIdea(e.target.value)}
                    placeholder="Your course topic (e.g. Python for designers)"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 pr-28 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Validate
                  </button>
                </div>
              </form>

              <p className="text-sm text-zinc-600 mt-3">
                Free. No signup required.
              </p>
            </motion.div>

            {/* Right: Result Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <ResultPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem + Solution (Compact) */}
      <Section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl sm:text-2xl text-zinc-300 leading-relaxed">
            <span className="text-white font-medium">80% of online courses fail.</span>
            <br />
            Creators spend months on ideas that don't sell.
          </p>
          <p className="text-zinc-500 mt-4">
            We help you validate before you waste time.
          </p>
        </div>
      </Section>

      {/* What you get (Compact - 3 columns) */}
      <Section className="py-16 px-6 border-y border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Demand</div>
              <p className="text-sm text-zinc-500">How many people are searching for this topic</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Competition</div>
              <p className="text-sm text-zinc-500">How many courses already exist</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Revenue</div>
              <p className="text-sm text-zinc-500">Estimated monthly earning potential</p>
            </div>
          </div>
        </div>
      </Section>

      {/* How it works (Super simple) */}
      <Section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-10 text-center">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Enter your idea", desc: "Any course topic" },
              { step: "2", title: "Get analysis", desc: "30 seconds" },
              { step: "3", title: "Make decision", desc: "Build or pivot" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-sm font-medium text-zinc-400">
                  {item.step}
                </div>
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA - Try it */}
      <Section className="py-16 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Try it now
          </h2>

          <form onSubmit={handleValidate}>
            <div className="relative">
              <input
                type="text"
                value={courseIdea}
                onChange={(e) => setCourseIdea(e.target.value)}
                placeholder="Your course topic..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 pr-28 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 transition-all"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Validate
              </button>
            </div>
          </form>
        </div>
      </Section>

      {/* Coming soon (Minimal) */}
      <Section className="py-16 px-6 border-t border-zinc-800/50">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm text-zinc-500 mb-3">Coming soon</p>
          <p className="text-zinc-300 mb-6">
            Connect your course platform. See where students drop off. Test which lessons work better.
          </p>

          {emailStatus === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 inline-block"
            >
              <p className="text-emerald-400 font-medium">You're on the list!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                disabled={emailStatus === "loading"}
              />
              <button 
                type="submit" 
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                disabled={emailStatus === "loading"}
              >
                Notify me
              </button>
            </form>
          )}
          
          <p className="text-xs text-zinc-600 mt-3">
            {waitlistCount}+ course creators waiting
          </p>
        </div>
      </Section>

      {/* FAQ (Compact) */}
      <Section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-8 text-center">
            FAQ
          </h2>
          <FAQAccordion />
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-zinc-600">
          <span>© 2025 CourseOS</span>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
            Twitter
          </a>
        </div>
      </footer>
    </div>
  );
}
