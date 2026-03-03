<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	let { initialContent = '', onReady }: {
		initialContent?: string;
		onReady?: (editor: Editor) => void;
	} = $props();

	let editorElement: HTMLDivElement;
	let editor: Editor | null = $state(null);

	// Toolbar state
	let isBold = $state(false);
	let isItalic = $state(false);
	let isBulletList = $state(false);
	let isOrderedList = $state(false);
	let isBlockquote = $state(false);

	function updateToolbar() {
		if (!editor) return;
		isBold = editor.isActive('bold');
		isItalic = editor.isActive('italic');
		isBulletList = editor.isActive('bulletList');
		isOrderedList = editor.isActive('orderedList');
		isBlockquote = editor.isActive('blockquote');
	}

	onMount(() => {
		editor = new Editor({
			element: editorElement,
			extensions: [StarterKit],
			content: initialContent,
			onTransaction: () => {
				updateToolbar();
			},
		});
		if (onReady) onReady(editor);
	});

	onDestroy(() => {
		editor?.destroy();
	});

	export function getHTML(): string {
		return editor?.getHTML() ?? '';
	}

	export function getEditor(): Editor | null {
		return editor;
	}
</script>

<div class="editor-wrapper">
	<div class="toolbar">
		<button
			class="tb-btn"
			class:active={isBold}
			onclick={() => editor?.chain().focus().toggleBold().run()}
			title="Bold"
		><strong>B</strong></button>
		<button
			class="tb-btn"
			class:active={isItalic}
			onclick={() => editor?.chain().focus().toggleItalic().run()}
			title="Italic"
		><em>I</em></button>
		<span class="tb-sep"></span>
		<button
			class="tb-btn"
			class:active={isBulletList}
			onclick={() => editor?.chain().focus().toggleBulletList().run()}
			title="Bulleted List"
		>&#8226;</button>
		<button
			class="tb-btn"
			class:active={isOrderedList}
			onclick={() => editor?.chain().focus().toggleOrderedList().run()}
			title="Numbered List"
		>1.</button>
		<button
			class="tb-btn"
			class:active={isBlockquote}
			onclick={() => editor?.chain().focus().toggleBlockquote().run()}
			title="Blockquote"
		>&rdquo;</button>
	</div>
	<div class="editor-content" bind:this={editorElement}></div>
</div>

<style>
	.editor-wrapper {
		border: 1.5px solid var(--border-subtle);
		border-radius: 6px;
		overflow: hidden;
		background: var(--app-bg-surface);
	}
	.toolbar {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: var(--space-1) var(--space-2);
		border-bottom: 1px solid var(--border-subtle);
		background: var(--app-bg);
	}
	.tb-btn {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border-radius: 4px;
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.tb-btn:hover {
		background: var(--app-bg-hover);
		color: var(--text-primary);
	}
	.tb-btn.active {
		background: var(--app-bg-surface);
		color: var(--pop-coral);
	}
	.tb-sep {
		width: 1px;
		height: 16px;
		background: var(--border-subtle);
		margin: 0 var(--space-1);
	}
	.editor-content {
		min-height: 200px;
		padding: var(--space-3) var(--space-4);
	}
	.editor-content :global(.tiptap) {
		outline: none;
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-primary);
	}
	.editor-content :global(.tiptap p) {
		margin: 0 0 0.5em;
	}
	.editor-content :global(.tiptap blockquote) {
		border-left: 3px solid var(--border-subtle);
		padding-left: var(--space-3);
		color: var(--text-secondary);
		margin: 0.5em 0;
	}
	.editor-content :global(.tiptap ul),
	.editor-content :global(.tiptap ol) {
		padding-left: 1.5em;
		margin: 0.5em 0;
	}
	.editor-content :global(.tiptap a) {
		color: var(--pop-coral);
	}
	.editor-content :global(.tiptap hr) {
		border: none;
		border-top: 1px solid var(--border-subtle);
		margin: 1em 0;
	}
</style>
