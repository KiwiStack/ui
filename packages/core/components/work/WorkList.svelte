<script lang="ts">
	import { columns } from '../../data/work';

	let { activeView, onViewChange }: {
		activeView: string;
		onViewChange: (id: string) => void;
	} = $props();

	const labelColors: Record<string, string> = {
		devops: '#42A5F5',
		backend: '#AB47BC',
		frontend: '#FF7043',
	};
</script>

<div class="work-list">
	{#each columns as column}
		<div class="column-group">
			<div class="column-header">
				<span class="column-title">{column.title}</span>
				<span class="column-count">{column.tasks.length}</span>
			</div>
			{#each column.tasks as task}
				<button
					class="task-item"
					class:active={activeView === task.id}
					onclick={() => onViewChange(task.id)}
				>
					<span
						class="priority-dot"
						style="--dot-color: {task.priority === 'high' ? '#FF7043' : task.priority === 'medium' ? '#FFA726' : '#7CB342'}"
					></span>
					<span class="task-content">
						<span class="task-title">{task.title}</span>
						<span class="task-labels">
							{#each task.labels as label}
								<span class="label-tag" style="--label-color: {labelColors[label] ?? 'var(--text-muted)'}">
									{label}
								</span>
							{/each}
						</span>
					</span>
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.work-list {
		padding: var(--space-3) 0;
	}
	.column-group {
		margin-bottom: var(--space-2);
	}
	.column-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-2) var(--space-4);
	}
	.column-title {
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}
	.column-count {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
		background: var(--app-bg-surface);
		padding: 2px 8px;
		border-radius: 10px;
	}
	.task-item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		width: 100%;
		color: var(--text-secondary);
		transition: all var(--transition-fast);
		border-radius: 0;
	}
	.task-item:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.task-item.active {
		background: var(--app-bg-active);
		color: var(--pop-purple);
	}
	.priority-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--dot-color);
		flex-shrink: 0;
		margin-top: 6px;
	}
	.task-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}
	.task-title {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.task-labels {
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
</style>
