// Mock data for the Search service

import type { ServiceId } from './services';

export interface SearchSuggestion {
  id: string;
  query: string;
  source: 'Recent' | 'Trending' | 'Saved';
  active?: boolean;
}

export interface SearchResult {
  service: ServiceId;
  title: string;
  snippet: string;
  date: string;
}

export interface AssistantMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface AssistantAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const suggestions: SearchSuggestion[] = [
  { id: 'deployment', query: 'deployment checklist', source: 'Recent', active: true },
  { id: 'q1-review', query: 'Q1 review', source: 'Recent' },
  { id: 'api-rate', query: 'API rate limiting', source: 'Trending' },
  { id: 'onboarding', query: 'new hire onboarding', source: 'Saved' },
] as const;

export const results: SearchResult[] = [
  {
    service: 'docs',
    title: 'Deployment Checklist v3',
    snippet: 'Pre-deploy: run full test suite, check migrations...',
    date: '2 days ago',
  },
  {
    service: 'mail',
    title: 'Re: Production Deploy Friday',
    snippet: 'Confirmed the rollback plan. Sarah will monitor...',
    date: '3 days ago',
  },
  {
    service: 'chat',
    title: '#engineering: deployment discussion',
    snippet: 'Jake: "Let\'s add a canary step before full rollout"',
    date: 'Yesterday',
  },
  {
    service: 'work',
    title: 'Task: Update deployment runbook',
    snippet: 'Priority: medium. Assigned to DevOps team.',
    date: 'Last week',
  },
] as const;

export const assistantMessages: AssistantMessage[] = [
  {
    role: 'user',
    content: 'Find everything about our deployment checklist',
  },
  {
    role: 'ai',
    content: 'I found 4 results across your workspace:',
  },
] as const;

export const assistantActions: AssistantAction[] = [
  { id: 'open-top', label: 'Open Top Result', icon: 'search', color: '#7CB342' },
  { id: 'show-all', label: 'Show All Results', icon: 'search', color: '#7CB342' },
] as const;
