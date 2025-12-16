"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Idea = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  avgScore: number | null;
};

type Team = {
  id: string;
  name: string;
};

const columns = [
  { id: "inbox", label: "Inbox", color: "#6B7280" },
  { id: "evaluating", label: "Evaluating", color: "#F59E0B" },
  { id: "approved", label: "Approved", color: "#8B5CF6" },
  { id: "in_progress", label: "In Progress", color: "#3B82F6" },
  { id: "completed", label: "Completed", color: "#10B981" },
  { id: "killed", label: "Killed", color: "#EF4444" },
];

const priorityColors: Record<string, string> = {
  low: "#6B7280",
  medium: "#F59E0B",
  high: "#F97316",
  urgent: "#EF4444",
};

// Sortable Card Component
function SortableCard({ idea }: { idea: Idea }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: idea.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-[var(--bg-elevated)] p-3 rounded-lg border border-[var(--border)] cursor-grab active:cursor-grabbing hover:border-[var(--accent)]/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2">
          {idea.title}
        </h4>
        {idea.avgScore !== null && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] flex-shrink-0">
            {idea.avgScore}%
          </span>
        )}
      </div>
      {idea.description && (
        <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 mb-2">
          {idea.description}
        </p>
      )}
      <div className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: priorityColors[idea.priority] || "#6B7280" }}
        />
        <span className="text-xs text-[var(--text-tertiary)] capitalize">
          {idea.priority}
        </span>
      </div>
    </div>
  );
}

// Card for DragOverlay
function DragCard({ idea }: { idea: Idea }) {
  return (
    <div className="bg-[var(--bg-elevated)] p-3 rounded-lg border-2 border-[var(--accent)] shadow-lg cursor-grabbing">
      <h4 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2">
        {idea.title}
      </h4>
    </div>
  );
}

export default function BoardPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdea, setActiveIdea] = useState<Idea | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    const idea = ideas.find((i) => i.id === event.active.id);
    if (idea) {
      setActiveIdea(idea);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIdea(null);

    if (!over) return;

    const ideaId = active.id as string;
    const newStatus = over.id as string;

    // Find the idea
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea || idea.status === newStatus) return;

    // Optimistic update
    setIdeas((prev) =>
      prev.map((i) => (i.id === ideaId ? { ...i, status: newStatus } : i))
    );

    // API update
    try {
      const res = await fetch(`/api/ideas/${ideaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Revert on error
        setIdeas((prev) =>
          prev.map((i) => (i.id === ideaId ? { ...i, status: idea.status } : i))
        );
      }
    } catch {
      // Revert on error
      setIdeas((prev) =>
        prev.map((i) => (i.id === ideaId ? { ...i, status: idea.status } : i))
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[var(--text-tertiary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
          Board
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Drag ideas between columns to update their status
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnIdeas = ideas.filter((i) => i.status === column.id);
            return (
              <div
                key={column.id}
                className="flex-shrink-0 w-72 flex flex-col bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="text-sm font-medium text-[var(--text-primary)]">
                      {column.label}
                    </h3>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-hover)] px-2 py-0.5 rounded-full">
                    {columnIdeas.length}
                  </span>
                </div>

                {/* Droppable Area */}
                <SortableContext
                  id={column.id}
                  items={columnIdeas.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1 p-2 space-y-2 min-h-[200px] overflow-y-auto">
                    {columnIdeas.map((idea) => (
                      <SortableCard key={idea.id} idea={idea} />
                    ))}
                    {columnIdeas.length === 0 && (
                      <div className="h-full flex items-center justify-center text-xs text-[var(--text-tertiary)] py-8">
                        Drop ideas here
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeIdea ? <DragCard idea={activeIdea} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
