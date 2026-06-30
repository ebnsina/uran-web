/**
 * Reusable motion primitives. Centralising transitions keeps microinteractions
 * consistent and makes the whole app's "feel" tunable from one file. Durations
 * and easings mirror the CSS motion tokens so JS and CSS animation agree.
 */
import { cubicOut, expoOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

/** Durations (ms) — keep in lockstep with --dur-* tokens. */
export const duration = {
	fast: 120,
	base: 220,
	slow: 360,
	slower: 600
} as const;

/**
 * Rise + fade. The signature entrance for cards, list rows and sections.
 * `y` is the travel distance in px; `delay` staggers grouped elements.
 */
export function riseIn(
	_node: Element,
	{
		delay = 0,
		duration: d = duration.slow,
		y = 14
	}: { delay?: number; duration?: number; y?: number } = {}
): TransitionConfig {
	return {
		delay,
		duration: d,
		easing: expoOut,
		css: (t) => {
			const eased = 1 - t;
			return `opacity: ${t}; transform: translate3d(0, ${eased * y}px, 0);`;
		}
	};
}

/** Scale + fade for popovers, toasts and menus — anchored, snappy. */
export function popIn(
	_node: Element,
	{
		delay = 0,
		duration: d = duration.base,
		start = 0.96
	}: { delay?: number; duration?: number; start?: number } = {}
): TransitionConfig {
	return {
		delay,
		duration: d,
		easing: cubicOut,
		css: (t, u) =>
			`opacity: ${t}; transform: scale(${start + (1 - start) * t}) translateY(${u * -4}px);`
	};
}

/**
 * Stagger helper: returns a per-index delay (ms) with a sensible cap so long
 * lists don't animate forever. Use as `delay: stagger(i)`.
 */
export function stagger(index: number, step = 55, max = 400): number {
	return Math.min(index * step, max);
}
