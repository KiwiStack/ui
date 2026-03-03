import { invoke } from '@tauri-apps/api/core';
import type { MailService } from '@kiwi/core/services/mail';
import type { EmailSummary, EmailDetail, SearchParams, SendParams, SendResult } from '@kiwi/core/services/types';

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
};
