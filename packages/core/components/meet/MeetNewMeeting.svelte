<script lang="ts">
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';
	import { newMeeting } from '../../data/meet';

	function iconUrl(name: string): string {
		return `/icons/${name}.svg`;
	}

	const agendaItems = $derived(
		newMeeting.agenda.split('\n').filter((line) => line.trim().length > 0)
	);
</script>

<div class="new-meeting">
	<ServiceBadge label="KIWI MEET" icon={iconUrl('meet')} color="#42A5F5" />

	<h1>New Meeting</h1>

	<div class="field-row highlighted">
		<label class="field-label">Title</label>
		<div class="field-value">{newMeeting.title}</div>
	</div>

	<div class="field-row highlighted">
		<label class="field-label">Date</label>
		<div class="field-value">{newMeeting.date}</div>
	</div>

	<div class="field-row highlighted">
		<label class="field-label">Time</label>
		<div class="field-value">{newMeeting.time}</div>
	</div>

	<div class="field-row highlighted">
		<label class="field-label">Duration</label>
		<div class="field-value">{newMeeting.duration}</div>
	</div>

	<div class="divider"></div>

	<label class="section-label">Attendees</label>
	<div class="attendees-row highlighted">
		{#each newMeeting.attendees as attendee}
			<span class="attendee-chip">{attendee}</span>
		{/each}
	</div>

	<div class="divider"></div>

	<label class="section-label">Agenda</label>
	<div class="agenda highlighted">
		<ol class="agenda-list">
			{#each agendaItems as item}
				<li>{item.replace(/^\d+\.\s*/, '')}</li>
			{/each}
		</ol>
	</div>

	<div class="button-row">
		<ActionButton label="Schedule" variant="primary" />
		<ActionButton label="Edit" variant="secondary" />
	</div>
</div>

<style>
	.new-meeting {
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
	.field-row {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		border-radius: 8px;
		border: 1.5px solid transparent;
		margin-bottom: var(--space-3);
	}
	.highlighted {
		border-color: var(--pop-blue);
	}
	.field-label {
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.95rem;
		color: var(--text-muted);
		min-width: 60px;
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
	.divider {
		height: 1px;
		background: var(--border-subtle);
		margin: var(--space-4) 0;
	}
	.section-label {
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--text-muted);
		display: block;
		margin-bottom: var(--space-3);
	}
	.attendees-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		border-radius: 8px;
		border: 1.5px solid transparent;
	}
	.attendee-chip {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--pop-blue);
		background: rgba(66, 165, 245, 0.1);
		padding: var(--space-1) var(--space-3);
		border-radius: 16px;
		border: 1px solid rgba(66, 165, 245, 0.3);
	}
	.agenda {
		padding: var(--space-4);
		border-radius: 8px;
		border: 1.5px solid transparent;
	}
	.agenda-list {
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.8;
		color: var(--text-primary);
		margin: 0;
		padding-left: var(--space-6);
	}
	.agenda-list li {
		padding-left: var(--space-2);
	}
	.button-row {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
