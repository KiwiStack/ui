<script lang="ts">
	import { getMailService } from '../../services/index';
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';

	let to = $state('');
	let cc = $state('');
	let subject = $state('');
	let body = $state('');
	let sending = $state(false);
	let feedback: { type: 'success' | 'error'; message: string } | null = $state(null);

	function parseAddresses(input: string): string[] {
		return input
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	}

	async function handleSend() {
		if (!to.trim() || !subject.trim()) {
			feedback = { type: 'error', message: 'To and Subject are required.' };
			return;
		}
		sending = true;
		feedback = null;
		try {
			const result = await getMailService().send({
				to: parseAddresses(to),
				cc: cc.trim() ? parseAddresses(cc) : undefined,
				subject,
				body,
			});
			feedback = { type: 'success', message: `Email sent (${result.status}).` };
			to = '';
			cc = '';
			subject = '';
			body = '';
		} catch (e) {
			feedback = { type: 'error', message: e instanceof Error ? e.message : 'Failed to send.' };
		} finally {
			sending = false;
		}
	}
</script>

<div class="compose">
	<ServiceBadge label="KIWI MAIL" icon="/icons/mail.svg" color="#FF7043" />

	<h1>New Message</h1>

	{#if feedback}
		<div class="feedback" class:success={feedback.type === 'success'} class:error={feedback.type === 'error'}>
			{feedback.message}
		</div>
	{/if}

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
		<label class="field-label" for="compose-body">Body</label>
		<textarea id="compose-body" bind:value={body} rows="12" placeholder="Write your message…"></textarea>
	</div>

	<div class="button-row">
		<ActionButton label={sending ? 'Sending…' : 'Send'} variant="primary" onClick={handleSend} />
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
	.feedback {
		padding: var(--space-3) var(--space-4);
		border-radius: 6px;
		font-family: var(--font-body);
		font-size: 0.9rem;
		margin-bottom: var(--space-4);
	}
	.feedback.success {
		background: rgba(124, 179, 66, 0.15);
		color: var(--kiwi-bright);
		border: 1px solid var(--kiwi-green);
	}
	.feedback.error {
		background: rgba(255, 112, 67, 0.15);
		color: var(--pop-coral);
		border: 1px solid var(--pop-coral);
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
	input, textarea {
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
	input:focus, textarea:focus {
		border-color: var(--pop-coral);
	}
	textarea {
		resize: vertical;
		line-height: 1.6;
	}
	.button-row {
		margin-top: var(--space-5);
	}
</style>
