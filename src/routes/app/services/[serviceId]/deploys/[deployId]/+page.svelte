<script lang="ts">
	import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { StatusBadge } from '$lib';
	import { getDeploy, qk } from '$lib/query/resources';
	import PageHead from '$lib/components/app/PageHead.svelte';

	const serviceId = $derived(Number(page.params.serviceId));
	const deployId = $derived(Number(page.params.deployId));

	const dep = createQuery(() => ({
		queryKey: qk.deploy(deployId),
		queryFn: () => getDeploy(deployId)
	}));

	let lines = $state<string[]>([]);
	let streamState = $state<'connecting' | 'streaming' | 'done' | 'error'>('connecting');
	let viewport = $state<HTMLElement>();

	async function autoscroll() {
		await tick();
		if (viewport) viewport.scrollTop = viewport.scrollHeight;
	}

	onMount(() => {
		// SSE build logs through the proxy. Cookie is same-origin so it's sent.
		const es = new EventSource(`/api/v1/deploys/${deployId}/logs`);
		es.onopen = () => (streamState = 'streaming');
		es.onmessage = (e) => {
			lines = [...lines, e.data].slice(-2000);
			autoscroll();
		};
		es.addEventListener('end', () => {
			streamState = 'done';
			es.close();
			dep.refetch();
		});
		es.onerror = () => {
			if (streamState !== 'done') streamState = 'error';
			es.close();
		};
		return () => es.close();
	});
</script>

<svelte:head><title>Deploy #{deployId} · Uran</title></svelte:head>

<PageHead
	crumbs={[
		{ label: 'Overview', href: '/app' },
		{ label: 'Service', href: `/app/services/${serviceId}` },
		{ label: `Deploy #${deployId}` }
	]}
	title="Deploy #{deployId}"
>
	{#if dep.data}<StatusBadge status={dep.data.status} />{/if}
</PageHead>

<div class="content">
	{#if dep.data}
		<div class="meta u-mono">
			{dep.data.commit_sha ? dep.data.commit_sha.slice(0, 12) : dep.data.image || '—'} · {dep.data
				.kind}
		</div>
	{/if}

	<div class="bar">
		<span class="dot {streamState}"></span>
		<span>
			{streamState === 'connecting'
				? 'Connecting…'
				: streamState === 'streaming'
					? 'Streaming build logs'
					: streamState === 'done'
						? 'Build finished'
						: 'Log stream ended'}
		</span>
	</div>

	<div class="logs u-mono" bind:this={viewport}>
		{#if lines.length === 0}
			<span class="muted">Waiting for build output…</span>
		{/if}
		{#each lines as line, i (i)}
			<div class="line">{line}</div>
		{/each}
	</div>
</div>

<style>
	.content {
		padding: var(--space-l);
	}
	.meta {
		color: var(--fg-muted);
		font-size: var(--step--1);
		margin-bottom: var(--space-m);
	}
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
		height: 32rem;
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
