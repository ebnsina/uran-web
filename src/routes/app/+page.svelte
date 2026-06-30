<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { Rocket, ArrowRight } from '@lucide/svelte';
	import { Button, Reveal, motion } from '$lib';
	import { getMe, getOrgs, keys } from '$lib/query/dashboard';

	const me = createQuery(() => ({ queryKey: keys.me, queryFn: getMe, staleTime: 60_000 }));
	const orgs = createQuery(() => ({ queryKey: keys.orgs, queryFn: getOrgs }));

	const firstName = $derived((me.data?.name || '').split(/\s+/)[0] || 'there');
	const skeletons = [0, 1, 2];
</script>

<svelte:head><title>Overview · Uran</title></svelte:head>

<header class="topbar">
	<div>
		<p class="u-eyebrow">Overview</p>
		<h1>Welcome back, {firstName}.</h1>
	</div>
	<Button href="/app/services/new" size="sm">New service</Button>
</header>

<section class="body">
	{#if orgs.isPending}
		<div class="skeleton-grid">
			{#each skeletons as i (i)}
				<div class="skeleton"></div>
			{/each}
		</div>
	{:else if orgs.isError}
		<div class="state">
			<h2>Couldn't load your organizations</h2>
			<p>{orgs.error.message}</p>
			<Button onclick={() => orgs.refetch()}>Try again</Button>
		</div>
	{:else if orgs.data.length === 0}
		<Reveal>
			<div class="empty">
				<div class="empty-mark" aria-hidden="true"><Rocket size={28} strokeWidth={1.75} /></div>
				<h2>Let's ship your first service</h2>
				<p>
					Create an organization, connect a repository, and deploy — Uran handles the build,
					routing, and TLS.
				</p>
				<div class="empty-cta">
					<Button href="/app/services/new">Create a service</Button>
					<Button href="/docs" variant="secondary">Read the docs</Button>
				</div>
			</div>
		</Reveal>
	{:else}
		<div class="org-grid">
			{#each orgs.data as org, i (org.id)}
				<a
					href="/app/orgs/{org.slug}"
					class="org"
					in:fly={{ y: 14, delay: motion.stagger(i), duration: 360, easing: expoOut }}
				>
					<div class="org-head">
						<span class="org-badge u-mono">{org.slug.slice(0, 2).toUpperCase()}</span>
						<span class="org-arrow" aria-hidden="true"><ArrowRight size={16} /></span>
					</div>
					<h3>{org.name}</h3>
					<p class="u-mono">{org.slug}</p>
				</a>
			{/each}
		</div>
	{/if}
</section>

<style>
	.topbar {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-m);
		padding: var(--space-l) var(--space-l) var(--space-m);
		border-bottom: 1px solid var(--border);
	}
	.topbar h1 {
		margin-top: var(--space-3xs);
		font-size: var(--step-2);
	}
	.body {
		padding: var(--space-l);
	}

	/* Loading skeleton */
	.skeleton-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: var(--space-m);
	}
	.skeleton {
		height: 9rem;
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
		max-width: 28rem;
		margin: var(--space-2xl) auto;
		text-align: center;
	}
	.state h2 {
		font-size: var(--step-1);
	}
	.state p {
		margin: var(--space-s) 0 var(--space-l);
		color: var(--fg-muted);
	}

	.empty {
		max-width: 32rem;
		margin: var(--space-2xl) auto;
		text-align: center;
		padding: var(--space-2xl) var(--space-l);
		background:
			radial-gradient(120% 130% at 50% 0%, var(--accent-soft), transparent 60%), var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
	}
	.empty-mark {
		display: grid;
		place-items: center;
		width: 3.2rem;
		height: 3.2rem;
		margin: 0 auto;
		color: var(--accent);
		background: var(--accent-soft);
		border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
		border-radius: var(--radius-md);
	}
	.empty h2 {
		margin-top: var(--space-s);
		font-size: var(--step-2);
	}
	.empty p {
		margin: var(--space-s) auto var(--space-l);
		max-width: 26rem;
		color: var(--fg-muted);
	}
	.empty-cta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-s);
		justify-content: center;
	}

	.org-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: var(--space-m);
	}
	.org {
		display: block;
		padding: var(--space-m);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		transition:
			transform var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out);
	}
	.org:hover {
		transform: translateY(-3px);
		border-color: var(--accent);
	}
	.org-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.org-badge {
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: var(--radius-sm);
		background: var(--accent-soft);
		color: var(--accent);
		font-weight: 700;
	}
	.org-arrow {
		display: inline-flex;
		color: var(--fg-subtle);
		transition:
			transform var(--dur-2) var(--ease-out),
			color var(--dur-2) var(--ease-out);
	}
	.org:hover .org-arrow {
		transform: translateX(4px);
		color: var(--accent);
	}
	.org h3 {
		margin-top: var(--space-s);
		font-size: var(--step-1);
	}
	.org p {
		margin-top: var(--space-3xs);
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}
</style>
