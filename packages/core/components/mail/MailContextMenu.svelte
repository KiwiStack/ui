<script lang="ts">
	import type { EmailSummary, Mailbox } from '../../services/types';

	let { email, mailboxes, position, onMove, onMarkRead, onFlag, onDelete, onClose }: {
		email: EmailSummary;
		mailboxes: Mailbox[];
		position: { x: number; y: number };
		onMove: (emailId: string, mailboxId: string) => void;
		onMarkRead: (emailId: string, isRead: boolean) => void;
		onFlag: (emailId: string, isFlagged: boolean) => void;
		onDelete: (emailId: string) => void;
		onClose: () => void;
	} = $props();

	let showMoveSubmenu = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	function handleMove(mailboxId: string) {
		onMove(email.id, mailboxId);
		onClose();
	}

	function handleMarkRead() {
		onMarkRead(email.id, !email.is_read);
		onClose();
	}

	function handleFlag() {
		onFlag(email.id, !email.is_flagged);
		onClose();
	}

	function handleDelete() {
		onDelete(email.id);
		onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="backdrop" onclick={onClose}></div>

<div class="context-menu" style="left: {position.x}px; top: {position.y}px">
	<div
		class="menu-item has-submenu"
		role="menuitem"
		tabindex="0"
		onmouseenter={() => showMoveSubmenu = true}
		onmouseleave={() => showMoveSubmenu = false}
	>
		<span class="menu-icon" style="--icon-url: url('/icons/files.svg')"></span>
		Move to...
		<span class="arrow">&#9656;</span>

		{#if showMoveSubmenu}
			<div class="submenu">
				{#each mailboxes as mb}
					<button class="menu-item" onclick={() => handleMove(mb.id)}>
						{mb.name}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<button class="menu-item" onclick={handleMarkRead}>
		<span class="menu-icon" style="--icon-url: url('/icons/mail.svg')"></span>
		{email.is_read ? 'Mark as unread' : 'Mark as read'}
	</button>

	<button class="menu-item" onclick={handleFlag}>
		<span class="menu-icon" style="--icon-url: url('/icons/star.svg')"></span>
		{email.is_flagged ? 'Remove flag' : 'Flag'}
	</button>

	<div class="divider"></div>

	<button class="menu-item danger" onclick={handleDelete}>
		<span class="menu-icon" style="--icon-url: url('/icons/trash.svg')"></span>
		Delete
	</button>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 999;
	}
	.context-menu {
		position: fixed;
		z-index: 1000;
		min-width: 200px;
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 8px;
		padding: var(--space-1) 0;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}
	.menu-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-2) var(--space-3);
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--text-primary);
		cursor: pointer;
		position: relative;
		text-align: left;
	}
	.menu-item:hover {
		background: var(--app-bg-hover);
	}
	.menu-item.danger:hover {
		color: #ef4444;
	}
	.menu-item.has-submenu {
		cursor: default;
	}
	.arrow {
		margin-left: auto;
		font-size: 0.7rem;
		color: var(--text-muted);
	}
	.menu-icon {
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
	.divider {
		height: 1px;
		background: var(--border-subtle);
		margin: var(--space-1) 0;
	}
	.submenu {
		position: absolute;
		left: 100%;
		top: 0;
		min-width: 160px;
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 8px;
		padding: var(--space-1) 0;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}
</style>
