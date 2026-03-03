<script lang="ts">
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';
	import { movePlan } from '../../data/store';

	function iconUrl(name: string): string {
		return `/icons/${name}.svg`;
	}
</script>

<div class="store-move">
	<ServiceBadge label="KIWI STORE" icon={iconUrl('files')} color="#FFA726" />

	<h1>File Organization Plan</h1>

	<div class="source-info">
		<span class="source-label">Source:</span>
		<span class="source-folder">{movePlan.source}</span>
		<span class="source-count">{movePlan.totalFiles} files</span>
	</div>

	<div class="move-cards">
		{#each movePlan.moves as move}
			<div class="move-card">
				<div class="move-header">
					<span
						class="move-icon"
						style="--icon-url: url({iconUrl('files')})"
					></span>
					<span class="move-folder">{move.folder}</span>
					<span class="move-count">{move.count} files</span>
				</div>
				<span class="move-pattern">{move.pattern}</span>
			</div>
		{/each}
	</div>

	<div class="button-row">
		<ActionButton label="Move All" variant="primary" />
		<ActionButton label="Review" variant="secondary" />
	</div>
</div>

<style>
	.store-move {
		padding: var(--space-6) var(--space-10);
		max-width: 720px;
	}
	h1 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 2.2rem;
		line-height: 1.2;
		color: var(--text-primary);
		margin: var(--space-4) 0 var(--space-6);
	}
	.source-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-6);
		padding: var(--space-3) var(--space-4);
		background: var(--app-bg-surface);
		border-radius: 8px;
	}
	.source-label {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--text-muted);
	}
	.source-folder {
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--text-primary);
	}
	.source-count {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-left: auto;
		background: var(--app-bg);
		padding: 2px 8px;
		border-radius: 10px;
	}
	.move-cards {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.move-card {
		padding: var(--space-4);
		border-radius: 8px;
		border: 1.5px solid var(--pop-amber);
		background: var(--app-bg-raised);
	}
	.move-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-2);
	}
	.move-icon {
		width: 18px;
		height: 18px;
		display: block;
		background-color: var(--pop-amber);
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
	.move-folder {
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--text-primary);
		flex: 1;
	}
	.move-count {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
		background: var(--app-bg-surface);
		padding: 2px 8px;
		border-radius: 10px;
	}
	.move-pattern {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-muted);
		padding-left: 30px;
	}
	.button-row {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
