<!--
  Generic list renderer for a TanStack Query result: shows a loading skeleton,
  an error+retry state, an empty state, or a grid of items via the `item`
  snippet. Keeps every resource page consistent.
-->
<script lang="ts" generics="T">
	import type { Snippet, Component } from 'svelte';
	import type { CreateQueryResult } from '@tanstack/svelte-query';
	import { Button, EmptyState } from '$lib';

	interface Props {
		query: CreateQueryResult<T[], Error>;
		item: Snippet<[T]>;
		empty: { title: string; hint?: string; icon?: Component };
		/** Optional action shown in the empty state (e.g. a create button). */
		action?: Snippet;
		columns?: string;
	}
	let {
		query,
		item,
		empty,
		action,
		columns = 'repeat(auto-fill, minmax(17rem, 1fr))'
	}: Props = $props();
</script>

{#if query.isPending}
	<div class="grid" style="--cols: {columns}">
		{#each [0, 1, 2] as i (i)}
			<div class="skeleton"></div>
		{/each}
	</div>
{:else if query.isError}
	<div class="state">
		<p>{query.error.message}</p>
		<Button variant="secondary" size="sm" onclick={() => query.refetch()}>Try again</Button>
	</div>
{:else if !query.data || query.data.length === 0}
	<EmptyState icon={empty.icon} title={empty.title} hint={empty.hint}>
		{#if action}{@render action()}{/if}
	</EmptyState>
{:else}
	<div class="grid" style="--cols: {columns}">
		{#each query.data as row, i (i)}
			{@render item(row)}
		{/each}
	</div>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: var(--cols);
		gap: var(--space-m);
	}
	.skeleton {
		height: 5.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background: linear-gradient(
			100deg,
			var(--surface) 30%,
			var(--surface-2) 50%,
			var(--surface) 70%
		);
		background-size: 200% 100%;
		animation: shimmer 1.3s ease-in-out infinite;
	}
	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}
	.state {
		display: grid;
		justify-items: center;
		gap: var(--space-s);
		max-width: 28rem;
		margin: var(--space-2xl) auto;
		text-align: center;
	}
	.state p {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
</style>
