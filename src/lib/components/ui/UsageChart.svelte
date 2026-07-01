<!--
  Area chart for a time series of metric samples, built on LayerChart: a y-axis
  with gridlines, a smooth filled area, and a hover highlight. Pass a plain
  number[] (oldest → newest); styling comes from design tokens.
-->
<script lang="ts">
	import { Chart, Svg, Axis, Area, Highlight } from 'layerchart';
	import { scaleLinear } from 'd3-scale';
	import { curveMonotoneX } from 'd3-shape';

	interface Props {
		data: number[];
		color?: string;
		/** Optional short unit for the y tick labels, e.g. "m" or "Mi". */
		unit?: string;
	}
	let { data, color = 'var(--accent)', unit = '' }: Props = $props();

	const points = $derived(data.map((v, i) => ({ i, v })));
	const fmt = (v: number) => `${v}${unit}`;
</script>

<div class="uc">
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
			tooltip
		>
			<Svg>
				<Axis
					placement="left"
					ticks={4}
					format={fmt}
					grid={{ class: 'uc-grid' }}
					classes={{ tickLabel: 'uc-tl' }}
				/>
				<Area
					curve={curveMonotoneX}
					line={{ stroke: color, strokeWidth: 2 }}
					fill={color}
					fillOpacity={0.14}
				/>
				<Highlight points={{ fill: color, r: 3 }} lines={{ class: 'uc-hl' }} />
			</Svg>
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
	.uc :global(.uc-grid) {
		stroke: color-mix(in oklab, var(--fg) 8%, transparent);
	}
	.uc :global(.uc-hl) {
		stroke: color-mix(in oklab, var(--fg) 20%, transparent);
	}
	.uc :global(.uc-tl) {
		fill: var(--fg-subtle);
		font-size: 10px;
		font-family: var(--font-mono);
	}
</style>
