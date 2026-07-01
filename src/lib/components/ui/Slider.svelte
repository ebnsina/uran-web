<!-- Custom range slider: accent-filled track, clean thumb, live readout. -->
<script lang="ts">
	interface Props {
		label: string;
		name: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		suffix?: string;
	}
	let {
		label,
		name,
		value = $bindable(1),
		min = 1,
		max = 10,
		step = 1,
		suffix = ''
	}: Props = $props();

	const id = $derived(`r-${name}`);
	const pct = $derived(max > min ? ((value - min) / (max - min)) * 100 : 0);
</script>

<div class="field">
	<div class="top">
		<label for={id}>{label}</label>
		<span class="val u-mono">{value}{suffix}</span>
	</div>
	<input {id} {name} type="range" {min} {max} {step} bind:value style="--pct: {pct}%" />
	<div class="ticks" aria-hidden="true">
		<span>{min}</span>
		<span>{max}</span>
	</div>
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}
	.top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}
	label {
		font-size: var(--step--1);
		font-weight: 500;
		color: var(--fg-muted);
	}
	.val {
		font-size: var(--step-0);
		font-weight: 600;
		color: var(--accent);
	}

	input[type='range'] {
		width: 100%;
		height: 1.25rem;
		margin: 0;
		background: transparent;
		cursor: pointer;
		-webkit-appearance: none;
		appearance: none;
	}
	input[type='range']:focus-visible {
		outline: none;
	}

	/* ── Track ── */
	input[type='range']::-webkit-slider-runnable-track {
		height: 6px;
		border-radius: var(--radius-full);
		background: linear-gradient(
			to right,
			var(--accent) var(--pct),
			var(--surface-hover) var(--pct)
		);
	}
	input[type='range']::-moz-range-track {
		height: 6px;
		border-radius: var(--radius-full);
		background: var(--surface-hover);
	}
	input[type='range']::-moz-range-progress {
		height: 6px;
		border-radius: var(--radius-full);
		background: var(--accent);
	}

	/* ── Thumb ── */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		margin-top: -5px; /* centre on the 6px track */
		border-radius: var(--radius-full);
		background: var(--accent);
		border: 3px solid var(--surface);
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.3);
		transition: transform var(--dur-1) var(--ease-out);
	}
	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border: 3px solid var(--surface);
		border-radius: var(--radius-full);
		background: var(--accent);
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.3);
		transition: transform var(--dur-1) var(--ease-out);
	}
	input[type='range']:hover::-webkit-slider-thumb {
		transform: scale(1.12);
	}
	input[type='range']:hover::-moz-range-thumb {
		transform: scale(1.12);
	}
	input[type='range']:focus-visible::-webkit-slider-thumb {
		box-shadow: var(--focus-ring);
	}
	input[type='range']:focus-visible::-moz-range-thumb {
		box-shadow: var(--focus-ring);
	}

	.ticks {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
</style>
