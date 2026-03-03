<script lang="ts">
	import { meetings } from '../../data/meet';

	let { activeMeeting, onMeetingChange }: {
		activeMeeting: string;
		onMeetingChange: (id: string) => void;
	} = $props();
</script>

<div class="meeting-list">
	{#each meetings as meeting}
		<button
			class="meeting-item"
			class:active={activeMeeting === meeting.id}
			onclick={() => onMeetingChange(meeting.id)}
		>
			<span
				class="meeting-icon"
				style="--icon-url: url('/icons/meet.svg')"
			></span>
			<div class="meeting-info">
				<span class="meeting-title">{meeting.title}</span>
				<span class="meeting-time">{meeting.time}</span>
			</div>
			<span class="attendee-count">{meeting.attendees}</span>
		</button>
	{/each}
</div>

<style>
	.meeting-list {
		padding: var(--space-3) 0;
	}
	.meeting-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		width: 100%;
		color: var(--text-secondary);
		transition: all var(--transition-fast);
		border-radius: 0;
	}
	.meeting-item:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.meeting-item.active {
		color: var(--pop-blue);
	}
	.meeting-icon {
		width: 20px;
		height: 20px;
		display: block;
		flex-shrink: 0;
		background-color: currentColor;
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}
	.meeting-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		text-align: left;
	}
	.meeting-title {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
	}
	.meeting-time {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	.meeting-item.active .meeting-time {
		color: var(--text-secondary);
	}
	.attendee-count {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-muted);
		flex-shrink: 0;
	}
	.attendee-count::after {
		content: ' att.';
	}
</style>
