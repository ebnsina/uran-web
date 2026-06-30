<!-- Marketing header. Compacts on scroll for a subtle depth cue. -->
<script lang="ts">
	import { Logo, Button } from '$lib';
	import { smoothAnchor } from '$lib/scroll';
	import type { User } from '$lib/api/schemas';

	interface Props {
		user?: User | null;
	}
	let { user = null }: Props = $props();

	let scrolled = $state(false);
	function onScroll() {
		scrolled = window.scrollY > 12;
	}
</script>

<svelte:window onscroll={onScroll} />

<header class="hdr" class:scrolled>
	<div class="u-container bar">
		<Logo />
		<nav class="nav">
			<a href="#index" onclick={smoothAnchor}>Capabilities</a>
			<a href="#workflow" onclick={smoothAnchor}>Workflow</a>
			<a href="/docs">Docs</a>
		</nav>
		<div class="actions">
			{#if user}
				<Button href="/app" size="sm">Dashboard</Button>
			{:else}
				<Button href="/login" variant="ghost" size="sm">Log in</Button>
				<Button href="/register" size="sm">Start free</Button>
			{/if}
		</div>
	</div>
</header>

<style>
	.hdr {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in oklab, var(--bg) 70%, transparent);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid transparent;
		transition:
			border-color var(--dur-2) var(--ease-out),
			background var(--dur-2) var(--ease-out);
	}
	.hdr.scrolled {
		border-bottom-color: var(--border);
		background: color-mix(in oklab, var(--bg) 88%, transparent);
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
		height: var(--header-h);
	}
	.nav {
		display: none;
		gap: var(--space-m);
		font-size: var(--step--1);
		color: var(--fg-muted);
	}
	.nav a {
		position: relative;
		padding: 0.25em 0;
		transition: color var(--dur-2) var(--ease-out);
	}
	.nav a::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -2px;
		height: 1.5px;
		width: 0;
		background: var(--accent);
		transition: width var(--dur-2) var(--ease-out);
	}
	.nav a:hover {
		color: var(--fg);
	}
	.nav a:hover::after {
		width: 100%;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
	}
	@media (min-width: 48rem) {
		.nav {
			display: flex;
		}
	}
</style>
