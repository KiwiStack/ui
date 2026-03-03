import type { MailService } from './mail';

let mailService: MailService | null = null;

export function setMailService(service: MailService): void {
	mailService = service;
}

export function getMailService(): MailService {
	if (!mailService) {
		throw new Error('MailService not initialized. Call setMailService() first.');
	}
	return mailService;
}
