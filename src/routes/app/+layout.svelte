<script lang="ts">
	import { page } from '$app/state';
	import { Logo } from '$lib';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const nav = [
		{ href: '/app', label: 'Overview', icon: 'grid' },
		{ href: '/app/services', label: 'Services', icon: 'box' },
		{ href: '/app/databases', label: 'Databases', icon: 'db' },
		{ href: '/app/settings', label: 'Settings', icon: 'cog' }
	];

	function isActive(href: string): boolean {
		return href === '/app' ? page.url.pathname === '/app' : page.url.pathname.startsWith(href);
	}

	const initials = $derived(
		(data.user?.name || data.user?.email || '?')
			.split(/\s+/)
			.map((s) => s[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);
</script>

<div class="layout">
	<aside class="side">
		<div class="side-top"><Logo /></div>
		<nav>
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class="nav-item"
					class:active={isActive(item.href)}
					aria-current={isActive(item.href) ? 'page' : undefined}
				>
					<span class="ico" data-icon={item.icon} aria-hidden="true"></span>
					{item.label}
				</a>
			{/each}
		</nav>
		<form class="user" method="POST" action="/logout">
			<div class="avatar" aria-hidden="true">{initials}</div>
			<div class="who">
				<span class="name">{data.user?.name || 'Account'}</span>
				<span class="email">{data.user?.email}</span>
			</div>
			<button class="logout" type="submit" title="Log out" aria-label="Log out">
				<span class="ico" data-icon="exit" aria-hidden="true"></span>
			</button>
		</form>
	</aside>

	<main class="main">
		{@render children()}
	</main>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: 1fr;
		min-height: 100dvh;
	}
	.side {
		display: none;
		flex-direction: column;
		gap: var(--space-l);
		padding: var(--space-m);
		border-right: 1px solid var(--border);
		background: var(--surface);
	}
	.side-top {
		padding: var(--space-2xs) var(--space-2xs) var(--space-s);
	}
	nav {
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
	.ico {
		width: 8px;
		height: 8px;
		border-radius: 2px;
		background: currentColor;
		opacity: 0.7;
	}
	.user {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		padding-top: var(--space-s);
		border-top: 1px solid var(--border);
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
	.logout:hover {
		color: var(--danger-400);
		border-color: var(--danger);
	}
	.main {
		min-width: 0;
	}

	@media (min-width: 56rem) {
		.layout {
			grid-template-columns: 16rem 1fr;
		}
		.side {
			display: flex;
			position: sticky;
			top: 0;
			height: 100dvh;
		}
	}
</style>
