<!--
  Uran wordmark: a clean paper-plane glyph (Uran = "to take flight") in a rounded
  badge beside the name. Static and professional — a subtle badge hover only.
-->
<script lang="ts">
	import { Send } from '@lucide/svelte';

	interface Props {
		size?: number;
		href?: string | null;
	}
	let { size = 28, href = '/' }: Props = $props();
</script>

{#snippet mark()}
	<span class="logo" style="--logo-size: {size}px">
		<span class="badge" aria-hidden="true">
			<Send size={Math.round(size * 0.52)} strokeWidth={2.2} />
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
	.link:hover .badge {
		background: var(--accent-hover);
		box-shadow: var(--glow-accent);
	}
	.word {
		margin-top: 0.06em;
	}
</style>
