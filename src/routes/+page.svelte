<script lang="ts">
	import {
		ArrowRight,
		Check,
		Boxes,
		FileCode2,
		Box,
		HardDrive,
		Database,
		Radio,
		Gauge,
		ShieldCheck,
		Network,
		ShieldAlert,
		BadgeCheck,
		ScrollText,
		Lock,
		KeyRound,
		Search
	} from '@lucide/svelte';
	import { Button, Reveal, Sparkline, RollingNumber } from '$lib';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';
	import HeroGlow from '$lib/components/site/HeroGlow.svelte';
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
	import DeployPanel from '$lib/components/site/DeployPanel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Sticky scroll: highlight one primitive at a time, kept centered, as the
	// section scrolls through its track.
	let revealTrack = $state<HTMLElement>();
	let activeIndex = $state(0);
	function onRevealScroll() {
		const el = revealTrack;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const total = rect.height - window.innerHeight;
		const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
		const progress = total > 0 ? scrolled / total : 0;
		activeIndex = Math.min(words.length - 1, Math.max(0, Math.floor(progress * words.length)));
	}

	const proof = [
		{ i: 0, c: 'b', tint: 'var(--accent)' },
		{ i: 1, c: 'm', tint: 'var(--ok)' },
		{ i: 2, c: 'k', tint: 'var(--warn)' },
		{ i: 3, c: '+', tint: 'var(--surface-hover)' }
	];

	const brands = [
		'Git',
		'GitHub',
		'Docker',
		'Kubernetes',
		'PostgreSQL',
		'Redis',
		'Go',
		'Traefik',
		'Cloudflare',
		'NGINX',
		'Prometheus',
		"Let's Encrypt",
		'Linux',
		'Node.js'
	];

	// "Click, click, done" — three numbered moves.
	const steps = [
		{
			n: 1,
			t: 'Select a service',
			d: 'Web service, static site, background worker, or cron — pick what you need to run.'
		},
		{
			n: 2,
			t: 'Deploy your code',
			d: 'Connect a repo. Uran builds on the right runtime for your framework, or your Dockerfile.'
		},
		{
			n: 3,
			t: 'Uran does the rest',
			d: 'Instant routing, TLS, autoscaling, preview environments, rollbacks, and monitoring.'
		}
	];

	// Colourful primitive words for the zero-ops statement (on-brand hues).
	const words = [
		{ w: 'web services', c: '#38a8e6' },
		{ w: 'Postgres', c: '#2dd4bf' },
		{ w: 'databases', c: '#2dd4bf' },
		{ w: 'cron jobs', c: '#fbbf24' },
		{ w: 'workflows', c: '#8b8cf7' },
		{ w: 'static sites', c: '#38bdf8' },
		{ w: 'background workers', c: '#f59e0b' },
		{ w: 'key value stores', c: '#fb7185' },
		{ w: 'private services', c: '#4ade80' },
		{ w: 'and more', c: 'var(--fg-subtle)' }
	];

	// "Designed for builders" primitives grid.
	const primitives = [
		{
			icon: Boxes,
			c: '#38a8e6',
			t: 'Native runtimes',
			d: 'High-performance environments for nearly every popular framework.'
		},
		{
			icon: FileCode2,
			c: '#4ade80',
			t: 'Deploy from Git',
			d: 'Every push builds and ships itself — no YAML to babysit.'
		},
		{
			icon: Box,
			c: '#8b8cf7',
			t: 'Isolated environments',
			d: 'Preview and production stay cleanly, safely separated.'
		},
		{
			icon: HardDrive,
			c: '#fbbf24',
			t: 'Persistent disks',
			d: 'Attach durable volumes to stateful services in a click.'
		},
		{
			icon: Database,
			c: '#2dd4bf',
			t: 'Managed Postgres & Redis',
			d: 'HA replicas, connection pooling, backups + PITR.'
		},
		{
			icon: Radio,
			c: '#fb7185',
			t: 'WebSockets',
			soon: true,
			d: 'Long-lived, bi-directional streaming out of the box.'
		},
		{
			icon: Gauge,
			c: '#38bdf8',
			t: 'Autoscaling',
			d: 'Scale on CPU between a floor and a ceiling, automatically.'
		},
		{
			icon: ShieldCheck,
			c: '#f59e0b',
			t: 'Fully-managed TLS',
			d: 'Free certificates for every domain, issued and renewed.'
		}
	];

	// "Secure by default" grid.
	const security = [
		{
			icon: Network,
			c: '#38a8e6',
			t: 'Private networking',
			soon: true,
			d: 'Keep internal traffic off the public internet — no VPC wrangling.'
		},
		{
			icon: ShieldAlert,
			c: '#fb7185',
			t: 'DDoS protection',
			soon: true,
			d: 'Every service is shielded from attacks without extra config.'
		},
		{
			icon: BadgeCheck,
			c: '#4ade80',
			t: 'Managed compliance',
			soon: true,
			d: 'Encryption, controls, and audit trails built in from day one.'
		},
		{
			icon: ScrollText,
			c: '#fbbf24',
			t: 'Audit logging',
			d: 'A built-in, queryable trail for every platform event.'
		},
		{
			icon: Lock,
			c: '#8b8cf7',
			t: 'Encryption at rest',
			soon: true,
			d: 'Databases, backups, and secrets encrypted by default.'
		},
		{
			icon: KeyRound,
			c: '#2dd4bf',
			t: 'Role-based access',
			d: 'Control who can touch what with organization roles.'
		}
	];

	const scaleSeries = [28, 34, 30, 46, 40, 62, 55, 84, 70, 96, 88, 120];
	const logLines = [
		{ t: '18:58:02', m: 'GET /healthz', s: '200' },
		{ t: '18:58:03', m: 'POST /v1/deploys', s: '201' },
		{ t: '18:58:05', m: 'GET /api/orders', s: '200' },
		{ t: '18:58:07', m: 'build: image pushed', s: 'ok' }
	];
