import type { MailService } from '@kiwi/core/services/mail';
import type { EmailSummary, EmailDetail, SearchParams, SendParams, SendResult } from '@kiwi/core/services/types';

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
};
