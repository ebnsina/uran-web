<!-- Dashboard page header: breadcrumb trail, title, and an actions slot. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Crumb {
		label: string;
		href?: string;
	}
	interface Props {
		crumbs?: Crumb[];
		title: string;
		children?: Snippet;
	}
	let { crumbs = [], title, children }: Props = $props();
</script>

<header class="head">
	<div class="lead">
		{#if crumbs.length}
			<nav class="crumbs">
				{#each crumbs as c, i (i)}
					{#if c.href}<a href={c.href}>{c.label}</a>{:else}<span>{c.label}</span>{/if}
					{#if i < crumbs.length - 1}<span class="sep" aria-hidden="true">/</span>{/if}
				{/each}
			</nav>
		{/if}
		<h1>{title}</h1>
	</div>
	{#if children}
		<div class="actions">{@render children()}</div>
	{/if}
</header>

<style>
	.head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-m);
		padding: var(--space-l) var(--space-l) var(--space-m);
		border-bottom: 1px solid var(--border);
	}
	.crumbs {
		display: flex;
		align-items: center;
		gap: 0.5em;
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}
	.crumbs a {
		color: var(--fg-muted);
		transition: color var(--dur-2) var(--ease-out);
	}
	.crumbs a:hover {
		color: var(--accent);
	}
	.sep {
		opacity: 0.5;
	}
	h1 {
		margin-top: var(--space-3xs);
		font-size: var(--step-2);
	}
	.actions {
		display: flex;
		gap: var(--space-2xs);
		flex-shrink: 0;
	}
</style>
