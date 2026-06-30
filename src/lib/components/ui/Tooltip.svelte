<!--
  Lightweight tooltip. CSS-driven (shows on hover and keyboard focus-within), so
  there's no JS state to manage. Token-styled; respects reduced-motion via the
  global transition gate.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text: string;
		placement?: 'top' | 'bottom';
		children: Snippet;
	}
	let { text, placement = 'bottom', children }: Props = $props();
</script>

<span class="tip-wrap">
	{@render children()}
	<span class="tip {placement}" role="tooltip">{text}</span>
</span>

<style>
	.tip-wrap {
		position: relative;
		display: inline-flex;
	}
	.tip {
		position: absolute;
		left: 50%;
		z-index: 60;
		width: max-content;
		max-width: 16rem;
		padding: 0.4em 0.65em;
		font-size: var(--step--2);
		line-height: 1.4;
		color: var(--fg);
		background: var(--surface-2);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-sm);
		box-shadow: var(--shadow-2);
		opacity: 0;
		pointer-events: none;
		transform: translate(-50%, var(--tip-from));
		transition:
			opacity var(--dur-2) var(--ease-out),
			transform var(--dur-2) var(--ease-out);
	}
	.tip.bottom {
		--tip-from: 2px;
		top: calc(100% + 8px);
	}
	.tip.top {
		--tip-from: -2px;
		bottom: calc(100% + 8px);
	}
	/* Arrow */
	.tip::before {
		content: '';
		position: absolute;
		left: 50%;
		width: 8px;
		height: 8px;
		background: var(--surface-2);
		border: 1px solid var(--border-strong);
		transform: translateX(-50%) rotate(45deg);
	}
	.tip.bottom::before {
		top: -5px;
		border-right: none;
		border-bottom: none;
	}
	.tip.top::before {
		bottom: -5px;
		border-left: none;
		border-top: none;
	}

	.tip-wrap:hover .tip,
	.tip-wrap:focus-within .tip {
		opacity: 1;
		transform: translate(-50%, 0);
	}
</style>
