import type { EmailSummary, EmailDetail, SearchParams, SendParams, SendResult } from './types';

export interface MailService {
	search(params: SearchParams): Promise<EmailSummary[]>;
	read(id: string, format?: string): Promise<EmailDetail>;
	send(params: SendParams): Promise<SendResult>;
}
