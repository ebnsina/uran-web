<!--
  Renders a Simple Icons brand glyph. Grayscale by default; lights up to the
  brand's own colour on hover. Decorative within the marquee (aria-hidden), but
  carries a title for tooltip/context.
-->
<script lang="ts">
	interface SimpleIcon {
		title: string;
		path: string;
		hex: string;
	}
	let { icon, size = 28 }: { icon: SimpleIcon; size?: number } = $props();
</script>

<span class="brand" style="--brand: #{icon.hex}" title={icon.title}>
	<svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
		<path d={icon.path} />
	</svg>
</span>

<style>
	.brand {
		display: inline-flex;
		color: var(--fg-subtle);
		transition:
			color var(--dur-2) var(--ease-out),
			transform var(--dur-2) var(--ease-out);
	}
	.brand:hover {
		color: var(--brand);
		transform: translateY(-2px);
	}
</style>
