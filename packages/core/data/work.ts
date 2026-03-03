// Mock data for the Work service

export interface Task {
  id: string;
  title: string;
  labels: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface NewTask {
  title: string;
  label: string;
  source: string;
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

export const columns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: 't1', title: 'Set up CI/CD parallel runners', labels: ['devops'], priority: 'high' },
      { id: 't2', title: 'Write API endpoint tests', labels: ['backend'], priority: 'medium' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: 't3', title: 'Dashboard performance audit', labels: ['frontend'], priority: 'high' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: 't4', title: 'Deploy rate limiter', labels: ['backend'], priority: 'medium' },
    ],
  },
] as const;

export const newTasks: NewTask[] = [
  {
    title: 'Implement caching layer for search API',
    label: 'backend',
    source: 'Meeting notes: "Search is slow"',
  },
  {
    title: 'Add loading skeletons to dashboard',
    label: 'frontend',
    source: 'Meeting notes: "UX feels sluggish"',
  },
  {
    title: 'Set up staging environment monitoring',
    label: 'devops',
    source: 'Meeting notes: "We need alerts"',
  },
] as const;

export const assistantMessages: AssistantMessage[] = [
  {
    role: 'user',
    content: "Turn yesterday's meeting notes into tasks",
  },
  {
    role: 'ai',
    content: "I've extracted 3 actionable tasks from the meeting notes:",
  },
] as const;

export const assistantActions: AssistantAction[] = [
  { id: 'create-all', label: 'Create All Tasks', icon: 'tasks', color: '#AB47BC' },
  { id: 'review', label: 'Review Individually', icon: 'tasks', color: '#AB47BC' },
] as const;
