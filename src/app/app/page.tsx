"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Team = {
  id: string;
  name: string;
  slug: string;
  role: string;
};

type Idea = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  avgScore: number | null;
};

const statusConfig = {
  inbox: { label: "Inbox", color: "#6B7280" },
  evaluating: { label: "Evaluating", color: "#F59E0B" },
  approved: { label: "Approved", color: "#8B5CF6" },
  in_progress: { label: "In Progress", color: "#3B82F6" },
  completed: { label: "Completed", color: "#10B981" },
  killed: { label: "Killed", color: "#EF4444" },
};

export default function Dashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch teams on mount
  useEffect(() => {
    fetchTeams();
  }, []);

  // Fetch ideas when team changes
  useEffect(() => {
    if (currentTeam) {
      fetchIdeas(currentTeam.id);
    }
  }, [currentTeam]);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      if (res.ok && data.teams) {
        if (data.teams.length > 0) {
          setTeams(data.teams);
          setCurrentTeam(data.teams[0]);
          setLoading(false);
        } else {
          // 자동으로 "My Workspace" 생성
          await autoCreateWorkspace();
        }
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setLoading(false);
    }
  };

  const autoCreateWorkspace = async () => {
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "My Workspace" }),
      });
      const data = await res.json();
      if (res.ok && data.team) {
        const newTeam = { ...data.team, role: "owner" };
        setTeams([newTeam]);
        setCurrentTeam(newTeam);
      }
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIdeas = async (teamId: string) => {
    try {
      const res = await fetch(`/api/ideas?teamId=${teamId}`);
      const data = await res.json();
      if (res.ok && data.ideas) {
        setIdeas(data.ideas);
      }
    } catch (error) {
      console.error("Failed to fetch ideas:", error);
    }
  };

  const stats = {
    inbox: ideas.filter((i) => i.status === "inbox").length,
    evaluating: ideas.filter((i) => i.status === "evaluating").length,
    approved: ideas.filter((i) => i.status === "approved").length,
    in_progress: ideas.filter((i) => i.status === "in_progress").length,
    completed: ideas.filter((i) => i.status === "completed").length,
    killed: ideas.filter((i) => i.status === "killed").length,
  };

  const recentIdeas = ideas.slice(0, 5);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[var(--text-tertiary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {currentTeam?.name} · Overview of your idea pipeline
          </p>
        </div>
        {teams.length > 1 && (
          <select
            value={currentTeam?.id || ""}
            onChange={(e) => {
              const team = teams.find((t) => t.id === e.target.value);
              if (team) setCurrentTeam(team);
            }}
            className="input text-sm"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {Object.entries(stats).map(([status, count]) => (
          <div key={status} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">
                {statusConfig[status as keyof typeof statusConfig].label}
              </span>
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: statusConfig[status as keyof typeof statusConfig].color,
                }}
              />
            </div>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {count}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/app/ideas"
          className="card p-5 hover:border-[var(--accent)] transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              Add new idea
            </h3>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            Capture a new idea before you forget
          </p>
        </Link>

        <Link
          href="/app/board"
          className="card p-5 hover:border-[var(--accent)] transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              View board
            </h3>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            Manage your experiment pipeline
          </p>
        </Link>
      </div>

      {/* Recent ideas */}
      <div className="card">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-medium text-[var(--text-primary)]">
            Recent ideas
          </h2>
          <Link href="/app/ideas" className="text-xs text-[var(--accent)] hover:underline">
            View all
          </Link>
        </div>
        {recentIdeas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--text-tertiary)] mb-3">
              No ideas yet
            </p>
            <Link href="/app/ideas" className="text-sm text-[var(--accent)] hover:underline">
              Add your first idea →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {recentIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-4 hover:bg-[var(--bg-hover)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1 truncate">
                      {idea.title}
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] truncate">
                      {idea.description || "No description"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {idea.avgScore !== null && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                        {idea.avgScore}%
                      </span>
                    )}
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        color: statusConfig[idea.status as keyof typeof statusConfig]?.color || "#6B7280",
                        background: `${statusConfig[idea.status as keyof typeof statusConfig]?.color || "#6B7280"}15`,
                      }}
                    >
                      {statusConfig[idea.status as keyof typeof statusConfig]?.label || idea.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
