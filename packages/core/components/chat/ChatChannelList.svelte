<script lang="ts">
	import { channels } from '../../data/chat';

	let { activeChannel, onChannelChange }: {
		activeChannel: string;
		onChannelChange: (id: string) => void;
	} = $props();
</script>

<div class="channel-list">
	{#each channels as channel}
		<button
			class="channel-item"
			class:active={activeChannel === channel.id}
			onclick={() => onChannelChange(channel.id)}
		>
			<span
				class="channel-icon"
				style="--icon-url: url('/icons/chat.svg')"
			></span>
			<span class="channel-name">{channel.name}</span>
			<span class="channel-meta">{channel.members} members</span>
			{#if channel.unread > 0}
				<span class="unread-badge">{channel.unread}</span>
			{/if}
		</button>
	{/each}
</div>

<style>
	.channel-list {
		padding: var(--space-3) 0;
	}
	.channel-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		width: 100%;
		color: var(--text-secondary);
		transition: all var(--transition-fast);
		border-radius: 0;
	}
	.channel-item:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.channel-item.active {
		color: var(--pop-teal);
	}
	.channel-icon {
		width: 20px;
		height: 20px;
		display: block;
		flex-shrink: 0;
		background-color: currentColor;
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}
	.channel-name {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
		flex: 1;
		text-align: left;
	}
	.channel-meta {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--text-muted);
		flex-shrink: 0;
	}
	.unread-badge {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		min-width: 20px;
		height: 20px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--pop-teal);
		color: var(--text-on-color);
		border-radius: 10px;
		padding: 0 6px;
		flex-shrink: 0;
	}
</style>
