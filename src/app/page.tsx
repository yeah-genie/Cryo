"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// Types
interface PlaygroundIdea {
  id: string;
  title: string;
  scores: { impact: number; effort: number; confidence: number };
  totalScore: number;
  status: "active" | "killed";
  killReason?: string;
}

const killReasons = [
  "Too competitive",
  "Not enough resources", 
  "Lost conviction",
  "Market timing off",
  "Better alternatives exist"
];

const calculateScore = (scores: PlaygroundIdea["scores"]) => {
  const { impact, effort, confidence } = scores;
  // ICE Score: Impact * Confidence / Effort
  return Math.round((impact * confidence) / Math.max(effort, 1) * 10);
};

// Particle explosion for kill effect
function KillParticles({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
          style={{ 
            background: i % 2 === 0 ? 'var(--red)' : 'var(--accent)',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ 
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            opacity: 0,
            scale: 0
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [step, setStep] = useState<"idle" | "input" | "evaluate" | "result">("idle");
  const [ideas, setIdeas] = useState<PlaygroundIdea[]>([]);
  const [inputs, setInputs] = useState(["", "", ""]);
  const [evalIndex, setEvalIndex] = useState(0);
  const [killingIdea, setKillingIdea] = useState<PlaygroundIdea | null>(null);
  const [showKillModal, setShowKillModal] = useState(false);
  const [isKilling, setIsKilling] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  const playgroundRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Scroll to playground
  const scrollToPlayground = () => {
    playgroundRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => setStep("input"), 500);
  };

  // Submit ideas
  const submitIdeas = () => {
    const valid = inputs.filter(v => v.trim()).map((title, i) => ({
      id: `idea-${i}`,
      title: title.trim(),
      scores: { impact: 5, effort: 5, confidence: 5 },
      totalScore: 50,
      status: "active" as const,
    }));
    if (valid.length === 0) return;
    setIdeas(valid);
    setStep("evaluate");
  };

  // Update score
  const updateScore = (field: keyof PlaygroundIdea["scores"], value: number) => {
    setIdeas(prev => prev.map((idea, i) => {
      if (i !== evalIndex) return idea;
      const newScores = { ...idea.scores, [field]: value };
      return { ...idea, scores: newScores, totalScore: calculateScore(newScores) };
    }));
  };

  // Next evaluation
  const nextEval = () => {
    if (evalIndex < ideas.length - 1) {
      setEvalIndex(prev => prev + 1);
    } else {
      setIdeas(prev => [...prev].sort((a, b) => b.totalScore - a.totalScore));
      setStep("result");
    }
  };

  // Kill idea
  const handleKill = (reason: string) => {
    if (!killingIdea) return;
    setIsKilling(true);
  };

  const completeKill = () => {
    if (!killingIdea) return;
    setIdeas(prev => prev.map(idea => 
      idea.id === killingIdea.id ? { ...idea, status: "killed", killReason: killingIdea.killReason } : idea
    ));
    setShowKillModal(false);
    setKillingIdea(null);
    setIsKilling(false);
  };

  // Submit email
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
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("error");
    }
  };

  // Reset
  const reset = () => {
    setStep("idle");
    setIdeas([]);
    setInputs(["", "", ""]);
    setEvalIndex(0);
    setEmail("");
    setEmailStatus("idle");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <motion.header 
        style={{ opacity: heroOpacity }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)] text-lg">Briefix</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">
              Get started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-xs font-medium text-[var(--accent)]">Now in private beta</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight mb-6">
            Your ideas deserve
            <br />
            <span className="gradient-text">better than Notion</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-xl mx-auto">
            Stop losing ideas in endless docs. Evaluate, prioritize, and ship—or kill them with conviction.
          </p>

          {/* CTA */}
          <motion.button
            onClick={scrollToPlayground}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 bg-[var(--text-primary)] text-[var(--bg-page)] font-semibold text-lg px-8 py-4 rounded-xl hover:bg-white transition-colors"
          >
            Try it with your ideas
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>

          <p className="mt-4 text-sm text-[var(--text-tertiary)]">
            No signup required. Experience it first.
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
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-[var(--text-tertiary)] flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-[var(--text-tertiary)]" />
          </motion.div>
        </motion.div>
      </section>

      {/* Playground Section */}
      <section ref={playgroundRef} className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="section-label">Interactive Demo</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mt-2">
              See how it works
            </h2>
          </motion.div>

          {/* Playground Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card overflow-hidden"
          >
            {/* Progress Steps */}
            <div className="flex border-b border-[var(--border)]">
              {[
                { key: "input", label: "Add Ideas", num: "1" },
                { key: "evaluate", label: "Evaluate", num: "2" },
                { key: "result", label: "Decide", num: "3" },
              ].map((s, i) => {
                const isActive = 
                  (s.key === "input" && step === "input") ||
                  (s.key === "evaluate" && step === "evaluate") ||
                  (s.key === "result" && step === "result");
                const isPast = 
                  (s.key === "input" && (step === "evaluate" || step === "result")) ||
                  (s.key === "evaluate" && step === "result");
                
                return (
                  <div 
                    key={s.key}
                    className={`flex-1 py-4 text-center text-sm font-medium transition-all relative ${
                      isActive 
                        ? "text-[var(--text-primary)]" 
                        : isPast 
                          ? "text-[var(--accent)]"
                          : "text-[var(--text-tertiary)]"
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-2 ${
                      isActive 
                        ? "bg-[var(--accent)] text-white" 
                        : isPast 
                          ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                          : "bg-[var(--bg-surface)] text-[var(--text-tertiary)]"
                    }`}>
                      {isPast ? "✓" : s.num}
                    </span>
                    {s.label}
                    {isActive && (
                      <motion.div 
                        layoutId="activeStep"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" 
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* IDLE STATE */}
                {step === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--purple)]/20 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                      Ready to prioritize?
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                      Add your ideas and see which ones are worth pursuing.
                    </p>
                    <button onClick={() => setStep("input")} className="btn-primary">
                      Start →
                    </button>
                  </motion.div>
                )}

                {/* INPUT STATE */}
                {step === "input" && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <p className="text-[var(--text-secondary)] mb-6">
                      What ideas have been on your mind? Add up to 3.
                    </p>
                    <div className="space-y-3">
                      {inputs.map((val, i) => (
                        <div key={i} className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-sm font-medium">
                            {i + 1}.
                          </span>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => {
                              const newInputs = [...inputs];
                              newInputs[i] = e.target.value;
                              setInputs(newInputs);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && inputs.some(v => v.trim())) {
                                submitIdeas();
                              }
                            }}
                            placeholder={
                              i === 0 ? "e.g., Launch a weekly newsletter" 
                              : i === 1 ? "e.g., Build an AI assistant" 
                              : "e.g., Create a mobile app"
                            }
                            className="input pl-10"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={submitIdeas}
                      disabled={!inputs.some(v => v.trim())}
                      className="btn-primary w-full mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {/* EVALUATE STATE */}
                {step === "evaluate" && ideas[evalIndex] && (
                  <motion.div
                    key={`eval-${evalIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-center mb-8">
                      <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                        Idea {evalIndex + 1} of {ideas.length}
                      </p>
                      <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                        {ideas[evalIndex].title}
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {[
                        { key: "impact", label: "Impact", desc: "How big is the potential?" },
                        { key: "effort", label: "Effort", desc: "How hard to execute?" },
                        { key: "confidence", label: "Confidence", desc: "How sure are you?" },
                      ].map(({ key, label, desc }) => (
                        <div key={key}>
                          <div className="flex justify-between items-baseline mb-3">
                            <div>
                              <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
                              <span className="text-xs text-[var(--text-tertiary)] ml-2">{desc}</span>
                            </div>
                            <span className="text-lg font-semibold text-[var(--accent)]">
                              {ideas[evalIndex].scores[key as keyof typeof ideas[0]["scores"]]}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={ideas[evalIndex].scores[key as keyof typeof ideas[0]["scores"]]}
                            onChange={(e) => updateScore(key as keyof PlaygroundIdea["scores"], parseInt(e.target.value))}
                            className="w-full h-2 bg-[var(--bg-surface)] rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
                          />
                          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                            <span>Low</span>
                            <span>High</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Score Preview */}
                    <div className="mt-8 p-4 rounded-xl bg-[var(--bg-surface)] text-center">
                      <div className="text-3xl font-bold gradient-text">
                        {ideas[evalIndex].totalScore}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)] mt-1">
                        ICE Score
                      </div>
                    </div>

                    <button onClick={nextEval} className="btn-primary w-full mt-6">
                      {evalIndex < ideas.length - 1 ? "Next Idea" : "See Results"}
                    </button>
                  </motion.div>
                )}

                {/* RESULT STATE */}
                {step === "result" && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-center mb-8">
                      <div className="text-4xl mb-3">🎯</div>
                      <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                        Your Priority Stack
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {ideas.map((idea, i) => {
                        const isKilled = idea.status === "killed";
                        const isWinner = i === 0 && !isKilled;
                        const isLowest = i === ideas.filter(x => x.status === "active").length - 1 && 
                                        ideas.filter(x => x.status === "active").length > 1 &&
                                        !isKilled;
                        
                        return (
                          <motion.div
                            key={idea.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isKilled ? 0.5 : 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                              isKilled 
                                ? "border-[var(--red)]/30 bg-[var(--red)]/5" 
                                : isWinner 
                                  ? "border-[var(--green)]/50 bg-[var(--green)]/5" 
                                  : "border-[var(--border)] bg-[var(--bg-surface)]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">
                                  {isKilled ? "💀" : isWinner ? "🏆" : i === 1 ? "🥈" : "🥉"}
                                </span>
                                <div>
                                  <div className={`font-medium ${isKilled ? "line-through text-[var(--text-tertiary)]" : "text-[var(--text-primary)]"}`}>
                                    {idea.title}
                                  </div>
                                  <div className="text-xs text-[var(--text-tertiary)]">
                                    {isKilled ? idea.killReason : `Score: ${idea.totalScore}`}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isWinner && !isKilled && (
                                  <span className="text-xs font-medium text-[var(--green)] px-2 py-1 rounded-full bg-[var(--green)]/10">
                                    Ship it!
                                  </span>
                                )}
                                {isLowest && (
                                  <button
                                    onClick={() => { setKillingIdea(idea); setShowKillModal(true); }}
                                    className="text-xs text-[var(--red)] hover:bg-[var(--red)]/10 px-2 py-1 rounded-lg transition-colors"
                                  >
                                    Kill
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    <div className="mt-10 pt-8 border-t border-[var(--border)]">
                      {emailStatus === "success" ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center"
                        >
                          <div className="w-12 h-12 rounded-full bg-[var(--green)]/10 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-[var(--green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-1">You're on the list!</h4>
                          <p className="text-sm text-[var(--text-secondary)]">We'll reach out when your spot is ready.</p>
                        </motion.div>
                      ) : (
                        <>
                          <h4 className="text-lg font-semibold text-[var(--text-primary)] text-center mb-2">
                            Want to save this?
                          </h4>
                          <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
                            Get early access and keep your priority stack.
                          </p>
                          <form onSubmit={handleEmailSubmit} className="flex gap-2">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@company.com"
                              className="input flex-1"
                              disabled={emailStatus === "loading"}
                            />
                            <button 
                              type="submit" 
                              className="btn-primary whitespace-nowrap"
                              disabled={emailStatus === "loading"}
                            >
                              {emailStatus === "loading" ? "..." : "Get Access"}
                            </button>
                          </form>
                          {emailStatus === "error" && (
                            <p className="text-xs text-[var(--red)] mt-2 text-center">Something went wrong. Try again.</p>
                          )}
                        </>
                      )}
                    </div>

                    <button 
                      onClick={reset}
                      className="w-full mt-6 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                      ← Try with different ideas
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Built For Section */}
      <section className="py-24 px-6 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="section-label">Built for</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mt-2">
              Teams that move fast
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🚀",
                title: "Startup founders",
                desc: "Turn 100 ideas into 1 validated experiment"
              },
              {
                icon: "💡",
                title: "Product teams",
                desc: "Prioritize features with data, not opinions"
              },
              {
                icon: "🎯",
                title: "Solo builders",
                desc: "Stop second-guessing, start shipping"
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="text-sm text-[var(--text-tertiary)]">© 2025 Briefix</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--text-tertiary)]">
            <Link href="/login" className="hover:text-[var(--text-secondary)] transition-colors">Log in</Link>
            <Link href="/signup" className="hover:text-[var(--text-secondary)] transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

      {/* Kill Modal */}
      <AnimatePresence>
        {showKillModal && killingIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isKilling && setShowKillModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 w-full max-w-sm relative"
              onClick={(e) => e.stopPropagation()}
            >
              {isKilling && <KillParticles onComplete={completeKill} />}
              
              <AnimatePresence mode="wait">
                {!isKilling ? (
                  <motion.div key="modal" exit={{ opacity: 0, scale: 0.8 }}>
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">💀</div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Kill this idea?
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {killingIdea.title}
                      </p>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                      Select a reason
                    </p>
                    <div className="space-y-2">
                      {killReasons.map((reason) => (
                        <button
                          key={reason}
                          onClick={() => {
                            setKillingIdea({ ...killingIdea, killReason: reason });
                            handleKill(reason);
                          }}
                          className="w-full p-3 text-left rounded-lg border border-[var(--border)] hover:border-[var(--red)]/50 hover:bg-[var(--red)]/5 transition-all text-sm text-[var(--text-secondary)]"
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowKillModal(false)}
                      className="w-full mt-4 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    >
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="killing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 0], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="text-5xl"
                    >
                      💀
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
