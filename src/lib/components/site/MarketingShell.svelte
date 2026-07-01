<!-- Shared chrome for simple marketing/legal pages: header, hero, footer. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import SiteHeader from './SiteHeader.svelte';
	import SiteFooter from './SiteFooter.svelte';
	import type { User } from '$lib/api/schemas';

	interface Props {
		user?: User | null;
		eyebrow?: string;
		title: string;
		lede?: string;
		children?: Snippet;
	}
	let { user = null, eyebrow, title, lede, children }: Props = $props();
</script>

<SiteHeader {user} />

<main class="u-container shell">
	<header class="head">
		{#if eyebrow}<p class="eyebrow u-mono">{eyebrow}</p>{/if}
		<h1>{title}</h1>
		{#if lede}<p class="lede">{lede}</p>{/if}
	</header>
	{#if children}<div class="content">{@render children()}</div>{/if}
</main>

<SiteFooter />

<style>
	.shell {
		padding-block: clamp(var(--space-2xl), 8vw, var(--space-3xl));
		min-height: 60vh;
	}
	.head {
		max-width: 44rem;
	}
	.eyebrow {
		font-size: var(--step--2);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: var(--space-s);
	}
	.head h1 {
		font-size: var(--h-lg);
		font-weight: 600;
		line-height: 1.15;
		letter-spacing: var(--tracking-tight);
	}
	.lede {
		margin-top: var(--space-s);
		color: var(--fg-muted);
		font-size: var(--step-1);
		line-height: var(--leading-normal);
	}
	.content {
		margin-top: var(--space-xl);
		max-width: 44rem;
	}
	.content :global(h2) {
		font-size: var(--h-sm);
		margin: var(--space-l) 0 var(--space-2xs);
	}
	.content :global(p) {
		color: var(--fg-muted);
		line-height: var(--leading-normal);
		margin-top: var(--space-s);
	}
	/* Text links only — never restyle Button-rendered anchors (.btn). */
	.content :global(a:not(.btn)) {
		color: var(--accent);
	}
	.content :global(a:not(.btn):hover) {
		text-decoration: underline;
	}
</style>
