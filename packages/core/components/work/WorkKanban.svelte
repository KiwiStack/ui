<script lang="ts">
	import ServiceBadge from '../shared/ServiceBadge.svelte';
	import ActionButton from '../shared/ActionButton.svelte';
	import { columns, newTasks } from '../../data/work';

	function iconUrl(name: string): string {
		return `/icons/${name}.svg`;
	}

	const labelColors: Record<string, string> = {
		devops: '#42A5F5',
		backend: '#AB47BC',
		frontend: '#FF7043',
	};
</script>

<div class="work-kanban">
	<ServiceBadge label="KIWI WORK" icon={iconUrl('tasks')} color="#AB47BC" />

	<h1>Sprint Board</h1>

	<div class="kanban-board">
		{#each columns as column}
			<div class="kanban-column">
				<div class="kanban-column-header">
					<span class="kanban-column-title">{column.title}</span>
					<span class="kanban-column-count">{column.tasks.length}</span>
				</div>
				<div class="kanban-cards">
					{#each column.tasks as task}
						<div class="kanban-card">
							<span
								class="priority-dot"
								style="--dot-color: {task.priority === 'high' ? '#FF7043' : task.priority === 'medium' ? '#FFA726' : '#7CB342'}"
							></span>
							<div class="card-body">
								<span class="card-title">{task.title}</span>
								<span class="card-labels">
									{#each task.labels as label}
										<span class="label-tag" style="--label-color: {labelColors[label] ?? 'var(--text-muted)'}">
											{label}
										</span>
									{/each}
								</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<div class="divider"></div>

	<h2>AI-suggested tasks</h2>
	<div class="new-tasks">
		{#each newTasks as task}
			<div class="new-task-card">
				<div class="new-task-header">
					<span class="new-task-title">{task.title}</span>
					<span class="label-tag" style="--label-color: {labelColors[task.label] ?? 'var(--text-muted)'}">
						{task.label}
					</span>
				</div>
				<span class="new-task-source">{task.source}</span>
			</div>
		{/each}
	</div>

	<div class="button-row">
		<ActionButton label="Create All" variant="primary" />
		<ActionButton label="Edit" variant="secondary" />
	</div>
</div>

<style>
	.work-kanban {
		padding: var(--space-6) var(--space-10);
		max-width: 900px;
	}
	h1 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 2.2rem;
		line-height: 1.2;
		color: var(--text-primary);
		margin: var(--space-4) 0 var(--space-6);
	}
	h2 {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.2rem;
		color: var(--text-primary);
		margin: 0 0 var(--space-4);
	}
	.kanban-board {
		display: flex;
		gap: var(--space-4);
	}
	.kanban-column {
		flex: 1;
		min-width: 0;
		background: var(--app-bg-surface);
		border-radius: 8px;
		padding: var(--space-3);
	}
	.kanban-column-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
		padding: 0 var(--space-2);
	}
	.kanban-column-title {
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}
	.kanban-column-count {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
		background: var(--app-bg);
		padding: 2px 8px;
		border-radius: 10px;
	}
	.kanban-cards {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.kanban-card {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--app-bg-raised);
		border-radius: 6px;
		border: 1px solid var(--border-subtle);
	}
	.priority-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--dot-color);
		flex-shrink: 0;
		margin-top: 5px;
	}
	.card-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}
	.card-title {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--text-primary);
		line-height: 1.3;
	}
	.card-labels {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
	.label-tag {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--label-color);
		border: 1px solid var(--label-color);
		border-radius: 4px;
		padding: 1px 6px;
		opacity: 0.85;
	}
	.divider {
		height: 1px;
		background: var(--border-subtle);
		margin: var(--space-6) 0;
	}
	.new-tasks {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.new-task-card {
		padding: var(--space-4);
		border-radius: 8px;
		border: 1.5px solid var(--pop-purple);
		background: var(--app-bg-raised);
	}
	.new-task-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		margin-bottom: var(--space-2);
	}
	.new-task-title {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
		color: var(--text-primary);
	}
	.new-task-source {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--text-muted);
		font-style: italic;
	}
	.button-row {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
