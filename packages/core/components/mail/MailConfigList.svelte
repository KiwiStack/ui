<script lang="ts">
	let { activeItem, onItemChange }: {
		activeItem: string;
		onItemChange: (id: string) => void;
	} = $props();

	const configItems = [
		{ id: 'auto-reply', label: 'Auto-reply', icon: 'mail' },
		{ id: 'signatures', label: 'Signatures', icon: 'docs' },
		{ id: 'filters', label: 'Filters', icon: 'search' },
		{ id: 'folders', label: 'Folders', icon: 'files' },
		{ id: 'security', label: 'Security', icon: 'lock' },
	];
</script>

<div class="config-list">
	{#each configItems as item}
		<button
			class="config-item"
			class:active={activeItem === item.id}
			onclick={() => onItemChange(item.id)}
		>
			<span
				class="item-icon"
				style="--icon-url: url('/icons/{item.icon}.svg')"
			></span>
			<span class="item-label">{item.label}</span>
		</button>
	{/each}
</div>

<style>
	.config-list {
		padding: var(--space-3) 0;
	}
	.config-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		width: 100%;
		color: var(--text-secondary);
		transition: all var(--transition-fast);
		border-radius: 0;
	}
	.config-item:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.config-item.active {
		color: var(--pop-coral);
	}
	.item-icon {
		width: 20px;
		height: 20px;
		display: block;
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
	.item-label {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
	}
</style>
