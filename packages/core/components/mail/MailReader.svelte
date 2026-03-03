<script lang="ts">
	import { getMailService } from '../../services/index';
	import { toast } from '../../services/toast.svelte';
	import type { EmailDetail } from '../../services/types';
	import ServiceBadge from '../shared/ServiceBadge.svelte';

	let { emailId, onReply, onReplyAll, onForward, onDelete }: {
		emailId: string;
		onReply?: (email: EmailDetail) => void;
		onReplyAll?: (email: EmailDetail) => void;
		onForward?: (email: EmailDetail) => void;
		onDelete?: (id: string) => void;
	} = $props();

	let email: EmailDetail | null = $state(null);
	let loading = $state(true);

	async function loadEmail(id: string) {
		loading = true;
		try {
			email = await getMailService().read(id);
			// Auto-mark as read (fire-and-forget)
			getMailService().updateEmail(id, { is_read: true }).catch(() => {});
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to load email');
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
	{:else if email}
		<ServiceBadge label="KIWI MAIL" icon="/icons/mail.svg" color="#FF7043" />

		<div class="toolbar">
			{#if onReply}
				<button class="toolbar-btn" onclick={() => onReply(email!)} title="Reply">
					<span class="toolbar-icon" style="--icon-url: url('/icons/reply.svg')"></span>
					Reply
				</button>
			{/if}
			{#if onReplyAll}
				<button class="toolbar-btn" onclick={() => onReplyAll(email!)} title="Reply All">
					<span class="toolbar-icon" style="--icon-url: url('/icons/reply-all.svg')"></span>
					Reply All
				</button>
			{/if}
			{#if onForward}
				<button class="toolbar-btn" onclick={() => onForward(email!)} title="Forward">
					<span class="toolbar-icon" style="--icon-url: url('/icons/forward.svg')"></span>
					Forward
				</button>
			{/if}
			{#if onDelete}
				<button class="toolbar-btn toolbar-btn--danger" onclick={() => onDelete(email!.id)} title="Delete">
					<span class="toolbar-icon" style="--icon-url: url('/icons/trash.svg')"></span>
					Delete
				</button>
			{/if}
		</div>

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
	.toolbar {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-3);
		padding: var(--space-2) 0;
	}
	.toolbar-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.toolbar-btn:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.toolbar-btn--danger:hover {
		color: #ef4444;
	}
	.toolbar-icon {
		width: 14px;
		height: 14px;
		display: block;
		background-color: currentColor;
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		flex-shrink: 0;
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
