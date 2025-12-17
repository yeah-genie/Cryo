"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
            <div className="text-xs text-violet-400 font-medium mb-4 tracking-wide uppercase">
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

// Optimize Demo - Lesson comparison
function OptimizeDemo() {
  const [phase, setPhase] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div ref={ref} className="bg-[#0c0c0e] border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/80 bg-[#111113]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-white font-medium">Lesson Test</span>
          </div>
          <span className="text-xs text-zinc-500">7 days running</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border transition-all ${phase >= 2 ? 'bg-zinc-900/30 border-zinc-700' : 'bg-zinc-900/50 border-zinc-800'}`}>
            <p className="text-xs text-zinc-500 mb-2">Original</p>
            <p className="text-sm text-zinc-300 mb-3">5-min intro video</p>
            {phase >= 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-2xl font-semibold text-white">42%</p>
                <p className="text-xs text-zinc-500">finished</p>
              </motion.div>
            )}
          </div>
          <div className={`p-4 rounded-lg border transition-all ${phase >= 2 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
            <p className="text-xs text-zinc-500 mb-2">New version</p>
            <p className="text-sm text-zinc-300 mb-3">Story-based intro</p>
            {phase >= 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-2xl font-semibold text-emerald-400">67%</p>
                <p className="text-xs text-zinc-500">finished</p>
              </motion.div>
            )}
          </div>
        </div>

        {phase >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 py-2">
            <span className="text-emerald-400 font-semibold">+59%</span>
            <span className="text-zinc-400 text-sm">more students finish</span>
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
            <p className="text-sm text-violet-300">
              Story-based intro wins. Apply it to all students?
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Analytics Demo - Where students drop off
function AnalyticsDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const lessons = [
    { name: "Intro", completion: 95, status: "good" },
    { name: "Setup", completion: 88, status: "good" },
    { name: "Basics", completion: 76, status: "warning" },
    { name: "Advanced", completion: 34, status: "danger" },
    { name: "Project", completion: 28, status: "danger" },
  ];

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="bg-[#0c0c0e] border border-zinc-800 rounded-xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-zinc-800/80 bg-[#111113]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white font-medium">Where students stop</span>
            <span className="text-xs text-zinc-500">Last 30 days</span>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson.name}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-3"
            >
              <span className="text-xs text-zinc-500 w-16">{lesson.name}</span>
              <div className="flex-1 h-6 bg-zinc-800/50 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${lesson.completion}%` } : {}}
                  transition={{ duration: 0.8, delay: 0.1 * i }}
                  className={`h-full ${
                    lesson.status === "good" ? "bg-emerald-500/80" :
                    lesson.status === "warning" ? "bg-yellow-500/80" :
                    "bg-red-500/80"
                  }`}
                />
              </div>
              <span className={`text-sm font-medium w-10 text-right ${
                lesson.status === "good" ? "text-emerald-400" :
                lesson.status === "warning" ? "text-yellow-400" :
                "text-red-400"
              }`}>
                {lesson.completion}%
              </span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="px-5 py-4 bg-red-500/5 border-t border-red-500/10"
        >
          <p className="text-sm text-red-300">
            <span className="font-medium">Problem:</span> 55% drop at "Advanced" — try splitting into 2 shorter lessons
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// FAQ Accordion Component
function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      q: "How does course validation work?",
      a: "Enter your course topic, and we analyze search trends, existing courses, reviews, and community discussions. You get a demand score, competition level, and revenue estimate — all in under a minute."
    },
    {
      q: "Which course platforms work with this?",
      a: "We're building integrations for Teachable, Thinkific, and Kajabi first. No coding required — just connect your account. More platforms coming based on demand."
    },
    {
      q: "How do lesson tests work?",
      a: "Upload two versions of a lesson (different intro, length, or format). We randomly show each version to students and track who finishes. When we have enough data, we tell you which one works better."
    },
    {
      q: "Is my course content safe?",
      a: "We never access your actual videos. We only look at behavioral data — when students start, pause, or finish lessons. Your content stays on your platform."
    },
    {
      q: "How long until I see results?",
      a: "Validation is instant. For lesson tests, it depends on your traffic — usually 1-2 weeks with 100+ daily students. We'll tell you when we have enough data."
    },
  ];

  return (
    <div className="space-y-5">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-900/50 transition-colors"
          >
            <span className="text-base font-medium text-white">{faq.q}</span>
            <svg 
              className={`w-5 h-5 text-zinc-500 transition-transform ${openIndex === i ? "rotate-180" : ""}`} 
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
                <p className="px-5 pb-5 text-zinc-400 leading-relaxed">{faq.a}</p>
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

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseIdea.trim()) return;
    // Navigate to validator with the course idea
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-violet-500/[0.07] via-purple-500/[0.03] to-transparent blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            CourseOS
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/app" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Try it free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - AI Search Style */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="min-h-screen flex items-center justify-center px-6 pt-14"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              Will your course idea
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                actually sell?
              </span>
            </h1>
            
            <p className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-md mx-auto">
              Find out in 30 seconds. Free.
            </p>

            {/* Course Idea Input - Main CTA */}
            <form onSubmit={handleValidate} className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={courseIdea}
                  onChange={(e) => setCourseIdea(e.target.value)}
                  placeholder="e.g. Python for healthcare professionals"
                  className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl px-5 py-4 pr-32 text-white text-lg placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Validate
                </button>
              </div>
              <p className="text-sm text-zinc-600 mt-3">
                Enter any course topic to see demand, competition, and revenue potential
              </p>
            </form>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
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

      {/* Problem Statement */}
      <Section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl text-zinc-300 leading-relaxed">
            <span className="text-white font-medium">Most online courses fail.</span>
            <br />
            Creators spend months building courses nobody buys.
            <br />
            Then wonder why only 10% of students finish.
          </p>
          <p className="text-lg text-zinc-500 mt-8">
            What if you could know before you start?
          </p>
        </div>
      </Section>

      {/* What you get - Simple list */}
      <Section className="py-24 px-6 border-y border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-16 text-center">
            What you'll know
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Is there demand?",
                desc: "See how many people are searching for your topic and if the market is growing",
                icon: "📊",
              },
              {
                title: "Can you compete?",
                desc: "Discover how many courses exist and find gaps nobody is filling",
                icon: "🎯",
              },
              {
                title: "What can you charge?",
                desc: "Get revenue estimates based on similar courses and their pricing",
                icon: "💰",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Coming Soon Features */}
      <Section className="py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs text-zinc-500 border border-zinc-800 rounded-full px-3 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Coming soon
          </div>
        </div>
      </Section>

      {/* Feature 1: Find problems */}
      <FeatureSection
        label="See what's not working"
        title="Find where students give up"
        description="Connect your course platform and see exactly which lessons lose students. No more guessing why your completion rate is low."
      >
        <AnalyticsDemo />
      </FeatureSection>

      {/* Feature 2: Test what works */}
      <FeatureSection
        label="Test different versions"
        title="Find out which lessons work better"
        description="Try two versions of a lesson. We show each to different students and tell you which one keeps more people watching."
      >
        <OptimizeDemo />
      </FeatureSection>

      {/* Email signup for full version */}
      <Section className="py-24 px-6 border-y border-zinc-800/50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            Get notified when we launch
          </h2>
          <p className="text-zinc-400 mb-8">
            Course validation is free now. Be first to access lesson tracking and testing.
          </p>

          {emailStatus === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5"
            >
              <p className="text-emerald-400 font-medium mb-1">You're on the list!</p>
              <p className="text-sm text-zinc-400">We'll email you when we launch.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                disabled={emailStatus === "loading"}
              />
              <button 
                type="submit" 
                className="bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                disabled={emailStatus === "loading"}
              >
                {emailStatus === "loading" ? "..." : "Notify me"}
              </button>
            </form>
          )}
          
          <p className="text-sm text-zinc-600 mt-4">
            Join {waitlistCount}+ course creators. No spam.
          </p>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-12 text-center">
            Questions
          </h2>
          
          <FAQAccordion />
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-32 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Ready to validate your idea?
          </h2>
          <p className="text-zinc-400 mb-8">
            Takes 30 seconds. Completely free.
          </p>

          <form onSubmit={handleValidate} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={courseIdea}
                onChange={(e) => setCourseIdea(e.target.value)}
                placeholder="Your course topic..."
                className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl px-5 py-4 pr-32 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 transition-all"
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

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-zinc-600">
          <span>© 2025 CourseOS</span>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
