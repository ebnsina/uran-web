<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		ArrowRight,
		Check,
		Terminal,
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
	import { Button, Reveal, Sparkline } from '$lib';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';
	import HeroGlow from '$lib/components/site/HeroGlow.svelte';
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
	import DashboardPreview from '$lib/components/site/DashboardPreview.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function startFree(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const email = String(new FormData(form).get('email') ?? '').trim();
		goto(`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`);
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
			t: 'Native runtimes',
			d: 'High-performance environments for nearly every popular framework.'
		},
		{
			icon: FileCode2,
			t: 'Deploy from Git',
			d: 'Every push builds and ships itself — no YAML to babysit.'
		},
		{
			icon: Box,
			t: 'Isolated environments',
			d: 'Preview and production stay cleanly, safely separated.'
		},
		{
			icon: HardDrive,
			t: 'Persistent disks',
			d: 'Attach durable volumes to stateful services in a click.'
		},
		{
			icon: Database,
			t: 'Managed Postgres & Redis',
			d: 'HA replicas, connection pooling, backups + PITR.'
		},
		{ icon: Radio, t: 'WebSockets', d: 'Long-lived, bi-directional streaming out of the box.' },
		{
			icon: Gauge,
			t: 'Autoscaling',
			d: 'Scale on CPU between a floor and a ceiling, automatically.'
		},
		{
			icon: ShieldCheck,
			t: 'Fully-managed TLS',
			d: 'Free certificates for every domain, issued and renewed.'
		}
	];

	// "Secure by default" grid.
	const security = [
		{
			icon: Network,
			t: 'Private networking',
			d: 'Keep internal traffic off the public internet — no VPC wrangling.'
		},
		{
			icon: ShieldAlert,
			t: 'DDoS protection',
			d: 'Every service is shielded from attacks without extra config.'
		},
		{
			icon: BadgeCheck,
			t: 'Managed compliance',
			d: 'Encryption, controls, and audit trails built in from day one.'
		},
		{
			icon: ScrollText,
			t: 'Audit logging',
			d: 'A built-in, queryable trail for every platform event.'
		},
		{
			icon: Lock,
			t: 'Encryption at rest',
			d: 'Databases, backups, and secrets encrypted by default.'
		},
		{
			icon: KeyRound,
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
				Your fastest path to production for <span class="grad">every push.</span>
			</h1>
			<p class="lede">
				Connect a repository and Uran turns every push into a running, routed, TLS-terminated
				service — with managed databases, autoscaling, and preview environments built in.
			</p>
			<form class="capture u-squircle" onsubmit={startFree}>
				<input
					type="email"
					name="email"
					placeholder="you@company.com"
					autocomplete="email"
					aria-label="Email address"
					required
				/>
				<button class="u-squircle" type="submit">Start free</button>
			</form>
			<div class="proof">
				<div class="avatars" aria-hidden="true">
					{#each proof as p (p.i)}
						<span class="avatar" style="--tint: {p.tint}">{p.c}</span>
					{/each}
				</div>
				<p>Join <strong>1,200+</strong> developers shipping on Uran</p>
			</div>
		</div>

		<div class="hero-panel">
			<span class="gitpush u-mono"><Terminal size={14} /> $ git push</span>
			<DashboardPreview />
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

	<!-- ── Zero ops ─────────────────────────────────────────────────────── -->
	<section class="u-container block">
		<Reveal>
			<h2 class="display sm">
				Deploy apps and agents<br />with <span class="grad">zero ops.</span>
			</h2>
		</Reveal>
		<div class="split">
			<Reveal>
				<p class="words">
					Intuitive hosting and private networking for
					{#each words as w, i (w.w)}<span style="color: {w.c}">{w.w}</span
						>{#if i < words.length - 1},
						{/if}{/each}.
				</p>
			</Reveal>
			<Reveal delay={80}>
				<div class="feature">
					<h3>Full-stack previews for every pull request</h3>
					<p>
						Iterate quickly with ephemeral previews of your entire application for every change.
					</p>
					<a class="doclink" href="/docs">Preview environment docs <ArrowRight size={15} /></a>
					<div class="mock preview">
						<div class="preview-pr">
							<span class="pr u-mono">PR #128</span>
							<span class="open u-mono">Open preview →</span>
						</div>
						<span class="branch u-mono">feature/database</span>
						<span class="checks"><Check size={13} /> Checks passed</span>
						<ul class="env">
							{#each ['web', 'api', 'database', 'workflow'] as e (e)}
								<li>
									<span class="led"></span><span class="u-mono">{e}</span><span class="avail"
										>Available</span
									>
								</li>
							{/each}
						</ul>
					</div>
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
					<h3>Durable, long-running workflows as code</h3>
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
	<section class="u-container block">
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
						<span class="cell-ico"><Icon size={20} strokeWidth={1.75} /></span>
						<h3>{p.t}</h3>
						<p>{p.d}</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</section>

	<!-- ── Security ─────────────────────────────────────────────────────── -->
	<section class="u-container block">
		<Reveal><h2 class="display sm">Stay secure and<br />resilient by default.</h2></Reveal>
		<Reveal delay={60}><p class="sub">Build products, not compliance.</p></Reveal>
		<div class="grid3">
			{#each security as s, i (s.t)}
				{@const Icon = s.icon}
				<Reveal delay={i * 40} y={14}>
					<div class="cell">
						<span class="cell-ico accent"><Icon size={20} strokeWidth={1.75} /></span>
						<h3>{s.t}</h3>
						<p>{s.d}</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</section>

	<!-- ── CTA ──────────────────────────────────────────────────────────── -->
	<section class="cta u-container">
		<div class="cta-orbit" aria-hidden="true">
			{#each brands.slice(0, 10) as b, i (b)}
				<span class="orbit-word u-mono" style="--i: {i}">{b}</span>
			{/each}
		</div>
		<Reveal>
			<div class="cta-card">
				<h2 class="display sm">Start building with Uran.</h2>
				<p>Zero ops, zero surprises.</p>
				<Button href="/register" size="lg">Deploy your app for free <ArrowRight size={16} /></Button
				>
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
		font-size: clamp(2.2rem, 4.6vw, 3.4rem);
		line-height: 1.04;
		letter-spacing: var(--tracking-tight);
		font-weight: 660;
		text-wrap: balance;
	}
	.display.sm {
		font-size: clamp(1.9rem, 4vw, 2.9rem);
	}
	.hero-h {
		max-width: 15ch;
	}
	.grad {
		background: linear-gradient(100deg, var(--blue-300), var(--accent) 55%, #7bd4ff);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.block {
		padding-block: clamp(var(--space-2xl), 9vw, var(--space-3xl));
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
	.lede {
		margin-top: var(--space-l);
		max-width: 34rem;
		color: var(--fg-muted);
		font-size: var(--step-1);
		line-height: var(--leading-normal);
	}
	.capture {
		display: flex;
		gap: 0.35rem;
		margin-top: var(--space-l);
		max-width: 27rem;
		padding: 0.35rem;
		background: var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
	}
	.capture input {
		flex: 1;
		border: none;
		background: transparent;
		color: var(--fg);
		padding: 0 0.7rem;
		font-size: var(--step-0);
		outline: none;
	}
	.capture button {
		padding: 0.6rem 1.1rem;
		background: var(--accent);
		color: var(--accent-contrast);
		border: none;
		border-radius: var(--radius-md);
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
		transition: filter var(--dur-2) var(--ease-out);
	}
	.capture button:hover {
		filter: brightness(1.06);
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
	.gitpush {
		position: absolute;
		top: -1.1rem;
		left: 1rem;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		padding: 0.4em 0.7em;
		background: var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: 8px;
		box-shadow: var(--shadow-2);
		font-size: var(--step--1);
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
		margin: var(--space-2xl) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
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
		margin-bottom: var(--space-s);
	}
	.steps h3 {
		font-size: var(--step-2);
		margin-bottom: var(--space-2xs);
	}
	.steps p {
		color: var(--fg-muted);
		max-width: 22rem;
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
		font-size: clamp(1.7rem, 3.2vw, 2.4rem);
		line-height: 1.05;
		letter-spacing: var(--tracking-tight);
	}
	.feature h3 {
		font-size: var(--step-2);
		line-height: 1.15;
	}
	.feature > p {
		margin-top: var(--space-s);
		color: var(--fg-muted);
		max-width: 32rem;
		line-height: var(--leading-normal);
	}
	.words {
		font-size: clamp(1.6rem, 3.4vw, 2.4rem);
		line-height: 1.25;
		letter-spacing: var(--tracking-tight);
		font-weight: 600;
		color: var(--fg);
	}
	.words span {
		font-weight: 680;
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
		gap: var(--space-xl);
		margin-top: var(--space-2xl);
	}
	.cell-ico {
		display: inline-grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: var(--radius-sm);
		color: var(--ok);
		border: 1px solid color-mix(in oklab, var(--ok) 40%, transparent);
		margin-bottom: var(--space-s);
	}
	.cell-ico.accent {
		color: var(--accent);
		border-color: color-mix(in oklab, var(--accent) 40%, transparent);
		background: var(--accent-soft);
	}
	.cell h3 {
		font-size: var(--step-0);
		margin-bottom: var(--space-3xs);
	}
	.cell p {
		color: var(--fg-muted);
		font-size: var(--step--1);
		line-height: var(--leading-normal);
	}

	/* ── CTA ───────────────────────────────────────────────────────────── */
	.cta {
		position: relative;
		padding-block: clamp(var(--space-3xl), 12vw, var(--space-3xl));
	}
	.cta-orbit {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.orbit-word {
		position: absolute;
		font-size: var(--step-1);
		font-weight: 600;
		color: color-mix(in oklab, var(--fg) 12%, transparent);
		top: calc(8% + (var(--i) * 8.5%));
		left: calc(2% + (var(--i) * 9%) + (var(--i) * var(--i) * -0.4%));
	}
	.orbit-word:nth-child(even) {
		top: calc(70% - (var(--i) * 5%));
	}
	.cta-card {
		position: relative;
		z-index: 1;
		max-width: 40rem;
		margin: 0 auto;
		padding: var(--space-2xl);
		text-align: center;
		background: color-mix(in oklab, var(--surface) 78%, transparent);
		backdrop-filter: blur(6px);
		border: 1px solid var(--border);
		border-radius: var(--radius-2xl);
	}
	.cta-card p {
		margin: var(--space-s) 0 var(--space-l);
		color: var(--fg-muted);
		font-size: var(--step-1);
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
		.hero-panel :global(.win) {
			min-width: 40rem;
		}
	}
</style>
