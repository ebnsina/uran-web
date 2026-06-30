<!-- Marketing footer. -->
<script lang="ts">
	import { Logo } from '$lib';
	import { smoothAnchor } from '$lib/scroll';
	const year = new Date().getFullYear();
</script>

<footer class="ft">
	<div class="u-container inner">
		<div class="brand">
			<Logo />
			<p>Ship code, not infrastructure.</p>
		</div>
		<div class="cols">
			<div>
				<h3>Product</h3>
				<a href="#index" onclick={smoothAnchor}>Capabilities</a>
				<a href="#workflow" onclick={smoothAnchor}>Workflow</a>
				<a href="/docs">Docs</a>
			</div>
			<div>
				<h3>Platform</h3>
				<a href="/register">Get started</a>
				<a href="/login">Log in</a>
				<a href="/status">Status</a>
			</div>
		</div>
	</div>
	<div class="u-container base">
		<span>© {year} Uran</span>
		<span class="u-mono">build · deploy · scale</span>
	</div>
</footer>

<style>
	.ft {
		margin-top: var(--space-3xl);
		border-top: 1px solid var(--border);
		padding-block: var(--space-xl) var(--space-l);
	}
	.inner {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xl);
		justify-content: space-between;
	}
	.brand {
		max-width: 22rem;
	}
	.brand p {
		margin-top: var(--space-s);
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.cols {
		display: flex;
		gap: var(--space-2xl);
	}
	.cols h3 {
		font-size: var(--step--1);
		font-weight: 600;
		color: var(--fg);
		margin-bottom: var(--space-xs);
	}
	.cols a {
		display: block;
		padding: 0.2em 0;
		font-size: var(--step--1);
		color: var(--fg-muted);
		transition: color var(--dur-2) var(--ease-out);
	}
	.cols a:hover {
		color: var(--accent);
	}
	.base {
		display: flex;
		justify-content: space-between;
		margin-top: var(--space-xl);
		padding-top: var(--space-m);
		border-top: 1px solid var(--border);
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
</style>
