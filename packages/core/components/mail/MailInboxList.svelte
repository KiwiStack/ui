<script lang="ts">
	import { getMailService } from '../../services/index';
	import { toast } from '../../services/toast.svelte';
	import { mailboxStore } from '../../stores/mailboxes.svelte';
	import type { EmailSummary } from '../../services/types';
	import MailContextMenu from './MailContextMenu.svelte';

	let { activeEmail, onEmailChange, mailboxId, onCompose, refreshKey = 0, onRefresh }: {
		activeEmail: string | null;
		onEmailChange: (id: string) => void;
		mailboxId?: string;
		onCompose?: () => void;
		refreshKey?: number;
		onRefresh?: () => void;
	} = $props();

	let emails: EmailSummary[] = $state([]);
	let loading = $state(true);

	// Search state
	let searchQuery = $state('');
	let searchTimeout: ReturnType<typeof setTimeout> | null = $state(null);

	// Sort state
	let sortBy = $state('receivedAt');
	let ascending = $state(false);
	const sortOptions = [
		{ value: 'receivedAt', label: 'Date' },
		{ value: 'from', label: 'From' },
		{ value: 'subject', label: 'Subject' },
		{ value: 'size', label: 'Size' },
	];

	// Context menu state
	let contextMenu: { email: EmailSummary; x: number; y: number } | null = $state(null);

	async function loadEmails() {
		loading = true;
		try {
			emails = await getMailService().search({
				mailbox: mailboxId,
				query: searchQuery || undefined,
				limit: 50,
				sort_by: sortBy,
				ascending,
			});
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to load emails');
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		// Re-fetch when mailboxId, refreshKey, sortBy, or ascending changes
		void mailboxId;
		void refreshKey;
		void sortBy;
		void ascending;
		loadEmails();
	});

	function handleSearchInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		searchQuery = value;
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => loadEmails(), 300);
	}

	function clearSearch() {
		searchQuery = '';
		loadEmails();
	}

	function handleContextMenu(e: MouseEvent, email: EmailSummary) {
		e.preventDefault();
		contextMenu = { email, x: e.clientX, y: e.clientY };
	}

	async function handleContextMove(emailId: string, targetMailboxId: string) {
		try {
			await getMailService().moveEmail(emailId, targetMailboxId);
			toast.show('success', 'Email moved.');
			onRefresh?.();
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to move email.');
		}
	}

	async function handleContextMarkRead(emailId: string, isRead: boolean) {
		try {
			await getMailService().updateEmail(emailId, { is_read: isRead });
			const idx = emails.findIndex(e => e.id === emailId);
			if (idx >= 0) emails[idx].is_read = isRead;
			onRefresh?.();
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to update email.');
		}
	}

	async function handleContextFlag(emailId: string, isFlagged: boolean) {
		try {
			await getMailService().updateEmail(emailId, { is_flagged: isFlagged });
			const idx = emails.findIndex(e => e.id === emailId);
			if (idx >= 0) emails[idx].is_flagged = isFlagged;
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to update email.');
		}
	}

	async function handleContextDelete(emailId: string) {
		try {
			await getMailService().deleteEmail(emailId);
			toast.show('success', 'Email deleted.');
			onRefresh?.();
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to delete email.');
		}
	}

	async function toggleFlag(e: MouseEvent, email: EmailSummary) {
		e.stopPropagation();
		const newFlagged = !email.is_flagged;
		try {
			await getMailService().updateEmail(email.id, { is_flagged: newFlagged });
			const idx = emails.findIndex(em => em.id === email.id);
			if (idx >= 0) emails[idx].is_flagged = newFlagged;
		} catch (err) {
			toast.show('error', err instanceof Error ? err.message : 'Failed to update flag.');
		}
	}

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

	function senderName(email: EmailSummary): string {
		if (email.from.length === 0) {
			if (email.to.length > 0) {
				return `To: ${email.to[0].name || email.to[0].email}`;
			}
			return 'Draft';
		}
		return email.from[0].name || email.from[0].email;
	}
</script>

