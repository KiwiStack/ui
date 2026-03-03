<script lang="ts">
	import { getMailService } from '../../services/index';
	import type { EmailDetail } from '../../services/types';
	import ServiceBadge from '../shared/ServiceBadge.svelte';

	let { emailId }: { emailId: string } = $props();

	let email: EmailDetail | null = $state(null);
	let loading = $state(true);
	let error: string | null = $state(null);

	async function loadEmail(id: string) {
		loading = true;
		error = null;
		try {
			email = await getMailService().read(id);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load email';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadEmail(emailId);
	});

	function formatAddresses(addrs: { name: string | null; email: string }[]): string {
		return addrs.map((a) => (a.name ? `${a.name} <${a.email}>` : a.email)).join(', ');
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleString([], {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<div class="mail-reader">
	{#if loading}
		<div class="status-msg">Loading…</div>
	{:else if error}
		<div class="status-msg error">{error}</div>
	{:else if email}
		<ServiceBadge label="KIWI MAIL" icon="/icons/mail.svg" color="#FF7043" />

		<h1>{email.subject}</h1>

		<div class="meta">
			<div class="meta-row">
				<span class="meta-label">From</span>
				<span class="meta-value">{formatAddresses(email.from)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">To</span>
				<span class="meta-value">{formatAddresses(email.to)}</span>
			</div>
			{#if email.cc.length > 0}
				<div class="meta-row">
					<span class="meta-label">Cc</span>
					<span class="meta-value">{formatAddresses(email.cc)}</span>
				</div>
			{/if}
			<div class="meta-row">
				<span class="meta-label">Date</span>
				<span class="meta-value">{formatDate(email.received_at)}</span>
			</div>
		</div>

		<div class="divider"></div>

		<div class="body">{@html email.body}</div>

		{#if email.attachments.length > 0}
			<div class="divider"></div>
			<div class="attachments">
				<span class="attachments-label">Attachments ({email.attachments.length})</span>
				{#each email.attachments as att}
					<div class="attachment">
						<span class="att-icon" style="--icon-url: url('/icons/files.svg')"></span>
						<span class="att-name">{att.name}</span>
						<span class="att-size">{formatSize(att.size)}</span>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.mail-reader {
		padding: var(--space-6) var(--space-8);
		max-width: 800px;
	}
	.status-msg {
		padding: var(--space-6);
		color: var(--text-secondary);
		font-family: var(--font-body);
		font-size: 0.95rem;
		text-align: center;
	}
	.status-msg.error {
		color: var(--pop-coral);
	}
	h1 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.6rem;
		line-height: 1.2;
		color: var(--text-primary);
		margin: var(--space-4) 0 var(--space-5);
	}
	.meta {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.meta-row {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
	}
	.meta-label {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--text-muted);
		min-width: 36px;
	}
	.meta-value {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--text-primary);
	}
	.divider {
		height: 1px;
		background: var(--border-subtle);
		margin: var(--space-5) 0;
	}
	.body {
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--text-primary);
		word-wrap: break-word;
	}
	.body :global(a) {
		color: var(--pop-coral);
	}
	.attachments-label {
		display: block;
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin-bottom: var(--space-3);
	}
	.attachment {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--app-bg-surface);
		border-radius: 6px;
		margin-bottom: var(--space-2);
	}
	.att-icon {
		width: 16px;
		height: 16px;
		display: block;
		background-color: var(--text-muted);
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		flex-shrink: 0;
	}
	.att-name {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--text-primary);
	}
	.att-size {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-left: auto;
	}
</style>
