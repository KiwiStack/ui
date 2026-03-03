// Mock data for the Meet service

export interface Meeting {
  id: string;
  title: string;
  time: string;
  attendees: number;
  active: boolean;
}

export interface NewMeeting {
  title: string;
  date: string;
  time: string;
  duration: string;
  attendees: string[];
  agenda: string;
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

export const meetings: Meeting[] = [
  { id: 'design-review', title: 'Design Review', time: 'Today, 3:00 PM', attendees: 5, active: false },
  { id: 'sprint-review', title: 'Sprint Review', time: 'Tomorrow, 2:00 PM', attendees: 12, active: true },
  { id: '1on1', title: '1:1 with Sarah', time: 'Wed, 10:00 AM', attendees: 2, active: false },
  { id: 'all-hands', title: 'All Hands', time: 'Fri, 4:00 PM', attendees: 48, active: false },
] as const;

export const newMeeting: NewMeeting = {
  title: 'Sprint Review',
  date: 'Mar 4, 2026',
  time: '2:00 PM',
  duration: '60 min',
  attendees: ['engineering@team', 'product@team', 'design@team'],
  agenda: `1. Sprint goals review
2. Demo: new dashboard
3. Blockers discussion
4. Next sprint planning`,
} as const;

export const assistantMessages: AssistantMessage[] = [
  {
    role: 'user',
    content: 'Schedule sprint review for tomorrow at 2 PM with all teams',
  },
  {
    role: 'ai',
    content: "I've drafted the sprint review meeting. Here are the details:",
  },
] as const;

export const assistantActions: AssistantAction[] = [
  { id: 'schedule', label: 'Schedule Meeting', icon: 'meet', color: '#42A5F5' },
  { id: 'invite', label: 'Send Calendar Invites', icon: 'calendar', color: '#42A5F5' },
] as const;
