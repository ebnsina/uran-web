<!--
  Slot-machine number: each digit is a 0–9 reel that rolls to its target as the
  value changes. Inherits font/colour from its context. Respects reduced-motion.
-->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		value: number | string;
	}
	let { value }: Props = $props();

	// Roll up from zeros on first paint, then to the real value.
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	const target = $derived(String(value));
	const chars = $derived((ready ? target : target.replace(/[0-9]/g, '0')).split(''));
	const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const isDigit = (c: string) => c >= '0' && c <= '9';
</script>

<span class="roll" aria-label={String(value)}>
	{#each chars as c, i (i)}
		{#if isDigit(c)}
			<span class="col">
				<span class="reel" style="transform: translateY({-Number(c) * 10}%)">
					{#each rows as n (n)}<span class="cell">{n}</span>{/each}
				</span>
			</span>
		{:else}
			<span class="sep" aria-hidden="true">{c}</span>
		{/if}
	{/each}
</span>

<style>
	.roll {
		display: inline-flex;
		height: 1em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.col {
		display: inline-block;
		height: 1em;
		overflow: hidden;
	}
	.reel {
		display: flex;
		flex-direction: column;
		will-change: transform;
		transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 1em;
	}
	@media (prefers-reduced-motion: reduce) {
		.reel {
			transition: none;
		}
	}
</style>