</script>

<svelte:head>
	<title>Uran — Ship code, not infrastructure</title>
	<meta
		name="description"
		content="Uran is the developer platform that turns a git push into a running, routed, TLS-terminated service. Managed databases, autoscaling, preview environments."
	/>
</svelte:head>

<svelte:window onscroll={onRevealScroll} onresize={onRevealScroll} />

<SiteHeader user={data.user} />

<main>
	<!-- ── Hero ─────────────────────────────────────────────────────────── -->
	<section class="hero u-container">
		<HeroGlow />
		<div class="hero-body">
			<p class="define u-mono">
				uran <span class="phon">/uˈraːn/</span> · <em>verb</em> — to take flight
			</p>
			<h1 class="display hero-h">
				Your fastest path to production for <span class="hl">every push.</span>
			</h1>
			<ul class="hero-checks">
				<li>
					<span class="tick"><Check size={13} strokeWidth={3.2} /></span>
					Every push builds, deploys, and routes itself
				</li>
				<li>
					<span class="tick"><Check size={13} strokeWidth={3.2} /></span>
					Managed Postgres &amp; Redis, autoscaling, and TLS
				</li>
				<li>
					<span class="tick"><Check size={13} strokeWidth={3.2} /></span>
					Preview environments for every pull request
				</li>
			</ul>
			<div class="hero-cta">
				<Button href="/register" size="lg">Start free <ArrowRight size={16} /></Button>
				<Button href="/docs" variant="secondary" size="lg">Read the docs</Button>
			</div>
			<div class="proof">
				<div class="avatars" aria-hidden="true">
					{#each proof as p (p.i)}
						<span class="avatar" style="--tint: {p.tint}">{p.c}</span>
					{/each}
				</div>
				<p>Join <strong><RollingNumber value="1,200" />+</strong> developers shipping on Uran</p>
			</div>
		</div>

		<div class="hero-panel">
			<DeployPanel />
		</div>
	</section>

	<!-- ── Works with your stack (marquee) ──────────────────────────────── -->
	<section class="stack">
		<p class="eyebrow u-mono">Works with your stack</p>
		<div class="marquee" aria-hidden="true">
			<div class="track">
				{#each [...brands, ...brands] as brand, i (i)}
					<span class="wordmark">{brand}</span>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Click, click, done ───────────────────────────────────────────── -->
	<section id="workflow" class="u-container block">
		<Reveal><h2 class="display sm">Click, click, done.</h2></Reveal>
		<ol class="steps">
			{#each steps as s, i (s.n)}
				<Reveal delay={i * 70} y={16}>
					<li>
						<span class="step-n u-mono">{s.n}</span>
						<h3>{s.t}</h3>
						<p>{s.d}</p>
					</li>
				</Reveal>
			{/each}
		</ol>
	</section>

	<!-- ── Zero ops: sticky scroll word reveal ──────────────────────────── -->
	<section class="reveal-section">
		<div class="reveal-track" bind:this={revealTrack}>
			<div class="reveal-sticky">
				<div class="u-container">
					<h2 class="display sm reveal-h">
						Deploy apps and agents with <span class="hl">zero ops.</span>
					</h2>
					<p class="reveal-intro">Intuitive hosting and private networking for</p>
					<div class="reveal-viewport" style="--active: {activeIndex}">
						<ul class="reveal-words">
							{#each words as w, i (w.w)}
								<li class:on={i === activeIndex} style="--c: {w.c}">{w.w}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ── Full-stack previews ──────────────────────────────────────────── -->
	<section class="u-container block band">
		<div class="split top">
			<Reveal>
				<div class="feature">
					<h2 class="head">Full-stack previews for every pull request</h2>
					<p>
						Iterate quickly with ephemeral previews of your entire application for every change.
					</p>
					<a class="doclink" href="/docs">Preview environment docs <ArrowRight size={15} /></a>
				</div>
			</Reveal>
			<Reveal delay={80}>
				<div class="mock preview">
					<div class="preview-pr">
						<span class="pr u-mono">PR #128</span>
						<span class="open u-mono">Open preview →</span>
					</div>
					<span class="branch u-mono">feature/database</span>
					<span class="checks"><Check size={13} /> Checks passed</span>
					<ul class="env">
						{#each ['web', 'api', 'database', 'worker'] as e (e)}
							<li>
								<span class="led"></span><span class="u-mono">{e}</span><span class="avail"
									>Available</span
								>
							</li>
						{/each}
					</ul>
				</div>
			</Reveal>
		</div>
	</section>

	<!-- ── Autoscaling ──────────────────────────────────────────────────── -->
	<section class="u-container block">
		<div class="split top">
			<Reveal>
				<div class="feature">
					<h2 class="head">Load-based autoscaling that handles 100× traffic bursts and beyond</h2>
					<p>
						Keep your workloads running smoothly through viral moments, seasonal spikes, and launch
						days.
					</p>
					<a class="doclink" href="/docs">Autoscaling docs <ArrowRight size={15} /></a>
				</div>
			</Reveal>
			<Reveal delay={80}>
				<div class="mock chart">
					<span class="chip u-mono">INSTANCE TYPE<br />64 CPU · 512GB</span>
					<Sparkline data={scaleSeries} height={120} />
				</div>
			</Reveal>
		</div>
		<div class="split">
			<Reveal>
				<div class="feature">
					<h3>Durable, long-running workflows as code <span class="soon">Soon</span></h3>
					<p>
						Run reliable agents and background processes at scale — without wiring up queues,
						workers, and retry logic.
					</p>
					<a class="doclink" href="/docs">Workflow docs <ArrowRight size={15} /></a>
				</div>
			</Reveal>
			<Reveal delay={80}>
				<div class="feature">
					<h3>Enterprise-grade Postgres databases</h3>
					<p>
						Fully-managed databases with point-in-time recovery, read replicas, and high
						availability.
					</p>
					<a class="doclink" href="/docs">Postgres docs <ArrowRight size={15} /></a>
				</div>
			</Reveal>
		</div>
	</section>

	<!-- ── Observability ────────────────────────────────────────────────── -->
	<section class="u-container block band">
		<div class="split top">
			<Reveal>
				<div class="feature">
					<h2 class="head">Integrated logs and monitoring for builds, deploys and live services</h2>
					<p>
						See critical metrics for all of your Uran infrastructure from day zero, and stream
						telemetry to external tools.
					</p>
					<a class="doclink" href="/docs">Observability docs <ArrowRight size={15} /></a>
				</div>
			</Reveal>
			<Reveal delay={80}>
				<div class="mock logs">
					<div class="logs-head">
						<span class="u-mono">All logs</span>
						<span class="logs-search"><Search size={12} /> Search</span>
					</div>
					{#each logLines as l (l.t)}
						<div class="logrow u-mono">
							<span class="lt">{l.t}</span>
							<span class="lm">{l.m}</span>
							<span class="ls" class:ok={l.s === '200' || l.s === 'ok'}>{l.s}</span>
						</div>
					{/each}
				</div>
			</Reveal>
		</div>
	</section>

	<!-- ── Primitives grid ──────────────────────────────────────────────── -->
	<section id="capabilities" class="u-container block">
		<Reveal
			><h2 class="display sm">Intuitive infrastructure,<br />designed for builders.</h2></Reveal
		>
		<Reveal delay={60}
			><p class="sub">Ship software faster with integrated primitives that just work.</p></Reveal
		>
		<div class="grid4">
			{#each primitives as p, i (p.t)}
				{@const Icon = p.icon}
				<Reveal delay={i * 40} y={14}>
					<div class="cell">
						<span class="cell-ico" style="--c: {p.c}"><Icon size={20} strokeWidth={1.75} /></span>
						<h3>
							{p.t}{#if p.soon}<span class="soon">Soon</span>{/if}
						</h3>
						<p>{p.d}</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</section>

	<!-- ── Security ─────────────────────────────────────────────────────── -->
	<section class="u-container block band">
		<Reveal><h2 class="display sm">Stay secure and<br />resilient by default.</h2></Reveal>
		<Reveal delay={60}><p class="sub">Build products, not compliance.</p></Reveal>
		<div class="grid3">
			{#each security as s, i (s.t)}
				{@const Icon = s.icon}
				<Reveal delay={i * 40} y={14}>
					<div class="cell">
						<span class="cell-ico" style="--c: {s.c}"><Icon size={20} strokeWidth={1.75} /></span>
						<h3>
							{s.t}{#if s.soon}<span class="soon">Soon</span>{/if}
						</h3>
						<p>{s.d}</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</section>

	<!-- ── CTA ──────────────────────────────────────────────────────────── -->
	<section class="cta u-container">
		<Reveal>
			<div class="cta-card">
				<span class="cta-glow" aria-hidden="true"></span>
				<h2 class="display sm">Start building with Uran.</h2>
				<p>Zero ops, zero surprises — from your first push to your billionth request.</p>
				<Button href="/register" size="lg">Deploy your app for free <ArrowRight size={16} /></Button
				>
				<p class="cta-meta u-mono">no credit card · minutes to live</p>
			</div>
		</Reveal>
	</section>
</main>

<SiteFooter />

<style>
	main {
		overflow-x: clip;
	}

	.display {
		font-size: var(--h-display);
		line-height: 1.15;
		letter-spacing: 0;
		font-weight: 600;
		font-stretch: expanded; /* Mona Sans width axis — the Dribbble hero look */
		text-wrap: balance;
		font-optical-sizing: auto;
	}
	.display.sm {
		font-size: var(--h-lg);
		line-height: 1.2;
	}
	.hero-h {
		max-width: 20ch;
	}
	/* Decorative hand-drawn accent underline: a curved brush stroke, masked so
	   it picks up --accent, with a slight casual tilt. */
	.hl {
		position: relative;
		color: var(--fg);
		white-space: nowrap;
	}
	.hl::after {
		content: '';
		position: absolute;
		left: -0.05em;
		right: -0.05em;
		bottom: -0.18em;
		height: 0.42em;
		background: var(--accent);
		-webkit-mask: var(--stroke) no-repeat center / 100% 100%;
		mask: var(--stroke) no-repeat center / 100% 100%;
		transform: rotate(-1.4deg);
		--stroke: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20300%2022'%20preserveAspectRatio='none'%3E%3Cpath%20d='M4%2012%20C%2070%203%20150%2020%20220%2010%20C%20260%205%20285%209%20296%2013'%20fill='none'%20stroke='%23000'%20stroke-width='5'%20stroke-linecap='round'/%3E%3C/svg%3E");
	}
	.block {
		padding-block: clamp(var(--space-xl), 5vw, var(--space-2xl));
	}
	/* Alternating full-width band to separate sections (works both themes). */
	.band {
		position: relative;
	}
	.band::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset-block: 0;
		left: 50%;
		width: 100vw;
		transform: translateX(-50%);
		background: var(--surface-2);
		border-block: 1px solid var(--border);
	}
	.sub {
		margin-top: var(--space-s);
		max-width: 40rem;
		color: var(--fg-muted);
		font-size: var(--step-1);
	}
	.doclink {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		margin-top: var(--space-s);
		color: var(--accent);
		font-size: var(--step--1);
		font-weight: 500;
	}
	.doclink:hover {
		text-decoration: underline;
	}

	/* ── Hero ──────────────────────────────────────────────────────────── */
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-2xl);
		align-items: center;
		padding-block: clamp(var(--space-2xl), 8vw, var(--space-3xl));
	}
	.define {
		font-size: var(--step--1);
		color: var(--fg-subtle);
		margin-bottom: var(--space-m);
	}
	.define em {
		font-style: italic;
		color: var(--fg-muted);
	}
	.phon {
		color: var(--fg-muted);
	}
	.hero-checks {
		list-style: none;
		margin: var(--space-l) 0 0;
		padding: 0;
		display: grid;
		gap: var(--space-s);
		max-width: 34rem;
	}
	.hero-checks li {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		font-size: var(--step-0);
		color: var(--fg);
	}
	.tick {
		display: grid;
		place-items: center;
		width: 1.4rem;
		height: 1.4rem;
		flex-shrink: 0;
		border-radius: var(--radius-full);
		background: var(--accent-soft);
		color: var(--accent);
	}
	.hero-cta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-s);
		margin-top: var(--space-l);
	}
	.proof {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		margin-top: var(--space-l);
		font-size: var(--step--1);
		color: var(--fg-muted);
	}
	.avatars {
		display: flex;
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		margin-right: -0.5rem;
		border-radius: var(--radius-full);
		background: var(--tint);
		color: #fff;
		font-size: var(--step--2);
		font-weight: 700;
		border: 2px solid var(--bg);
	}

	.hero-panel {
		position: relative;
		min-width: 0;
	}
	/* Premium accent halo behind the deploy console. */
	.hero-panel::before {
		content: '';
		position: absolute;
		inset: -14% -8% -14% 2%;
		z-index: -1;
		background:
			radial-gradient(
				55% 45% at 60% 30%,
				color-mix(in oklab, var(--accent) 26%, transparent),
				transparent 72%
			),
			radial-gradient(
				40% 40% at 28% 82%,
				color-mix(in oklab, var(--accent-2) 16%, transparent),
				transparent 70%
			);
		filter: blur(36px);
		pointer-events: none;
	}
	.hero-panel :global(.panel) {
		box-shadow:
			var(--shadow-3),
			0 0 0 1px color-mix(in oklab, var(--fg) 6%, transparent);
	}

	/* ── Stack marquee ─────────────────────────────────────────────────── */
	.stack {
		padding-block: var(--space-xl);
		text-align: center;
	}
	.eyebrow {
		font-size: var(--step--2);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--fg-subtle);
		margin-bottom: var(--space-l);
	}
	.marquee {
		overflow: hidden;
		-webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
		mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
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
	.wordmark {
		font-size: var(--step-1);
		font-weight: 600;
		letter-spacing: var(--tracking-tight);
		color: var(--fg-subtle);
	}
	@keyframes drift {
		to {
			transform: translateX(-50%);
		}
	}

	/* ── Steps ─────────────────────────────────────────────────────────── */
	.steps {
		list-style: none;
		margin: var(--space-xl) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-m);
	}
	.steps li {
		padding: var(--space-l);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		transition:
			border-color var(--dur-2) var(--ease-out),
			transform var(--dur-2) var(--ease-out);
	}
	.steps li:hover {
		border-color: color-mix(in oklab, var(--accent) 45%, var(--border));
		transform: translateY(-2px);
	}
	.step-n {
		display: inline-grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		border-radius: 7px;
		background: var(--accent);
		color: var(--accent-contrast);
		font-weight: 700;
		font-size: var(--step--1);
		margin-bottom: var(--space-m);
	}
	.steps h3 {
		font-size: var(--h-sm);
		font-weight: 600;
		margin-bottom: var(--space-2xs);
	}
	.steps p {
		color: var(--fg-muted);
		line-height: var(--leading-normal);
	}

	/* ── Split feature rows ────────────────────────────────────────────── */
	.split {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
		margin-top: var(--space-xl);
	}
	.split.top {
		align-items: start;
	}
	.feature h2.head {
		font-size: var(--h-md);
		line-height: 1.19;
		font-weight: 600;
	}
	.feature h3 {
		font-size: var(--h-sm);
		line-height: 1.21;
		font-weight: 600;
	}
	.feature > p {
		margin-top: var(--space-s);
		color: var(--fg-muted);
		max-width: 32rem;
		line-height: var(--leading-normal);
	}
	/* ── Sticky scroll word reveal ─────────────────────────────────────── */
	.reveal-track {
		position: relative;
		height: 240vh;
	}
	.reveal-sticky {
		position: sticky;
		top: 0;
		display: grid;
		align-content: center;
		min-height: 100vh;
		padding-block: var(--space-2xl);
	}
	.reveal-h {
		margin-bottom: var(--space-l);
	}
	.reveal-intro {
		font-size: clamp(1.2rem, 2.4vw, 1.8rem);
		color: var(--fg-muted);
		margin-bottom: var(--space-m);
	}
	/* A 3-row window; the active word sits in the middle row, neighbours fade. */
	.reveal-viewport {
		--ih: clamp(2.8rem, 7vw, 4.4rem);
		height: calc(var(--ih) * 3);
		overflow: hidden;
		-webkit-mask-image: linear-gradient(transparent, #000 33%, #000 67%, transparent);
		mask-image: linear-gradient(transparent, #000 33%, #000 67%, transparent);
	}
	.reveal-words {
		list-style: none;
		margin: 0;
		padding: 0;
		transform: translateY(calc((1 - var(--active)) * var(--ih)));
		transition: transform var(--dur-4) var(--ease-out);
	}
	.reveal-words li {
		display: flex;
		align-items: center;
		height: var(--ih);
		font-family: var(--font-mono);
		font-size: clamp(1.4rem, 4vw, 2.6rem);
		font-weight: 600;
		letter-spacing: var(--tracking-tight);
		color: var(--fg-subtle);
		opacity: 0.25;
		transition:
			color var(--dur-3) var(--ease-out),
			opacity var(--dur-3) var(--ease-out);
	}
	.reveal-words li.on {
		color: var(--c);
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.reveal-track {
			height: auto;
		}
		.reveal-sticky {
			position: static;
			min-height: 0;
		}
		.reveal-viewport {
			height: auto;
			overflow: visible;
			mask-image: none;
			-webkit-mask-image: none;
		}
		.reveal-words {
			transform: none;
		}
		.reveal-words li {
			opacity: 1;
			color: var(--c);
		}
	}

	/* ── Mocks ─────────────────────────────────────────────────────────── */
	.mock {
		margin-top: var(--space-l);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--space-m);
	}
	.preview-pr {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.preview .pr {
		font-weight: 700;
	}
	.preview .open {
		color: var(--accent);
		font-size: var(--step--2);
	}
	.preview .branch {
		display: block;
		margin-top: var(--space-2xs);
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.preview .checks {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		margin-top: var(--space-2xs);
		font-size: var(--step--2);
		color: var(--ok);
	}
	.preview .env {
		list-style: none;
		margin: var(--space-s) 0 0;
		padding: var(--space-s) 0 0;
		border-top: 1px solid var(--border);
		display: grid;
		gap: var(--space-2xs);
	}
	.preview .env li {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--space-s);
		font-size: var(--step--1);
	}
	.preview .led {
		width: 7px;
		height: 7px;
		border-radius: var(--radius-full);
		background: var(--ok);
	}
	.preview .avail {
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}

	.chart {
		position: relative;
		padding-top: var(--space-xl);
	}
	.chart .chip {
		position: absolute;
		top: var(--space-s);
		left: var(--space-m);
		font-size: var(--step--2);
		color: var(--fg-subtle);
		line-height: 1.4;
	}

	.logs .logs-head {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding-bottom: var(--space-s);
		border-bottom: 1px solid var(--border);
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.logs-search {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		margin-left: auto;
		padding: 0.2em 0.6em;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}
	.logrow {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--space-s);
		padding: 0.4em 0;
		font-size: var(--step--2);
		color: var(--fg-muted);
	}
	.logrow .lt {
		color: var(--fg-subtle);
	}
	.logrow .ls {
		color: var(--warn);
	}
	.logrow .ls.ok {
		color: var(--ok);
	}

	/* ── Feature grids ─────────────────────────────────────────────────── */
	.grid4,
	.grid3 {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-m);
		margin-top: var(--space-2xl);
	}
	/* Reveal wrappers are the grid items — let them (and the cards inside) fill
	   the row so every card in a row is the same height. */
	.grid4 :global(.reveal),
	.grid3 :global(.reveal),
	.steps :global(.reveal) {
		height: 100%;
	}
	.cell {
		height: 100%;
		padding: var(--space-l);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		transition:
			border-color var(--dur-2) var(--ease-out),
			transform var(--dur-2) var(--ease-out);
	}
	.cell:hover {
		border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
		transform: translateY(-3px);
	}
	.cell-ico {
		display: inline-grid;
		place-items: center;
		width: 2.6rem;
		height: 2.6rem;
		border-radius: var(--radius-sm);
		color: var(--c);
		border: 1px solid color-mix(in oklab, var(--c) 42%, transparent);
		background: color-mix(in oklab, var(--c) 12%, transparent);
		margin-bottom: var(--space-m);
	}
	.soon {
		display: inline-block;
		margin-left: 0.5em;
		padding: 0.1em 0.5em;
		font-family: var(--font-mono);
		font-size: 0.62em;
		font-weight: 600;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		vertical-align: middle;
		color: var(--accent);
		background: var(--accent-soft);
		border: 1px solid color-mix(in oklab, var(--accent) 35%, transparent);
		border-radius: var(--radius-full);
	}
	.cell h3 {
		font-size: var(--h-sm);
		font-weight: 600;
		margin-bottom: var(--space-2xs);
	}
	.cell p {
		color: var(--fg-muted);
		font-size: var(--step--1);
		line-height: var(--leading-normal);
	}

	/* ── CTA ───────────────────────────────────────────────────────────── */
	.cta {
		padding-block: clamp(var(--space-2xl), 8vw, var(--space-3xl));
	}
	.cta-card {
		position: relative;
		max-width: 48rem;
		margin: 0 auto;
		padding: clamp(var(--space-2xl), 6vw, var(--space-3xl)) var(--space-l);
		text-align: center;
		overflow: hidden;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-2xl);
	}
	.cta-glow {
		position: absolute;
		top: -40%;
		left: 50%;
		width: 30rem;
		height: 22rem;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse at center,
			color-mix(in oklab, var(--accent) 30%, transparent),
			transparent 70%
		);
		filter: blur(20px);
		pointer-events: none;
	}
	.cta-card h2,
	.cta-card p {
		position: relative;
	}
	.cta-card > p {
		max-width: 34rem;
		margin: var(--space-m) auto var(--space-l);
		color: var(--fg-muted);
		font-size: var(--step-1);
	}
	.cta-meta {
		margin-top: var(--space-m) !important;
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}

	/* ── Responsive ────────────────────────────────────────────────────── */
	@media (min-width: 52rem) {
		.hero {
			grid-template-columns: 1.05fr 1fr;
		}
		.steps {
			grid-template-columns: repeat(3, 1fr);
		}
		.split {
			grid-template-columns: 1fr 1fr;
			align-items: center;
		}
		.grid4 {
			grid-template-columns: repeat(4, 1fr);
		}
		.grid3 {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (min-width: 72rem) {
		.hero-panel :global(.panel) {
			min-width: 34rem;
		}
	}
</style>
