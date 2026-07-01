<!--
  Button / link button. Variants and sizes are token-driven. The press
  microinteraction (a subtle settle) and an optional loading state are built in.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant;
		size?: Size;
		href?: string;
		loading?: boolean;
		full?: boolean;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		loading = false,
		full = false,
		children,
		...rest
	}: Props & (HTMLButtonAttributes | HTMLAnchorAttributes) = $props();
</script>

{#snippet inner()}
	<span class="label" class:hidden={loading}>{@render children()}</span>
	{#if loading}
		<span class="spinner" aria-hidden="true"></span>
	{/if}
{/snippet}

{#if href}
	<a {href} class="btn {variant} {size}" class:full {...rest as HTMLAnchorAttributes}>
		{@render inner()}
	</a>
{:else}
	<button
		class="btn {variant} {size}"
		class:full
		class:loading
		disabled={loading || (rest as HTMLButtonAttributes).disabled}
		{...rest as HTMLButtonAttributes}
	>
		{@render inner()}
	</button>
{/if}

<style>
	.btn {
		--_bg: transparent;
		--_fg: var(--fg);
		--_border: transparent;
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
		font-family: var(--font-sans);
		font-weight: 500;
		letter-spacing: var(--tracking-normal);
		white-space: nowrap;
		text-align: center;
		cursor: pointer;
		border: 1px solid var(--_border);
		background: var(--_bg);
		color: var(--_fg);
		border-radius: var(--radius);
		transition:
			transform var(--dur-1) var(--ease-out),
			background var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out),
			box-shadow var(--dur-2) var(--ease-out),
			color var(--dur-2) var(--ease-out);
	}
	.btn:hover {
		transform: translateY(-1px);
	}
	.btn:active {
		transform: translateY(0) scale(0.985);
	}
	.btn:disabled {
		cursor: not-allowed;
		opacity: 0.6;
		transform: none;
	}
	.full {
		width: 100%;
	}

	/* Sizes */
	.sm {
		padding: 0.4em 0.8em;
		font-size: var(--step--1);
	}
	.md {
		padding: 0.62em 1.1em;
		font-size: var(--step-0);
	}
	.lg {
		padding: 0.85em 1.5em;
		font-size: var(--step-1);
	}

	/* Variants */
	.primary {
		--_bg: var(--accent);
		--_fg: var(--accent-contrast);
		--_border: transparent;
		font-weight: 600;
		background-image: var(--accent-gradient);
		box-shadow:
			var(--glow-accent),
			inset 0 1px 0 rgb(255 255 255 / 0.22);
	}
	.primary:hover {
		box-shadow:
			0 14px 34px -10px rgb(0 127 191 / 0.6),
			inset 0 1px 0 rgb(255 255 255 / 0.28);
	}
	.primary:active {
		box-shadow: var(--glow-accent);
	}

	.secondary {
		--_bg: var(--surface);
		--_fg: var(--fg);
		--_border: var(--border-strong);
	}
	.secondary:hover {
		--_bg: var(--surface-hover);
		--_border: var(--accent);
	}

	.ghost {
		--_fg: var(--fg-muted);
	}
	.ghost:hover {
		--_fg: var(--fg);
		--_bg: var(--surface);
	}

	.danger {
		--_bg: var(--danger);
		--_fg: #ffffff;
		font-weight: 600;
	}
	.danger:hover {
		--_bg: color-mix(in oklab, var(--danger) 88%, black);
	}

	.label {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		transition: opacity var(--dur-1) var(--ease-out);
	}
	.label.hidden {
		opacity: 0;
	}

	.spinner {
		position: absolute;
		width: 1.05em;
		height: 1.05em;
		border-radius: var(--radius-full);
		border: 2px solid color-mix(in oklab, currentColor 30%, transparent);
		border-top-color: currentColor;
		animation: spin 0.6s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
