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
}

export interface SendResult {
	id: string;
	status: string;
}
