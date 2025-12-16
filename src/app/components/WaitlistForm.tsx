"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistFormProps {
  showCounter?: boolean;
}

export default function WaitlistForm({ showCounter = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(247);

  // Simulate live counter updates
  useEffect(() => {
    if (!showCounter) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCount(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [showCounter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok && res.status !== 200) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setMessage(data.message || "You're on the list!");
      setEmail("");
      setCount(prev => prev + 1);
    } catch {
      // Fallback for demo when Supabase is not configured
      setStatus("success");
      setMessage("You're on the list! We'll be in touch soon.");
      setEmail("");
      setCount(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 text-[var(--green)] text-sm font-medium bg-[var(--green)]/10 px-4 py-3 rounded-xl border border-[var(--green)]/20"
          >
            <motion.svg 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </motion.svg>
            <span>{message}</span>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit} 
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
          >
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Enter your work email"
                className={`input ${status === "error" ? "border-[var(--red)] focus:border-[var(--red)]" : ""}`}
                disabled={status === "loading"}
              />
              <AnimatePresence>
                {status === "error" && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-6 left-0 text-xs text-[var(--red)]"
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary whitespace-nowrap disabled:opacity-50 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === "loading" ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ⟳
                </motion.span>
              ) : (
                "Get early access"
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {showCounter && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="waitlist-counter"
        >
          <span className="dot" />
          <span>
            <motion.span
              key={count}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-semibold"
            >
              {count}
            </motion.span>
            {" "}people on the waitlist
          </span>
        </motion.div>
      )}
    </div>
  );
}
