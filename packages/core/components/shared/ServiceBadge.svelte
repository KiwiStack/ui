<script lang="ts">
	let { label, icon, color }: { label: string; icon: string; color: string } = $props();
</script>

<span class="service-badge" style="--badge-color: {color}">
	<span class="badge-icon" style="--icon-url: url('{icon}')"></span>
	{label}
</span>

<style>
	.service-badge {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--badge-color);
		background: transparent;
		border: 1.5px solid var(--badge-color);
		border-radius: 20px;
		padding: 4px 14px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
	}
	.badge-icon {
		width: 16px;
		height: 16px;
		display: inline-block;
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
</style>
