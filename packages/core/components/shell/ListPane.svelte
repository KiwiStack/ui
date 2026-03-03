<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<aside class="list-pane">
	{@render children()}
</aside>

<style>
	.list-pane {
		width: 260px;
		min-width: 200px;
		height: 100%;
		overflow-y: auto;
		border-right: 1px solid var(--border-subtle);
	}
</style>
