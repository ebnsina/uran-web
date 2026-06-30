<script lang="ts">
	import { Button, Reveal } from '$lib';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
	import DeployPanel from '$lib/components/site/DeployPanel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const features = [
		{
			t: 'Push to live',
			d: 'Connect a repo and every push builds, deploys, and routes itself — TLS and all.',
			tag: 'git'
		},
		{
			t: 'Managed databases',
			d: 'Postgres or Redis in a click. HA replicas, connection pooling, continuous backups + PITR.',
			tag: 'data'
		},
		{
			t: 'Autoscaling',
			d: 'Scale on CPU between a floor and ceiling, or pin a size from small to 2xlarge pro compute.',
			tag: 'scale'
		},
		{
			t: 'Preview environments',
			d: 'Every pull request gets its own isolated URL, torn down automatically when it merges.',
			tag: 'pr'
		},
		{
			t: 'Automatic TLS',
			d: 'Bring your domain; certificates are issued and renewed for you. HTTPS by default.',
			tag: 'tls'
		},
		{
			t: 'Built-in observability',
			d: 'Live logs, per-pod metrics, and usage metering — no agents to wire up.',
			tag: 'obs'
		}
	];

	const steps = [
		{ n: '01', t: 'Connect', d: 'Link your Git repository and pick a branch.' },
		{
			n: '02',
			t: 'Detect',
			d: 'We read your Dockerfile, or auto-detect the stack and build a clean image.'
		},
		{ n: '03', t: 'Deploy', d: 'Your service goes live behind TLS with health-checked rollouts.' },
		{ n: '04', t: 'Scale', d: 'Add databases, replicas, and domains as you grow — same workflow.' }
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
	<!-- Hero -->
	<section class="hero u-container">
		<div class="hero-copy">
			<p class="u-eyebrow tag">
				<span class="dot"></span> The developer platform
			</p>
			<h1>Ship code,<br />not infrastructure.</h1>
			<p class="lede">
				Connect a repository and Uran turns every push into a running, routed, TLS-terminated
				service — with managed databases, autoscaling, and preview environments built in.
			</p>
			<div class="cta">
				<Button href="/register" size="lg">Start free</Button>
				<Button href="/#how" variant="secondary" size="lg">See how it works</Button>
			</div>
			<p class="trust u-mono">no credit card · deploy in minutes</p>
		</div>

		<div class="hero-visual">
			<DeployPanel />
		</div>
	</section>

	<!-- Features -->
	<section id="features" class="section u-container">
		<Reveal>
			<header class="section-head">
				<p class="u-eyebrow">What you get</p>
				<h2>Everything between <em>git push</em> and production.</h2>
			</header>
		</Reveal>

		<div class="grid">
			{#each features as f, i (f.t)}
				<Reveal delay={i * 60} y={20}>
					<article class="card">
						<span class="card-tag u-mono">{f.tag}</span>
						<h3>{f.t}</h3>
						<p>{f.d}</p>
					</article>
				</Reveal>
			{/each}
		</div>
	</section>

	<!-- How it works -->
	<section id="how" class="section u-container">
		<Reveal>
			<header class="section-head">
				<p class="u-eyebrow">How it works</p>
				<h2>Four steps. No YAML to babysit.</h2>
			</header>
		</Reveal>

		<ol class="steps">
			{#each steps as s, i (s.n)}
				<Reveal delay={i * 70} y={18}>
					<li class="step">
						<span class="step-n u-mono">{s.n}</span>
						<div>
							<h3>{s.t}</h3>
							<p>{s.d}</p>
						</div>
					</li>
				</Reveal>
			{/each}
		</ol>
	</section>

	<!-- CTA band -->
	<section class="section u-container">
		<Reveal>
			<div class="band">
				<h2>Your next deploy is one push away.</h2>
				<p>Spin up a service, attach a database, and ship — all from one workflow.</p>
				<Button href="/register" size="lg">Create your account</Button>
			</div>
		</Reveal>
	</section>
</main>

<SiteFooter />

<style>
	/* Hero */
	.hero {
		display: grid;
		gap: var(--space-2xl);
		align-items: center;
		padding-block: var(--space-2xl) var(--space-xl);
	}
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.6em;
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: var(--radius-full);
		background: var(--accent);
		box-shadow: 0 0 0 0 var(--accent);
		animation: pulse 2.4s var(--ease-in-out) infinite;
	}
	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 color-mix(in oklab, var(--accent) 60%, transparent);
		}
		70% {
			box-shadow: 0 0 0 8px transparent;
		}
		100% {
			box-shadow: 0 0 0 0 transparent;
		}
	}
	h1 {
		margin-top: var(--space-s);
		font-size: var(--step-6);
		letter-spacing: -0.03em;
	}
	.lede {
		margin-top: var(--space-m);
		max-width: 34rem;
		font-size: var(--step-1);
		color: var(--fg-muted);
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-s);
		margin-top: var(--space-l);
	}
	.trust {
		margin-top: var(--space-m);
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}

	/* Sections */
	.section {
		padding-block: var(--space-2xl);
	}
	.section-head {
		max-width: 40rem;
		margin-bottom: var(--space-xl);
	}
	.section-head h2 {
		margin-top: var(--space-xs);
		font-size: var(--step-4);
	}
	.section-head em {
		font-style: normal;
		color: var(--accent);
		font-family: var(--font-mono);
		font-size: 0.85em;
	}

	/* Feature grid */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--space-m);
	}
	.card {
		height: 100%;
		padding: var(--space-l);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		transition:
			border-color var(--dur-2) var(--ease-out),
			transform var(--dur-2) var(--ease-out),
			background var(--dur-2) var(--ease-out);
	}
	.card:hover {
		transform: translateY(-3px);
		border-color: var(--border-strong);
		background: var(--surface-2);
	}
	.card-tag {
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
		color: var(--accent);
	}
	.card h3 {
		margin-top: var(--space-s);
		font-size: var(--step-1);
	}
	.card p {
		margin-top: var(--space-2xs);
		color: var(--fg-muted);
		font-size: var(--step-0);
	}

	/* Steps */
	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: var(--space-l);
		list-style: none;
		padding: 0;
	}
	.step {
		display: flex;
		gap: var(--space-s);
		padding-top: var(--space-s);
		border-top: 1px solid var(--border-strong);
	}
	.step-n {
		font-size: var(--step-1);
		color: var(--accent);
	}
	.step h3 {
		font-size: var(--step-1);
	}
	.step p {
		margin-top: var(--space-3xs);
		color: var(--fg-muted);
		font-size: var(--step--1);
	}

	/* CTA band */
	.band {
		text-align: center;
		padding: var(--space-2xl) var(--space-l);
		background:
			radial-gradient(120% 140% at 50% 0%, var(--accent-soft), transparent 60%), var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
	}
	.band h2 {
		font-size: var(--step-4);
	}
	.band p {
		margin: var(--space-s) auto var(--space-l);
		max-width: 32rem;
		color: var(--fg-muted);
	}

	@media (min-width: 60rem) {
		.hero {
			grid-template-columns: 1.05fr 0.95fr;
			padding-block: var(--space-3xl) var(--space-2xl);
		}
	}
</style>
