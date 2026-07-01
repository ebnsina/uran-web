<!--
  Authenticated dashboard chrome. Runs inside the QueryClientProvider so it can
  use TanStack Query: a `me` query doubles as the auth guard (401 → login) and
  feeds the sidebar identity; logout is a mutation. No SSR, no form actions.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { LogOut, Search } from '@lucide/svelte';
	import { Logo } from '$lib';
	import { palette } from '$lib/palette.svelte';
	import { getMe, postLogout, keys } from '$lib/query/dashboard';
	import { FetchError } from '$lib/query/fetcher';

	let { children }: { children: Snippet } = $props();

	const client = useQueryClient();

	const me = createQuery(() => ({
		queryKey: keys.me,
		queryFn: getMe,
		retry: false,
		staleTime: 60_000
	}));

	// Client-side auth guard: bounce to login on 401 (preserve return path).
	$effect(() => {
		if (me.isError && me.error instanceof FetchError && me.error.status === 401) {
			goto(`/login?next=${encodeURIComponent(page.url.pathname)}`);
		}
	});

	const logout = createMutation(() => ({
		mutationFn: postLogout,
		onSuccess: () => {
			client.clear();
			goto('/');
		}
	}));

	const nav = [
		{ href: '/app', label: 'Overview' },
		{ href: '/app/settings', label: 'Settings' },
		{ href: '/docs', label: 'Docs' }
	];

	function isActive(href: string): boolean {
		return href === '/app' ? page.url.pathname === '/app' : page.url.pathname.startsWith(href);
	}

	const initials = $derived(
		(me.data?.name || me.data?.email || '?')
			.split(/\s+/)
			.map((s) => s[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);
</script>

{#if me.isSuccess}
	<div class="layout">
		<!-- Mobile top bar (replaces the sidebar below the breakpoint) -->
		<header class="topbar">
			<Logo size={24} />
			<nav class="topnav">
				{#each nav as item (item.href)}
					<a
						href={item.href}
						class="tnav"
						class:active={isActive(item.href)}
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{item.label}
					</a>
				{/each}
			</nav>
			<div class="tact">
				<button
					class="ticon"
					type="button"
					aria-label="Search"
					onclick={() => (palette.open = true)}
				>
					<Search size={17} />
				</button>
				<button
					class="ticon"
					type="button"
					aria-label="Log out"
					disabled={logout.isPending}
					onclick={() => logout.mutate()}
				>
					<LogOut size={17} />
				</button>
			</div>
		</header>

		<aside class="side">
			<div class="side-top"><Logo /></div>
			<button class="search" type="button" onclick={() => (palette.open = true)}>
				<Search size={15} />
				<span>Search</span>
				<kbd>⌘K</kbd>
			</button>
			<nav>
				{#each nav as item (item.href)}
					<a
						href={item.href}
						class="nav-item"
						class:active={isActive(item.href)}
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{item.label}
					</a>
				{/each}
			</nav>
			<div class="user">
				<div class="avatar" aria-hidden="true">{initials}</div>
				<div class="who">
					<span class="name">{me.data.name || 'Account'}</span>
					<span class="email">{me.data.email}</span>
				</div>
				<button
					class="logout"
					type="button"
					title="Log out"
					aria-label="Log out"
					disabled={logout.isPending}
					onclick={() => logout.mutate()}
				>
					<LogOut size={16} />
				</button>
			</div>
		</aside>

		<main class="main">
			{@render children()}
		</main>
	</div>
{:else}
	<div class="boot" role="status" aria-live="polite">
		<span class="spinner" aria-hidden="true"></span>
		<span class="u-visually-hidden">Loading your dashboard…</span>
	</div>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		min-height: 100dvh;
		background: var(--canvas);
	}
	/* Mobile top bar — shown below the sidebar breakpoint. */
	.topbar {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-2xs) var(--space-s);
		position: sticky;
		top: 0;
		z-index: 20;
		background: var(--canvas);
		border-bottom: 1px solid var(--border);
	}
	.topnav {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-3xs);
		flex: 1;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.topnav::-webkit-scrollbar {
		display: none;
	}
	.tnav {
		padding: 0.4em 0.7em;
		border-radius: var(--radius-sm);
		color: var(--fg-muted);
		font-size: var(--step--1);
		font-weight: 500;
		white-space: nowrap;
	}
	.tnav.active {
		color: var(--accent-contrast);
		background: var(--accent);
	}
	.tact {
		display: flex;
		gap: 2px;
	}
	.ticon {
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		border: none;
		background: transparent;
		color: var(--fg-muted);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	.ticon:hover {
		color: var(--fg);
		background: var(--surface-2);
	}

	/* Sidebar sits on the grey canvas (no panel/border) — active item is brand. */
	.side {
		display: none;
		flex-direction: column;
		gap: var(--space-l);
		padding: var(--space-m);
		background: transparent;
	}
	.side-top {
		padding: var(--space-2xs) var(--space-2xs) var(--space-s);
	}
	.search {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: 0.55em 0.7em;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		color: var(--fg-subtle);
		font-size: var(--step--1);
		cursor: pointer;
		transition:
			border-color var(--dur-2) var(--ease-out),
			color var(--dur-2) var(--ease-out);
	}
	.search:hover {
		color: var(--fg);
		border-color: var(--border-strong);
	}
	.search span {
		flex: 1;
		text-align: left;
	}
	.search kbd {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		border: 1px solid var(--border);
		border-radius: var(--radius-xs);
		padding: 0.05em 0.4em;
	}
	.side nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
	}
	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: 0.6em 0.7em;
		border-radius: var(--radius-sm);
		color: var(--fg-muted);
		font-size: var(--step--1);
		font-weight: 500;
		transition:
			color var(--dur-2) var(--ease-out),
			background var(--dur-2) var(--ease-out);
	}
	.nav-item:hover {
		color: var(--fg);
		background: var(--surface-2);
	}
	.nav-item.active {
		color: var(--accent-contrast);
		background: var(--accent);
	}
	.user {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		padding-top: var(--space-s);
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		border-radius: var(--radius-full);
		background: var(--accent-soft);
		color: var(--accent);
		font-size: var(--step--2);
		font-weight: 700;
		font-family: var(--font-mono);
	}
	.who {
		flex: 1;
		min-width: 0;
	}
	.name,
	.email {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.name {
		font-size: var(--step--1);
		font-weight: 500;
	}
	.email {
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.logout {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--border);
		background: transparent;
		border-radius: var(--radius-sm);
		color: var(--fg-muted);
		cursor: pointer;
		transition:
			color var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out);
	}
	.logout:hover:not(:disabled) {
		color: var(--danger-400);
		border-color: var(--danger);
	}
	.logout:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	/* The content area: a single white, rounded-xl panel floating on the canvas. */
	.main {
		--gap: var(--space-2xs);
		min-width: 0;
		width: calc(100% - 2 * var(--gap));
		max-width: 82rem;
		margin: var(--gap) auto;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-1);
		overflow: hidden;
		min-height: calc(100dvh - 2 * var(--gap));
	}

	.boot {
		display: grid;
		place-items: center;
		min-height: 100dvh;
	}
	.spinner {
		width: 1.6rem;
		height: 1.6rem;
		border-radius: var(--radius-full);
		border: 2px solid var(--border-strong);
		border-top-color: var(--accent);
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (min-width: 56rem) {
		.layout {
			grid-template-columns: 16rem minmax(0, 1fr);
		}
		.topbar {
			display: none;
		}
		.side {
			display: flex;
			position: sticky;
			top: 0;
			height: 100dvh;
		}
	}
</style>
