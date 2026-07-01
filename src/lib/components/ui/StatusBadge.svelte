<!-- Status pill with a tone-coloured dot. Maps known statuses to a tone. -->
<script lang="ts">
	interface Props {
		status: string;
		/** Pulse the dot for in-progress states. */
		pulse?: boolean;
	}
	let { status, pulse }: Props = $props();

	const tones: Record<string, 'ok' | 'accent' | 'warn' | 'danger' | 'muted'> = {
		live: 'ok',
		ready: 'ok',
		deploying: 'accent',
		building: 'warn',
		queued: 'muted',
		creating: 'warn',
		failed: 'danger',
		suspended: 'muted',
		none: 'muted'
	};
	const tone = $derived(tones[status.toLowerCase()] ?? 'muted');
	const active = $derived(
		['deploying', 'building', 'queued', 'creating'].includes(status.toLowerCase())
	);
</script>

<span class="badge {tone}">
	<span class="dot" class:pulse={pulse ?? active}></span>{status}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		padding: 0.25em 0.6em;
		font-size: var(--step--1);
		font-family: var(--font-mono);
		border-radius: var(--radius-full);
		border: 1px solid var(--border);
		text-transform: capitalize;
		white-space: nowrap;
		color: var(--_tone);
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: var(--radius-full);
		background: currentColor;
		flex-shrink: 0;
	}
	.dot.pulse {
		animation: pulse 1.6s var(--ease-in-out) infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.35;
		}
	}
	.ok {
		--_tone: var(--ok);
	}
	.accent {
		--_tone: var(--accent);
	}
	.warn {
		--_tone: var(--warn);
	}
	.danger {
		--_tone: var(--danger);
	}
	.muted {
		--_tone: var(--fg-subtle);
	}
</style>
