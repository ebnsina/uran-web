<!-- Minimal SVG sparkline: an area + line for a series of numbers. -->
<script lang="ts">
	interface Props {
		data: number[];
		width?: number;
		height?: number;
		color?: string;
	}
	let { data, width = 220, height = 44, color = 'var(--accent)' }: Props = $props();

	const pad = 2;
	const points = $derived.by(() => {
		if (data.length < 2) return null;
		const max = Math.max(...data, 1);
		const min = Math.min(...data, 0);
		const span = max - min || 1;
		const stepX = (width - pad * 2) / (data.length - 1);
		return data.map((v, i) => {
			const x = pad + i * stepX;
			const y = pad + (height - pad * 2) * (1 - (v - min) / span);
			return [x, y] as const;
		});
	});
	const line = $derived(points ? points.map(([x, y]) => `${x},${y}`).join(' ') : '');
	const area = $derived(
		points ? `${pad},${height - pad} ${line} ${width - pad},${height - pad}` : ''
	);
</script>

{#if points}
	<svg {width} {height} viewBox="0 0 {width} {height}" style="--c: {color}" aria-hidden="true">
		<polygon class="area" points={area} />
		<polyline class="line" points={line} />
	</svg>
{:else}
	<span class="empty">not enough data</span>
{/if}

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.area {
		fill: color-mix(in oklab, var(--c) 14%, transparent);
	}
	.line {
		fill: none;
		stroke: var(--c);
		stroke-width: 1.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.empty {
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
</style>
