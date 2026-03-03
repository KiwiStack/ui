// Service definitions for Kiwi UI
// Each service has a color, icon, badge label, and menu items.

export type ServiceId = 'mail' | 'chat' | 'meet' | 'docs' | 'work' | 'store' | 'search';

export interface ServiceDefinition {
  id: ServiceId;
  name: string;
  color: string;
  icon: string;
  badge: string;
  menus: readonly string[];
  defaultMenu: string;
}

export const services: Record<ServiceId, ServiceDefinition> = {
  mail: {
    id: 'mail',
    name: 'Mail',
    color: '#FF7043',
    icon: 'mail.svg',
    badge: 'KIWI MAIL',
    menus: ['Inbox', 'Drafts', 'Sent', 'Deleted', 'Junk', 'Archive', 'Configuration'] as const,
    defaultMenu: 'Inbox',
  },
  chat: {
    id: 'chat',
    name: 'Chat',
    color: '#26A69A',
    icon: 'chat.svg',
    badge: 'KIWI CHAT',
    menus: ['Channels', 'Direct Messages', 'Threads', 'Starred'] as const,
    defaultMenu: 'Channels',
  },
  meet: {
    id: 'meet',
    name: 'Meet',
    color: '#42A5F5',
    icon: 'meet.svg',
    badge: 'KIWI MEET',
    menus: ['Upcoming', 'Past', 'Recordings'] as const,
    defaultMenu: 'Upcoming',
  },
  docs: {
    id: 'docs',
    name: 'Docs',
    color: '#EC407A',
    icon: 'docs.svg',
    badge: 'KIWI DOCS',
    menus: ['Recent', 'Shared with me', 'Templates'] as const,
    defaultMenu: 'Recent',
  },
  work: {
    id: 'work',
    name: 'Work',
    color: '#AB47BC',
    icon: 'tasks.svg',
    badge: 'KIWI WORK',
    menus: ['Board', 'List', 'Timeline', 'Calendar'] as const,
    defaultMenu: 'Board',
  },
  store: {
    id: 'store',
    name: 'Store',
    color: '#FFA726',
    icon: 'files.svg',
    badge: 'KIWI STORE',
    menus: ['All Files', 'Recent', 'Shared', 'Trash'] as const,
    defaultMenu: 'All Files',
  },
  search: {
    id: 'search',
    name: 'Search',
    color: '#7CB342',
    icon: 'search.svg',
    badge: 'KIWI SEARCH',
    menus: ['All', 'Mail', 'Chat', 'Docs', 'Files'] as const,
    defaultMenu: 'All',
  },
} as const;
