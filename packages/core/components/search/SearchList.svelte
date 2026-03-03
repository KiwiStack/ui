<script lang="ts">
	import { suggestions } from '../../data/search';

	let { activeQuery, onQueryChange }: {
		activeQuery: string;
		onQueryChange: (id: string) => void;
	} = $props();

	const sourceColors: Record<string, string> = {
		Recent: 'var(--text-muted)',
		Trending: '#FF7043',
		Saved: '#7CB342',
	};
</script>

<div class="search-list">
	{#each suggestions as suggestion}
		<button
			class="suggestion-item"
			class:active={activeQuery === suggestion.id}
			onclick={() => onQueryChange(suggestion.id)}
		>
			<span
				class="search-icon"
				style="--icon-url: url('/icons/search.svg')"
			></span>
			<span class="suggestion-query">{suggestion.query}</span>
			<span class="source-tag" style="--source-color: {sourceColors[suggestion.source] ?? 'var(--text-muted)'}">
				{suggestion.source}
			</span>
		</button>
	{/each}
</div>

<style>
	.search-list {
		padding: var(--space-3) 0;
	}
	.suggestion-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		width: 100%;
		color: var(--text-secondary);
		transition: all var(--transition-fast);
		border-radius: 0;
	}
	.suggestion-item:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.suggestion-item.active {
		color: var(--kiwi-green);
	}
	.search-icon {
		width: 18px;
		height: 18px;
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
	.suggestion-query {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
		flex: 1;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.source-tag {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--source-color);
		border: 1px solid var(--source-color);
		border-radius: 4px;
		padding: 1px 6px;
		flex-shrink: 0;
	}
</style>
