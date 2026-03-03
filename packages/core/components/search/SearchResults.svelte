<script lang="ts">
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';
	import { results, suggestions } from '../../data/search';
	import { services } from '../../data/services';

	function iconUrl(name: string): string {
		return `/icons/${name}.svg`;
	}

	const activeQuery = $derived(
		suggestions.find(s => s.active)?.query ?? 'deployment checklist'
	);
</script>

<div class="search-results">
	<ServiceBadge label="KIWI SEARCH" icon={iconUrl('search')} color="#7CB342" />

	<h1>{activeQuery}</h1>
	<p class="result-count">{results.length} results across your workspace</p>

	<div class="results-list">
		{#each results as result}
			{@const svc = services[result.service]}
			<div class="result-card" style="--service-color: {svc.color}">
				<div class="result-header">
					<span class="result-service-badge" style="--badge-color: {svc.color}">
						<span
							class="result-service-icon"
							style="--icon-url: url({iconUrl(svc.icon.replace('.svg', ''))})"
						></span>
						{svc.name}
					</span>
					<span class="result-date">{result.date}</span>
				</div>
				<span class="result-title">{result.title}</span>
				<span class="result-snippet">{result.snippet}</span>
			</div>
		{/each}
	</div>

	<div class="button-row">
		<ActionButton label="Open Top Result" variant="primary" />
		<ActionButton label="Show All" variant="secondary" />
	</div>
</div>

<style>
	.search-results {
		padding: var(--space-6) var(--space-10);
		max-width: 720px;
	}
	h1 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 2.2rem;
		line-height: 1.2;
		color: var(--text-primary);
		margin: var(--space-4) 0 var(--space-2);
	}
	.result-count {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--text-muted);
		margin: 0 0 var(--space-6);
	}
	.results-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.result-card {
		padding: var(--space-4);
		border-radius: 8px;
		border: 1px solid var(--border-subtle);
		border-left: 3px solid var(--service-color);
		background: var(--app-bg-raised);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.result-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.result-service-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--badge-color);
	}
	.result-service-icon {
		width: 14px;
		height: 14px;
		display: block;
		background-color: var(--badge-color);
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}
	.result-date {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	.result-title {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
		color: var(--text-primary);
	}
	.result-snippet {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}
	.button-row {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
