// TypeScript equivalents of kiwi-mail-types

export interface Address {
	name: string | null;
	email: string;
}

export interface Attachment {
	name: string;
	type: string;
	size: number;
}

export interface EmailSummary {
	id: string;
	from: Address[];
	to: Address[];
	subject: string;
	received_at: string;
	preview: string;
	is_read: boolean;
	is_flagged: boolean;
}

export interface EmailDetail {
	id: string;
	from: Address[];
	to: Address[];
	cc: Address[];
	subject: string;
	received_at: string;
	body: string;
	attachments: Attachment[];
	message_id?: string;
	in_reply_to?: string;
}

export interface SearchParams {
	query?: string;
	mailbox?: string;
	from?: string;
	after?: string;
	before?: string;
	limit?: number;
}

export interface SendParams {
	to: string[];
	cc?: string[];
	bcc?: string[];
	subject: string;
	body: string;
	in_reply_to?: string;
	references?: string;
	format?: 'text' | 'html';
}

export interface Mailbox {
	id: string;
	name: string;
	role: string | null;
	total_emails: number;
	unread_emails: number;
}

export interface EmailUpdate {
	is_read?: boolean;
	is_flagged?: boolean;
}

export interface SendResult {
	id: string;
	status: string;
}
