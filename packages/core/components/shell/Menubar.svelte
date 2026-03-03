<script lang="ts">
	let { tabs, activeTab, serviceColor, onTabChange }: {
		tabs: string[];
		activeTab: string;
		serviceColor: string;
		onTabChange: (tab: string) => void;
	} = $props();
</script>

<div class="menubar" style="--svc-color: {serviceColor}">
	{#each tabs as tab}
		<button
			class="tab"
			class:active={activeTab === tab}
			onclick={() => onTabChange(tab)}
		>
			{tab}
		</button>
	{/each}
</div>

<style>
	.menubar {
		display: flex;
		gap: var(--space-6);
		padding: 0 var(--space-4);
		border-bottom: 1px solid var(--border-subtle);
		grid-column: 2 / -1;
		min-height: 44px;
	}
	.tab {
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-secondary);
		padding: var(--space-3) 0;
		border-bottom: 2px solid transparent;
		transition: all var(--transition-fast);
		white-space: nowrap;
	}
	.tab:hover:not(.active) {
		color: var(--text-primary);
	}
	.tab.active {
		color: var(--svc-color);
		border-bottom-color: var(--svc-color);
	}
</style>
