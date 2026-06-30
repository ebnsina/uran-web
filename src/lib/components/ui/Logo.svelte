<!--
  Uran wordmark. A small orbital glyph (a nucleus + electron) nods to the name
  without leaning on any cliché. The ring draws itself on hover.
-->
<script lang="ts">
	interface Props {
		size?: number;
		href?: string | null;
	}
	let { size = 28, href = '/' }: Props = $props();
</script>

{#snippet mark()}
	<span class="logo" style="--logo-size: {size}px">
		<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" class="glyph">
			<circle cx="16" cy="16" r="3.4" fill="var(--accent)" />
			<ellipse
				class="orbit"
				cx="16"
				cy="16"
				rx="13"
				ry="6.2"
				stroke="currentColor"
				stroke-width="1.6"
				transform="rotate(-28 16 16)"
			/>
			<circle class="electron" cx="27" cy="11" r="2" fill="var(--accent)" />
		</svg>
		<span class="word">uran</span>
	</span>
{/snippet}

{#if href}
	<a {href} class="link" aria-label="Uran home">{@render mark()}</a>
{:else}
	{@render mark()}
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
		color: var(--fg-muted);
		overflow: visible;
	}
	.orbit {
		transition: color var(--dur-2) var(--ease-out);
		transform-box: fill-box;
		transform-origin: center;
	}
	.electron {
		transform-box: fill-box;
		transform-origin: 16px 16px;
		transition: transform var(--dur-3) var(--ease-out);
	}
	.link:hover .glyph {
		color: var(--accent);
	}
	.link:hover .electron {
		transform: rotate(360deg);
		transition-duration: var(--dur-4);
	}
	.word {
		margin-top: 0.06em;
	}
</style>
