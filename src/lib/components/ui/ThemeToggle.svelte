<!--
  Dark/light theme toggle. Crossfades a sun/moon glyph and persists the choice.
-->
<script lang="ts">
	import { theme } from '$lib/theme.svelte';

	const isDark = $derived(theme.value === 'dark');
</script>

<button
	type="button"
	class="toggle"
	role="switch"
	aria-checked={!isDark}
	aria-label="Toggle light and dark theme"
	title={isDark ? 'Switch to light' : 'Switch to dark'}
	onclick={() => theme.toggle()}
>
	<span class="glyphs" class:light={!isDark}>
		<svg class="moon" viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linejoin="round"
			/>
		</svg>
		<svg class="sun" viewBox="0 0 24 24" aria-hidden="true">
			<circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8" />
			<g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
				<path
					d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19"
				/>
			</g>
		</svg>
	</span>
</button>

<style>
	.toggle {
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		border: 1px solid var(--border-strong);
		background: transparent;
		border-radius: var(--radius-full);
		color: var(--fg-muted);
		cursor: pointer;
		transition:
			color var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out),
			background var(--dur-2) var(--ease-out);
	}
	.toggle:hover {
		color: var(--accent);
		border-color: var(--accent);
		background: var(--accent-soft);
	}
	.glyphs {
		position: relative;
		width: 1.05rem;
		height: 1.05rem;
	}
	.glyphs svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		transition:
			opacity var(--dur-2) var(--ease-out),
			transform var(--dur-3) var(--ease-spring);
	}
	/* Dark theme → show moon; light theme → show sun. */
	.sun {
		opacity: 0;
		transform: rotate(-90deg) scale(0.5);
	}
	.moon {
		opacity: 1;
		transform: none;
	}
	.glyphs.light .sun {
		opacity: 1;
		transform: none;
	}
	.glyphs.light .moon {
		opacity: 0;
		transform: rotate(90deg) scale(0.5);
	}
</style>
