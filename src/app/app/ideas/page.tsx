"use client";

import { useState, useEffect } from "react";

type Idea = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tags: string[];
  created_at: string;
  avgScore: number | null;
};

type Team = {
  id: string;
  name: string;
};

const statusConfig = {
  inbox: { label: "Inbox", color: "#6B7280" },
  evaluating: { label: "Evaluating", color: "#F59E0B" },
  approved: { label: "Approved", color: "#8B5CF6" },
  in_progress: { label: "In Progress", color: "#3B82F6" },
  completed: { label: "Completed", color: "#10B981" },
  killed: { label: "Killed", color: "#EF4444" },
};

const priorityConfig = {
  low: { label: "Low", color: "#6B7280" },
  medium: { label: "Medium", color: "#F59E0B" },
  high: { label: "High", color: "#F97316" },
  urgent: { label: "Urgent", color: "#EF4444" },
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState("medium");
  const [formStatus, setFormStatus] = useState("inbox");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (currentTeamId) {
      fetchIdeas(currentTeamId);
    }
  }, [currentTeamId]);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      if (res.ok && data.teams) {
        if (data.teams.length > 0) {
          setTeams(data.teams);
          setCurrentTeamId(data.teams[0].id);
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
        setTeams([data.team]);
        setCurrentTeamId(data.team.id);
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

  const openAddModal = () => {
    setEditingIdea(null);
    setFormTitle("");
    setFormDescription("");
    setFormPriority("medium");
    setFormStatus("inbox");
    setShowAddModal(true);
  };

  const openEditModal = (idea: Idea) => {
    setEditingIdea(idea);
    setFormTitle(idea.title);
    setFormDescription(idea.description || "");
    setFormPriority(idea.priority);
    setFormStatus(idea.status);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingIdea(null);
  };

  const handleSubmit = async () => {
    if (!formTitle.trim() || !currentTeamId) return;
    setSaving(true);

    try {
      if (editingIdea) {
        // Update existing idea
        const res = await fetch(`/api/ideas/${editingIdea.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            description: formDescription,
            priority: formPriority,
            status: formStatus,
          }),
        });
        if (res.ok) {
          fetchIdeas(currentTeamId);
          closeModal();
        }
      } else {
        // Create new idea
        const res = await fetch("/api/ideas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            description: formDescription,
            priority: formPriority,
            teamId: currentTeamId,
          }),
        });
        if (res.ok) {
          fetchIdeas(currentTeamId);
          closeModal();
        }
      }
    } catch (error) {
      console.error("Failed to save idea:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ideaId: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;

    try {
      const res = await fetch(`/api/ideas/${ideaId}`, { method: "DELETE" });
      if (res.ok && currentTeamId) {
        fetchIdeas(currentTeamId);
      }
    } catch (error) {
      console.error("Failed to delete idea:", error);
    }
  };

  const filteredIdeas =
    filter === "all" ? ideas : ideas.filter((i) => i.status === filter);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[var(--text-tertiary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
            Ideas
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {ideas.length} ideas in your pipeline
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Idea
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            filter === "all"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          All ({ideas.length})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = ideas.filter((i) => i.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === status
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Ideas List */}
      {filteredIdeas.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">
            No ideas yet
          </h3>
          <p className="text-sm text-[var(--text-tertiary)] mb-4">
            Capture your first idea before it escapes
          </p>
          <button onClick={openAddModal} className="btn-primary">
            Add your first idea
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="card p-4 hover:border-[var(--accent)]/50 transition-colors cursor-pointer"
              onClick={() => openEditModal(idea)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-[var(--text-primary)] truncate">
                      {idea.title}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        color: priorityConfig[idea.priority as keyof typeof priorityConfig]?.color,
                        background: `${priorityConfig[idea.priority as keyof typeof priorityConfig]?.color}15`,
                      }}
                    >
                      {priorityConfig[idea.priority as keyof typeof priorityConfig]?.label}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)] truncate">
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
                      color: statusConfig[idea.status as keyof typeof statusConfig]?.color,
                      background: `${statusConfig[idea.status as keyof typeof statusConfig]?.color}15`,
                    }}
                  >
                    {statusConfig[idea.status as keyof typeof statusConfig]?.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(idea.id);
                    }}
                    className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--red)] rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] w-full max-w-lg">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="font-semibold text-[var(--text-primary)]">
                {editingIdea ? "Edit Idea" : "Add New Idea"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="What's the idea?"
                  className="input w-full"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the idea in more detail..."
                  className="input w-full h-24 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="input w-full"
                  >
                    {Object.entries(priorityConfig).map(([value, config]) => (
                      <option key={value} value={value}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
                {editingIdea && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="input w-full"
                    >
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <option key={value} value={value}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-[var(--border)] flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !formTitle.trim()}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? "Saving..." : editingIdea ? "Save Changes" : "Add Idea"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
