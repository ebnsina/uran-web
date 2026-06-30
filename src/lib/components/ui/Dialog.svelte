<!--
  Modal dialog built on the native <dialog> element. Bind `open`; renders a
  titled panel with a backdrop. Closes on Escape, backdrop click, and the X.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';

	interface Props {
		open: boolean;
		title: string;
		children: Snippet;
	}
	let { open = $bindable(), title, children }: Props = $props();

	let el = $state<HTMLDialogElement>();

	$effect(() => {
		if (!el) return;
		if (open && !el.open) el.showModal();
		else if (!open && el.open) el.close();
	});

	function onClose() {
		open = false;
	}
	function onBackdrop(e: MouseEvent) {
		if (e.target === el) open = false;
	}
</script>

<dialog bind:this={el} onclose={onClose} onclick={onBackdrop} aria-label={title}>
	<div class="panel">
		<header>
			<h2>{title}</h2>
			<button type="button" class="close" aria-label="Close" onclick={onClose}>
				<X size={18} />
			</button>
		</header>
		<div class="body">
			{@render children()}
		</div>
	</div>
</dialog>

<style>
	dialog {
		margin: auto;
		padding: 0;
		border: none;
		background: transparent;
		max-width: min(92vw, 32rem);
		width: 100%;
		color: var(--fg);
	}
	dialog::backdrop {
		background: rgb(0 0 0 / 0.55);
		backdrop-filter: blur(3px);
	}
	.panel {
		background: var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-3);
		overflow: hidden;
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
		padding: var(--space-m) var(--space-l);
		border-bottom: 1px solid var(--border);
	}
	header h2 {
		font-size: var(--step-1);
	}
	.close {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--fg-muted);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			color var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out);
	}
	.close:hover {
		color: var(--fg);
		border-color: var(--border-strong);
	}
	.body {
		padding: var(--space-l);
	}
</style>
