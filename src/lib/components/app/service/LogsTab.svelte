<!--
  Live runtime logs. Streams the proxied text/plain log endpoint with a fetch
  ReadableStream reader, appends lines (capped), and auto-scrolls.
-->
<script lang="ts">
	import { onMount, tick } from 'svelte';

	let { serviceId }: { serviceId: number } = $props();

	let lines = $state<string[]>([]);
	let streamState = $state<'connecting' | 'streaming' | 'ended' | 'error'>('connecting');
	let viewport = $state<HTMLElement>();

	onMount(() => {
		const ctrl = new AbortController();
		(async () => {
			let res: Response;
			try {
				res = await fetch(`/api/v1/services/${serviceId}/runtime-logs`, { signal: ctrl.signal });
			} catch {
				streamState = 'error';
				return;
			}
			if (!res.ok || !res.body) {
				streamState = 'error';
				return;
			}
			streamState = 'streaming';
			const reader = res.body.getReader();
			const dec = new TextDecoder();
			let buf = '';
			try {
				for (;;) {
					const { done, value } = await reader.read();
					if (done) break;
					buf += dec.decode(value, { stream: true });
					const parts = buf.split('\n');
					buf = parts.pop() ?? '';
					if (parts.length) {
						lines = [...lines, ...parts].slice(-1000);
						await tick();
						if (viewport) viewport.scrollTop = viewport.scrollHeight;
					}
				}
				streamState = 'ended';
			} catch {
				if (!ctrl.signal.aborted) streamState = 'error';
			}
		})();
		return () => ctrl.abort();
	});
</script>

<div class="bar">
	<span class="dot {streamState}"></span>
	<span class="label">
		{streamState === 'connecting'
			? 'Connecting…'
			: streamState === 'streaming'
				? 'Streaming live'
				: streamState === 'ended'
					? 'Stream ended'
					: 'No running pods / stream unavailable'}
	</span>
</div>

<div class="logs u-mono" bind:this={viewport}>
	{#if lines.length === 0 && streamState === 'streaming'}
		<span class="muted">Waiting for output…</span>
	{/if}
	{#each lines as line, i (i)}
		<div class="line">{line}</div>
	{/each}
</div>

<style>
	.bar {
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin-bottom: var(--space-s);
		font-size: var(--step--1);
		color: var(--fg-muted);
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		background: var(--fg-subtle);
	}
	.dot.streaming {
		background: var(--ok);
		animation: pulse 1.6s var(--ease-in-out) infinite;
	}
	.dot.connecting {
		background: var(--warn);
	}
	.dot.error {
		background: var(--danger);
	}
	@keyframes pulse {
		50% {
			opacity: 0.35;
		}
	}
	.logs {
		height: 28rem;
		overflow: auto;
		padding: var(--space-s) var(--space-m);
		background: var(--ink-900);
		color: var(--paper-100);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		font-size: var(--step--1);
		line-height: 1.7;
	}
	.line {
		white-space: pre-wrap;
		word-break: break-word;
	}
	.muted {
		color: var(--fg-subtle);
	}
</style>
