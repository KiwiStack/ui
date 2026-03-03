<script lang="ts">
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';
	import { getMailService } from '../../services/index';
	import { toast } from '../../services/toast.svelte';

	let isEnabled = $state(false);
	let useTimeRange = $state(false);
	let fromDate = $state('');
	let toDate = $state('');
	let subject = $state('');
	let textBody = $state('');
	let loading = $state(true);
	let saving = $state(false);

	async function loadVacation() {
		loading = true;
		try {
			const v = await getMailService().getVacation();
			isEnabled = v.is_enabled;
			fromDate = v.from_date ?? '';
			toDate = v.to_date ?? '';
			subject = v.subject ?? '';
			textBody = v.text_body ?? '';
			useTimeRange = !!(v.from_date || v.to_date);
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to load auto-reply settings');
		} finally {
			loading = false;
		}
	}

	async function handleApply() {
		saving = true;
		try {
			await getMailService().setVacation({
				is_enabled: isEnabled,
				from_date: useTimeRange && fromDate ? fromDate : null,
				to_date: useTimeRange && toDate ? toDate : null,
				subject: subject || null,
				text_body: textBody || null,
				html_body: null,
			});
			toast.show('success', 'Auto-reply settings saved.');
		} catch (e) {
			toast.show('error', e instanceof Error ? e.message : 'Failed to save auto-reply settings');
		} finally {
			saving = false;
		}
	}

	// Load on mount
	loadVacation();

	function iconUrl(name: string): string {
		return `/icons/${name}.svg`;
	}
</script>

<div class="auto-reply">
	<ServiceBadge label="KIWI MAIL" icon={iconUrl('mail')} color="#FF7043" />

	<h1>Automatic Replies</h1>

	{#if loading}
		<div class="status-msg">Loading…</div>
	{:else}
		<div class="radio-group">
			<label class="radio-option" class:highlighted={!isEnabled}>
				<input type="radio" name="auto-reply" bind:group={isEnabled} value={false} />
				<span>Don't send automatic replies</span>
			</label>
			<label class="radio-option" class:highlighted={isEnabled}>
				<input type="radio" name="auto-reply" bind:group={isEnabled} value={true} />
				<span>Send automatic replies</span>
			</label>
		</div>

		{#if isEnabled}
			<div class="divider"></div>

			<label class="checkbox-option" class:highlighted={useTimeRange}>
				<input type="checkbox" bind:checked={useTimeRange} />
				<span>Only during this time range</span>
			</label>

			{#if useTimeRange}
				<div class="field-row highlighted">
					<label class="field-label">Start</label>
					<input type="datetime-local" class="field-input" bind:value={fromDate} />
				</div>

				<div class="field-row highlighted">
					<label class="field-label">End</label>
					<input type="datetime-local" class="field-input" bind:value={toDate} />
				</div>
			{/if}

			<div class="divider"></div>

			<label class="field-label-block">Subject</label>
			<input type="text" class="text-input" bind:value={subject} placeholder="Auto-reply subject" />

			<label class="field-label-block">Message</label>
			<textarea class="message-input" bind:value={textBody} rows="5" placeholder="Your auto-reply message..."></textarea>
		{/if}

		<div class="button-row">
			<ActionButton label={saving ? 'Saving…' : 'Apply'} variant="primary" onClick={handleApply} />
		</div>
	{/if}
</div>

<style>
	.auto-reply {
		padding: var(--space-6) var(--space-8);
		max-width: 600px;
	}
	h1 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.6rem;
		line-height: 1.2;
		color: var(--text-primary);
		margin: var(--space-4) 0 var(--space-5);
	}
	.status-msg {
		padding: var(--space-4);
		color: var(--text-secondary);
		font-family: var(--font-body);
		font-size: 0.9rem;
		text-align: center;
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
	.field-label-block {
		display: block;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--text-muted);
		margin-bottom: var(--space-2);
		margin-top: var(--space-3);
	}
	.field-input {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--text-primary);
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 4px;
		padding: var(--space-2) var(--space-3);
	}
	.text-input {
		width: 100%;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--text-primary);
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		padding: var(--space-2) var(--space-3);
		margin-bottom: var(--space-2);
	}
	.message-input {
		width: 100%;
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-primary);
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		padding: var(--space-3) var(--space-4);
		resize: vertical;
	}
	.button-row {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
