<!-- Inline status message. Slides in; tone is token-driven. -->
<script lang="ts">
	import { slide } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';

	interface Props {
		tone?: 'danger' | 'ok' | 'warn';
		children: Snippet;
	}
	let { tone = 'danger', children }: Props = $props();
</script>

<p class="alert {tone}" role="alert" transition:slide={{ duration: 220, easing: expoOut }}>
	{@render children()}
</p>

<style>
	.alert {
		padding: 0.7em 0.9em;
		border-radius: var(--radius-sm);
		font-size: var(--step--1);
		border: 1px solid;
	}
	.danger {
		color: var(--danger-400);
		background: color-mix(in oklab, var(--danger) 12%, transparent);
		border-color: color-mix(in oklab, var(--danger) 35%, transparent);
	}
	.ok {
		color: var(--ok);
		background: color-mix(in oklab, var(--ok) 12%, transparent);
		border-color: color-mix(in oklab, var(--ok) 35%, transparent);
	}
	.warn {
		color: var(--warn);
		background: color-mix(in oklab, var(--warn) 12%, transparent);
		border-color: color-mix(in oklab, var(--warn) 35%, transparent);
	}
</style>
