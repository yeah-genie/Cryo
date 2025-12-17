"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Zoom logo - accurate brand style
function ZoomIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#2D8CFF"/>
      <path d="M4.5 8C4.5 7.17 5.17 6.5 6 6.5h8c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5H6c-.83 0-1.5-.67-1.5-1.5V8z" fill="white"/>
      <path d="M16 9.5l3.5-2v7l-3.5-2v-3z" fill="white"/>
    </svg>
  );
}

// Google Meet logo - accurate 4-color brand style
function MeetIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      {/* Blue left side */}
      <path d="M2 6a2 2 0 012-2h2v8H2V6z" fill="#4285F4"/>
      <path d="M2 12h4v8H4a2 2 0 01-2-2v-6z" fill="#0D65D9"/>
      {/* Red top-left corner */}
      <path d="M4 4h4L4 8V4z" fill="#EA4335"/>
      {/* Yellow/Orange top */}
      <path d="M8 4h6a2 2 0 012 2v2l-2 2H6V6l2-2z" fill="#FBBC04"/>
      {/* White center */}
      <path d="M6 8h8v6H6V8z" fill="white"/>
      {/* Green bottom and right */}
      <path d="M6 14h8l2 2v2a2 2 0 01-2 2H6v-6z" fill="#34A853"/>
      {/* Green play button */}
      <path d="M16 8l6-3v14l-6-3V8z" fill="#188038"/>
      <path d="M16 8l6-3v8l-6-1V8z" fill="#34A853"/>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
    </svg>
  );
}

