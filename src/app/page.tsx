"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// Step Card Component
function StepCard({ 
  step, 
  title, 
  desc, 
  children,
  delay = 0 
}: { 
  step: string;
  title: string;
  desc: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex-1 min-w-[280px]"
    >
      <div className="h-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 transition-colors">
        <div className="text-xs text-zinc-600 mb-3">{step}</div>
        <h3 className="text-white font-medium mb-1">{title}</h3>
        <p className="text-sm text-zinc-500 mb-4">{desc}</p>
        <div className="mt-auto">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// Animated Demo Component
function AnimatedDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Connect
      setTimeout(() => setPhase(2), 1500),  // Deploy
      setTimeout(() => setPhase(3), 2500),  // Detect
      setTimeout(() => setPhase(4), 3500),  // Result
    ];

    const loop = setInterval(() => {
      setPhase(0);
      setTimeout(() => setPhase(1), 500);
      setTimeout(() => setPhase(2), 1500);
      setTimeout(() => setPhase(3), 2500);
      setTimeout(() => setPhase(4), 3500);
    }, 6000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      {/* Timeline connector */}
      <div className="absolute top-8 left-0 right-0 h-px bg-zinc-800 hidden lg:block" />
      <motion.div 
        className="absolute top-8 left-0 h-px bg-gradient-to-r from-blue-500 to-emerald-500 hidden lg:block"
        initial={{ width: "0%" }}
        animate={{ width: phase >= 4 ? "100%" : phase >= 3 ? "75%" : phase >= 2 ? "50%" : phase >= 1 ? "25%" : "0%" }}
        transition={{ duration: 0.5 }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1: Connect */}
        <StepCard step="01" title="Connect" desc="Link your tools once" delay={0}>
          <div className="flex gap-2">
            {["G", "V", "A"].map((letter, i) => (
              <motion.div
                key={letter}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  phase >= 1 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                    : "bg-zinc-800 text-zinc-600 border border-zinc-700"
                }`}
                animate={phase >= 1 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ delay: i * 0.1 }}
              >
                {letter}
              </motion.div>
            ))}
          </div>
        </StepCard>

        {/* Step 2: Deploy */}
        <StepCard step="02" title="Ship" desc="Deploy like always" delay={0.1}>
          <div className="font-mono text-xs space-y-1">
            <p className="text-zinc-600">$ git push</p>
            <motion.p 
              className="text-emerald-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
            >
              ✓ Deployed
            </motion.p>
          </div>
        </StepCard>

        {/* Step 3: Detect */}
        <StepCard step="03" title="Detect" desc="Auto-tracked" delay={0.2}>
          <motion.div 
            className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs transition-all duration-300 ${
              phase >= 3 
                ? "bg-blue-500/20 text-blue-400" 
                : "bg-zinc-800 text-zinc-600"
            }`}
          >
            <motion.span 
              className="w-1.5 h-1.5 rounded-full bg-blue-400"
              animate={phase >= 3 ? { scale: [1, 1.3, 1] } : {}}
              transition={{ repeat: phase >= 3 ? Infinity : 0, duration: 1 }}
            />
            {phase >= 3 ? "Tracking..." : "Waiting"}
          </motion.div>
        </StepCard>

        {/* Step 4: Result */}
        <StepCard step="04" title="Learn" desc="See what works" delay={0.3}>
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 4 ? 1 : 0.3 }}
          >
            <span className="text-zinc-500 text-sm">12%</span>
            <span className="text-zinc-700">→</span>
            <span className={`text-sm font-medium ${phase >= 4 ? "text-emerald-400" : "text-zinc-600"}`}>
              18%
            </span>
            {phase >= 4 && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-emerald-400"
              >
                +50%
              </motion.span>
            )}
          </motion.div>
        </StepCard>
      </div>
    </div>
  );
}

// Live Experiment Feed
function LiveFeed() {
  const experiments = [
    { title: "Checkout redesign", result: "success", change: "+12%", time: "2h ago" },
    { title: "New pricing tier", result: "success", change: "+8%", time: "1d ago" },
    { title: "Homepage CTA", result: "neutral", change: "0%", time: "2d ago" },
    { title: "Onboarding flow", result: "fail", change: "-3%", time: "3d ago" },
  ];

  return (
    <div className="space-y-2">
      {experiments.map((exp, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between py-2 px-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${
              exp.result === "success" ? "bg-emerald-400" : 
              exp.result === "fail" ? "bg-red-400" : "bg-zinc-600"
            }`} />
            <span className="text-sm text-zinc-400">{exp.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${
              exp.result === "success" ? "text-emerald-400" : 
              exp.result === "fail" ? "text-red-400" : "text-zinc-600"
            }`}>
              {exp.change}
            </span>
            <span className="text-xs text-zinc-700">{exp.time}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistCount, setWaitlistCount] = useState(247);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setWaitlistCount(prev => prev + 1);
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/[0.04] blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-white">
            Briefix
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm bg-white text-black font-medium px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 text-xs text-zinc-500 border border-zinc-800 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Zero-effort experiment tracking
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.15] tracking-tight mb-5">
              Experiments track themselves.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                You just ship.
              </span>
            </h1>
            
            <p className="text-zinc-500 text-lg mb-8">
              Connect once, ship as usual. Every deploy becomes a tracked experiment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white text-black font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Start free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <span className="text-sm text-zinc-600">No credit card required</span>
            </div>
          </motion.div>

          {/* How it works - Horizontal */}
          <AnimatedDemo />
        </div>
      </section>

      {/* Social proof + Live feed */}
      <section className="py-16 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                Ship with confidence
              </h2>
              <p className="text-zinc-500 mb-6">
                Know what's working without the manual tracking.
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "0", label: "Manual input" },
                  { value: "100%", label: "Auto-tracked" },
                  { value: "5min", label: "Setup time" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Live feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Recent experiments</h3>
                <span className="text-xs text-zinc-600">Auto-detected</span>
              </div>
              <LiveFeed />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-zinc-500"
          >
            {[
              "GitHub & Vercel integration",
              "Automatic before/after analysis",
              "Weekly AI insights",
              "Team knowledge base",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to ship smarter?
            </h2>
            <p className="text-zinc-500 mb-6">
              Join {waitlistCount}+ teams on the waitlist.
            </p>

            {status === "success" ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                <svg className="w-6 h-6 text-emerald-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-white font-medium">You're on the list!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                  disabled={status === "loading"}
                />
                <button 
                  type="submit" 
                  className="bg-white text-black font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "..." : "Join"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-600">
          <span>© 2025 Briefix</span>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
            @yejin
          </a>
        </div>
      </footer>
    </div>
  );
}
