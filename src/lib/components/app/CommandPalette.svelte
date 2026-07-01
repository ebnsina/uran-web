<!--
  ⌘K / Ctrl-K command palette: fuzzy-search navigation + quick actions
  (overview, settings, docs, theme, your organizations). Arrow keys + Enter.
-->
<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { createQuery } from '@tanstack/svelte-query';
	import { Search, LayoutGrid, Settings, BookOpen, SunMoon, Building2 } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import { getOrgs, keys } from '$lib/query/dashboard';
	import { theme } from '$lib/theme.svelte';
	import { palette } from '$lib/palette.svelte';

	let q = $state('');
	let selected = $state(0);
	let inputEl = $state<HTMLInputElement>();
	const open = $derived(palette.open);

	const orgs = createQuery(() => ({
		queryKey: keys.orgs,
		queryFn: getOrgs,
		staleTime: 60_000,
		enabled: palette.open
	}));

	// Focus + reset whenever the palette opens.
	$effect(() => {
		if (palette.open) {
			q = '';
			selected = 0;
			tick().then(() => inputEl?.focus());
		}
	});

	interface Cmd {
		label: string;
		hint: string;
		icon: Component;
		run: () => void;
	}
	const commands = $derived<Cmd[]>([
		{ label: 'Overview', hint: 'Go to', icon: LayoutGrid, run: () => goto('/app') },
		{ label: 'Settings', hint: 'Go to', icon: Settings, run: () => goto('/app/settings') },
		{ label: 'Documentation', hint: 'Open', icon: BookOpen, run: () => goto('/docs') },
		{
			label: `Switch to ${theme.value === 'dark' ? 'light' : 'dark'} theme`,
			hint: 'Appearance',
			icon: SunMoon,
			run: () => theme.toggle()
		},
		...(orgs.data ?? []).map((o) => ({
			label: o.name,
			hint: 'Organization',
			icon: Building2,
			run: () => goto(`/app/orgs/${o.id}`)
		}))
	]);
	const filtered = $derived(
		q.trim() ? commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())) : commands
	);

	$effect(() => {
		if (selected >= filtered.length) selected = 0;
	});

	function close() {
		palette.open = false;
	}
	function run(c: Cmd) {
		close();
		c.run();
	}

	function onWindowKey(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			palette.toggle();
		} else if (palette.open && e.key === 'Escape') {
			close();
		}
	}
	function onInputKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selected = Math.min(selected + 1, filtered.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selected = Math.max(selected - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filtered[selected]) run(filtered[selected]);
		}
	}
</script>

<svelte:window onkeydown={onWindowKey} />

{#if open}
	<div class="scrim">
		<button class="backdrop" aria-label="Close command palette" onclick={close}></button>
		<div class="palette" role="dialog" aria-modal="true" aria-label="Command palette">
			<div class="search">
				<Search size={17} />
				<input
					bind:this={inputEl}
					bind:value={q}
					onkeydown={onInputKey}
					placeholder="Search commands and organizations…"
					aria-label="Search"
				/>
				<kbd>esc</kbd>
			</div>
			<ul>
				{#each filtered as c, i (c.label + i)}
					{@const Icon = c.icon}
					<li>
						<button
							class="cmd"
							class:active={i === selected}
							onmouseenter={() => (selected = i)}
							onclick={() => run(c)}
						>
							<Icon size={16} />
							<span class="label">{c.label}</span>
							<span class="hint">{c.hint}</span>
						</button>
					</li>
				{/each}
				{#if filtered.length === 0}
					<li class="empty">No matches</li>
				{/if}
			</ul>
		</div>
	</div>
{/if}

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 90;
		display: grid;
		justify-items: center;
		align-items: start;
		padding-top: 12vh;
	}
	.backdrop {
		position: absolute;
		inset: 0;
		border: none;
		background: rgb(0 0 0 / 0.5);
		backdrop-filter: blur(3px);
		cursor: default;
	}
	.palette {
		position: relative;
		width: min(92vw, 34rem);
		background: var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-3);
		overflow: hidden;
	}
	.search {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: var(--space-s) var(--space-m);
		border-bottom: 1px solid var(--border);
		color: var(--fg-subtle);
	}
	.search input {
		flex: 1;
		border: none;
		background: transparent;
		color: var(--fg);
		font-size: var(--step-0);
		outline: none;
	}
	kbd {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		color: var(--fg-subtle);
		border: 1px solid var(--border);
		border-radius: var(--radius-xs);
		padding: 0.1em 0.4em;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: var(--space-2xs);
		max-height: 22rem;
		overflow-y: auto;
	}
	.cmd {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		width: 100%;
		padding: 0.6em 0.7em;
		border: none;
		background: transparent;
		color: var(--fg-muted);
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-align: left;
		transition: none;
	}
	.cmd.active {
		background: var(--accent-soft);
		color: var(--fg);
	}
	.cmd.active :global(svg) {
		color: var(--accent);
	}
	.label {
		flex: 1;
		font-size: var(--step--1);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.hint {
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.empty {
		padding: var(--space-m);
		text-align: center;
		color: var(--fg-subtle);
		font-size: var(--step--1);
	}
</style>
