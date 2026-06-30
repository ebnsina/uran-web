<!--
  Floating pill header. Logo left, centered nav with keyboard-shortcut badges
  (press the key to jump to that section), CTA on the right. Compacts subtly on
  scroll.
-->
<script lang="ts">
	import { Logo, Button } from '$lib';
	import { smoothAnchor } from '$lib/scroll';
	import { goto } from '$app/navigation';
	import type { User } from '$lib/api/schemas';

	interface Props {
		user?: User | null;
	}
	let { user = null }: Props = $props();

	const links = [
		{ label: 'Capabilities', href: '#index', key: 'C' },
		{ label: 'Workflow', href: '#workflow', key: 'W' },
		{ label: 'Docs', href: '/docs', key: 'D' }
	];

	let scrolled = $state(false);
	function onScroll() {
		scrolled = window.scrollY > 12;
	}

	// Keyboard shortcuts — ignore when typing or using modifiers.
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

<div class="hdr">
	<div class="pill" class:scrolled>
		<div class="brand"><Logo /></div>
		<nav class="nav">
			{#each links as l (l.href)}
				<a href={l.href} onclick={l.href.startsWith('#') ? smoothAnchor : undefined}>
					{l.label}<kbd>{l.key}</kbd>
				</a>
			{/each}
		</nav>
		<div class="actions">
			{#if user}
				<Button href="/app" size="sm">Dashboard</Button>
			{:else}
				<Button href="/login" variant="ghost" size="sm">Log in</Button>
				<Button href="/register" size="sm">Get started</Button>
			{/if}
		</div>
	</div>
</div>

<style>
	.hdr {
		position: sticky;
		top: var(--space-s);
		z-index: 50;
		padding-inline: var(--space-m);
	}
	.pill {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: var(--space-m);
		width: min(100%, var(--container-wide));
		margin-inline: auto;
		padding: 0.45rem 0.45rem 0.45rem 1rem;
		background: color-mix(in oklab, var(--surface) 72%, transparent);
		backdrop-filter: blur(14px);
		border: 1px solid var(--border);
		border-radius: var(--radius-full);
		transition:
			background var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out),
			box-shadow var(--dur-2) var(--ease-out);
	}
	.pill.scrolled {
		background: color-mix(in oklab, var(--surface) 90%, transparent);
		border-color: var(--border-strong);
		box-shadow: var(--shadow-2);
	}
	.brand {
		justify-self: start;
	}

	.nav {
		display: none;
		justify-self: center;
		align-items: center;
		gap: var(--space-2xs);
	}
	.nav a {
		display: inline-flex;
		align-items: center;
		padding: 0.4em 0.7em;
		border-radius: var(--radius-full);
		font-size: var(--step--1);
		color: var(--fg-muted);
		transition:
			color var(--dur-2) var(--ease-out),
			background var(--dur-2) var(--ease-out);
	}
	.nav a:hover {
		color: var(--fg);
		background: var(--surface-2);
	}
	kbd {
		margin-left: 0.55em;
		display: inline-grid;
		place-items: center;
		min-width: 1.35em;
		height: 1.35em;
		padding: 0 0.3em;
		font-family: var(--font-mono);
		font-size: 0.72em;
		line-height: 1;
		color: var(--fg-subtle);
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-xs);
	}
	.nav a:hover kbd {
		color: var(--accent);
		border-color: var(--accent);
	}

	.actions {
		justify-self: end;
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