// macOS window header
function WindowHeader({ title, variant = "default" }: { title: string; variant?: "default" | "dark" }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 border-b ${variant === "dark" ? "border-zinc-800 bg-zinc-950" : "border-zinc-800/80 bg-zinc-900/50"}`}>
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>
      <span className="text-xs text-zinc-500 ml-2">{title}</span>
    </div>
  );
}

// ============================================
// WOW 1: TIMELINE - Chemistry Lesson
// ============================================
function TimelineDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const markers = [
    { 
      time: "03:24", 
      position: 8, 
      type: "insight",
      title: "Analogy clicked",
      detail: "\"Electrons sharing = friends sharing pizza\"",
      impact: "+180% engagement"
    },
    { 
      time: "15:42", 
      position: 35, 
      type: "warning",
      title: "Attention dropped",
      detail: "Started listing exceptions",
      impact: "Consider a visual break"
    },
    { 
      time: "28:15", 
      position: 63, 
      type: "insight",
      title: "Best explanation",
      detail: "Drew molecules on whiteboard",
      impact: "3.2x retention vs verbal"
    },
    { 
      time: "41:30", 
      position: 92, 
      type: "insight",
      title: "Student breakthrough",
      detail: "Asked follow-up question",
      impact: "Deep understanding confirmed"
    },
  ];

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      <div className="relative bg-[#0a0a0a] border border-zinc-800 rounded-2xl overflow-hidden">
        <WindowHeader title="Chemistry — Covalent Bonds" variant="dark" />
        
        <div className="p-8">
          {/* Timeline container */}
          <div className="relative mb-8">
            {/* Time labels */}
            <div className="flex justify-between text-xs text-zinc-600 mb-3">
              <span>0:00</span>
              <span>45:00</span>
            </div>
            
            {/* Timeline bar */}
            <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden">
              {/* Progress */}
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
              
              {/* Markers */}
              {markers.map((marker, i) => (
                <motion.button
                  key={i}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-125 ${
                    marker.type === "insight" 
                      ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" 
                      : "bg-amber-500 shadow-lg shadow-amber-500/30"
                  }`}
                  style={{ left: `${marker.position}%`, marginLeft: -8 }}
                  onMouseEnter={() => setActiveMarker(i)}
                  onMouseLeave={() => setActiveMarker(null)}
                />
              ))}
            </div>
          </div>

          {/* Marker detail popup */}
          <AnimatePresence mode="wait">
            {activeMarker !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border ${
                  markers[activeMarker].type === "insight"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-amber-500/5 border-amber-500/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        markers[activeMarker].type === "insight"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {markers[activeMarker].time}
                      </span>
                      <span className={`text-sm font-medium ${
                        markers[activeMarker].type === "insight" ? "text-emerald-300" : "text-amber-300"
                      }`}>
                        {markers[activeMarker].title}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm">{markers[activeMarker].detail}</p>
                  </div>
                  <span className={`text-xs ${
                    markers[activeMarker].type === "insight" ? "text-emerald-400" : "text-amber-400"
                  }`}>
                    {markers[activeMarker].impact}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Default state */}
          {activeMarker === null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-zinc-600 text-sm py-4"
            >
              Hover on markers to see insights
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// WOW 2: BEFORE/AFTER - Physics Lesson
// ============================================
function BeforeAfterDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setShowAfter(true), 1500);
    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      <div className="grid md:grid-cols-2 gap-4">
        {/* BEFORE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          className={`relative bg-[#0a0a0a] border rounded-2xl overflow-hidden transition-all duration-500 ${
            showAfter ? "border-zinc-800 opacity-60" : "border-zinc-700"
          }`}
        >
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Physics — Newton's Laws</span>
            <span className="text-xs text-red-400/80 bg-red-500/10 px-2 py-0.5 rounded">Before</span>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="font-mono text-sm text-zinc-400 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
              "Newton's second law states that F equals m times a, where F is force, m is mass, and a is acceleration..."
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Student engagement</span>
                <span className="text-red-400">34%</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "34%" } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-red-500/60 rounded-full"
                />
              </div>
            </div>
            
            <p className="text-xs text-zinc-600">
              Student response: "I don't get why that matters"
            </p>
          </div>
        </motion.div>

        {/* AFTER */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`relative bg-[#0a0a0a] border rounded-2xl overflow-hidden transition-all duration-500 ${
            showAfter ? "border-emerald-500/30 shadow-lg shadow-emerald-500/5" : "border-zinc-800"
          }`}
        >
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Physics — Newton's Laws</span>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">After</span>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="font-mono text-sm text-zinc-300 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
              "Push this textbook across the desk. Feel how hard that was? Now try with your pencil. Easier, right? That's mass affecting force."
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Student engagement</span>
                <span className="text-emerald-400">91%</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={showAfter ? { width: "91%" } : {}}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                />
              </div>
            </div>
            
            <p className="text-xs text-emerald-400/80">
              Student response: "Oh! So heavier things need more force!"
            </p>
          </div>
        </motion.div>
      </div>

      {/* Insight badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={showAfter ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 border border-cyan-500/20 rounded-xl text-center"
      >
        <p className="text-sm text-zinc-300">
          <span className="text-cyan-400 font-medium">Chalk found:</span> Tactile demonstrations increase retention by <span className="text-emerald-400 font-semibold">2.7x</span> compared to formula-first approaches
        </p>
      </motion.div>
    </div>
  );
}

// ============================================
// WOW 3: WEEKLY REPORT - Premium Dashboard Style
// ============================================
function WeeklyReportDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState(0);

  const weekData = [
    { day: "M", value: 62, sessions: 2 },
    { day: "T", value: 71, sessions: 1 },
    { day: "W", value: 68, sessions: 2 },
    { day: "T", value: 85, sessions: 1 },
    { day: "F", value: 89, sessions: 2 },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 rounded-3xl blur-2xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="relative"
      >
        {/* Report container */}
        <div className="bg-[#0c0c0c] border border-zinc-800/80 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-800/50 bg-gradient-to-r from-zinc-900/80 to-zinc-900/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Weekly Report</p>
                  <p className="text-xs text-zinc-500">Dec 9 - Dec 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-400">+18% vs last week</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { value: "8", label: "Sessions", trend: null },
                { value: "76%", label: "Avg. Engagement", trend: "+12%" },
                { value: "5", label: "Breakthroughs", trend: "+2" },
                { value: "23min", label: "Avg. Duration", trend: null },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50"
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white">{stat.value}</span>
                    {stat.trend && (
                      <span className="text-xs text-emerald-400">{stat.trend}</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Graph - minimal elegant */}
            <div className="mb-6 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-zinc-500">Engagement trend</span>
                <div className="flex gap-1">
                  {["1W", "1M", "3M"].map((period, i) => (
                    <button
                      key={period}
                      onClick={() => setActiveTab(i)}
                      className={`px-2 py-1 text-xs rounded ${
                        activeTab === i 
                          ? "bg-zinc-800 text-white" 
                          : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sparkline style graph */}
              <div className="relative h-20">
                <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(34, 211, 238)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(34, 211, 238)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    d="M0,45 Q25,40 40,38 T80,30 T120,25 T160,15 T200,10"
                    fill="none"
                    stroke="rgb(34, 211, 238)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,45 Q25,40 40,38 T80,30 T120,25 T160,15 T200,10 L200,60 L0,60 Z"
                    fill="url(#graphGradient)"
                  />
                </svg>
                
                {/* Day markers */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                  {weekData.map((day) => (
                    <span key={day.day} className="text-[10px] text-zinc-600">{day.day}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Best moment - premium card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="relative overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent" />
              <div className="relative p-4 border border-amber-500/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-amber-300">Best Moment</span>
                      <span className="text-xs text-zinc-600">History — French Revolution</span>
                    </div>
                    <p className="text-sm text-white mb-2">
                      "What would YOU do if bread cost a month's salary?"
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">4-min discussion triggered</span>
                      <span className="text-xs text-emerald-400 font-medium">2.4x engagement</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI suggestion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-4 p-4 bg-gradient-to-r from-cyan-500/5 to-transparent border border-cyan-500/10 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-cyan-400 mb-0.5">Try next week</p>
                  <p className="text-sm text-zinc-400">
                    Open each topic with a "what if" scenario — your students engage 2x more with hypotheticals.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// CONNECT SECTION
// ============================================
function ConnectDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative">
      <div className="relative bg-[#0a0a0a] border border-zinc-800 rounded-2xl overflow-hidden">
        <WindowHeader title="Connect your platform" variant="dark" />
        
        <div className="p-6 space-y-3">
          {[
            { name: "Zoom", icon: <ZoomIcon />, status: "Connect", color: "hover:border-blue-500/30" },
            { name: "Google Meet", icon: <MeetIcon />, status: "Connect", color: "hover:border-green-500/30" },
            { name: "Upload recording", icon: <UploadIcon />, status: "Browse", color: "hover:border-zinc-600" },
          ].map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl cursor-pointer transition-all ${platform.color}`}
            >
              <div className="flex items-center gap-3">
                {platform.icon}
                <span className="text-sm text-zinc-300">{platform.name}</span>
              </div>
              <span className="text-xs text-zinc-500">{platform.status}</span>
            </motion.div>
          ))}
          
          <p className="text-xs text-zinc-600 text-center pt-2">
            Takes 30 seconds. We never store your recordings.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PRIVACY SECTION - Minimal
// ============================================
function PrivacyBadges() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-zinc-500">
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
        </svg>
        End-to-end encrypted
      </span>
      <span className="hidden sm:block text-zinc-700">·</span>
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Recordings deleted in 24h
      </span>
    </div>
  );
}

