<script lang="ts">
	import type { ServiceId } from '../../data/services';

	let { activeService, onServiceChange }: {
		activeService: ServiceId;
		onServiceChange: (id: ServiceId) => void;
	} = $props();

	const serviceIcons: { id: ServiceId; icon: string }[] = [
		{ id: 'mail', icon: 'mail' },
		{ id: 'chat', icon: 'chat' },
		{ id: 'meet', icon: 'meet' },
		{ id: 'docs', icon: 'docs' },
		{ id: 'work', icon: 'tasks' },
		{ id: 'store', icon: 'files' },
		{ id: 'search', icon: 'search' },
	];

	const serviceColors: Record<ServiceId, string> = {
		mail: '#FF7043',
		chat: '#26A69A',
		meet: '#42A5F5',
		docs: '#EC407A',
		work: '#AB47BC',
		store: '#FFA726',
		search: '#7CB342',
	};
</script>

<nav class="sidebar">
	<div class="sidebar-top">
		<button class="logo-btn">
			<img src="/icons/kiwi-logo-small.svg" alt="Kiwi" class="logo" />
		</button>
	</div>

	<div class="sidebar-icons">
		{#each serviceIcons as svc}
			<button
				class="icon-btn"
				class:active={activeService === svc.id}
				style="--svc-color: {serviceColors[svc.id]}"
				onclick={() => onServiceChange(svc.id)}
				title={svc.id}
			>
				<span class="icon-mask" style="--icon-url: url('/icons/{svc.icon}.svg')"></span>
			</button>
		{/each}
	</div>

	<div class="sidebar-bottom">
		<span class="status-dot"></span>
	</div>
</nav>

<style>
	.sidebar {
		width: 64px;
		height: 100vh;
		background: var(--sidebar-bg);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-3) 0;
		grid-row: 1 / -1;
	}
	.sidebar-top {
		margin-bottom: var(--space-6);
	}
	.logo-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition: box-shadow var(--transition-fast);
	}
	.logo-btn:hover {
		box-shadow: 0 0 12px rgba(124, 179, 66, 0.4);
	}
	.logo {
		width: 36px;
		height: 36px;
		border-radius: 50%;
	}
	.sidebar-icons {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		flex: 1;
	}
	.icon-btn {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-fast);
		position: relative;
	}
	.icon-btn:hover {
		background: var(--app-bg-hover);
	}
	.icon-btn.active {
		background: color-mix(in srgb, var(--svc-color) 15%, transparent);
		border: 1.5px solid var(--svc-color);
	}
	.icon-mask {
		width: var(--icon-lg);
		height: var(--icon-lg);
		display: block;
		background-color: var(--svc-color);
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
		transition: background-color var(--transition-fast);
	}
	.sidebar-bottom {
		margin-top: auto;
		padding-top: var(--space-4);
	}
	.status-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--kiwi-green);
		display: block;
	}
</style>