<div class="inbox-list">
	<div class="search-bar">
		<span class="search-icon" style="--icon-url: url('/icons/search.svg')"></span>
		<input
			type="text"
			class="search-input"
			placeholder="Search emails..."
			value={searchQuery}
			oninput={handleSearchInput}
		/>
		{#if searchQuery}
			<button class="search-clear" onclick={clearSearch} title="Clear search">&times;</button>
		{/if}
	</div>

	<div class="toolbar-row">
		{#if onCompose}
			<button class="compose-btn" onclick={onCompose}>
				<span class="compose-icon" style="--icon-url: url('/icons/compose.svg')"></span>
				New Message
			</button>
		{/if}

		<div class="sort-controls">
			<select class="sort-select" bind:value={sortBy}>
				{#each sortOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
			<button
				class="sort-dir"
				onclick={() => ascending = !ascending}
				title={ascending ? 'Ascending' : 'Descending'}
			>
				{ascending ? '\u2191' : '\u2193'}
			</button>
		</div>
	</div>

	{#if loading}
		<div class="status-msg">Loading…</div>
	{:else if emails.length === 0}
		<div class="status-msg">{searchQuery ? 'No results' : 'No emails'}</div>
	{:else}
		{#each emails as email}
			<button
				class="email-item"
				class:active={activeEmail === email.id}
				class:unread={!email.is_read}
				onclick={() => onEmailChange(email.id)}
				oncontextmenu={(e) => handleContextMenu(e, email)}
			>
				<div class="email-header">
					<span class="sender">{senderName(email)}</span>
					<div class="header-right">
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							class="flag-btn"
							class:flagged={email.is_flagged}
							onclick={(e) => toggleFlag(e, email)}
							onkeydown={(e) => { if (e.key === 'Enter') toggleFlag(e, email); }}
							role="button"
							tabindex="-1"
							title={email.is_flagged ? 'Remove flag' : 'Flag'}
						>
							{email.is_flagged ? '\u2605' : '\u2606'}
						</span>
						<span class="time">{formatTime(email.received_at)}</span>
					</div>
				</div>
				<div class="subject">{email.subject}</div>
				<div class="preview">{email.preview}</div>
			</button>
		{/each}
	{/if}

	{#if contextMenu}
		<MailContextMenu
			email={contextMenu.email}
			mailboxes={mailboxStore.mailboxes}
			position={{ x: contextMenu.x, y: contextMenu.y }}
			onMove={handleContextMove}
			onMarkRead={handleContextMarkRead}
			onFlag={handleContextFlag}
			onDelete={handleContextDelete}
			onClose={() => contextMenu = null}
		/>
	{/if}
</div>

<style>
	.inbox-list {
		padding: var(--space-2) 0;
	}
	.search-bar {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: var(--space-2) var(--space-3);
		padding: var(--space-2) var(--space-3);
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
	}
	.search-icon {
		width: 14px;
		height: 14px;
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
	.search-input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--text-primary);
	}
	.search-input::placeholder {
		color: var(--text-muted);
	}
	.search-clear {
		font-size: 1.1rem;
		color: var(--text-muted);
		cursor: pointer;
		line-height: 1;
		padding: 0 2px;
	}
	.search-clear:hover {
		color: var(--text-primary);
	}
	.toolbar-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: var(--space-2) var(--space-3);
	}
	.compose-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--pop-coral);
		color: #fff;
		border-radius: 6px;
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity var(--transition-fast);
	}
	.compose-btn:hover {
		opacity: 0.9;
	}
	.compose-icon {
		width: 14px;
		height: 14px;
		display: block;
		background-color: #fff;
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		flex-shrink: 0;
	}
	.sort-controls {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		margin-left: auto;
	}
	.sort-select {
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 4px;
		font-family: var(--font-body);
		font-size: 0.75rem;
		color: var(--text-secondary);
		padding: 2px var(--space-2);
		cursor: pointer;
	}
	.sort-dir {
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 4px;
		font-size: 0.8rem;
		color: var(--text-secondary);
		padding: 2px 6px;
		cursor: pointer;
		line-height: 1;
	}
	.sort-dir:hover, .sort-select:hover {
		color: var(--text-primary);
	}
	.status-msg {
		padding: var(--space-4);
		color: var(--text-secondary);
		font-family: var(--font-body);
		font-size: 0.9rem;
		text-align: center;
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
	.email-item.unread .sender,
	.email-item.unread .subject {
		font-weight: 700;
	}
	.email-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2px;
	}
	.header-right {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-shrink: 0;
	}
	.flag-btn {
		font-size: 0.95rem;
		color: var(--text-muted);
		cursor: pointer;
		line-height: 1;
		padding: 0;
		transition: color var(--transition-fast);
	}
	.flag-btn:hover {
		color: var(--pop-coral);
	}
	.flag-btn.flagged {
		color: var(--pop-coral);
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
