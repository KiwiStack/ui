// Mock data for the Store service

export interface Folder {
  id: string;
  name: string;
  files: number;
  active?: boolean;
}

export interface FileMove {
  folder: string;
  count: number;
  pattern: string;
}

export interface MovePlan {
  source: string;
  totalFiles: number;
  moves: FileMove[];
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

export const folders: Folder[] = [
  { id: 'projects', name: 'Projects', files: 45, active: true },
  { id: 'downloads', name: 'Downloads', files: 23 },
  { id: 'documents', name: 'Documents', files: 67 },
  { id: 'images', name: 'Images', files: 34 },
  { id: 'archives', name: 'Archives', files: 12 },
] as const;

export const movePlan: MovePlan = {
  source: 'Downloads',
  totalFiles: 23,
  moves: [
    { folder: 'Projects/Reports', count: 8, pattern: 'Q*-report-*.pdf' },
    { folder: 'Documents/Contracts', count: 6, pattern: '*-contract-*.docx' },
    { folder: 'Images/Screenshots', count: 5, pattern: 'screenshot-*.png' },
    { folder: 'Archives/Old', count: 4, pattern: '*-2024-*.*' },
  ],
} as const;

export const assistantMessages: AssistantMessage[] = [
  {
    role: 'user',
    content: 'Clean up my Downloads folder, organize files by type',
  },
  {
    role: 'ai',
    content: "I've analyzed 23 files in Downloads. Here's the organization plan:",
  },
] as const;

export const assistantActions: AssistantAction[] = [
  { id: 'move', label: 'Move All Files', icon: 'files', color: '#FFA726' },
  { id: 'review', label: 'Review Plan', icon: 'files', color: '#FFA726' },
] as const;
