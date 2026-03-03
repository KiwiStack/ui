import { invoke } from '@tauri-apps/api/core';
import type { MailService } from '@kiwi/core/services/mail';
import type { EmailSummary, EmailDetail, SearchParams, SendParams, SendResult, Mailbox, EmailUpdate, VacationResponse } from '@kiwi/core/services/types';

export const mailService: MailService = {
	async search(params: SearchParams): Promise<EmailSummary[]> {
		return invoke<EmailSummary[]>('mail_search', { params });
	},

	async read(id: string, format = 'html'): Promise<EmailDetail> {
		return invoke<EmailDetail>('mail_read', { id, format });
	},

	async send(params: SendParams): Promise<SendResult> {
		return invoke<SendResult>('mail_send', { params });
	},

	async listMailboxes(): Promise<Mailbox[]> {
		return invoke<Mailbox[]>('mail_list_mailboxes');
	},

	async moveEmail(id: string, mailboxId: string): Promise<void> {
		await invoke('mail_move', { id, mailboxId });
	},

	async deleteEmail(id: string): Promise<void> {
		await invoke('mail_delete', { id });
	},

	async updateEmail(id: string, updates: EmailUpdate): Promise<void> {
		await invoke('mail_update', { id, updates });
	},

	async downloadAttachment(emailId: string, blobId: string, filename: string): Promise<void> {
		await invoke('mail_download_attachment', { emailId, blobId, filename });
	},

	async getVacation(): Promise<VacationResponse> {
		return invoke<VacationResponse>('mail_get_vacation');
	},

	async setVacation(vacation: VacationResponse): Promise<void> {
		await invoke('mail_set_vacation', { vacation });
	},
};