// ============================================
// FAQ
// ============================================
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  
  const items = [
    { 
      q: "How accurate is the analysis?", 
      a: "Our AI is trained on thousands of tutoring sessions. It identifies engagement patterns through speech cadence, question quality, and response timing with 94% accuracy." 
    },
    { 
      q: "What subjects does it work for?", 
      a: "Any subject. We analyze teaching patterns, not content. Whether you teach calculus or creative writing, Chalk identifies what makes your explanations effective." 
    },
    { 
      q: "Is my students' data safe?", 
      a: "Yes. We analyze speech patterns only — no faces, no personal data. Recordings are processed and deleted within 24 hours. You own all insights." 
    },
  ];

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-zinc-800/50 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-900/30 transition-colors"
          >
            <span className="text-zinc-300">{item.q}</span>
            <motion.svg 
              animate={{ rotate: open === i ? 180 : 0 }}
              className="w-5 h-5 text-zinc-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-zinc-500 leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [count, setCount] = useState(0);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

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
    <div className="min-h-screen bg-[#09090b] text-white antialiased">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-cyan-500/[0.07] to-transparent rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-white">Chalk</Link>
          <span className="text-xs text-zinc-600">Teaching analytics for tutors</span>
        </div>
      </header>

      {/* Hero */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="min-h-screen flex items-center justify-center px-6 pt-14"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              See what works
              <br />
              <span className="text-zinc-500">in your teaching</span>
            </h1>
            
            <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto">
              AI analyzes your tutoring sessions. Discover which explanations actually click.
            </p>

            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-zinc-300">You're on the list</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Join beta
                </button>
              </form>
            )}
            
            {count > 0 && (
              <p className="text-xs text-zinc-600 mt-4">{count} tutors on the waitlist</p>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 rounded-full border-2 border-zinc-800 flex items-start justify-center p-2"
            >
              <div className="w-1 h-2 bg-zinc-700 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* WOW 1: Timeline */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-cyan-400 mb-3">Your lesson, decoded</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">See your entire session at a glance</h2>
            <p className="text-zinc-500 mt-3 max-w-lg mx-auto">
              Every breakthrough moment. Every attention dip. All mapped on a timeline.
            </p>
          </div>
          <TimelineDemo />
        </div>
      </section>

      {/* WOW 2: Before/After */}
      <section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-cyan-400 mb-3">Same concept, different result</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">Know exactly what to change</h2>
            <p className="text-zinc-500 mt-3 max-w-lg mx-auto">
              Compare how different explanations perform. Data, not guesswork.
            </p>
          </div>
          <BeforeAfterDemo />
        </div>
      </section>

      {/* WOW 3: Weekly Report */}
      <section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-cyan-400 mb-3">Every week, get smarter</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">Your teaching, improving</h2>
            <p className="text-zinc-500 mt-3 max-w-lg mx-auto">
              Weekly reports with your best moments, growth trends, and personalized tips.
            </p>
          </div>
          <WeeklyReportDemo />
        </div>
      </section>

      {/* Connect + Privacy */}
      <section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm text-cyan-400 mb-3">Get started in seconds</p>
              <h2 className="text-3xl font-semibold text-white mb-4">Connect, then forget about it</h2>
              <p className="text-zinc-500 mb-6">
                Link your Zoom or Google Meet. We'll analyze sessions automatically. No extra work.
              </p>
              <PrivacyBadges />
            </div>
            <ConnectDemo />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-white">Questions</h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">Ready to teach smarter?</h2>
          <p className="text-zinc-500 mb-8">Free during beta. No credit card required.</p>
          
          {status === "success" ? (
            <p className="text-zinc-400">We'll email you when we launch</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
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
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-zinc-700">© 2025 Chalk</p>
        </div>
      </footer>
    </div>
  );
}
