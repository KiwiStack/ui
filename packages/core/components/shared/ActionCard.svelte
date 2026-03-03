<script lang="ts">
	let { label, icon, color }: { label: string; icon: string; color: string } = $props();
</script>

<button class="action-card" style="--card-color: {color}">
	<span class="card-icon" style="--icon-url: url('{icon}')"></span>
	<span class="card-label">{label}</span>
</button>

<style>
	.action-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--assistant-action-bg);
		border: 1px solid var(--assistant-action-border);
		border-radius: 10px;
		cursor: pointer;
		width: 100%;
		transition: border-color var(--transition-fast);
	}
	.action-card:hover {
		border-color: var(--card-color);
	}
	.card-icon {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		display: block;
		background-color: var(--card-color);
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}
	.card-label {
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--card-color);
	}
</style>
