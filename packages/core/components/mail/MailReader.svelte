<script lang="ts">
	import { getMailService } from '../../services/index';
	import { toast } from '../../services/toast.svelte';
	import { mailboxStore } from '../../stores/mailboxes.svelte';
	import type { EmailDetail } from '../../services/types';
	import ServiceBadge from '../shared/ServiceBadge.svelte';

	let { emailId, onReply, onReplyAll, onForward, onDelete, onRefresh }: {
		emailId: string;
		onReply?: (email: EmailDetail) => void;
		onReplyAll?: (email: EmailDetail) => void;
		onForward?: (email: EmailDetail) => void;
		onDelete?: (id: string) => void;
		onRefresh?: () => void;
	} = $props();

	let email: EmailDetail | null = $state(null);
	let loading = $state(true);
	let showMoveDropdown = $state(false);
	let isFlagged = $state(false);

	async function loadEmail(id: string) {
		loading = true;
		showMoveDropdown = false;
		try {
			email = await getMailService().read(id);
			isFlagged = false; // Reset; detail doesn't carry flag state currently
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

	async function handleMarkUnread() {
		if (!email) return;
		try {
			await getMailService().updateEmail(email.id, { is_read: false });
			toast.show('info', 'Marked as unread.');
			onRefresh?.();
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to mark unread.');
		}
	}

	async function handleToggleFlag() {
		if (!email) return;
		const newFlagged = !isFlagged;
		try {
			await getMailService().updateEmail(email.id, { is_flagged: newFlagged });
			isFlagged = newFlagged;
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to update flag.');
		}
	}

	async function handleMoveTo(mailboxId: string) {
		if (!email) return;
		showMoveDropdown = false;
		try {
			await getMailService().moveEmail(email.id, mailboxId);
			toast.show('success', 'Email moved.');
			onRefresh?.();
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to move email.');
		}
	}

	async function handleDownloadAttachment(att: { name: string; blob_id?: string; type: string; size: number }) {
		if (!email || !att.blob_id) return;
		try {
			await getMailService().downloadAttachment(email.id, att.blob_id, att.name);
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Download failed.');
		}
	}

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

			<div class="move-dropdown-wrapper">
				<button
					class="toolbar-btn"
					onclick={() => showMoveDropdown = !showMoveDropdown}
					title="Move to folder"
				>
					<span class="toolbar-icon" style="--icon-url: url('/icons/files.svg')"></span>
					Move to
				</button>
				{#if showMoveDropdown}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div class="move-backdrop" onclick={() => showMoveDropdown = false}></div>
					<div class="move-dropdown">
						{#each mailboxStore.mailboxes as mb}
							<button class="move-option" onclick={() => handleMoveTo(mb.id)}>
								{mb.name}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<button class="toolbar-btn" onclick={handleMarkUnread} title="Mark as unread">
				<span class="toolbar-icon" style="--icon-url: url('/icons/mail.svg')"></span>
				Mark unread
			</button>

			<button
				class="toolbar-btn"
				class:flagged={isFlagged}
				onclick={handleToggleFlag}
				title={isFlagged ? 'Remove flag' : 'Flag'}
			>
				<span class="flag-star">{isFlagged ? '\u2605' : '\u2606'}</span>
				{isFlagged ? 'Flagged' : 'Flag'}
			</button>

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
					<button
						class="attachment"
						class:clickable={!!att.blob_id}
						onclick={() => handleDownloadAttachment(att)}
						title={att.blob_id ? `Download ${att.name}` : att.name}
					>
						<span class="att-icon" style="--icon-url: url('/icons/files.svg')"></span>
						<span class="att-name">{att.name}</span>
						<span class="att-size">{formatSize(att.size)}</span>
						{#if att.blob_id}
							<span class="att-download">&darr;</span>
						{/if}
					</button>
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
		flex-wrap: wrap;
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
	.toolbar-btn.flagged {
		color: var(--pop-coral);
		border-color: var(--pop-coral);
	}
	.flag-star {
		font-size: 0.95rem;
		line-height: 1;
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
	.move-dropdown-wrapper {
		position: relative;
	}
	.move-backdrop {
		position: fixed;
		inset: 0;
		z-index: 99;
	}
	.move-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 100;
		min-width: 160px;
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 8px;
		padding: var(--space-1) 0;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
		margin-top: var(--space-1);
	}
	.move-option {
		display: block;
		width: 100%;
		padding: var(--space-2) var(--space-3);
		text-align: left;
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--text-primary);
		cursor: pointer;
	}
	.move-option:hover {
		background: var(--app-bg-hover);
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
		width: 100%;
		text-align: left;
	}
	.attachment.clickable {
		cursor: pointer;
	}
	.attachment.clickable:hover {
		background: var(--app-bg-hover);
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
	.att-download {
		font-size: 0.9rem;
		color: var(--pop-coral);
		margin-left: var(--space-2);
	}
</style>
