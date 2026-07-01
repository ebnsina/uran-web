<!--
  Static, on-brand mock of the Uran dashboard for the hero — mirrors the real
  app: a grey canvas with a grey sidebar (blue active pill) and a white, rounded
  content panel holding the services table. Decorative (aria-hidden); token-
  styled so it tracks the theme. Health bars ease in on mount.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Send } from '@lucide/svelte';

	const nav = [
		{ label: 'Overview', active: true },
		{ label: 'Settings', active: false },
		{ label: 'Docs', active: false }
	];

	type Tone = 'ok' | 'accent' | 'warn';
	const rows: { name: string; region: string; status: string; tone: Tone; health: number }[] = [
		{ name: 'web', region: 'sin-1', status: 'Live', tone: 'ok', health: 98 },
		{ name: 'api', region: 'sin-1', status: 'Live', tone: 'ok', health: 94 },
		{ name: 'worker', region: 'fra-1', status: 'Deploying', tone: 'accent', health: 62 },
		{ name: 'cron-tick', region: 'sin-1', status: 'Live', tone: 'ok', health: 100 },
		{ name: 'docs', region: 'iad-1', status: 'Building', tone: 'warn', health: 38 }
	];
	const toneVar: Record<Tone, string> = {
		ok: 'var(--ok)',
		accent: 'var(--accent)',
		warn: 'var(--warn)'
	};

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
</script>

<div class="win" aria-hidden="true">
	<div class="chrome">
		<span class="dots"><i></i><i></i><i></i></span>
		<span class="path u-mono">uran / acme-prod</span>
	</div>

	<div class="body">
		<aside class="side">
			<span class="logo">
				<span class="logo-badge"><Send size={11} strokeWidth={2.2} /></span>
				<b>uran</b>
			</span>
			<div class="search">
				Search
				<span class="kbd u-mono">⌘K</span>
			</div>
			<ul>
				{#each nav as n (n.label)}
					<li class:active={n.active}>{n.label}</li>
				{/each}
			</ul>
			<div class="user">
				<span class="uavatar u-mono">A</span>
				<span class="uname">ada</span>
			</div>
		</aside>

		<div class="panel">
			<div class="panel-head">
				<b class="panel-title">Services</b>
				<span class="new u-mono">+ New</span>
			</div>

			<div class="table">
				<div class="thead u-mono">
					<span>Service</span><span>Region</span><span>Status</span><span>Health</span>
				</div>
				{#each rows as r, i (r.name)}
					<div class="row" style="--d: {i * 70}ms">
						<span class="svc">
							<span class="svc-mark u-mono">{r.name[0].toUpperCase()}</span>
							<span class="u-mono">{r.name}</span>
						</span>
						<span class="region u-mono">{r.region}</span>
						<span class="status" style="--tone: {toneVar[r.tone]}">
							<span class="led"></span>{r.status}
						</span>
						<span class="health">
							<span class="bar" style="--w: {mounted ? r.health : 0}%; --tone: {toneVar[r.tone]}"
							></span>
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.win {
		width: 100%;
		min-width: 32rem;
		background: var(--bg-elevated);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-3);
		overflow: hidden;
		font-size: var(--step--1);
	}
	.chrome {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-xs) var(--space-s);
		border-bottom: 1px solid var(--border);
	}
	.dots {
		display: flex;
		gap: 6px;
	}
	.dots i {
		width: 9px;
		height: 9px;
		border-radius: var(--radius-full);
		background: var(--ink-400);
	}
	.path {
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}

	/* Grey canvas with a grey sidebar + white content panel (like the real app) */
	.body {
		display: grid;
		grid-template-columns: 8rem 1fr;
		gap: var(--space-s);
		padding: var(--space-s);
		background: var(--canvas);
	}
	.side {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.4em;
		font-weight: 600;
		color: var(--fg);
		margin-bottom: var(--space-2xs);
	}
	.logo-badge {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: var(--radius-sm);
		background: var(--accent);
		color: var(--accent-contrast);
	}
	.search {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.4em 0.5em;
		font-size: var(--step--2);
		color: var(--fg-subtle);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		margin-bottom: var(--space-2xs);
	}
	.search .kbd {
		font-size: var(--step--2);
		border: 1px solid var(--border);
		border-radius: var(--radius-xs);
		padding: 0 0.3em;
	}
	.side ul {
		list-style: none;
		margin: 0;
		padding: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.side li {
		display: flex;
		align-items: center;
		padding: 0.4em 0.5em;
		border-radius: var(--radius-sm);
		color: var(--fg-muted);
		font-size: var(--step--2);
	}
	.side li.active {
		color: var(--accent-contrast);
		background: var(--accent);
	}
	.user {
		display: flex;
		align-items: center;
		gap: 0.4em;
		margin-top: var(--space-2xs);
	}
	.uavatar {
		display: grid;
		place-items: center;
		width: 1.4rem;
		height: 1.4rem;
		flex-shrink: 0;
		border-radius: var(--radius-full);
		background: var(--accent-soft);
		color: var(--accent);
		font-size: var(--step--2);
		font-weight: 700;
	}
	.uname {
		font-size: var(--step--2);
		color: var(--fg-muted);
	}

	.panel {
		min-width: 0;
		padding: var(--space-s);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}
	.panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-s);
	}
	.panel-title {
		font-size: var(--step-0);
	}
	.new {
		font-size: var(--step--2);
		color: var(--accent);
	}

	.table {
		display: flex;
		flex-direction: column;
	}
	.thead,
	.row {
		display: grid;
		grid-template-columns: 1.4fr 0.8fr 0.9fr 0.9fr;
		align-items: center;
		gap: var(--space-s);
		padding: 0.55rem 0.4rem;
	}
	.thead {
		font-size: var(--step--2);
		color: var(--fg-subtle);
		border-bottom: 1px solid var(--border);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}
	.row {
		border-bottom: 1px solid var(--border);
	}
	.row:last-child {
		border-bottom: none;
	}
	.svc {
		display: flex;
		align-items: center;
		gap: 0.5em;
		min-width: 0;
	}
	.svc-mark {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: var(--radius-sm);
		background: var(--accent-soft);
		color: var(--accent);
		font-size: var(--step--2);
		font-weight: 600;
	}
	.region {
		color: var(--fg-subtle);
		font-size: var(--step--2);
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		font-size: var(--step--2);
		color: var(--tone);
	}
	.status .led {
		width: 6px;
		height: 6px;
		border-radius: var(--radius-full);
		background: currentColor;
	}
	.health {
		height: 6px;
		border-radius: var(--radius-full);
		background: var(--surface-2);
		overflow: hidden;
	}
	.bar {
		display: block;
		height: 100%;
		width: var(--w);
		background: var(--tone);
		border-radius: var(--radius-full);
		transition: width var(--dur-4) var(--ease-out) var(--d);
	}

	@media (prefers-reduced-motion: reduce) {
		.bar {
			transition: none;
		}
	}
</style>
