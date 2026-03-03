<script lang="ts">
	import { documents } from '../../data/docs';

	let { activeDoc, onDocChange }: {
		activeDoc: string;
		onDocChange: (id: string) => void;
	} = $props();
</script>

<div class="docs-list">
	{#each documents as doc}
		<button
			class="doc-item"
			class:active={activeDoc === doc.id}
			onclick={() => onDocChange(doc.id)}
		>
			<span
				class="doc-icon"
				style="--icon-url: url('/icons/docs.svg')"
			></span>
			<div class="doc-info">
				<span class="doc-title">{doc.title}</span>
				<span class="doc-meta">{doc.author} &middot; {doc.updated}</span>
			</div>
		</button>
	{/each}
</div>

<style>
	.docs-list {
		padding: var(--space-3) 0;
	}
	.doc-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		width: 100%;
		color: var(--text-secondary);
		transition: all var(--transition-fast);
		border-radius: 0;
	}
	.doc-item:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.doc-item.active {
		color: var(--pop-pink);
	}
	.doc-icon {
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
	.doc-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		text-align: left;
	}
	.doc-title {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
	}
	.doc-meta {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	.doc-item.active .doc-meta {
		color: var(--text-secondary);
	}
</style>
