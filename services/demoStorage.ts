// Demo Mode Storage - localStorage fallback for when not using real Supabase
import { Idea, Decision, Metric, WikiDoc, ActivityLog } from '../types';
import { MOCK_IDEAS, MOCK_DECISIONS, MOCK_METRICS, MOCK_WIKI, MOCK_ACTIVITIES } from './mockData';

const STORAGE_KEYS = {
    IDEAS: 'cryo_demo_ideas',
    DECISIONS: 'cryo_demo_decisions',
    METRICS: 'cryo_demo_metrics',
    WIKI: 'cryo_demo_wiki',
    ACTIVITIES: 'cryo_demo_activities',
};

// Initialize with mock data if empty
const initializeStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.IDEAS)) {
        localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(MOCK_IDEAS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DECISIONS)) {
        localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(MOCK_DECISIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.METRICS)) {
        localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(MOCK_METRICS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WIKI)) {
        localStorage.setItem(STORAGE_KEYS.WIKI, JSON.stringify(MOCK_WIKI));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(MOCK_ACTIVITIES));
    }
};

initializeStorage();

export const demoStorage = {
    // Ideas
    getIdeas: (): Idea[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.IDEAS);
        return stored ? JSON.parse(stored) : MOCK_IDEAS;
    },

    saveIdeas: (ideas: Idea[]) => {
        localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
    },

    addIdea: (idea: Idea) => {
        const ideas = demoStorage.getIdeas();
        ideas.unshift(idea);
        demoStorage.saveIdeas(ideas);
    },

    updateIdea: (updatedIdea: Idea) => {
        const ideas = demoStorage.getIdeas();
        const index = ideas.findIndex(i => i.idea_id === updatedIdea.idea_id);
        if (index !== -1) {
            ideas[index] = updatedIdea;
            demoStorage.saveIdeas(ideas);
        }
    },

    // Decisions
    getDecisions: (): Decision[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.DECISIONS);
        return stored ? JSON.parse(stored) : MOCK_DECISIONS;
    },

    addDecision: (decision: Decision) => {
        const decisions = demoStorage.getDecisions();
        decisions.unshift(decision);
        localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));
    },

    // Metrics
    getMetrics: (): Metric[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.METRICS);
        return stored ? JSON.parse(stored) : MOCK_METRICS;
    },

    updateMetric: (updatedMetric: Metric) => {
        const metrics = demoStorage.getMetrics();
        const index = metrics.findIndex(m => m.metric_id === updatedMetric.metric_id);
        if (index !== -1) {
            metrics[index] = updatedMetric;
            localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
        }
    },

    addMetric: (metric: Metric) => {
        const metrics = demoStorage.getMetrics();
        metrics.push(metric);
        localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
    },

    // Wiki
    getWiki: (): WikiDoc[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.WIKI);
        return stored ? JSON.parse(stored) : MOCK_WIKI;
    },

    addWikiDoc: (doc: WikiDoc) => {
        const wiki = demoStorage.getWiki();
        wiki.unshift(doc);
        localStorage.setItem(STORAGE_KEYS.WIKI, JSON.stringify(wiki));
    },

    updateWikiDoc: (updatedDoc: WikiDoc) => {
        const wiki = demoStorage.getWiki();
        const index = wiki.findIndex(w => w.wiki_id === updatedDoc.wiki_id);
        if (index !== -1) {
            wiki[index] = updatedDoc;
            localStorage.setItem(STORAGE_KEYS.WIKI, JSON.stringify(wiki));
        }
    },

    // Activities
    getActivities: (): ActivityLog[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
        return stored ? JSON.parse(stored) : MOCK_ACTIVITIES;
    },

    addActivity: (activity: ActivityLog) => {
        const activities = demoStorage.getActivities();
        activities.unshift(activity);
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    },

    markActivityAsRead: (activityId: string) => {
        const activities = demoStorage.getActivities();
        const index = activities.findIndex(a => a.activity_id === activityId);
        if (index !== -1) {
            activities[index].is_read = true;
            localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
        }
    },

    // Clear all demo data
    clearAll: () => {
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        initializeStorage();
    }
};
