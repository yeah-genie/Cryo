"use client";

import { useState } from "react";
import Link from "next/link";

type Experiment = {
  id: string;
  title: string;
  status: "tracking" | "success" | "neutral" | "fail";
  change: string;
  metric: string;
  before: string;
  after: string;
  detectedAt: string;
  filesChanged: string[];
};

// Demo data
const experiments: Experiment[] = [
  {
    id: "1",
    title: "Checkout redesign",
    status: "success",
    change: "+50%",
    metric: "Conversion rate",
    before: "12%",
    after: "18%",
    detectedAt: "2 hours ago",
    filesChanged: ["checkout.tsx", "payment-form.tsx"],
  },
  {
    id: "2",
    title: "New pricing page",
    status: "success",
    change: "+33%",
    metric: "Signup rate",
    before: "2.1%",
    after: "2.8%",
    detectedAt: "1 day ago",
    filesChanged: ["pricing.tsx"],
  },
  {
    id: "3",
    title: "CTA button color change",
    status: "neutral",
    change: "0%",
    metric: "CTR",
    before: "8%",
    after: "8%",
    detectedAt: "2 days ago",
    filesChanged: ["button.tsx"],
  },
  {
    id: "4",
    title: "Onboarding skip option",
    status: "fail",
    change: "-3%",
    metric: "Retention",
    before: "45%",
    after: "42%",
    detectedAt: "3 days ago",
    filesChanged: ["onboarding.tsx"],
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; text: string }> = {
  all: { label: "All", color: "#3B82F6", bg: "bg-[var(--accent)]/10", text: "text-[var(--accent)]" },
  tracking: { label: "Tracking", color: "#3B82F6", bg: "bg-blue-500/10", text: "text-blue-400" },
  success: { label: "Success", color: "#10B981", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  neutral: { label: "No change", color: "#6B7280", bg: "bg-zinc-500/10", text: "text-zinc-400" },
  fail: { label: "Failed", color: "#EF4444", bg: "bg-red-500/10", text: "text-red-400" },
};

export default function ExperimentsPage() {
  const [filter, setFilter] = useState<"all" | "tracking" | "success" | "neutral" | "fail">("all");

  const filteredExperiments = filter === "all" 
    ? experiments 
    : experiments.filter(e => e.status === filter);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
          Experiments
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Auto-detected from your deployments
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(["all", "tracking", "success", "neutral", "fail"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === status
                ? statusConfig[status]?.bg || "bg-[var(--accent)]/10"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            } ${
              filter === status ? statusConfig[status]?.text || "text-[var(--accent)]" : ""
            }`}
          >
            {status === "all" ? "All" : statusConfig[status]?.label}
          </button>
        ))}
      </div>

      {/* Experiments list */}
      {filteredExperiments.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[var(--text-tertiary)] mb-4">No experiments found</p>
          <Link href="/app/connections" className="text-sm text-[var(--accent)] hover:underline">
            Connect your tools to start tracking →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExperiments.map((exp) => (
            <div
              key={exp.id}
              className="card p-5 hover:border-[var(--accent)]/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                    <span>{exp.detectedAt}</span>
                    <span>•</span>
                    <span>{exp.filesChanged.length} file{exp.filesChanged.length > 1 ? "s" : ""} changed</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded text-sm font-medium ${
                    statusConfig[exp.status].bg
                  } ${statusConfig[exp.status].text}`}>
                    {exp.change}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    statusConfig[exp.status].bg
                  } ${statusConfig[exp.status].text}`}>
                    {statusConfig[exp.status].label}
                  </span>
                </div>
              </div>

              {/* Metric comparison */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-tertiary)]">Before:</span>
                  <span className="text-[var(--text-primary)] font-medium">{exp.before}</span>
                </div>
                <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-tertiary)]">After:</span>
                  <span className={`font-medium ${
                    exp.status === "success" ? "text-emerald-400" : 
                    exp.status === "fail" ? "text-red-400" : 
                    "text-[var(--text-primary)]"
                  }`}>
                    {exp.after}
                  </span>
                </div>
                <span className="text-[var(--text-tertiary)] ml-auto">
                  {exp.metric}
                </span>
              </div>

              {/* Files changed */}
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 flex-wrap">
                  {exp.filesChanged.map((file, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-mono"
                    >
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
