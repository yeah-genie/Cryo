"use client";

export default function InsightsPage() {
  const weeklyReport = {
    period: "Dec 9 - 15, 2024",
    experiments: [
      { name: "Checkout redesign", result: "+50% conversion", success: true },
      { name: "New pricing page", result: "+33% signups", success: true },
      { name: "CTA button color", result: "No change", success: false },
    ],
    pattern: "UX flow changes beat color tweaks",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
          Insights
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Weekly reports and patterns from your experiments
        </p>
      </div>

      {/* Weekly Report */}
      <div className="card mb-6">
        <div className="p-5 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1">
                Weekly Report
              </p>
              <p className="text-base font-medium text-[var(--text-primary)]">
                {weeklyReport.period}
              </p>
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">Auto-generated</span>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            This week's experiments
          </p>
          
          <div className="space-y-2 mb-4">
            {weeklyReport.experiments.map((exp, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-tertiary)]">├─</span>
                  <span className="text-sm text-[var(--text-primary)]">{exp.name}</span>
                </div>
                <span className={`text-sm font-medium ${
                  exp.success ? "text-emerald-400" : "text-[var(--text-tertiary)]"
                }`}>
                  {exp.result} {exp.success && "✓"}
                </span>
              </div>
            ))}
          </div>

          {/* Pattern insight */}
          <div className="pt-4 border-t border-[var(--border)]">
            <div className="flex items-start gap-2">
              <span className="text-blue-400">🧠</span>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  Pattern
                </p>
                <p className="text-sm text-blue-300">
                  {weeklyReport.pattern}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total experiments", value: "12" },
          { label: "Successful", value: "8" },
          { label: "Avg. impact", value: "+24%" },
        ].map((stat, i) => (
          <div key={i} className="card p-4">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

