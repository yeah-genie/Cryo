"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// Section wrapper with scroll animation
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Feature section component
function FeatureSection({ 
  label, 
  title, 
  description, 
  children 
}: { 
  label: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <Section className="min-h-[70vh] flex items-center py-32 px-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs text-blue-400 font-medium mb-4 tracking-wide uppercase">
              {label}
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight mb-4">
              {title}
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="lg:pl-8">
            {children}
          </div>
        </div>
      </div>
    </Section>
  );
}

// Tool icons
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function VercelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M24 22.525H0l12-21.05 12 21.05z"/>
    </svg>
  );
}

function GoogleAnalyticsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M22.84 2.998v17.998c0 1.66-1.34 3.004-3 3.004-1.66 0-3-1.344-3-3.004V2.998c0-1.656 1.34-3 3-3 1.66 0 3 1.344 3 3zM6 13.998v7.002c0 1.656-1.34 3-3 3s-3-1.344-3-3v-7.002c0-1.659 1.34-3.003 3-3.003s3 1.344 3 3.003zm8.5-4.5v11.498c0 1.66-1.34 3.004-3 3.004s-3-1.344-3-3.004V9.498c0-1.656 1.34-3 3-3s3 1.344 3 3z"/>
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  );
}

function MixpanelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8a7.2 7.2 0 110 14.4 7.2 7.2 0 010-14.4z"/>
    </svg>
  );
}

function AmplitudeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2L2 19.5h20L12 2zm0 4l7 12H5l7-12z"/>
    </svg>
  );
}

