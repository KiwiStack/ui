// Mock data for the Chat service

export interface Channel {
  id: string;
  name: string;
  unread: number;
  members: number;
}

export interface StandupDraft {
  channel: string;
  title: string;
  content: string;
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

export const channels: Channel[] = [
  { id: 'engineering', name: '#engineering', unread: 3, members: 24 },
  { id: 'general', name: '#general', unread: 0, members: 48 },
  { id: 'design', name: '#design', unread: 1, members: 12 },
  { id: 'standup', name: '#standup', unread: 0, members: 24 },
  { id: 'random', name: '#random', unread: 5, members: 48 },
] as const;

export const standupDraft: StandupDraft = {
  channel: '#engineering',
  title: 'Daily Standup Summary',
  content: `Here's what the team accomplished yesterday:

**Backend**: API rate limiting deployed to production. Latency reduced by 23%.
**Frontend**: New dashboard widgets merged. Dark mode fixes applied.
**DevOps**: Kubernetes cluster upgraded to 1.29. Zero downtime achieved.

3 blockers identified — see thread for details.`,
} as const;

export const assistantMessages: AssistantMessage[] = [
  {
    role: 'user',
    content: 'Summarize yesterday\'s standup and post to #engineering',
  },
  {
    role: 'ai',
    content: "I've compiled the standup notes. Here's the summary for #engineering:",
  },
] as const;

export const assistantActions: AssistantAction[] = [
  { id: 'send', label: 'Post to #engineering', icon: 'chat', color: '#26A69A' },
  { id: 'thread', label: 'Create Discussion Thread', icon: 'chat', color: '#26A69A' },
] as const;
