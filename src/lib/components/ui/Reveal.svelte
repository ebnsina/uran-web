<!--
  Scroll-reveal wrapper. Children rise + fade the first time they enter the
  viewport (IntersectionObserver), with an optional stagger delay. Honours
  prefers-reduced-motion by rendering immediately. Pure microinteraction sugar.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		delay?: number;
		y?: number;
		once?: boolean;
		children: Snippet;
	}
	let { delay = 0, y = 16, once = true, children }: Props = $props();

	let shown = $state(false);

	function reveal(node: HTMLElement) {
		if (typeof IntersectionObserver === 'undefined') {
			shown = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						shown = true;
						if (once) io.disconnect();
					} else if (!once) {
						shown = false;
					}
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

<div use:reveal class="reveal" class:shown style="--reveal-delay: {delay}ms; --reveal-y: {y}px">
	{@render children()}
</div>

<style>
	.reveal {
		opacity: 0;
		transform: translate3d(0, var(--reveal-y), 0);
		transition:
			opacity var(--dur-4) var(--ease-out) var(--reveal-delay),
			transform var(--dur-4) var(--ease-out) var(--reveal-delay);
		will-change: opacity, transform;
	}
	.reveal.shown {
		opacity: 1;
		transform: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
