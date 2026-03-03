import type { MailService } from '@kiwi/core/services/mail';
import type { EmailSummary, EmailDetail, SearchParams, SendParams, SendResult, Mailbox, EmailUpdate } from '@kiwi/core/services/types';

export const mailService: MailService = {
	async search(params: SearchParams): Promise<EmailSummary[]> {
		const res = await fetch('/api/v1/mail/search', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(params),
		});
		if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
		const json = await res.json();
		return json.data;
	},

	async read(id: string, format = 'html'): Promise<EmailDetail> {
		const res = await fetch(`/api/v1/mail/${encodeURIComponent(id)}?format=${format}`);
		if (!res.ok) throw new Error(`Read failed: ${res.statusText}`);
		const json = await res.json();
		return json.data;
	},

	async send(params: SendParams): Promise<SendResult> {
		const res = await fetch('/api/v1/mail/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(params),
		});
		if (!res.ok) throw new Error(`Send failed: ${res.statusText}`);
		const json = await res.json();
		return json.data;
	},

	async listMailboxes(): Promise<Mailbox[]> {
		const res = await fetch('/api/v1/mailboxes');
		if (!res.ok) throw new Error(`List mailboxes failed: ${res.statusText}`);
		const json = await res.json();
		return json.data;
	},

	async moveEmail(id: string, mailboxId: string): Promise<void> {
		const res = await fetch(`/api/v1/mail/${encodeURIComponent(id)}/move`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ mailbox_id: mailboxId }),
		});
		if (!res.ok) throw new Error(`Move failed: ${res.statusText}`);
	},

	async deleteEmail(id: string): Promise<void> {
		const res = await fetch(`/api/v1/mail/${encodeURIComponent(id)}`, {
			method: 'DELETE',
		});
		if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
	},

	async updateEmail(id: string, updates: EmailUpdate): Promise<void> {
		const res = await fetch(`/api/v1/mail/${encodeURIComponent(id)}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updates),
		});
		if (!res.ok) throw new Error(`Update failed: ${res.statusText}`);
	},
};
