// Mock data for the Docs service

export interface Document {
  id: string;
  title: string;
  updated: string;
  author: string;
  active?: boolean;
}

export interface RetrospectiveSection {
  heading: string;
  items: string[];
}

export interface Retrospective {
  title: string;
  sections: RetrospectiveSection[];
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

export const documents: Document[] = [
  { id: 'retrospective', title: 'Q1 Retrospective', updated: '2 hours ago', author: 'AI Draft', active: true },
  { id: 'onboarding', title: 'Onboarding Guide', updated: 'Yesterday', author: 'Sarah Chen' },
  { id: 'api-docs', title: 'API Documentation', updated: '3 days ago', author: 'Team' },
  { id: 'roadmap', title: '2026 Roadmap', updated: 'Last week', author: 'Product' },
] as const;

export const retrospective: Retrospective = {
  title: 'Q1 2026 Retrospective',
  sections: [
    {
      heading: 'What went well',
      items: [
        'Deployed Kiwi Mail to 3 customers',
        'Zero critical bugs in production',
        'Team velocity increased 15%',
      ],
    },
    {
      heading: 'What could improve',
      items: [
        'CI/CD pipeline still slow (8 min avg)',
        'Documentation coverage at 60%',
        'Cross-team sync meetings too frequent',
      ],
    },
    {
      heading: 'Action items',
      items: [
        'Invest in parallel test runners',
        'Schedule monthly doc sprints',
        'Move to async standups',
      ],
    },
  ],
} as const;

export const assistantMessages: AssistantMessage[] = [
  {
    role: 'user',
    content: 'Draft a Q1 retrospective from our sprint notes',
  },
  {
    role: 'ai',
    content: "I've analyzed the sprint notes and created a structured retrospective:",
  },
] as const;

export const assistantActions: AssistantAction[] = [
  { id: 'create', label: 'Create Document', icon: 'docs', color: '#EC407A' },
  { id: 'share', label: 'Share with Team', icon: 'docs', color: '#EC407A' },
] as const;
