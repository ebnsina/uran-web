<!-- Centered empty state: icon badge, title, hint, and an optional action slot. -->
<script lang="ts">
	import type { Snippet, Component } from 'svelte';

	interface Props {
		icon?: Component;
		title: string;
		hint?: string;
		children?: Snippet;
	}
	let { icon, title, hint, children }: Props = $props();
</script>

<div class="empty">
	{#if icon}
		{@const Icon = icon}
		<span class="mark"><Icon size={22} /></span>
	{/if}
	<h3>{title}</h3>
	{#if hint}<p>{hint}</p>{/if}
	{#if children}<div class="cta">{@render children()}</div>{/if}
</div>

<style>
	.empty {
		display: grid;
		justify-items: center;
		gap: var(--space-2xs);
		max-width: 26rem;
		margin: var(--space-l) auto;
		text-align: center;
	}
	.mark {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		margin-bottom: var(--space-2xs);
		color: var(--accent);
		background: var(--accent-soft);
		border: 1px solid color-mix(in oklab, var(--accent) 28%, transparent);
		border-radius: var(--radius-md);
	}
	h3 {
		font-size: var(--step-1);
	}
	p {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
		justify-content: center;
		margin-top: var(--space-s);
	}
</style>
