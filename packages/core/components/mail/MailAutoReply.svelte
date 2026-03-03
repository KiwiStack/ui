<script lang="ts">
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';
	import { autoReplyData } from '../../data/mail';

	function iconUrl(name: string): string {
		return `/icons/${name}.svg`;
	}
</script>

<div class="auto-reply">
	<ServiceBadge label="KIWI MAIL" icon={iconUrl('mail')} color="#FF7043" />

	<h1>Automatic Replies</h1>

	<div class="radio-group">
		<label class="radio-option">
			<input type="radio" name="auto-reply" value="off" />
			<span>Don't send automatic replies</span>
		</label>
		<label class="radio-option highlighted">
			<input type="radio" name="auto-reply" value="on" checked />
			<span>Send automatic replies</span>
		</label>
	</div>

	<div class="divider"></div>

	<label class="checkbox-option highlighted">
		<input type="checkbox" checked />
		<span>Only during this time range</span>
	</label>

	<div class="field-row highlighted">
		<label class="field-label">Start</label>
		<div class="field-value">{autoReplyData.startDate}</div>
	</div>

	<div class="field-row highlighted">
		<label class="field-label">End</label>
		<div class="field-value">{autoReplyData.endDate}</div>
	</div>

	<div class="divider"></div>

	<label class="message-label">Message</label>
	<div class="message-field highlighted">
		<p>{autoReplyData.message}</p>
	</div>

	<div class="button-row">
		<ActionButton label="Apply" variant="primary" />
		<ActionButton label="Edit" variant="secondary" />
	</div>
</div>

<style>
	.auto-reply {
		padding: var(--space-6) var(--space-8);
	}
	h1 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.6rem;
		line-height: 1.2;
		color: var(--text-primary);
		margin: var(--space-4) 0 var(--space-5);
	}
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.radio-option, .checkbox-option {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: 8px;
		border: 1.5px solid transparent;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--text-primary);
		cursor: pointer;
	}
	.highlighted {
		border-color: var(--pop-coral);
	}
	input[type="radio"], input[type="checkbox"] {
		accent-color: var(--pop-coral);
		width: 16px;
		height: 16px;
	}
	.divider {
		height: 1px;
		background: var(--border-subtle);
		margin: var(--space-4) 0;
	}
	.field-row {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		border-radius: 8px;
		border: 1.5px solid transparent;
		margin-bottom: var(--space-3);
	}
	.field-label {
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.95rem;
		color: var(--text-muted);
		min-width: 40px;
	}
	.field-value {
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--text-primary);
		background: var(--app-bg-surface);
		padding: var(--space-2) var(--space-3);
		border-radius: 4px;
	}
	.message-label {
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--text-muted);
		display: block;
		margin-bottom: var(--space-3);
	}
	.message-field {
		padding: var(--space-4);
		border-radius: 8px;
		border: 1.5px solid transparent;
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-primary);
	}
	.message-field p {
		margin: 0;
	}
	.button-row {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
