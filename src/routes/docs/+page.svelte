<script lang="ts">
	import { Rocket, Terminal, Boxes, Database, KeyRound, Globe, Gauge, Zap } from '@lucide/svelte';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
	import { smoothAnchor } from '$lib/scroll';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const toc = [
		{ id: 'quickstart', label: 'Quickstart', icon: Rocket },
		{ id: 'services', label: 'Services', icon: Boxes },
		{ id: 'env', label: 'Environment variables', icon: KeyRound },
		{ id: 'databases', label: 'Databases', icon: Database },
		{ id: 'domains', label: 'Domains & TLS', icon: Globe },
		{ id: 'scaling', label: 'Scaling', icon: Gauge },
		{ id: 'cli', label: 'CLI', icon: Terminal }
	];
</script>

<svelte:head>
	<title>Docs · Uran</title>
	<meta
		name="description"
		content="Get started with Uran — deploy from git, manage databases, scale, and more."
	/>
</svelte:head>

<SiteHeader user={data.user} />

<main class="u-container docs">
	<aside class="toc">
		<p class="u-eyebrow">Documentation</p>
		<nav>
			{#each toc as t (t.id)}
				<a href="#{t.id}" onclick={smoothAnchor}>
					<t.icon size={15} />
					{t.label}
				</a>
			{/each}
		</nav>
	</aside>

	<article class="content">
		<header class="lede">
			<h1>Ship code, not infrastructure.</h1>
			<p>
				Uran turns a git push into a running, routed, TLS-terminated service — with managed
				databases, autoscaling, and preview environments built in. This guide gets you from an empty
				account to a live deploy.
			</p>
		</header>

		<section id="quickstart">
			<h2><Rocket size={18} /> Quickstart</h2>
			<ol class="steps">
				<li>
					<b>Create an organization</b> from the dashboard — it holds your projects, services and databases.
				</li>
				<li><b>Add a project</b> to group related services.</li>
				<li><b>Create a service</b>, point it at a Git repository and branch.</li>
				<li>
					<b>Deploy.</b> Uran reads your <code>Dockerfile</code> (or auto-detects the stack), builds an
					image, and rolls it out behind TLS.
				</li>
			</ol>
			<p class="note">
				<span class="note-ico"><Zap size={16} /></span>
				Every push to the connected branch triggers a new build and a health-checked rollout.
			</p>
		</section>

		<section id="services">
			<h2><Boxes size={18} /> Services</h2>
			<p>A service is a deployable unit. Four types are supported:</p>
			<ul class="defs">
				<li><b>web</b> — an HTTP service, routed and TLS-terminated at a public URL.</li>
				<li><b>static</b> — a built static site.</li>
				<li><b>worker</b> — a background process with no inbound routing.</li>
				<li><b>cron</b> — a scheduled job (provide a 5-field cron expression).</li>
			</ul>
			<p>
				Trigger a deploy from the latest commit, deploy a prebuilt image directly, or roll back to
				any previous image from the <b>Deploys</b> tab. Live build and runtime logs stream in the dashboard.
			</p>
		</section>

		<section id="env">
			<h2><KeyRound size={18} /> Environment variables</h2>
			<p>
				Set variables per service under <b>Variables</b>. Mark a variable <b>secret</b> to hide its
				value, or <b>build-time</b> to expose it only during the image build (not at runtime).
			</p>
			<pre class="code">DATABASE_URL   secret
NODE_ENV       production</pre>
		</section>

		<section id="databases">
			<h2><Database size={18} /> Databases</h2>
			<p>
				Provision managed <b>Postgres</b> or <b>Redis</b> in a click. Postgres offers two tiers:
			</p>
			<ul class="defs">
				<li>
					<b>standard</b> — a fixed instance count and size, with HA replicas and an optional read endpoint.
				</li>
				<li><b>autoscale</b> — instances scale between a floor and ceiling.</li>
			</ul>
			<p>
				Enable <b>connection pooling</b> (PgBouncer) and <b>continuous backups + PITR</b>.
				Connection URIs (primary, read-only, pooled) are revealed on the database page and never
				logged.
			</p>
		</section>

		<section id="domains">
			<h2><Globe size={18} /> Domains & TLS</h2>
			<p>
				Every web service gets an internal URL automatically. Add a custom domain under <b
					>Domains</b
				>, point a CNAME/A record at Uran, and a certificate is issued and renewed for you — HTTPS
				by default.
			</p>
		</section>

		<section id="scaling">
			<h2><Gauge size={18} /> Scaling</h2>
			<p>
				Pin a fixed replica count and instance size (<code>small</code> → <code>2xlarge</code>), or
				autoscale on CPU between a min and max. Attach a persistent disk for stateful workloads
				(this pins the service to a single replica). Suspend a service to scale it to zero, and
				resume any time.
			</p>
		</section>

		<section id="cli">
			<h2><Terminal size={18} /> CLI</h2>
			<p>
				Create a personal access token under <b>Settings → API tokens</b>, then authenticate the
				CLI:
			</p>
			<pre class="code">uran login --token uran_pat_xxx
uran deploy --service 12
uran logs   --service 12
uran env set --service 12 KEY=value</pre>
		</section>
	</article>
</main>

<SiteFooter />

<style>
	.docs {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
		padding-block: var(--space-2xl);
		align-items: start;
	}
	.toc nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-top: var(--space-s);
	}
	.toc a {
		display: flex;
		align-items: center;
		gap: 0.6em;
		padding: 0.5em 0.7em;
		border-radius: var(--radius-sm);
		color: var(--fg-muted);
		font-size: var(--step--1);
		transition:
			color var(--dur-2) var(--ease-out),
			background var(--dur-2) var(--ease-out);
	}
	.toc a:hover {
		color: var(--fg);
		background: var(--surface);
	}

	.content {
		max-width: 44rem;
	}
	.lede h1 {
		font-size: var(--step-4);
	}
	.lede p {
		margin-top: var(--space-s);
		color: var(--fg-muted);
		font-size: var(--step-1);
	}
	section {
		margin-top: var(--space-2xl);
		scroll-margin-top: calc(var(--header-h) + var(--space-m));
	}
	section h2 {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		font-size: var(--step-2);
		margin-bottom: var(--space-s);
		color: var(--fg);
	}
	section h2 :global(svg) {
		color: var(--accent);
	}
	section p {
		color: var(--fg-muted);
		line-height: var(--leading-normal);
		margin-top: var(--space-s);
	}
	.steps,
	.defs {
		margin-top: var(--space-s);
		padding-left: 1.2em;
		color: var(--fg-muted);
		line-height: 1.7;
	}
	.steps li,
	.defs li {
		margin-top: var(--space-2xs);
	}
	b {
		color: var(--fg);
		font-weight: 600;
	}
	code {
		padding: 0.1em 0.4em;
		background: var(--surface-2);
		border-radius: var(--radius-xs);
		font-size: 0.9em;
	}
	.code {
		margin-top: var(--space-s);
		padding: var(--space-s) var(--space-m);
		background: var(--ink-900);
		color: var(--paper-100);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		font-size: var(--step--1);
		line-height: 1.7;
		overflow-x: auto;
	}
	.note {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		margin-top: var(--space-m);
		padding: var(--space-s) var(--space-m);
		background: var(--accent-soft);
		border-radius: var(--radius);
		color: var(--fg);
	}
	.note-ico {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		flex-shrink: 0;
		color: #fff;
		background: var(--accent);
		border-radius: var(--radius-full);
	}

	@media (min-width: 56rem) {
		.docs {
			grid-template-columns: 15rem 1fr;
		}
		.toc {
			position: sticky;
			top: calc(var(--header-h) + var(--space-m));
		}
	}
</style>
