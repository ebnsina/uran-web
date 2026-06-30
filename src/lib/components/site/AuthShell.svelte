<!--
  Split-screen auth layout: a calm form column beside an on-brand showcase
  column. The showcase collapses away on small screens.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Logo } from '$lib';

	interface Props {
		eyebrow: string;
		title: string;
		subtitle: string;
		children: Snippet;
		footer: Snippet;
	}
	let { eyebrow, title, subtitle, children, footer }: Props = $props();
</script>

<div class="wrap">
	<div class="form-col">
		<div class="top"><Logo /></div>
		<div class="form-inner">
			<header>
				<p class="u-eyebrow">{eyebrow}</p>
				<h1>{title}</h1>
				<p class="sub">{subtitle}</p>
			</header>
			{@render children()}
		</div>
		<div class="foot">{@render footer()}</div>
	</div>

	<aside class="show-col" aria-hidden="true">
		<div class="glow"></div>
		<blockquote>
			<p>“Ship code, not infrastructure.”</p>
			<span class="u-mono">build · deploy · scale</span>
		</blockquote>
		<div class="grid-lines"></div>
	</aside>
</div>

<style>
	.wrap {
		display: grid;
		min-height: 100dvh;
		grid-template-columns: 1fr;
	}
	.form-col {
		display: flex;
		flex-direction: column;
		padding: var(--space-l);
	}
	.top {
		padding-block: var(--space-2xs) var(--space-2xl);
	}
	.form-inner {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		max-width: 25rem;
		margin-inline: auto;
	}
	header {
		margin-bottom: var(--space-l);
	}
	header h1 {
		margin-top: var(--space-xs);
		font-size: var(--step-3);
	}
	.sub {
		margin-top: var(--space-2xs);
		color: var(--fg-muted);
	}
	.foot {
		max-width: 25rem;
		margin-inline: auto;
		width: 100%;
		padding-top: var(--space-l);
		font-size: var(--step--1);
		color: var(--fg-muted);
		text-align: center;
	}

	.show-col {
		display: none;
		position: relative;
		overflow: hidden;
		background: var(--surface);
		border-left: 1px solid var(--border);
	}
	.glow {
		position: absolute;
		inset: -20% -20% auto auto;
		width: 60%;
		aspect-ratio: 1;
		background: radial-gradient(circle, var(--accent-soft), transparent 65%);
		filter: blur(20px);
	}
	.grid-lines {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--border) 1px, transparent 1px),
			linear-gradient(90deg, var(--border) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: radial-gradient(circle at 70% 30%, black, transparent 75%);
		opacity: 0.6;
	}
	blockquote {
		position: absolute;
		left: var(--space-2xl);
		bottom: var(--space-2xl);
		max-width: 22rem;
	}
	blockquote p {
		font-size: var(--step-3);
		letter-spacing: var(--tracking-tight);
		line-height: var(--leading-snug);
	}
	blockquote span {
		display: block;
		margin-top: var(--space-s);
		color: var(--accent);
		font-size: var(--step--1);
		letter-spacing: var(--tracking-wide);
	}

	@media (min-width: 60rem) {
		.wrap {
			grid-template-columns: 1fr 1fr;
		}
		.show-col {
			display: block;
		}
	}
</style>
