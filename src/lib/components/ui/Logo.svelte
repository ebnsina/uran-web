<!--
  Uran wordmark. The mark is a paper-plane glyph — Uran (উড়ান) means "to take
  flight". On hover the plane lifts off along its heading and a dashed vapour
  trail draws in behind it. An optional tooltip surfaces the meaning.
-->
<script lang="ts">
	import Tooltip from './Tooltip.svelte';

	interface Props {
		size?: number;
		href?: string | null;
		/** Show the "meaning" tooltip on hover/focus. */
		tip?: boolean;
	}
	let { size = 28, href = '/', tip = true }: Props = $props();

	const meaning = 'Uran · উড়ান — to take flight';
</script>

{#snippet mark()}
	<span class="logo" style="--logo-size: {size}px">
		<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" class="glyph">
			<!-- vapour trail -->
			<path
				class="trail"
				d="M3 29 C 9 27, 13 23, 16 17"
				stroke="var(--accent)"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-dasharray="2 3"
			/>
			<!-- paper plane: two folded facets -->
			<g class="plane">
				<path class="wing" d="M29 3 L4 14 L15 18 Z" fill="var(--accent)" />
				<path class="keel" d="M29 3 L15 18 L14 29 Z" fill="var(--accent)" fill-opacity="0.55" />
			</g>
		</svg>
		<span class="word">uran</span>
	</span>
{/snippet}

{#snippet inner()}
	{#if href}
		<a {href} class="link" aria-label="Uran home — to take flight">{@render mark()}</a>
	{:else}
		{@render mark()}
	{/if}
{/snippet}

{#if tip}
	<Tooltip text={meaning}>{@render inner()}</Tooltip>
{:else}
	{@render inner()}
{/if}

<style>
	.link {
		display: inline-flex;
		border-radius: var(--radius-sm);
	}
	.logo {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		color: var(--fg);
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: calc(var(--logo-size) * 0.62);
		letter-spacing: var(--tracking-tight);
		line-height: 1;
	}
	.glyph {
		width: var(--logo-size);
		height: var(--logo-size);
		overflow: visible;
	}

	.plane {
		transform-box: fill-box;
		transform-origin: center;
		transition: transform var(--dur-3) var(--ease-out);
	}
	.trail {
		/* dash travels ~34 units; hidden until takeoff */
		stroke-dashoffset: 34;
		opacity: 0;
		transition:
			stroke-dashoffset var(--dur-4) var(--ease-out),
			opacity var(--dur-2) var(--ease-out);
	}

	/* Takeoff: lift along the plane's heading (up + right) with a touch of bank. */
	.logo:hover .plane {
		transform: translate(2.5px, -2.5px) rotate(4deg);
	}
	.logo:hover .trail {
		opacity: 1;
		stroke-dashoffset: 0;
	}

	.word {
		margin-top: 0.06em;
	}

	@media (prefers-reduced-motion: reduce) {
		.plane,
		.trail {
			transition: none;
		}
	}
</style>
