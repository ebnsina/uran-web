<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Link2,
		ScanSearch,
		Rocket,
		TrendingUp,
		ArrowUpRight,
		ArrowRight,
		GitBranch,
		Database,
		Gauge,
		GitPullRequestArrow,
		ShieldCheck,
		Activity
	} from '@lucide/svelte';
	import {
		siGit,
		siGithub,
		siDocker,
		siKubernetes,
		siPostgresql,
		siRedis,
		siGo,
		siTraefikproxy,
		siCloudflare,
		siNginx,
		siPrometheus,
		siLetsencrypt,
		siLinux,
		siNodedotjs
	} from 'simple-icons';
	import { Button, Reveal } from '$lib';
	import { smoothAnchor } from '$lib/scroll';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';
	import HeroGlow from '$lib/components/site/HeroGlow.svelte';
	import BrandIcon from '$lib/components/site/BrandIcon.svelte';
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
	import DashboardPreview from '$lib/components/site/DashboardPreview.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Hero email capture → carry the address into registration.
	function startFree(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const email = String(new FormData(form).get('email') ?? '').trim();
		goto(`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`);
	}

	// Social-proof avatars (decorative initials, tinted).
	const proof = [
		{ i: 0, c: 'b', tint: 'var(--accent)' },
		{ i: 1, c: 'm', tint: 'var(--ok)' },
		{ i: 2, c: 'k', tint: 'var(--warn)' },
		{ i: 3, c: '+', tint: 'var(--surface-hover)' }
	];

	// Capabilities read as an index / spec sheet, not a card grid.
	// Each icon carries its own colour for a livelier, scannable list.
	const capabilities = [
		{
			icon: GitBranch,
			c: '#38a8e6',
			t: 'Push to live',
			d: 'Connect a repo; every push builds, deploys, and routes itself — TLS and all.'
		},
		{
			icon: Database,
			c: '#2dd4bf',
			t: 'Managed databases',
			d: 'Postgres or Redis in a click. HA replicas, connection pooling, continuous backups + PITR.'
		},
		{
			icon: Gauge,
			c: '#fbbf24',
			t: 'Autoscaling',
			d: 'Scale on CPU between a floor and a ceiling, or pin a size from small to 2xlarge.'
		},
		{
			icon: GitPullRequestArrow,
			c: '#8b8cf7',
			t: 'Preview environments',
			d: 'Every pull request gets an isolated URL, torn down automatically when it merges.'
		},
		{
			icon: ShieldCheck,
			c: '#4ade80',
			t: 'Automatic TLS',
			d: 'Bring your domain; certificates are issued and renewed for you. HTTPS by default.'
		},
		{
			icon: Activity,
			c: '#fb7185',
			t: 'Built-in observability',
			d: 'Live logs, per-pod metrics, and usage metering — no agents to wire up.'
		}
	];

	const flow = [
		{ t: 'Connect', c: '#38a8e6', d: 'Link a repository and a branch.', icon: Link2 },
		{
			t: 'Detect',
			c: '#22d3ee',
			d: 'Read your Dockerfile, or auto-detect the stack.',
			icon: ScanSearch
		},
		{ t: 'Deploy', c: '#fbbf24', d: 'Go live behind TLS, health-checked.', icon: Rocket },
		{ t: 'Scale', c: '#4ade80', d: 'Add databases, replicas, domains.', icon: TrendingUp }
	];

	// Tech-stack logos for the marquee (the platform Uran is built on / integrates).
	const brands = [
		siGit,
		siGithub,
		siDocker,
		siKubernetes,
		siPostgresql,
		siRedis,
		siGo,
		siTraefikproxy,
		siCloudflare,
		siNginx,
		siPrometheus,
		siLetsencrypt,
		siLinux,
		siNodedotjs
	];
</script>

<svelte:head>
	<title>Uran — Ship code, not infrastructure</title>
	<meta
		name="description"
		content="Uran is the developer platform that turns a git push into a running, routed, TLS-terminated service. Managed databases, autoscaling, preview environments."
	/>
</svelte:head>

<SiteHeader user={data.user} />

