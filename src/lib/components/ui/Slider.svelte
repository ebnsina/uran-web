<!-- Labelled range slider with a live numeric readout. Accent-tinted track. -->
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
</script>

<div class="field">
	<div class="top">
		<label for={id}>{label}</label>
		<span class="val u-mono">{value}{suffix}</span>
	</div>
	<input {id} {name} type="range" {min} {max} {step} bind:value />
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
		accent-color: var(--accent);
		cursor: pointer;
		height: 1.4rem;
	}
	input[type='range']:focus-visible {
		outline: 2px solid var(--accent-soft);
		outline-offset: 4px;
		border-radius: var(--radius-xs);
	}
	.ticks {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
</style>
