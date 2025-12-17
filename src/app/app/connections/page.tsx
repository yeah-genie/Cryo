"use client";

import { useState } from "react";

type Tool = {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status?: string;
};

const tools: Tool[] = [
  { id: "github", name: "GitHub", icon: "G", connected: true, status: "Watching code changes..." },
  { id: "vercel", name: "Vercel", icon: "V", connected: true, status: "Tracking deploys..." },
  { id: "analytics", name: "Google Analytics", icon: "A", connected: true, status: "Monitoring conversions..." },
  { id: "slack", name: "Slack", icon: "S", connected: false },
  { id: "mixpanel", name: "Mixpanel", icon: "M", connected: false },
  { id: "amplitude", name: "Amplitude", icon: "A", connected: false },
];

export default function ConnectionsPage() {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (toolId: string) => {
    setConnecting(toolId);
    // Simulate connection
    setTimeout(() => {
      setConnecting(null);
    }, 2000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
          Connections
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Connect your tools to start automatic experiment tracking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={`card p-5 ${
              tool.connected 
                ? "border-emerald-500/30 bg-emerald-500/5" 
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${
                  tool.connected 
                    ? "bg-white text-black" 
                    : "bg-[var(--bg-elevated)] text-[var(--text-tertiary)]"
                }`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    {tool.name}
                  </h3>
                  {tool.connected && tool.status && (
                    <p className="text-xs text-emerald-400 mt-0.5">{tool.status}</p>
                  )}
                </div>
              </div>
              {tool.connected ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-emerald-400">Connected</span>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(tool.id)}
                  disabled={connecting === tool.id}
                  className="px-4 py-1.5 bg-[var(--accent)] text-white text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {connecting === tool.id ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-5 bg-blue-500/5 border-blue-500/20">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
          How it works
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Once connected, Briefix automatically watches your deployments and pulls metrics from your analytics tools. 
          No SDK required. We use OAuth to access your existing data.
        </p>
      </div>
    </div>
  );
}