<main class="frame">
	<!-- ── Hero: asymmetric, gutter-marked, panel breaks the grid ───────── -->
	<section class="hero">
		<HeroGlow />
		<div class="hero-body">
			<p class="define u-mono">
				uran <span class="phon">/uˈraːn/</span> · <em>verb</em> — to take flight
			</p>
			<h1 class="display">
				Ship code,<br /><span class="thin">not</span> infrastructure.
			</h1>
			<p class="lede">
				Connect a repository and Uran turns every push into a running, routed, TLS-terminated
				service — with managed databases, autoscaling, and preview environments built in.
			</p>
			<form class="capture" onsubmit={startFree}>
				<input
					type="email"
					name="email"
					placeholder="you@company.com"
					autocomplete="email"
					aria-label="Email address"
					required
				/>
				<button type="submit">Start free</button>
			</form>

			<div class="proof">
				<div class="avatars" aria-hidden="true">
					{#each proof as p (p.i)}
						<span class="avatar" style="--tint: {p.tint}">{p.c}</span>
					{/each}
				</div>
				<p>Join <strong>1,200+</strong> developers shipping on Uran</p>
			</div>

			<a class="browse" href="#index" onclick={smoothAnchor}>
				Browse capabilities <ArrowRight size={15} />
			</a>
		</div>
		<div class="hero-panel">
			<DashboardPreview />
		</div>
	</section>

	<!-- ── Marquee: full-bleed, slow drift ──────────────────────────────── -->
	<section class="marquee" aria-hidden="true">
		<div class="track">
			{#each [...brands, ...brands] as brand, i (i)}
				<BrandIcon icon={brand} />
			{/each}
		</div>
	</section>

	<!-- ── Capabilities: a numbered index, not a card grid ──────────────── -->
	<section id="index" class="block">
		<aside class="sticky">
			<h2 class="block-title">Capabilities</h2>
			<p class="block-note">Everything between <em>git push</em> and production.</p>
		</aside>
		<ol class="index">
			{#each capabilities as c, i (c.t)}
				{@const Icon = c.icon}
				<Reveal delay={i * 50} y={16}>
					<li class="row">
						<span class="row-ico" style="--c: {c.c}"><Icon size={20} strokeWidth={1.75} /></span>
						<div class="row-main">
							<h3>{c.t}</h3>
							<p>{c.d}</p>
						</div>
						<span class="row-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
					</li>
				</Reveal>
			{/each}
		</ol>
	</section>

	<!-- ── Workflow: a connected flow line, not step cards ──────────────── -->
	<section id="workflow" class="block">
		<aside class="sticky">
			<h2 class="block-title">Workflow</h2>
			<p class="block-note">Four moves. No YAML to babysit.</p>
		</aside>
		<ol class="flow">
			{#each flow as step, i (step.t)}
				{@const Icon = step.icon}
				<Reveal delay={i * 80} y={14}>
					<li class="step">
						<span class="step-ico" style="--c: {step.c}"><Icon size={20} strokeWidth={1.75} /></span
						>
						<h3>{step.t}</h3>
						<p>{step.d}</p>
					</li>
				</Reveal>
			{/each}
		</ol>
	</section>

	<!-- ── Closing: asymmetric statement, not a centered band ───────────── -->
	<section class="closing">
		<div class="closing-body">
			<Reveal>
				<h2 class="display closing-h">Your next deploy<br />is one push away.</h2>
				<div class="closing-cta">
					<Button href="/register" size="lg">Create your account</Button>
					<span class="u-mono closing-meta">no credit card · minutes to live</span>
				</div>
			</Reveal>
		</div>
	</section>
</main>

<SiteFooter />

<style>
	/* Editorial spec-sheet layout: hairline rules + a sticky label column. */
	.frame {
		width: min(100% - 2 * var(--space-m), var(--container-wide));
		margin-inline: auto;
		/* Clip the hero preview where it bleeds toward the edge (clip, not hidden,
		   so sticky children keep working). The clip-margin lets focus glows /
		   shadows paint just past the edge so they aren't sliced off. */
		overflow-x: clip;
		overflow-clip-margin: 2rem;
	}

	/* Shared display type — oversized, tight. */
	.display {
		font-size: clamp(2.2rem, 1.5rem + 3.4vw, 4rem);
		line-height: 1;
		letter-spacing: -0.035em;
	}
	.display .thin {
		color: var(--fg-subtle);
		font-weight: 400;
	}

	/* ── Hero ─────────────────────────────────────────────────────────── */
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-m);
		padding-block: var(--space-2xl) var(--space-xl);
		border-bottom: 1px solid var(--border);
	}
	/* Lift hero content above the decorative glow layer. */
	.hero > :not(:global(.glow)) {
		position: relative;
		z-index: 1;
	}
	.define {
		font-size: var(--step--1);
		color: var(--fg-muted);
	}
	.define .phon {
		color: var(--fg-subtle);
	}
	.define em {
		font-style: normal;
		color: var(--accent);
	}
	.hero-body {
		max-width: 38rem;
	}
	.display {
		margin-top: var(--space-m);
	}
	.lede {
		margin-top: var(--space-l);
		max-width: 34rem;
		font-size: var(--step-1);
		color: var(--fg-muted);
	}
	/* Email capture pill — the hero's primary action, so it carries weight. */
	.capture {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		margin-top: var(--space-l);
		max-width: 34rem;
		padding: 0.5rem 0.5rem 0.5rem 1.25rem;
		background: color-mix(in oklab, var(--surface) 82%, transparent);
		backdrop-filter: blur(12px);
		border: 1px solid var(--border-strong);
		border-radius: 1.6rem;
		/* squircle here only — it looked great on the hero input */
		corner-shape: squircle;
		box-shadow: var(--shadow-2);
		transition:
			border-color var(--dur-2) var(--ease-out),
			box-shadow var(--dur-2) var(--ease-out);
	}
	.capture:focus-within {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-soft);
	}
	.capture input {
		flex: 1;
		min-width: 0;
		background: transparent;
		border: none;
		color: var(--fg);
		font-size: var(--step-1);
	}
	.capture input::placeholder {
		color: var(--fg-subtle);
	}
	.capture input:focus {
		outline: none;
	}
	.capture button {
		flex-shrink: 0;
		padding: 0.7em 1.35em;
		font-size: var(--step-0);
		font-weight: 600;
		color: var(--accent-contrast);
		background: var(--accent);
		border: none;
		border-radius: 1.15rem;
		corner-shape: squircle;
		cursor: pointer;
		transition:
			background var(--dur-2) var(--ease-out),
			box-shadow var(--dur-2) var(--ease-out),
			transform var(--dur-1) var(--ease-out);
	}
	.capture button:hover {
		background: var(--accent-hover);
		transform: translateY(-1px);
	}
	.capture button:active {
		transform: translateY(0) scale(0.98);
	}

	/* Social proof */
	.proof {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		margin-top: var(--space-m);
	}
	.avatars {
		display: flex;
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 1.85rem;
		height: 1.85rem;
		margin-left: -0.55rem;
		border-radius: var(--radius-full);
		border: 2px solid var(--bg);
		background: color-mix(in oklab, var(--tint) 28%, var(--surface-2));
		color: var(--fg);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		font-weight: 600;
	}
	.avatar:first-child {
		margin-left: 0;
	}
	.proof p {
		font-size: var(--step--1);
		color: var(--fg-muted);
	}
	.proof strong {
		color: var(--fg);
		font-weight: 600;
	}

	.browse {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		margin-top: var(--space-m);
		font-size: var(--step--1);
		color: var(--fg-muted);
		transition:
			color var(--dur-2) var(--ease-out),
			gap var(--dur-2) var(--ease-out);
	}
	.browse:hover {
		color: var(--accent);
		gap: 0.6em;
	}

	.hero-panel {
		margin-top: var(--space-l);
	}

	/* ── Marquee ──────────────────────────────────────────────────────── */
	.marquee {
		overflow: hidden;
		padding-block: var(--space-l);
		border-bottom: 1px solid var(--border);
		-webkit-mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
		mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
	}
	.track {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xl);
		white-space: nowrap;
		animation: drift 52s linear infinite;
	}
	.marquee:hover .track {
		animation-play-state: paused;
	}
	@keyframes drift {
		to {
			transform: translateX(-50%);
		}
	}

	/* ── Block scaffold (gutter marker + content) ─────────────────────── */
	.block {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-l);
		padding-block: var(--space-2xl);
		border-bottom: 1px solid var(--border);
		/* clear the sticky header when scrolled to via in-page nav */
		scroll-margin-top: calc(var(--header-h) + var(--space-s));
	}
	.block-title {
		margin-top: var(--space-xs);
		font-size: var(--step-2);
	}
	.block-note {
		margin-top: var(--space-2xs);
		max-width: 18rem;
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.block-note em {
		font-style: normal;
		font-family: var(--font-mono);
		color: var(--accent);
		font-size: 0.9em;
	}

	/* ── Index list ───────────────────────────────────────────────────── */
	.index {
		list-style: none;
		margin: 0;
		padding: 0;
		border-bottom: 1px solid var(--border);
	}
	.row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: start;
		gap: var(--space-m);
		padding: var(--space-m) var(--space-2xs);
		border-top: 1px solid var(--border);
		transition:
			background var(--dur-2) var(--ease-out),
			padding-left var(--dur-2) var(--ease-out);
	}
	.row:hover {
		background: var(--surface);
		padding-left: var(--space-s);
	}
	.row-ico {
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		color: var(--c, var(--accent));
		background: color-mix(in oklab, var(--c, var(--accent)) 13%, transparent);
		border: 1px solid color-mix(in oklab, var(--c, var(--accent)) 28%, transparent);
		border-radius: var(--radius-md);
		transition: background var(--dur-2) var(--ease-out);
	}
	.row:hover .row-ico {
		background: color-mix(in oklab, var(--c, var(--accent)) 22%, transparent);
	}
	.row-main h3 {
		font-size: var(--step-1);
	}
	.row-main p {
		margin-top: var(--space-3xs);
		max-width: 40rem;
		color: var(--fg-muted);
		font-size: var(--step-0);
	}
	.row-arrow {
		display: inline-flex;
		align-self: center;
		color: var(--fg-subtle);
		opacity: 0;
		transform: translate(-6px, 6px);
		transition:
			opacity var(--dur-2) var(--ease-out),
			transform var(--dur-2) var(--ease-out),
			color var(--dur-2) var(--ease-out);
	}
	.row:hover .row-arrow {
		opacity: 1;
		transform: none;
		color: var(--accent);
	}

	/* ── Workflow steps (icon-led) ────────────────────────────────────── */
	.flow {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-l);
	}
	.step-ico {
		display: grid;
		place-items: center;
		width: 2.6rem;
		height: 2.6rem;
		margin-bottom: var(--space-s);
		color: var(--c, var(--accent));
		background: color-mix(in oklab, var(--c, var(--accent)) 13%, transparent);
		border: 1px solid color-mix(in oklab, var(--c, var(--accent)) 28%, transparent);
		border-radius: var(--radius-md);
	}
	.step h3 {
		font-size: var(--step-1);
	}
	.step p {
		margin-top: var(--space-3xs);
		color: var(--fg-muted);
		font-size: var(--step--1);
	}

	/* ── Closing ──────────────────────────────────────────────────────── */
	.closing {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-m);
		padding-block: var(--space-3xl);
	}
	.closing-cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-m);
		margin-top: var(--space-l);
	}
	.closing-meta {
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}

	/* ── Editorial layout kicks in at wider widths ────────────────────── */
	@media (min-width: 60rem) {
		.hero {
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
			column-gap: var(--space-xl);
			align-items: center;
			padding-block: var(--space-3xl) var(--space-2xl);
		}
		.hero-body {
			grid-column: 1;
		}
		/* Panel sits in the right column, vertically centred with the copy. */
		.hero-panel {
			grid-column: 2;
			justify-self: start;
			min-width: 0;
			margin-top: 0;
			z-index: 1;
		}
		.hero-panel :global(.win) {
			width: 44rem;
			/* Dissolve the right edge into the background for a soft, premium
			   blend rather than a hard rectangular cut. */
			-webkit-mask-image: linear-gradient(90deg, #000 60%, transparent 96%);
			mask-image: linear-gradient(90deg, #000 60%, transparent 96%);
		}

		.block {
			grid-template-columns: 16rem 1fr;
			column-gap: var(--space-xl);
		}
		.sticky {
			position: sticky;
			top: calc(var(--header-h) + var(--space-m));
			align-self: start;
		}
		.flow {
			grid-template-columns: repeat(4, 1fr);
			gap: var(--space-l);
		}

		.closing {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}
	}
</style>
