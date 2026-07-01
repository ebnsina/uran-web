<!-- Renders the toast stack (bottom-right). Tone-coloured, click to dismiss. -->
<script lang="ts">
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { CircleCheck, CircleAlert, Info, X } from '@lucide/svelte';
	import { getToasts, dismissToast } from '$lib/toast.svelte';

	const icons = { success: CircleCheck, error: CircleAlert, info: Info };
</script>

<div class="toaster" aria-live="polite" aria-atomic="false">
	{#each getToasts() as t (t.id)}
		{@const Icon = icons[t.tone]}
		<div
			class="toast {t.tone}"
			role="status"
			transition:fly={{ y: 12, duration: 260, easing: expoOut }}
		>
			<span class="ico"><Icon size={17} /></span>
			<span class="msg">{t.message}</span>
			<button class="close" type="button" aria-label="Dismiss" onclick={() => dismissToast(t.id)}>
				<X size={14} />
			</button>
		</div>
	{/each}
</div>

<style>
	.toaster {
		position: fixed;
		right: var(--space-m);
		bottom: var(--space-m);
		z-index: 100;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		max-width: min(92vw, 24rem);
		pointer-events: none;
	}
	.toast {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: 0.7em 0.85em;
		background: color-mix(in oklab, var(--_tone) 12%, var(--surface));
		border: 1px solid color-mix(in oklab, var(--_tone) 22%, var(--border));
		border-radius: var(--radius);
		box-shadow: var(--shadow-3);
		font-size: var(--step--1);
	}
	.ico {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		flex-shrink: 0;
		color: #fff;
		background: var(--_tone);
		border-radius: var(--radius-full);
	}
	.msg {
		flex: 1;
		color: var(--fg);
	}
	.close {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border: none;
		background: transparent;
		color: var(--fg-subtle);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	.close:hover {
		color: var(--fg);
	}
	.success {
		--_tone: var(--ok);
	}
	.error {
		--_tone: var(--danger);
	}
	.info {
		--_tone: var(--accent);
	}
</style>
