"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Types
interface UserIdea {
  id: string;
  title: string;
  scores: {
    market: number;
    effort: number;
    confidence: number;
  };
  totalScore: number;
  status: "inbox" | "evaluate" | "experiment" | "killed";
  killReason?: string;
}

// Kill reasons
const killReasons = [
  "Too competitive",
  "Not enough time",
  "Lost interest",
  "Market changed",
  "Too risky",
];

// Calculate score
const calculateScore = (scores: UserIdea["scores"]) => {
  const { market, effort, confidence } = scores;
  // Higher market + lower effort + higher confidence = better
  return Math.round(((market + (11 - effort) + confidence) / 30) * 100);
};

// Particle component for kill effect
function Particles({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-500 rounded-full"
          initial={{ 
            x: "50%", 
            y: "50%", 
            opacity: 1,
            scale: 1 
          }}
          animate={{ 
            x: `${50 + (Math.random() - 0.5) * 200}%`,
            y: `${50 + (Math.random() - 0.5) * 200}%`,
            opacity: 0,
            scale: 0
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function PlaygroundLanding() {
  // Playground state
  const [step, setStep] = useState<"intro" | "input" | "evaluate" | "priority" | "kill" | "summary">("intro");
  const [ideas, setIdeas] = useState<UserIdea[]>([]);
  const [inputValues, setInputValues] = useState(["", "", ""]);
  const [currentEvalIndex, setCurrentEvalIndex] = useState(0);
  const [showKillModal, setShowKillModal] = useState(false);
  const [killingIdea, setKillingIdea] = useState<UserIdea | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);

  // Fetch waitlist count
  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => setWaitlistCount(data.count || 0))
      .catch(() => {});
  }, []);

  // Start the experience
  const startExperience = () => {
    setStep("input");
  };

  // Submit ideas
  const submitIdeas = () => {
    const validIdeas = inputValues
      .filter((v) => v.trim())
      .map((title, i) => ({
        id: `idea-${i}`,
        title: title.trim(),
        scores: { market: 5, effort: 5, confidence: 5 },
        totalScore: 50,
        status: "inbox" as const,
      }));

    if (validIdeas.length === 0) return;
    
    setIdeas(validIdeas);
    setStep("evaluate");
  };

  // Update score
  const updateScore = (field: "market" | "effort" | "confidence", value: number) => {
    setIdeas((prev) =>
      prev.map((idea, i) => {
        if (i !== currentEvalIndex) return idea;
        const newScores = { ...idea.scores, [field]: value };
        return {
          ...idea,
          scores: newScores,
          totalScore: calculateScore(newScores),
        };
      })
    );
  };

  // Next evaluation
  const nextEvaluation = () => {
    if (currentEvalIndex < ideas.length - 1) {
      setCurrentEvalIndex((prev) => prev + 1);
    } else {
      // Sort by score and move to priority
      setIdeas((prev) =>
        [...prev].sort((a, b) => b.totalScore - a.totalScore).map((idea, i) => ({
          ...idea,
          status: i === 0 ? "experiment" : i === prev.length - 1 ? "inbox" : "evaluate",
        }))
      );
      setStep("priority");
    }
  };

  // Start kill flow
  const startKill = (idea: UserIdea) => {
    setKillingIdea(idea);
    setShowKillModal(true);
  };

  // Confirm kill
  const confirmKill = (reason: string) => {
    if (!killingIdea) return;
    
    setShowKillModal(false);
    setShowParticles(true);
  };

  // Complete kill animation
  const completeKill = () => {
    setShowParticles(false);
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === killingIdea?.id
          ? { ...idea, status: "killed", killReason: killingIdea.killReason }
          : idea
      )
    );
    setKillingIdea(null);
    setStep("summary");
  };

  // Submit email
  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) return;
    
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setWaitlistCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)]">Briefix</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-1.5 px-3">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14">
        <AnimatePresence mode="wait">
          {/* INTRO STEP */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
                  Stop letting ideas<br />
                  <span className="text-[var(--accent)]">die in your notes</span>
                </h1>
                <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
                  Try Briefix with your own ideas. See how we help you evaluate, 
                  prioritize, and track what actually ships.
                </p>
                
                <button
                  onClick={startExperience}
                  className="btn-primary text-lg px-8 py-3 mb-6"
                >
                  Try it with your ideas →
                </button>

                {waitlistCount > 0 && (
                  <p className="text-sm text-[var(--text-tertiary)]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[var(--green)] rounded-full animate-pulse" />
                      {waitlistCount} people on the waitlist
                    </span>
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* INPUT STEP */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6"
            >
              <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                  <div className="text-sm text-[var(--accent)] mb-2">Step 1 of 4</div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Add your ideas
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    What have you been thinking about building or trying?
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {inputValues.map((value, i) => (
                    <div key={i} className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                        {i + 1}.
                      </span>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          const newValues = [...inputValues];
                          newValues[i] = e.target.value;
                          setInputValues(newValues);
                        }}
                        placeholder={
                          i === 0
                            ? "e.g., Launch a newsletter for devs"
                            : i === 1
                            ? "e.g., Build an AI writing tool"
                            : "e.g., Create a habit tracker app"
                        }
                        className="input w-full pl-10"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={submitIdeas}
                  disabled={!inputValues.some((v) => v.trim())}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  Continue →
                </button>

                <button
                  onClick={() => setStep("intro")}
                  className="w-full mt-3 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                >
                  ← Back
                </button>
              </div>
            </motion.div>
          )}

          {/* EVALUATE STEP */}
          {step === "evaluate" && ideas[currentEvalIndex] && (
            <motion.div
              key={`evaluate-${currentEvalIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6"
            >
              <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                  <div className="text-sm text-[var(--accent)] mb-2">Step 2 of 4</div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Rate this idea
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    Idea {currentEvalIndex + 1} of {ideas.length}
                  </p>
                </div>

                <div className="card p-6 mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 text-center">
                    "{ideas[currentEvalIndex].title}"
                  </h3>

                  <div className="space-y-6">
                    {/* Market Fit */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[var(--text-secondary)]">Market Opportunity</span>
                        <span className="text-[var(--text-primary)] font-medium">
                          {ideas[currentEvalIndex].scores.market}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={ideas[currentEvalIndex].scores.market}
                        onChange={(e) => updateScore("market", parseInt(e.target.value))}
                        className="w-full accent-[var(--accent)]"
                      />
                      <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                        <span>Niche</span>
                        <span>Huge market</span>
                      </div>
                    </div>

                    {/* Effort */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[var(--text-secondary)]">Effort Required</span>
                        <span className="text-[var(--text-primary)] font-medium">
                          {ideas[currentEvalIndex].scores.effort}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={ideas[currentEvalIndex].scores.effort}
                        onChange={(e) => updateScore("effort", parseInt(e.target.value))}
                        className="w-full accent-[var(--accent)]"
                      />
                      <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                        <span>Weekend project</span>
                        <span>Months of work</span>
                      </div>
                    </div>

                    {/* Confidence */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[var(--text-secondary)]">Your Confidence</span>
                        <span className="text-[var(--text-primary)] font-medium">
                          {ideas[currentEvalIndex].scores.confidence}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={ideas[currentEvalIndex].scores.confidence}
                        onChange={(e) => updateScore("confidence", parseInt(e.target.value))}
                        className="w-full accent-[var(--accent)]"
                      />
                      <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                        <span>Just a hunch</span>
                        <span>Very confident</span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
                    <div className="text-3xl font-bold text-[var(--accent)]">
                      {ideas[currentEvalIndex].totalScore}%
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {ideas[currentEvalIndex].totalScore >= 70
                        ? "🔥 High potential!"
                        : ideas[currentEvalIndex].totalScore >= 50
                        ? "🤔 Worth exploring"
                        : "⚠️ Needs more thought"}
                    </div>
                  </div>
                </div>

                <button onClick={nextEvaluation} className="btn-primary w-full">
                  {currentEvalIndex < ideas.length - 1 ? "Next idea →" : "See results →"}
                </button>
              </div>
            </motion.div>
          )}

          {/* PRIORITY STEP */}
          {step === "priority" && (
            <motion.div
              key="priority"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6"
            >
              <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                  <div className="text-sm text-[var(--accent)] mb-2">Step 3 of 4</div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Your priorities
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    Based on your ratings, here's the recommended order
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {ideas.map((idea, i) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`card p-4 ${
                        i === 0 ? "border-[var(--green)] bg-[var(--green)]/5" : ""
                      } ${i === ideas.length - 1 ? "border-red-500/30 bg-red-500/5" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              i === 0
                                ? "bg-[var(--green)] text-white"
                                : i === ideas.length - 1
                                ? "bg-red-500/20 text-red-400"
                                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                            }`}
                          >
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                          </div>
                          <div>
                            <div className="font-medium text-[var(--text-primary)]">
                              {idea.title}
                            </div>
                            <div className="text-xs text-[var(--text-tertiary)]">
                              Score: {idea.totalScore}%
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          {i === 0 && (
                            <span className="text-[var(--green)]">→ Start here!</span>
                          )}
                          {i === ideas.length - 1 && ideas.length > 1 && (
                            <button
                              onClick={() => startKill(idea)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Kill it? 💀
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {ideas.length > 1 ? (
                  <p className="text-center text-sm text-[var(--text-tertiary)] mb-6">
                    Click "Kill it?" on the lowest-ranked idea to see how kill logs work
                  </p>
                ) : (
                  <button onClick={() => setStep("summary")} className="btn-primary w-full">
                    Continue →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* SUMMARY STEP */}
          {step === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6"
            >
              <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-5xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Your idea pipeline is ready!
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    Here's what you built in just 2 minutes
                  </p>
                </div>

                {/* Pipeline visualization */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                  {/* Inbox */}
                  <div className="card p-3">
                    <div className="text-xs text-[var(--text-tertiary)] mb-2">📥 Inbox</div>
                    {ideas.filter((i) => i.status === "inbox").length === 0 ? (
                      <div className="text-xs text-[var(--text-tertiary)] opacity-50">Empty</div>
                    ) : (
                      ideas
                        .filter((i) => i.status === "inbox")
                        .map((idea) => (
                          <div key={idea.id} className="text-xs text-[var(--text-secondary)] truncate">
                            {idea.title}
                          </div>
                        ))
                    )}
                  </div>

                  {/* Evaluating */}
                  <div className="card p-3">
                    <div className="text-xs text-[var(--yellow)] mb-2">📊 Evaluating</div>
                    {ideas.filter((i) => i.status === "evaluate").length === 0 ? (
                      <div className="text-xs text-[var(--text-tertiary)] opacity-50">Empty</div>
                    ) : (
                      ideas
                        .filter((i) => i.status === "evaluate")
                        .map((idea) => (
                          <div key={idea.id} className="text-xs text-[var(--text-secondary)] truncate">
                            {idea.title}
                          </div>
                        ))
                    )}
                  </div>

                  {/* Experiment */}
                  <div className="card p-3 border-[var(--green)]">
                    <div className="text-xs text-[var(--green)] mb-2">🧪 Experiment</div>
                    {ideas
                      .filter((i) => i.status === "experiment")
                      .map((idea) => (
                        <div key={idea.id} className="text-xs text-[var(--text-secondary)] truncate">
                          {idea.title}
                        </div>
                      ))}
                  </div>

                  {/* Kill Log */}
                  <div className="card p-3 border-red-500/30">
                    <div className="text-xs text-red-400 mb-2">💀 Kill Log</div>
                    {ideas.filter((i) => i.status === "killed").length === 0 ? (
                      <div className="text-xs text-[var(--text-tertiary)] opacity-50">Empty</div>
                    ) : (
                      ideas
                        .filter((i) => i.status === "killed")
                        .map((idea) => (
                          <div key={idea.id}>
                            <div className="text-xs text-[var(--text-secondary)] truncate line-through">
                              {idea.title}
                            </div>
                            {idea.killReason && (
                              <div className="text-xs text-red-400/60">{idea.killReason}</div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="card p-6 text-center">
                  {submitted ? (
                    <div>
                      <div className="text-[var(--green)] text-lg font-medium mb-2">
                        ✓ You're on the list!
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        We'll notify you when Briefix launches.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        Save your ideas & get early access
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-4">
                        Your ideas will be waiting for you when we launch
                      </p>
                      <div className="flex gap-2 max-w-md mx-auto">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="input flex-1"
                          onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                        />
                        <button onClick={handleEmailSubmit} className="btn-primary">
                          Get early access
                        </button>
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)] mt-3">
                        Free for small teams. No credit card required.
                      </p>
                    </>
                  )}
                </div>

                {/* Try again */}
                <button
                  onClick={() => {
                    setStep("intro");
                    setIdeas([]);
                    setInputValues(["", "", ""]);
                    setCurrentEvalIndex(0);
                    setEmail("");
                    setSubmitted(false);
                  }}
                  className="w-full mt-4 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                >
                  ← Try again with different ideas
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kill Modal */}
        <AnimatePresence>
          {showKillModal && killingIdea && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setShowKillModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card p-6 w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
              >
                {showParticles && <Particles onComplete={completeKill} />}
                
                <AnimatePresence>
                  {!showParticles && (
                    <motion.div exit={{ opacity: 0, scale: 0.8 }}>
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">💀</div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          Kill "{killingIdea.title}"?
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          Why are you killing this idea?
                        </p>
                      </div>

                      <div className="space-y-2 mb-4">
                        {killReasons.map((reason) => (
                          <button
                            key={reason}
                            onClick={() => {
                              setKillingIdea({ ...killingIdea, killReason: reason });
                              confirmKill(reason);
                            }}
                            className="w-full p-3 text-left rounded-lg border border-[var(--border)] hover:border-red-500/50 hover:bg-red-500/5 transition-colors text-sm text-[var(--text-secondary)]"
                          >
                            {reason}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowKillModal(false)}
                        className="w-full text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 px-6 mt-auto">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between text-sm text-[var(--text-tertiary)]">
          <span>© 2025 Briefix</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-[var(--text-secondary)]">Log in</Link>
            <Link href="/signup" className="hover:text-[var(--text-secondary)]">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
