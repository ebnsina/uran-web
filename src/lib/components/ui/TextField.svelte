<!--
  Labelled text input with inline validation messaging. The label sits above;
  the field border animates to the accent on focus and to danger on error.
  Errors fade/slide in via a Svelte transition.
-->
<script lang="ts">
	import { slide } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		label: string;
		name: string;
		value?: string;
		error?: string | undefined;
		hint?: string;
	}

	let {
		label,
		name,
		value = $bindable(''),
		error,
		hint,
		...rest
	}: Props & HTMLInputAttributes = $props();

	const fieldId = $derived(`f-${name}`);
	const errId = $derived(`${fieldId}-err`);
</script>

<div class="field" class:has-error={error}>
	<label for={fieldId}>{label}</label>
	<input
		id={fieldId}
		{name}
		bind:value
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? errId : undefined}
		{...rest}
	/>
	{#if error}
		<p class="msg" id={errId} transition:slide={{ duration: 200, easing: expoOut }}>{error}</p>
	{:else if hint}
		<p class="hint">{hint}</p>
	{/if}
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
	input {
		width: 100%;
		padding: 0.85em 1.15em;
		background: var(--surface-2);
		color: var(--fg);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		transition:
			border-color var(--dur-2) var(--ease-out),
			box-shadow var(--dur-2) var(--ease-out),
			background var(--dur-2) var(--ease-out);
	}
	input::placeholder {
		color: var(--fg-subtle);
	}
	input:hover {
		border-color: var(--fg-subtle);
	}
	input:focus {
		outline: none;
		background: var(--surface);
		border-color: var(--accent);
		box-shadow: var(--focus-ring);
	}
	.has-error input {
		border-color: var(--danger);
	}
	.has-error input:focus {
		box-shadow:
			0 0 0 2px var(--surface),
			0 0 0 4px var(--danger);
	}
	.msg {
		font-size: var(--step--1);
		color: var(--danger);
	}
	.hint {
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}
</style>
