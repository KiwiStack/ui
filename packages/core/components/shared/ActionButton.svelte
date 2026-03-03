<script lang="ts">
	let { label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' } = $props();
</script>

<button class="action-btn" class:primary={variant === 'primary'} class:secondary={variant === 'secondary'}>
	{label}
</button>

<style>
	.action-btn {
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9rem;
		padding: 10px 24px;
		border-radius: 8px;
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.primary {
		color: var(--text-primary);
		background: transparent;
		border: 2px dashed transparent;
		background-image: none;
		position: relative;
	}
	.primary::before {
		content: '';
		position: absolute;
		inset: -2px;
		border-radius: 10px;
		padding: 2px;
		background: conic-gradient(
			from var(--angle, 0deg),
			var(--kiwi-green),
			var(--pop-amber),
			var(--pop-pink),
			var(--pop-purple),
			var(--kiwi-green)
		);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		animation: rotate-border 3s linear infinite;
	}
	@keyframes rotate-border {
		to { --angle: 360deg; }
	}
	@property --angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}
	.primary:hover {
		background: rgba(124, 179, 66, 0.1);
	}
	.secondary {
		color: var(--text-secondary);
		background: transparent;
		border: 1.5px solid var(--border-subtle);
	}
	.secondary:hover {
		color: var(--text-primary);
		border-color: var(--text-secondary);
	}
</style>
