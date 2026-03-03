<script lang="ts">
	import { getMailService } from '../../services/index';
	import type { EmailSummary } from '../../services/types';

	let { activeEmail, onEmailChange }: {
		activeEmail: string | null;
		onEmailChange: (id: string) => void;
	} = $props();

	let emails: EmailSummary[] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);

	async function loadEmails() {
		loading = true;
		error = null;
		try {
			emails = await getMailService().search({ limit: 50 });
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load emails';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadEmails();
	});

	function formatTime(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		if (diffDays === 0) {
			return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		} else if (diffDays < 7) {
			return date.toLocaleDateString([], { weekday: 'short' });
		}
		return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
	}

	function senderName(from: EmailSummary['from']): string {
		if (from.length === 0) return 'Unknown';
		return from[0].name || from[0].email;
	}
</script>

<div class="inbox-list">
	{#if loading}
		<div class="status-msg">Loading…</div>
	{:else if error}
		<div class="status-msg error">{error}</div>
		<button class="retry-btn" onclick={loadEmails}>Retry</button>
	{:else if emails.length === 0}
		<div class="status-msg">No emails</div>
	{:else}
		{#each emails as email}
			<button
				class="email-item"
				class:active={activeEmail === email.id}
				onclick={() => onEmailChange(email.id)}
			>
				<div class="email-header">
					<span class="sender">{senderName(email.from)}</span>
					<span class="time">{formatTime(email.received_at)}</span>
				</div>
				<div class="subject">{email.subject}</div>
				<div class="preview">{email.preview}</div>
			</button>
		{/each}
	{/if}
</div>

<style>
	.inbox-list {
		padding: var(--space-2) 0;
	}
	.status-msg {
		padding: var(--space-4);
		color: var(--text-secondary);
		font-family: var(--font-body);
		font-size: 0.9rem;
		text-align: center;
	}
	.status-msg.error {
		color: var(--pop-coral);
	}
	.retry-btn {
		display: block;
		margin: 0 auto;
		padding: var(--space-2) var(--space-4);
		color: var(--pop-coral);
		font-family: var(--font-body);
		font-size: 0.85rem;
		border: 1px solid var(--pop-coral);
		border-radius: 4px;
		cursor: pointer;
	}
	.email-item {
		display: block;
		width: 100%;
		padding: var(--space-3) var(--space-4);
		text-align: left;
		color: var(--text-secondary);
		transition: all var(--transition-fast);
		border-bottom: 1px solid var(--border-subtle);
	}
	.email-item:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.email-item.active {
		background: var(--app-bg-surface);
		color: var(--text-primary);
		border-left: 3px solid var(--pop-coral);
	}
	.email-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2px;
	}
	.sender {
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.time {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
		flex-shrink: 0;
		margin-left: var(--space-2);
	}
	.subject {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.85rem;
		color: var(--text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 2px;
	}
	.preview {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--text-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
