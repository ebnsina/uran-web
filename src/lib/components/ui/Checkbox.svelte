<!-- Labelled checkbox with an optional hint. -->
<script lang="ts">
	interface Props {
		label: string;
		name: string;
		checked?: boolean;
		hint?: string;
	}
	let { label, name, checked = $bindable(false), hint }: Props = $props();
</script>

<label class="check">
	<input type="checkbox" {name} bind:checked />
	<span class="box" aria-hidden="true"></span>
	<span class="text">
		{label}
		{#if hint}<span class="hint">{hint}</span>{/if}
	</span>
</label>

<style>
	.check {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2xs);
		cursor: pointer;
		user-select: none;
	}
	input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}
	.box {
		flex-shrink: 0;
		width: 1.15rem;
		height: 1.15rem;
		margin-top: 0.1rem;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-xs);
		background: var(--surface-2);
		transition:
			background var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out);
		position: relative;
	}
	input:checked + .box {
		background: var(--accent);
		border-color: var(--accent);
	}
	input:checked + .box::after {
		content: '';
		position: absolute;
		left: 0.36rem;
		top: 0.16rem;
		width: 0.28rem;
		height: 0.55rem;
		border: solid var(--accent-contrast);
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}
	input:focus-visible + .box {
		box-shadow: 0 0 0 3px var(--accent-soft);
	}
	.text {
		font-size: var(--step--1);
		color: var(--fg);
	}
	.hint {
		display: block;
		color: var(--fg-subtle);
	}
</style>
