<script lang="ts">
	import { folders } from '../../data/store';

	let { activeFolder, onFolderChange }: {
		activeFolder: string;
		onFolderChange: (id: string) => void;
	} = $props();
</script>

<div class="store-list">
	{#each folders as folder}
		<button
			class="folder-item"
			class:active={activeFolder === folder.id}
			onclick={() => onFolderChange(folder.id)}
		>
			<span
				class="folder-icon"
				style="--icon-url: url('/icons/files.svg')"
			></span>
			<span class="folder-name">{folder.name}</span>
			<span class="file-count">{folder.files}</span>
		</button>
	{/each}
</div>

<style>
	.store-list {
		padding: var(--space-3) 0;
	}
	.folder-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		width: 100%;
		color: var(--text-secondary);
		transition: all var(--transition-fast);
		border-radius: 0;
	}
	.folder-item:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.folder-item.active {
		color: var(--pop-amber);
	}
	.folder-icon {
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
		flex-shrink: 0;
	}
	.folder-name {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
		flex: 1;
		text-align: left;
	}
	.file-count {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
		background: var(--app-bg-surface);
		padding: 2px 8px;
		border-radius: 10px;
	}
</style>
