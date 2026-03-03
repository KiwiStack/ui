<script lang="ts">
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';
	import { standupDraft } from '../../data/chat';

	function iconUrl(name: string): string {
		return `/icons/${name}.svg`;
	}

	interface Segment {
		bold: boolean;
		text: string;
	}

	function parseContent(content: string): Segment[][] {
		const paragraphs = content.split('\n\n');
		return paragraphs.map((para) => {
			const segments: Segment[] = [];
			const regex = /\*\*(.+?)\*\*/g;
			let lastIndex = 0;
			let match: RegExpExecArray | null;
			while ((match = regex.exec(para)) !== null) {
				if (match.index > lastIndex) {
					segments.push({ bold: false, text: para.slice(lastIndex, match.index) });
				}
				segments.push({ bold: true, text: match[1] });
				lastIndex = regex.lastIndex;
			}
			if (lastIndex < para.length) {
				segments.push({ bold: false, text: para.slice(lastIndex) });
			}
			return segments;
		});
	}

	const paragraphs = $derived(parseContent(standupDraft.content));
</script>

<div class="post-draft">
	<ServiceBadge label="KIWI CHAT" icon={iconUrl('chat')} color="#26A69A" />

	<h1>{standupDraft.title}</h1>

	<div class="channel-target">
		Posting to <strong>{standupDraft.channel}</strong>
	</div>

	<div class="draft-content">
		{#each paragraphs as segments}
			<p>
				{#each segments as segment}
					{#if segment.bold}
						<strong>{segment.text}</strong>
					{:else}
						{segment.text}
					{/if}
				{/each}
			</p>
		{/each}
	</div>

	<div class="button-row">
		<ActionButton label="Apply" variant="primary" />
		<ActionButton label="Edit" variant="secondary" />
	</div>
</div>

<style>
	.post-draft {
		padding: var(--space-6) var(--space-10);
		max-width: 720px;
	}
	h1 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 2.2rem;
		line-height: 1.2;
		color: var(--text-primary);
		margin: var(--space-4) 0 var(--space-4);
	}
	.channel-target {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin-bottom: var(--space-6);
	}
	.channel-target strong {
		color: var(--pop-teal);
		font-weight: 600;
	}
	.draft-content {
		padding: var(--space-4);
		border-radius: 8px;
		border: 1.5px solid var(--pop-teal);
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-primary);
	}
	.draft-content p {
		margin: 0 0 var(--space-3);
	}
	.draft-content p:last-child {
		margin-bottom: 0;
	}
	.draft-content strong {
		font-weight: 700;
		color: var(--text-primary);
	}
	.button-row {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
