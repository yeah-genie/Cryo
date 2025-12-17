"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type ValidationResult = {
  demandScore: number;
  competition: "Low" | "Medium" | "High";
  estimatedRevenue: string;
  searchVolume: string;
  existingCourses: number;
  avgPrice: number;
  niche: {
    found: boolean;
    suggestion: string;
    reason: string;
  };
  verdict: "Worth building" | "Needs refinement" | "High risk";
  tips: string[];
};

// Simulated validation logic - will be replaced with real API
function generateValidation(topic: string): ValidationResult {
  const topicLower = topic.toLowerCase();
  
  // Simple heuristics for demo
  const techKeywords = ["python", "javascript", "coding", "programming", "web", "app", "data", "ai", "machine learning"];
  const businessKeywords = ["marketing", "sales", "business", "startup", "entrepreneur", "freelance"];
  const creativeKeywords = ["design", "photo", "video", "music", "art", "writing"];
  const nicheKeywords = ["healthcare", "legal", "real estate", "finance", "teachers", "parents"];
  
  const hasTech = techKeywords.some(k => topicLower.includes(k));
  const hasBusiness = businessKeywords.some(k => topicLower.includes(k));
  const hasCreative = creativeKeywords.some(k => topicLower.includes(k));
  const hasNiche = nicheKeywords.some(k => topicLower.includes(k));
  
  // Calculate scores
  let demandScore = 50 + Math.floor(Math.random() * 30);
  let competition: "Low" | "Medium" | "High" = "Medium";
  let existingCourses = 100 + Math.floor(Math.random() * 400);
  
  if (hasTech) {
    demandScore += 15;
    competition = "High";
    existingCourses += 300;
  }
  if (hasBusiness) {
    demandScore += 10;
    competition = "High";
    existingCourses += 200;
  }
  if (hasCreative) {
    demandScore += 5;
    competition = "Medium";
  }
  if (hasNiche) {
    demandScore += 10;
    competition = "Low";
    existingCourses = Math.floor(existingCourses / 5);
  }
  
  demandScore = Math.min(95, demandScore);
  
  const avgPrice = hasNiche ? 149 + Math.floor(Math.random() * 100) : 49 + Math.floor(Math.random() * 100);
  const monthlyStudents = demandScore * 10 + Math.floor(Math.random() * 500);
  const conversionRate = hasNiche ? 0.03 : 0.015;
  const monthlyRevenue = Math.floor(monthlyStudents * conversionRate * avgPrice);
  
  const revenueMin = Math.floor(monthlyRevenue * 0.5 / 1000);
  const revenueMax = Math.floor(monthlyRevenue * 1.5 / 1000);
  
  // Niche suggestions
  const nicheSuggestions: { [key: string]: { suggestion: string; reason: string } } = {
    python: { suggestion: "Python for Healthcare Analytics", reason: "Only 15 courses exist, but healthcare data demand is growing 40% yearly" },
    javascript: { suggestion: "JavaScript for Non-Profit Websites", reason: "Underserved market with 70% fewer courses than general JS" },
    marketing: { suggestion: "Marketing for SaaS Startups", reason: "High-ticket niche with $200+ course prices" },
    design: { suggestion: "UI Design for FinTech Apps", reason: "Specialized skill with low competition" },
    default: { suggestion: `${topic} for Small Business Owners`, reason: "Adding a specific audience reduces competition by 60%" }
  };
  
  const nicheKey = Object.keys(nicheSuggestions).find(k => topicLower.includes(k)) || "default";
  const nicheData = nicheSuggestions[nicheKey];
  
  // Verdict
  let verdict: "Worth building" | "Needs refinement" | "High risk" = "Needs refinement";
  if (demandScore >= 75 && competition !== "High") verdict = "Worth building";
  else if (demandScore < 50 || (competition === "High" && !hasNiche)) verdict = "High risk";
  
  // Tips
  const tips: string[] = [];
  if (competition === "High") tips.push("Consider narrowing to a specific audience to stand out");
  if (!hasNiche) tips.push("Adding a niche (e.g., 'for healthcare') can reduce competition by 60%");
  if (demandScore < 60) tips.push("Search volume is moderate — validate with your existing audience first");
  if (demandScore >= 80) tips.push("Strong demand — move fast before more competitors enter");
  if (avgPrice > 100) tips.push("Higher price point works for this topic — don't underprice");
  
  return {
    demandScore,
    competition,
    estimatedRevenue: `$${revenueMin}K-${revenueMax}K/month`,
    searchVolume: `${Math.floor(monthlyStudents / 100) * 100}+/month`,
    existingCourses,
    avgPrice,
    niche: {
      found: competition === "High" || !hasNiche,
      suggestion: nicheData.suggestion,
      reason: nicheData.reason,
    },
    verdict,
    tips,
  };
}

function CourseValidatorContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";
  
  const [topic, setTopic] = useState(initialTopic);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Auto-validate if topic is provided in URL
  useEffect(() => {
    if (initialTopic && !result) {
      handleValidate();
    }
  }, [initialTopic]);

  const handleValidate = async () => {
    if (!topic.trim()) return;
    
    setIsAnalyzing(true);
    setShowResult(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const validation = generateValidation(topic);
    setResult(validation);
    setIsAnalyzing(false);
    setShowResult(true);
  };

  const handleNewValidation = () => {
    setTopic("");
    setResult(null);
    setShowResult(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getCompetitionColor = (comp: string) => {
    if (comp === "Low") return "text-emerald-400";
    if (comp === "Medium") return "text-yellow-400";
    return "text-red-400";
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict === "Worth building") return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    if (verdict === "Needs refinement") return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
    return "bg-red-500/10 border-red-500/30 text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            CourseOS
          </Link>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Input Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Course Idea Validator
          </h1>
          <p className="text-zinc-400 mb-8">
            Enter your course topic to see if it's worth building
          </p>

          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleValidate()}
                placeholder="e.g. Python for data science beginners"
                className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl px-5 py-4 pr-32 text-white text-lg placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                disabled={isAnalyzing}
              />
              <button 
                onClick={handleValidate}
                disabled={isAnalyzing || !topic.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                {isAnalyzing ? "Analyzing..." : "Validate"}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-zinc-400">Analyzing market demand...</p>
                <div className="mt-4 space-y-2 text-sm text-zinc-500">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Checking search trends...
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Analyzing competitors...
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    Calculating revenue potential...
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Verdict */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-xl border ${getVerdictColor(result.verdict)} text-center`}
              >
                <p className="text-2xl font-semibold mb-1">{result.verdict}</p>
                <p className="text-sm opacity-80">Based on market analysis</p>
              </motion.div>

              {/* Main Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5"
                >
                  <p className="text-sm text-zinc-500 mb-2">Demand Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(result.demandScore)}`}>
                    {result.demandScore}/100
                  </p>
                  <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.demandScore}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-violet-500 to-emerald-500"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5"
                >
                  <p className="text-sm text-zinc-500 mb-2">Competition</p>
                  <p className={`text-3xl font-bold ${getCompetitionColor(result.competition)}`}>
                    {result.competition}
                  </p>
                  <p className="text-sm text-zinc-500 mt-2">
                    {result.existingCourses}+ existing courses
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5"
                >
                  <p className="text-sm text-zinc-500 mb-2">Revenue Potential</p>
                  <p className="text-3xl font-bold text-white">
                    {result.estimatedRevenue}
                  </p>
                  <p className="text-sm text-zinc-500 mt-2">
                    Avg price: ${result.avgPrice}
                  </p>
                </motion.div>
              </div>

              {/* Niche Opportunity */}
              {result.niche.found && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="text-sm text-blue-400 mb-1">Niche Opportunity</p>
                      <p className="text-white font-medium mb-1">{result.niche.suggestion}</p>
                      <p className="text-sm text-zinc-400">{result.niche.reason}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tips */}
              {result.tips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5"
                >
                  <p className="text-sm text-zinc-500 mb-3">Recommendations</p>
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-300">
                        <span className="text-violet-400">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              >
                <button
                  onClick={handleNewValidation}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                >
                  Try another idea
                </button>
                <Link
                  href="/#notify"
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium transition-colors text-center"
                >
                  Get notified for full version
                </Link>
              </motion.div>

              {/* Coming Soon Banner */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 p-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl text-center"
              >
                <p className="text-zinc-300 mb-2">
                  <span className="font-medium text-white">Coming soon:</span> Connect your course platform
                </p>
                <p className="text-sm text-zinc-500">
                  See where students drop off and test which lessons work better
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isAnalyzing && !showResult && (
          <div className="max-w-xl mx-auto">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 text-center">
              <p className="text-zinc-500 mb-4">Enter a course topic above to get started</p>
              <div className="space-y-2 text-sm text-zinc-600">
                <p>Try something like:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Python for beginners", "Digital marketing", "UI/UX design", "Personal finance"].map((example) => (
                    <button
                      key={example}
                      onClick={() => setTopic(example)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CourseValidator() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CourseValidatorContent />
    </Suspense>
  );
}
