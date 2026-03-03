import type { EmailSummary, EmailDetail, SearchParams, SendParams, SendResult, Mailbox, EmailUpdate, VacationResponse } from './types';

export interface MailService {
	search(params: SearchParams): Promise<EmailSummary[]>;
	read(id: string, format?: string): Promise<EmailDetail>;
	send(params: SendParams): Promise<SendResult>;
	listMailboxes(): Promise<Mailbox[]>;
	moveEmail(id: string, mailboxId: string): Promise<void>;
	deleteEmail(id: string): Promise<void>;
	updateEmail(id: string, updates: EmailUpdate): Promise<void>;
	downloadAttachment(emailId: string, blobId: string, filename: string): Promise<void>;
	getVacation(): Promise<VacationResponse>;
	setVacation(vacation: VacationResponse): Promise<void>;
}
