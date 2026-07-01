<!--
  Full-width marketing header: logo + nav on the left, theme toggle + auth CTAs
  on the right. Sticky, with a subtle bottom border that firms up on scroll.
  Section links (Capabilities/Workflow) also have hidden keyboard shortcuts.
-->
<script lang="ts">
	import { Logo, Button } from '$lib';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { smoothAnchor } from '$lib/scroll';
	import { goto } from '$app/navigation';
	import type { User } from '$lib/api/schemas';

	interface Props {
		user?: User | null;
	}
	let { user = null }: Props = $props();

	const links = [
		{ label: 'Capabilities', href: '#capabilities', key: 'C' },
		{ label: 'Workflow', href: '#workflow', key: 'W' },
		{ label: 'Docs', href: '/docs', key: 'D' }
	];

	let scrolled = $state(false);
	function onScroll() {
		scrolled = window.scrollY > 8;
	}

	function onKey(event: KeyboardEvent) {
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		const el = event.target as HTMLElement | null;
		if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
		const link = links.find((l) => l.key.toLowerCase() === event.key.toLowerCase());
		if (!link) return;
		event.preventDefault();
		if (link.href.startsWith('#')) {
			document.getElementById(link.href.slice(1))?.scrollIntoView({ block: 'start' });
		} else {
			goto(link.href);
		}
	}
</script>

<svelte:window onscroll={onScroll} onkeydown={onKey} />

<header class="hdr" class:scrolled>
	<div class="bar u-container">
		<div class="left">
			<Logo />
			<nav class="nav">
				{#each links as l (l.href)}
					<a href={l.href} onclick={l.href.startsWith('#') ? smoothAnchor : undefined}>{l.label}</a>
				{/each}
			</nav>
		</div>
		<div class="actions">
			<ThemeToggle />
			{#if user}
				<Button href="/app" size="sm">Dashboard</Button>
			{:else}
				<Button href="/login" variant="ghost" size="sm">Log in</Button>
				<Button href="/register" size="sm">Get started</Button>
			{/if}
		</div>
	</div>
</header>

<style>
	.hdr {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in oklab, var(--bg) 80%, transparent);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid transparent;
		transition:
			border-color var(--dur-2) var(--ease-out),
			background var(--dur-2) var(--ease-out);
	}
	.hdr.scrolled {
		border-bottom-color: var(--border);
		background: color-mix(in oklab, var(--bg) 90%, transparent);
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
		padding-block: var(--space-s);
	}
	.left {
		display: flex;
		align-items: center;
		gap: var(--space-xl);
	}
	.nav {
		display: none;
		align-items: center;
		gap: var(--space-l);
	}
	.nav a {
		font-size: var(--step-0);
		font-weight: 600;
		color: var(--fg);
		transition: color var(--dur-2) var(--ease-out);
	}
	.nav a:hover {
		color: var(--accent);
	}
	.actions {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
	}

	@media (min-width: 52rem) {
		.nav {
			display: flex;
		}
	}
</style>
