<script lang="ts">
	import ActionCard from '../shared/ActionCard.svelte';

	type ChatMessage = { role: 'user' | 'ai'; content: string };
	type ActionItem = { id: string; label: string; icon: string; color: string };

	let { messages, actions }: {
		messages: ChatMessage[];
		actions: ActionItem[];
	} = $props();

	function iconUrl(name: string): string {
		return `/icons/${name}.svg`;
	}
</script>

<aside class="assistant">
	<header class="assistant-header">
		<h2>AI Assistant</h2>
	</header>

	<div class="assistant-messages">
		{#each messages as msg}
			<div class="msg" class:user={msg.role === 'user'} class:ai={msg.role === 'ai'}>
				<p>{msg.content}</p>
			</div>
		{/each}

		{#if actions.length > 0}
			<div class="actions">
				{#each actions as action}
					<ActionCard label={action.label} icon={iconUrl(action.icon)} color={action.color} />
				{/each}
			</div>
		{/if}
	</div>

	<div class="assistant-input">
		<div class="input-field">
			<span class="cursor"></span>
		</div>
	</div>
</aside>

<style>
	.assistant {
		width: 300px;
		min-width: 280px;
		background: var(--assistant-bg);
		display: flex;
		flex-direction: column;
		height: 100%;
		border-left: 1px solid var(--border-subtle);
	}
	.assistant-header {
		padding: var(--space-4) var(--space-4);
		border-bottom: 1px solid var(--border-subtle);
	}
	.assistant-header h2 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--kiwi-green);
	}
	.assistant-messages {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		justify-content: flex-end;
	}
	.msg {
		padding: var(--space-3) var(--space-4);
		border-radius: 12px;
		max-width: 95%;
		line-height: 1.5;
	}
	.msg p {
		font-size: 0.9rem;
	}
	.msg.user {
		background: var(--assistant-user-msg);
		color: var(--text-on-color);
		align-self: flex-end;
	}
	.msg.ai {
		background: var(--assistant-ai-msg);
		color: var(--text-primary);
		align-self: flex-start;
	}
	.actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.assistant-input {
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid var(--border-subtle);
	}
	.input-field {
		background: var(--app-bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 8px;
		padding: var(--space-3) var(--space-4);
		min-height: 40px;
		display: flex;
		align-items: center;
	}
	.cursor {
		width: 2px;
		height: 18px;
		background: var(--kiwi-green);
		animation: blink 1s step-end infinite;
	}
	@keyframes blink {
		50% { opacity: 0; }
	}
</style>
