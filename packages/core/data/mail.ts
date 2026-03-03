// Mock data for the Mail service

export interface ConfigItem {
  id: string;
  label: string;
  icon: string;
}

export interface AutoReplyData {
  enabled: boolean;
  startDate: string;
  endDate: string;
  message: string;
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

export const configItems: ConfigItem[] = [
  { id: 'auto-reply', label: 'Auto-reply', icon: 'mail' },
  { id: 'signatures', label: 'Signatures', icon: 'docs' },
  { id: 'filters', label: 'Filters', icon: 'search' },
  { id: 'folders', label: 'Folders', icon: 'files' },
  { id: 'security', label: 'Security', icon: 'lock' },
] as const;

export const autoReplyData: AutoReplyData = {
  enabled: true,
  startDate: 'Mar 1, 2026 09:00',
  endDate: 'Mar 11, 2026 09:00',
  message:
    "Thanks for your email! I'm currently out of the office and will return on March 11. I'll get back to you then.",
} as const;

export const assistantMessages: AssistantMessage[] = [
  {
    role: 'user',
    content: "Set auto-reply on my emails, I'll be back in 10 days",
  },
  {
    role: 'ai',
    content: "I'll set up an auto-reply for the next 10 days. Here's the configuration:",
  },
] as const;

export const assistantActions: AssistantAction[] = [
  { id: 'auto-reply', label: 'Auto-reply Activation', icon: 'mail', color: '#FF7043' },
  { id: 'calendar', label: 'Calendar Event Creation', icon: 'calendar', color: '#FF7043' },
] as const;
