<!--
  Uran wordmark: a custom paper-plane glyph (Uran = "to take flight") in a
  rounded badge beside the name. The plane is two folded facets — a brighter top
  wing and a shaded belly crease — for a professional, origami feel.
-->
<script lang="ts">
	interface Props {
		size?: number;
		href?: string | null;
	}
	let { size = 28, href = '/' }: Props = $props();
	const glyph = $derived(Math.round(size * 0.6));
</script>

{#snippet mark()}
	<span class="logo" style="--logo-size: {size}px">
		<span class="badge" aria-hidden="true">
			<svg class="plane" width={glyph} height={glyph} viewBox="0 0 24 24" fill="none">
				<!-- top wing (lit) -->
				<path d="M21 3.2 6.2 10 11 12.7Z" fill="currentColor" />
				<!-- belly fold (shaded), meeting the wing at the crease -->
				<path d="M21 3.2 11 12.7 10.3 20.6Z" fill="currentColor" fill-opacity="0.5" />
			</svg>
		</span>
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
	.badge {
		display: grid;
		place-items: center;
		width: var(--logo-size);
		height: var(--logo-size);
		color: var(--accent-contrast);
		background: var(--accent);
		border-radius: var(--radius-sm);
		transition:
			background var(--dur-2) var(--ease-out),
			box-shadow var(--dur-2) var(--ease-out);
	}
	.plane {
		transform: translate(-1%, 1%);
	}
	.link:hover .badge {
		background: var(--accent-hover);
	}
	.word {
		margin-top: 0.06em;
	}
</style>
