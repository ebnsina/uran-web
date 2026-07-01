<!-- Labelled native select, styled to match TextField. -->
<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props {
		label: string;
		name: string;
		value?: string;
		options: { value: string; label: string }[];
	}
	let {
		label,
		name,
		value = $bindable(''),
		options,
		...rest
	}: Props & HTMLSelectAttributes = $props();
	const fieldId = $derived(`s-${name}`);
</script>

<div class="field">
	{#if label}<label for={fieldId}>{label}</label>{/if}
	<div class="wrap">
		<select id={fieldId} {name} bind:value {...rest}>
			{#each options as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</select>
		<span class="chev" aria-hidden="true"><ChevronDown size={16} /></span>
	</div>
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}
	label {
		font-size: var(--step--1);
		font-weight: 500;
		color: var(--fg-muted);
	}
	.wrap {
		position: relative;
	}
	select {
		width: 100%;
		appearance: none;
		padding: 0.85em 2.4em 0.85em 1.15em;
		background: var(--surface-2);
		color: var(--fg);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		cursor: pointer;
		transition:
			border-color var(--dur-2) var(--ease-out),
			box-shadow var(--dur-2) var(--ease-out);
	}
	select:hover {
		border-color: var(--fg-subtle);
	}
	select:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-soft);
	}
	.chev {
		position: absolute;
		right: 0.7em;
		top: 50%;
		transform: translateY(-50%);
		color: var(--fg-subtle);
		pointer-events: none;
	}
</style>
