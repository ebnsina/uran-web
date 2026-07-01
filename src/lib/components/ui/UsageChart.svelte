<!--
  Area chart for a time series of metric samples, built on LayerChart: a y-axis
  with gridlines, a smooth filled area, and a hover highlight + tooltip. Pass a
  plain number[] (oldest → newest). Colours come from design tokens via CSS —
  LayerChart applies fill/stroke as SVG presentation attributes, which don't
  support var(), so we style the generated .path-area / .path-line classes.
-->
<script lang="ts">
	import { Chart, Svg, Axis, Area, Highlight, Tooltip } from 'layerchart';
	import { scaleLinear } from 'd3-scale';
	import { curveMonotoneX } from 'd3-shape';

	interface Props {
		data: number[];
		color?: string;
		/** Optional short unit for the y ticks + tooltip, e.g. "m" or "Mi". */
		unit?: string;
	}
	let { data, color = 'var(--accent)', unit = '' }: Props = $props();

	const points = $derived(data.map((v, i) => ({ i, v })));
	const fmt = (v: number) => `${v}${unit}`;
</script>

<div class="uc" style="--uc-color: {color}">
	{#if points.length > 1}
		<Chart
			data={points}
			x="i"
			y="v"
			xScale={scaleLinear()}
			yScale={scaleLinear()}
			yDomain={[0, null]}
			yNice
			padding={{ top: 10, right: 10, bottom: 8, left: 40 }}
			tooltip={{ mode: 'bisect-x' }}
		>
			<Svg>
				<Axis
					placement="left"
					ticks={4}
					format={fmt}
					grid={{ class: 'uc-grid' }}
					classes={{ tickLabel: 'uc-tl' }}
				/>
				<Area curve={curveMonotoneX} line />
				<Highlight points={{ class: 'uc-dot' }} lines={{ class: 'uc-hl' }} axis="x" />
			</Svg>
			<Tooltip.Root variant="none" classes={{ container: 'uc-tip' }} let:data>
				<span class="uc-tip-v">{fmt(data.v)}</span>
			</Tooltip.Root>
		</Chart>
	{:else}
		<p class="uc-empty">Not enough data yet.</p>
	{/if}
</div>

<style>
	.uc {
		height: 9rem;
	}
	.uc-empty {
		display: grid;
		place-items: center;
		height: 100%;
		color: var(--fg-subtle);
		font-size: var(--step--1);
	}
	/* LayerChart-generated elements — styled here so var() colours apply. */
	.uc :global(.path-area) {
		fill: var(--uc-color);
		fill-opacity: 0.15;
		stroke: none;
	}
	.uc :global(.path-line) {
		fill: none;
		stroke: var(--uc-color);
		stroke-width: 2;
	}
	.uc :global(.uc-grid) {
		stroke: color-mix(in oklab, var(--fg) 8%, transparent);
	}
	.uc :global(.uc-tl) {
		fill: var(--fg-subtle);
		font-size: 10px;
		font-family: var(--font-mono);
	}
	.uc :global(.uc-dot) {
		fill: var(--uc-color);
		stroke: var(--surface);
		stroke-width: 2;
	}
	.uc :global(.uc-hl) {
		stroke: color-mix(in oklab, var(--fg) 22%, transparent);
	}
	.uc :global(.uc-tip) {
		padding: 0.3em 0.55em;
		background: var(--surface-2);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-xs);
		box-shadow: var(--shadow-2);
	}
	.uc-tip-v {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		font-weight: 600;
		color: var(--fg);
	}
</style>
