<!--
  Callout: a tinted panel with an icon badge for tips, notes, and warnings.
  Tone drives the colour + default icon; pass `icon` to override, or a `title`.
-->
<script lang="ts">
	import type { Snippet, Component } from 'svelte';
	import { Info, CircleCheck, TriangleAlert, Zap } from '@lucide/svelte';

	type Tone = 'info' | 'success' | 'warning' | 'danger' | 'accent';
	interface Props {
		tone?: Tone;
		title?: string;
		icon?: Component;
		children: Snippet;
	}
	let { tone = 'accent', title, icon, children }: Props = $props();

	const defaults: Record<Tone, Component> = {
		info: Info,
		success: CircleCheck,
		warning: TriangleAlert,
		danger: TriangleAlert,
		accent: Zap
	};
	const Icon = $derived(icon ?? defaults[tone]);
</script>

<div class="callout {tone}">
	<span class="ico"><Icon size={16} /></span>
	<div class="body">
		{#if title}<b class="title">{title}</b>{/if}
		<p>{@render children()}</p>
	</div>
</div>

<style>
	.callout {
		--_c: var(--accent);
		display: flex;
		align-items: flex-start;
		gap: var(--space-s);
		padding: var(--space-s) var(--space-m);
		background: color-mix(in oklab, var(--_c) 12%, transparent);
		border-radius: var(--radius);
		color: var(--fg);
	}
	.info {
		--_c: var(--info, #3aa6de);
	}
	.success {
		--_c: var(--ok);
	}
	.warning {
		--_c: var(--warn);
	}
	.danger {
		--_c: var(--danger);
	}
	.accent {
		--_c: var(--accent);
	}
	.ico {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		flex-shrink: 0;
		color: #fff;
		background: var(--_c);
		border-radius: var(--radius-full);
	}
	.body {
		min-width: 0;
	}
	.title {
		display: block;
		margin-bottom: 0.15em;
		font-size: var(--step-0);
	}
	.body p {
		color: var(--fg-muted);
		line-height: var(--leading-normal);
	}
	.callout:not(:has(.title)) .body {
		display: flex;
		align-items: center;
		min-height: 1.9rem;
	}
	.callout:not(:has(.title)) .body p {
		color: var(--fg);
	}
</style>
