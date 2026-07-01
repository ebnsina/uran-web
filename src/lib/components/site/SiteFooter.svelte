<!-- Marketing footer: a Render-style multi-column link map + brand + socials. -->
<script lang="ts">
	import { Logo, Button } from '$lib';
	const year = new Date().getFullYear();

	const columns = [
		{
			title: 'Features',
			links: [
				['CLI', '/docs'],
				['Autoscaling', '/docs'],
				['Private networking', '/docs'],
				['Persistent disks', '/docs'],
				['Infrastructure as code', '/docs'],
				['Preview environments', '/docs'],
				['Zero-downtime deploys', '/docs'],
				['REST API', '/docs']
			]
		},
		{
			title: 'Services',
			links: [
				['Static sites', '/docs'],
				['Web services', '/docs'],
				['Private services', '/docs'],
				['Background workers', '/docs'],
				['Cron jobs', '/docs'],
				['Postgres', '/docs'],
				['Key value', '/docs']
			]
		},
		{
			title: 'Resources',
			links: [
				['Docs', '/docs'],
				['Pricing', '/pricing'],
				['Changelog', '/changelog'],
				['Status', '/status'],
				['Blog', '/blog']
			]
		},
		{
			title: 'Company',
			links: [
				['About', '/about'],
				['Careers', '/careers'],
				['Contact', '/contact'],
				['Security', '/docs'],
				['Terms', '/legal/terms'],
				['Privacy', '/legal/privacy']
			]
		}
	];
	const socials = [
		['X', 'https://x.com'],
		['LinkedIn', 'https://linkedin.com'],
		['GitHub', 'https://github.com']
	];
</script>

<footer class="ft">
	<div class="u-container inner">
		<div class="brand">
			<Logo />
			<p>Ship code, not infrastructure.</p>
			<div class="get">
				<Button href="/register" size="sm">Get started</Button>
				<Button href="/login" variant="ghost" size="sm">Log in</Button>
			</div>
		</div>
		<nav class="cols">
			{#each columns as col (col.title)}
				<div>
					<h3>{col.title}</h3>
					{#each col.links as [label, href] (label)}
						<a {href}>{label}</a>
					{/each}
				</div>
			{/each}
		</nav>
	</div>

	<div class="u-container base">
		<span>© {year} Uran</span>
		<div class="social">
			{#each socials as [label, href] (label)}
				<a {href} target="_blank" rel="noreferrer noopener">{label}</a>
			{/each}
		</div>
	</div>
</footer>

<style>
	.ft {
		margin-top: var(--space-3xl);
		border-top: 1px solid var(--border);
		padding-block: var(--space-2xl) var(--space-l);
	}
	.inner {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-2xl);
	}
	.brand {
		max-width: 24rem;
	}
	.brand p {
		margin-top: var(--space-s);
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.get {
		display: flex;
		gap: var(--space-2xs);
		margin-top: var(--space-m);
	}
	.cols {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-xl);
	}
	.cols h3 {
		font-size: var(--step--2);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		color: var(--fg-subtle);
		margin-bottom: var(--space-s);
	}
	.cols a {
		display: block;
		padding: 0.28em 0;
		font-size: var(--step--1);
		color: var(--fg-muted);
		transition: color var(--dur-2) var(--ease-out);
	}
	.cols a:hover {
		color: var(--accent);
	}
	.base {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-m);
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-2xl);
		padding-top: var(--space-m);
		border-top: 1px solid var(--border);
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.social {
		display: flex;
		gap: var(--space-m);
	}
	.social a {
		color: var(--fg-muted);
		transition: color var(--dur-2) var(--ease-out);
	}
	.social a:hover {
		color: var(--accent);
	}

	@media (min-width: 40rem) {
		.cols {
			grid-template-columns: repeat(4, 1fr);
		}
	}
	@media (min-width: 60rem) {
		.inner {
			grid-template-columns: 1fr 2.4fr;
			gap: var(--space-3xl);
		}
	}
</style>
