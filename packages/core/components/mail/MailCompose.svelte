<script lang="ts">
	import { getMailService } from '../../services/index';
	import { toast } from '../../services/toast.svelte';
	import type { EmailDetail } from '../../services/types';
	import type { Editor } from '@tiptap/core';
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';
	import MailEditor from './MailEditor.svelte';

	type ComposeMode =
		| { type: 'new' }
		| { type: 'reply'; email: EmailDetail; all: boolean }
		| { type: 'forward'; email: EmailDetail }
		| null;

	let { mode = null, onDone }: {
		mode?: ComposeMode;
		onDone?: () => void;
	} = $props();

	let to = $state('');
	let cc = $state('');
	let subject = $state('');
	let bodyHtml = $state('');
	let editorRef: Editor | null = $state(null);
	let pendingContent: string | null = $state(null);
	let inReplyTo = $state<string | undefined>(undefined);
	let references = $state<string | undefined>(undefined);
	let sending = $state(false);

	// Derive heading text
	let heading = $derived(
		mode?.type === 'reply' ? 'Reply' :
		mode?.type === 'forward' ? 'Forward' :
		'New Message'
	);

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\n/g, '<br>');
	}

	function formatQuotedHtml(email: EmailDetail): string {
		const from = email.from.map(a => a.name ? `${a.name} &lt;${a.email}&gt;` : a.email).join(', ');
		const date = new Date(email.received_at).toLocaleString([], {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});

		const originalBody = email.body || '';

		return `<br><hr><p><strong>--- Original Message ---</strong><br>From: ${from}<br>Date: ${date}<br>Subject: ${escapeHtml(email.subject)}</p><blockquote>${originalBody}</blockquote>`;
	}

	function applyContent(html: string) {
		if (editorRef) {
			editorRef.commands.setContent(html);
			bodyHtml = html;
		} else {
			pendingContent = html;
			bodyHtml = html;
		}
	}

	// Pre-fill when mode changes
	$effect(() => {
		if (!mode || mode.type === 'new') {
			to = '';
			cc = '';
			subject = '';
			inReplyTo = undefined;
			references = undefined;
			applyContent('');
			return;
		}

		const email = mode.type === 'reply' ? mode.email : mode.email;
		const quotedHtml = formatQuotedHtml(email);

		if (mode.type === 'reply') {
			to = email.from.map(a => a.email).join(', ');

			if (mode.all) {
				const allRecipients = [
					...email.to.map(a => a.email),
					...email.cc.map(a => a.email),
				].filter(addr => !email.from.some(f => f.email === addr));
				const toAddrs = email.from.map(a => a.email);
				const ccAddrs = allRecipients.filter(a => !toAddrs.includes(a));
				cc = [...new Set(ccAddrs)].join(', ');
			} else {
				cc = '';
			}

			subject = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`;
			inReplyTo = email.message_id;
			references = email.message_id;
			applyContent(`<p><br></p>${quotedHtml}`);
		} else {
			to = '';
			cc = '';
			subject = email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`;
			inReplyTo = undefined;
			references = undefined;
			applyContent(`<p><br></p>${quotedHtml}`);
		}
	});

	function parseAddresses(input: string): string[] {
		return input
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	}

	function handleEditorReady(editor: Editor) {
		editorRef = editor;
		if (pendingContent !== null) {
			editor.commands.setContent(pendingContent);
			bodyHtml = pendingContent;
			pendingContent = null;
		}
	}

	function handleEditorUpdate(html: string) {
		bodyHtml = html;
	}

	async function handleSend() {
		if (!to.trim() || !subject.trim()) {
			toast.show('error', 'To and Subject are required.');
			return;
		}
		sending = true;
		try {
			const body = bodyHtml;
			const result = await getMailService().send({
				to: parseAddresses(to),
				cc: cc.trim() ? parseAddresses(cc) : undefined,
				subject,
				body,
				in_reply_to: inReplyTo,
				references: references,
				format: 'html',
			});
			toast.show('success', `Email sent (${result.status}).`);
			if (onDone) onDone();
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to send.');
		} finally {
			sending = false;
		}
	}

	function handleCancel() {
		if (onDone) onDone();
	}
</script>

<div class="compose">
	<ServiceBadge label="KIWI MAIL" icon="/icons/mail.svg" color="#FF7043" />

	<h1>{heading}</h1>

	<div class="field">
		<label class="field-label" for="compose-to">To</label>
		<input id="compose-to" type="text" bind:value={to} placeholder="recipient@example.com" />
	</div>

	<div class="field">
		<label class="field-label" for="compose-cc">Cc</label>
		<input id="compose-cc" type="text" bind:value={cc} placeholder="Optional" />
	</div>

	<div class="field">
		<label class="field-label" for="compose-subject">Subject</label>
		<input id="compose-subject" type="text" bind:value={subject} placeholder="Subject" />
	</div>

	<div class="field">
		<label class="field-label">Body</label>
		<MailEditor onReady={handleEditorReady} onUpdate={handleEditorUpdate} />
	</div>

	<div class="button-row">
		<ActionButton label={sending ? 'Sending…' : 'Send'} variant="primary" onClick={handleSend} />
		{#if onDone}
			<button class="cancel-btn" onclick={handleCancel}>Cancel</button>
		{/if}
	</div>
</div>

<style>
	.compose {
		padding: var(--space-6) var(--space-8);
		max-width: 700px;
	}
	h1 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.6rem;
		line-height: 1.2;
		color: var(--text-primary);
		margin: var(--space-4) 0 var(--space-5);
	}
	.field {
		margin-bottom: var(--space-4);
	}
	.field-label {
		display: block;
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: var(--space-1);
	}
	input {
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: var(--app-bg-surface);
		border: 1.5px solid var(--border-subtle);
		border-radius: 6px;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--text-primary);
		outline: none;
		transition: border-color var(--transition-fast);
	}
	input:focus {
		border-color: var(--pop-coral);
	}
	.button-row {
		margin-top: var(--space-5);
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.cancel-btn {
		padding: var(--space-2) var(--space-4);
		background: transparent;
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.cancel-btn:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
</style>
