"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  type: "bot" | "user" | "system";
  content: string | React.ReactNode;
  timestamp: string;
};

// Slack-style Bot Avatar
function BotAvatar() {
  return (
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-sm">B</span>
    </div>
  );
}

// Experiment Result Card
function ExperimentCard({ 
  title, 
  change, 
  metric, 
  success 
}: { 
  title: string; 
  change: string; 
  metric: string; 
  success: boolean;
}) {
  return (
    <div className="bg-[#1a1d21] border border-zinc-700/50 rounded-lg p-4 mt-2 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-medium text-sm">{title}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          success ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-600/20 text-zinc-400"
        }`}>
          {success ? "Success" : "No change"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold ${success ? "text-emerald-400" : "text-zinc-400"}`}>
          {change}
        </span>
        <span className="text-zinc-500 text-sm">{metric}</span>
      </div>
    </div>
  );
}

// Weekly Report Preview
function WeeklyReportCard() {
  return (
    <div className="bg-[#1a1d21] border border-zinc-700/50 rounded-lg overflow-hidden mt-2 max-w-md">
      <div className="px-4 py-3 border-b border-zinc-700/50 bg-[#1e2126]">
        <div className="flex items-center justify-between">
          <span className="text-white font-medium text-sm">Weekly Report</span>
          <span className="text-xs text-zinc-500">Dec 9 - 15</span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {[
          { name: "Checkout redesign", result: "+50%", success: true },
          { name: "New pricing page", result: "+33%", success: true },
          { name: "CTA button color", result: "0%", success: false },
        ].map((exp, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-zinc-300">{exp.name}</span>
            <span className={exp.success ? "text-emerald-400 font-medium" : "text-zinc-500"}>
              {exp.result} {exp.success && "✓"}
            </span>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 bg-blue-500/5 border-t border-blue-500/10">
        <p className="text-xs text-blue-400">
          💡 Pattern: UX changes outperform color tweaks
        </p>
      </div>
    </div>
  );
}

// Typing Indicator
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <BotAvatar />
      <div className="flex items-center gap-1 bg-[#1a1d21] px-3 py-2 rounded-lg">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-2 h-2 bg-zinc-500 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          className="w-2 h-2 bg-zinc-500 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          className="w-2 h-2 bg-zinc-500 rounded-full"
        />
      </div>
    </div>
  );
}

// Demo scenarios
const demoScenarios = [
  {
    trigger: "deploy",
    messages: [
      {
        type: "bot" as const,
        content: (
          <div>
            <p className="text-zinc-300 mb-1">🚀 <strong>New deploy detected!</strong></p>
            <p className="text-zinc-400 text-sm">
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">pricing.tsx</code> was changed. I'll start tracking conversion rate.
            </p>
          </div>
        ),
      },
      {
        type: "bot" as const,
        content: (
          <div>
            <p className="text-zinc-400 text-sm mb-2">Auto-generated hypothesis:</p>
            <p className="text-blue-400 text-sm italic">"Pricing page update → Higher signup conversion"</p>
          </div>
        ),
        delay: 1500,
      },
    ],
  },
  {
    trigger: "results",
    messages: [
      {
        type: "bot" as const,
        content: (
          <div>
            <p className="text-zinc-300 mb-1">📊 <strong>Results are in!</strong></p>
            <p className="text-zinc-400 text-sm">Your latest experiment just reached statistical significance.</p>
            <ExperimentCard 
              title="Checkout redesign" 
              change="+50%" 
              metric="conversion rate" 
              success={true} 
            />
          </div>
        ),
      },
    ],
  },
  {
    trigger: "report",
    messages: [
      {
        type: "bot" as const,
        content: (
          <div>
            <p className="text-zinc-300 mb-1">📬 <strong>Your weekly report is ready!</strong></p>
            <p className="text-zinc-400 text-sm">Here's what happened this week:</p>
            <WeeklyReportCard />
          </div>
        ),
      },
    ],
  },
  {
    trigger: "help",
    messages: [
      {
        type: "bot" as const,
        content: (
          <div>
            <p className="text-zinc-300 mb-3">Here's what I can help you with:</p>
            <div className="space-y-2 text-sm">
              <p className="text-zinc-400"><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-blue-400">deploy</code> — See what happens after a deploy</p>
              <p className="text-zinc-400"><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-blue-400">results</code> — View experiment results</p>
              <p className="text-zinc-400"><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-blue-400">report</code> — Get your weekly report</p>
              <p className="text-zinc-400"><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-blue-400">suggest</code> — Get experiment ideas</p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    trigger: "suggest",
    messages: [
      {
        type: "bot" as const,
        content: (
          <div>
            <p className="text-zinc-300 mb-3">🎯 Based on your data, here are high-impact experiments:</p>
            <div className="space-y-2">
              {[
                { title: "Simplify signup form", impact: "+15% est.", confidence: "High" },
                { title: "Add social proof to pricing", impact: "+12% est.", confidence: "Medium" },
                { title: "Reduce checkout steps", impact: "+20% est.", confidence: "High" },
              ].map((exp, i) => (
                <div key={i} className="flex items-center justify-between bg-[#1a1d21] p-3 rounded-lg border border-zinc-700/50">
                  <span className="text-zinc-300 text-sm">{exp.title}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-400">{exp.impact}</span>
                    <span className="text-zinc-500">• {exp.confidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },
];

export default function SlackSimulator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial message
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          id: "1",
          type: "bot",
          content: (
            <div>
              <p className="text-zinc-300 mb-2">👋 Hey! I'm Briefix Bot.</p>
              <p className="text-zinc-400 text-sm mb-3">
                I automatically track your experiments and notify you when results come in. No manual work needed.
              </p>
              <p className="text-zinc-400 text-sm">
                Try typing <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-blue-400">deploy</code>, <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-blue-400">results</code>, or <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-blue-400">help</code> to see what I can do.
              </p>
            </div>
          ),
          timestamp: formatTime(new Date()),
        },
      ]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: formatTime(new Date()),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.toLowerCase().trim();
    setInput("");

    // Find matching scenario
    const scenario = demoScenarios.find(s => userInput.includes(s.trigger));

    if (scenario) {
      setIsTyping(true);
      
      for (let i = 0; i < scenario.messages.length; i++) {
        const msg = scenario.messages[i];
        await new Promise(resolve => setTimeout(resolve, (msg as any).delay || 1000));
        
        setMessages(prev => [...prev, {
          id: `${Date.now()}-${i}`,
          type: msg.type,
          content: msg.content,
          timestamp: formatTime(new Date()),
        }]);

        if (i < scenario.messages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setIsTyping(false);
    } else {
      // Default response
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(false);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        content: (
          <p className="text-zinc-400">
            I'm not sure what you mean. Try <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-blue-400">help</code> to see what I can do!
          </p>
        ),
        timestamp: formatTime(new Date()),
      }]);
    }

    inputRef.current?.focus();
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1d21]">
      {/* Header - Slack style */}
      <div className="flex-shrink-0 border-b border-zinc-700/50 bg-[#1a1d21]">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">#</span>
            <span className="text-white font-medium">briefix-experiments</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Connected
          </div>
        </div>
        <div className="px-4 pb-2 text-xs text-zinc-500">
          Automatic experiment tracking for your team
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-1 hover:bg-zinc-800/30"
            >
              {message.type === "user" ? (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-zinc-300 text-sm">You</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white font-medium text-sm">You</span>
                      <span className="text-xs text-zinc-500">{message.timestamp}</span>
                    </div>
                    <p className="text-zinc-300">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <BotAvatar />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white font-medium text-sm">Briefix</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">APP</span>
                      <span className="text-xs text-zinc-500">{message.timestamp}</span>
                    </div>
                    <div>{message.content}</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Slack style */}
      <div className="flex-shrink-0 px-4 pb-4">
        <form onSubmit={handleSubmit}>
          <div className="bg-[#222529] border border-zinc-700/50 rounded-lg overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a command (deploy, results, help, suggest, report)"
              className="w-full bg-transparent px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none"
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-700/30">
              <div className="flex items-center gap-2 text-zinc-500">
                <button type="button" className="p-1.5 hover:bg-zinc-700/50 rounded transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded transition-colors text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </form>
        <p className="text-center text-xs text-zinc-600 mt-2">
          This is a demo. In production, this would be a real Slack integration.
        </p>
      </div>
    </div>
  );
}
