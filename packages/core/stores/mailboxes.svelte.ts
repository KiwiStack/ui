import { getMailService } from '../services/index';
import type { Mailbox } from '../services/types';

let mailboxes = $state<Mailbox[]>([]);
let loaded = $state(false);

const TAB_ROLE_MAP: Record<string, string> = {
	Inbox: 'inbox',
	Drafts: 'drafts',
	Sent: 'sent',
	Deleted: 'trash',
	Junk: 'junk',
	Archive: 'archive',
};

export const mailboxStore = {
	get mailboxes(): Mailbox[] {
		return mailboxes;
	},

	get loaded(): boolean {
		return loaded;
	},

	async load(): Promise<void> {
		if (loaded) return;
		try {
			mailboxes = await getMailService().listMailboxes();
			loaded = true;
		} catch {
			// Silently fail — mailboxes will remain empty
		}
	},

	mailboxIdForTab(tabName: string): string | undefined {
		const role = TAB_ROLE_MAP[tabName];
		if (!role) return undefined;
		return mailboxes.find((m) => m.role === role)?.id;
	},

	reset(): void {
		mailboxes = [];
		loaded = false;
	},
};