// Connect animation - shows what it does after connecting
function ConnectDemo() {
  const [phase, setPhase] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const tools = [
    { name: "GitHub", icon: <GitHubIcon />, status: "Watching code changes..." },
    { name: "Vercel", icon: <VercelIcon />, status: "Tracking deploys..." },
    { name: "Google Analytics", icon: <GoogleAnalyticsIcon />, status: "Monitoring conversions..." },
    { name: "Slack", icon: <SlackIcon />, status: "Ready for alerts..." },
    { name: "Mixpanel", icon: <MixpanelIcon />, status: "Syncing events..." },
    { name: "Amplitude", icon: <AmplitudeIcon />, status: "Pulling metrics..." },
  ];

  useEffect(() => {
    if (!isInView) return;
    const timers = tools.map((_, i) => 
      setTimeout(() => setPhase(i + 1), 300 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-2">
      {tools.map((tool, i) => (
        <motion.div
          key={tool.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: i * 0.08 }}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-400 ${
            phase > i 
              ? "bg-emerald-500/5 border-emerald-500/20" 
              : "bg-zinc-900/50 border-zinc-800"
          }`}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-400 ${
            phase > i ? "bg-white text-black" : "bg-zinc-800 text-zinc-500"
          }`}>
            {tool.icon}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm text-white block">{tool.name}</span>
            {phase > i && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-emerald-400 block"
              >
                {tool.status}
              </motion.span>
            )}
          </div>
          {phase > i && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Ship animation - shows auto detection
function ShipDemo() {
  const [phase, setPhase] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1900),
      setTimeout(() => setPhase(4), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div ref={ref} className="bg-[#0c0c0e] border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/80 bg-[#111113]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-zinc-500 ml-2">Terminal</span>
      </div>
      <div className="p-5 font-mono text-sm space-y-1.5">
        <p className="text-zinc-500">$ git push origin main</p>
        {phase >= 1 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400">
            Writing objects: 100% (42/42), done.
          </motion.p>
        )}
        {phase >= 2 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400">
            ✓ Deployed to production
          </motion.p>
        )}
        {phase >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 space-y-1">
            <p className="text-blue-400">🤖 Briefix detected:</p>
            <p className="text-zinc-400 pl-4">pricing.tsx changed</p>
            <p className="text-zinc-400 pl-4">Tracking: Conversion rate</p>
          </motion.div>
        )}
        {phase >= 4 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-violet-400 pl-4">
            Auto-hypothesis: "Price change → Signup impact"
          </motion.p>
        )}
      </div>
    </div>
  );
}

// Learn animation - Weekly report style
function LearnDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Weekly Report</p>
              <p className="text-white font-medium">Dec 9 - 15</p>
            </div>
            <div className="text-xs text-zinc-500">Auto-generated</div>
          </div>
        </div>

        {/* Experiments */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">This week's experiments</p>
          
          {[
            { name: "Checkout redesign", result: "+50% conversion", success: true },
            { name: "New pricing page", result: "+33% signups", success: true },
            { name: "CTA button color", result: "No change", success: false },
          ].map((exp, i) => (
            <motion.div
              key={exp.name}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">├─</span>
                <span className="text-zinc-300">{exp.name}</span>
              </div>
              <span className={`text-sm font-medium ${exp.success ? "text-emerald-400" : "text-zinc-500"}`}>
                {exp.result} {exp.success && "✓"}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="px-5 py-4 bg-blue-500/5 border-t border-blue-500/10"
        >
          <div className="flex items-start gap-2">
            <span className="text-blue-400">🧠</span>
            <p className="text-sm text-blue-300">
              <span className="font-medium">Pattern:</span> UX flow changes beat color tweaks
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistCount, setWaitlistCount] = useState(247);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-500/[0.07] via-violet-500/[0.03] to-transparent blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-white">
            Briefix
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/app" className="text-sm bg-white text-black font-medium px-4 py-1.5 rounded-md hover:bg-zinc-200 transition-colors">
              Try a demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="min-h-screen flex items-center justify-center px-6 pt-14"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 text-xs text-zinc-400 border border-zinc-800 rounded-full px-3 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Zero-effort experiment tracking
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              Experiments
              <br />
              track themselves.
            </h1>
            
            <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-lg mx-auto">
              Connect your stack once. Zero input from you — we watch deploys, compare metrics, and tell you what worked.
            </p>

            {/* Email form in Hero */}
            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 max-w-md mx-auto"
              >
                <p className="text-emerald-400 font-medium mb-1">You're on the list!</p>
                <p className="text-sm text-zinc-400">We'll set you up with automatic experiment tracking soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                  disabled={status === "loading"}
                />
                <button 
                  type="submit" 
                  className="bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "..." : "Get early access"}
                </button>
              </form>
            )}
            
            <p className="text-sm text-zinc-600 mt-4">
              Join {waitlistCount}+ others. No spam, just updates.
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2"
            >
              <div className="w-1 h-2 bg-zinc-600 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature 1: Connect */}
      <FeatureSection
        label="Step 1"
        title="Connect once, track forever"
        description="Authenticate with your stack in 5 minutes. No SDK, no code changes. Once connected, we start watching everything automatically."
      >
        <ConnectDemo />
      </FeatureSection>

      {/* Feature 2: Ship */}
      <FeatureSection
        label="Step 2"
        title="Ship like you always do"
        description="Just keep pushing code. We detect what changed, auto-generate hypotheses, and start tracking the right metrics. You don't lift a finger."
      >
        <ShipDemo />
      </FeatureSection>

      {/* Feature 3: Learn */}
      <FeatureSection
        label="Step 3"
        title="Get weekly insights, automatically"
        description="Every Monday, you get a report of what worked and what didn't. We spot patterns so you can double down on what matters."
      >
        <LearnDemo />
      </FeatureSection>

      {/* FAQ Section */}
      <Section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-12 text-center">
            Frequently asked questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: "Is it really zero input?",
                a: "Yes. Once you connect your tools, we watch your deploys and pull metrics automatically. You don't need to log experiments, tag commits, or fill out forms. Just ship code like you always do."
              },
              {
                q: "What data sources do you use?",
                a: "We connect to GitHub (code changes), Vercel (deployments), and your analytics tool (Google Analytics, Mixpanel, Amplitude, etc.). We compare metrics before and after each deploy to detect impact."
              },
              {
                q: "Do I need to install an SDK?",
                a: "No SDK required. We use OAuth to connect to your existing tools. No code changes, no new dependencies, no deployment pipeline modifications."
              },
              {
                q: "How accurate is the automatic detection?",
                a: "We track file changes per deploy and correlate them with metric changes. For most product changes, this works well. For complex multi-feature deploys, we'll ask you to confirm what changed."
              },
              {
                q: "What if I want to track something manually?",
                a: "You can always add manual experiments or override our auto-detection. But most teams find they don't need to — we catch everything automatically."
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-zinc-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-medium text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-32 px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Ready to ship smarter?
          </h2>
          <p className="text-zinc-400 mb-8">
            Stop flying blind. Know exactly what's working.
          </p>

          {status === "success" ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-medium">You're on the list!</p>
              <p className="text-sm text-zinc-400 mt-1">We'll set you up with automatic tracking soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                disabled={status === "loading"}
              />
              <button 
                type="submit" 
                className="bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                disabled={status === "loading"}
              >
                {status === "loading" ? "..." : "Join waitlist"}
              </button>
            </form>
          )}
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-zinc-600">
          <span>© 2025 Briefix</span>
          <div className="flex items-center gap-6">
            <Link href="/app" className="hover:text-zinc-400 transition-colors">Try a demo</Link>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
