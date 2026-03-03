<script lang="ts">
	import { toast } from '../../services/toast.svelte';
	import { fly, fade } from 'svelte/transition';
</script>

{#if toast.all.length > 0}
	<div class="toast-container">
		{#each toast.all as t (t.id)}
			<div
				class="toast toast-{t.type}"
				role="alert"
				in:fly={{ x: 80, duration: 250 }}
				out:fade={{ duration: 150 }}
			>
				<span class="toast-icon">
					{#if t.type === 'success'}&#10003;{:else if t.type === 'error'}&#10007;{:else if t.type === 'warning'}&#9888;{:else}&#8505;{/if}
				</span>
				<span class="toast-message">{t.message}</span>
				<button class="toast-dismiss" onclick={() => toast.dismiss(t.id)} aria-label="Dismiss">×</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: var(--space-6);
		right: var(--space-6);
		z-index: 9999;
		display: flex;
		flex-direction: column-reverse;
		gap: var(--space-2);
		pointer-events: none;
		max-width: 400px;
	}
	.toast {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: 8px;
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--text-primary);
		background: var(--app-bg-raised);
		border: 1px solid var(--border-subtle);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
		pointer-events: auto;
	}
	.toast-success {
		border-color: var(--kiwi-green);
		background: linear-gradient(135deg, rgba(124, 179, 66, 0.12), var(--app-bg-raised));
	}
	.toast-error {
		border-color: var(--pop-coral);
		background: linear-gradient(135deg, rgba(255, 112, 67, 0.12), var(--app-bg-raised));
	}
	.toast-warning {
		border-color: var(--pop-amber);
		background: linear-gradient(135deg, rgba(255, 167, 38, 0.12), var(--app-bg-raised));
	}
	.toast-info {
		border-color: var(--pop-blue);
		background: linear-gradient(135deg, rgba(66, 165, 245, 0.12), var(--app-bg-raised));
	}
	.toast-icon {
		flex-shrink: 0;
		font-size: 1rem;
		line-height: 1;
	}
	.toast-success .toast-icon { color: var(--kiwi-bright); }
	.toast-error .toast-icon { color: var(--pop-coral); }
	.toast-warning .toast-icon { color: var(--pop-amber); }
	.toast-info .toast-icon { color: var(--pop-blue); }
	.toast-message {
		flex: 1;
		line-height: 1.4;
	}
	.toast-dismiss {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		color: var(--text-muted);
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		transition: color var(--transition-fast), background var(--transition-fast);
	}
	.toast-dismiss:hover {
		color: var(--text-primary);
		background: var(--app-bg-hover);
	}
</style>
