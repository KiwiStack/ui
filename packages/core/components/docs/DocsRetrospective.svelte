<script lang="ts">
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';
	import { retrospective } from '../../data/docs';

	function iconUrl(name: string): string {
		return `/icons/${name}.svg`;
	}
</script>

<div class="retrospective">
	<ServiceBadge label="KIWI DOCS" icon={iconUrl('docs')} color="#EC407A" />

	<h1>{retrospective.title}</h1>

	{#each retrospective.sections as section}
		<div class="section">
			<h2>{section.heading}</h2>
			<ul class="section-items">
				{#each section.items as item}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	{/each}

	<div class="button-row">
		<ActionButton label="Create" variant="primary" />
		<ActionButton label="Share" variant="secondary" />
	</div>
</div>

<style>
	.retrospective {
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
	.section {
		margin-bottom: var(--space-6);
	}
	h2 {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.3rem;
		color: var(--pop-pink);
		margin: 0 0 var(--space-3);
	}
	.section-items {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.section-items li {
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-primary);
		padding: var(--space-2) 0;
		padding-left: var(--space-5);
		position: relative;
	}
	.section-items li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--pop-pink);
		opacity: 0.6;
	}
	.button-row {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
