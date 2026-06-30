<script lang="ts">
	import { page } from '$app/state';
	import { createQuery } from '@tanstack/svelte-query';
	import {
		ExternalLink,
		Box,
		GitBranch,
		Cpu,
		Gauge,
		FolderGit2,
		Globe,
		Activity
	} from '@lucide/svelte';
	import { StatusBadge, Alert } from '$lib';
	import { getService, getDeploys, getMetrics, qk } from '$lib/query/resources';
	import type { Deploy } from '$lib/api/resources';
	import PageHead from '$lib/components/app/PageHead.svelte';
	import DeploysTab from '$lib/components/app/service/DeploysTab.svelte';
	import LogsTab from '$lib/components/app/service/LogsTab.svelte';
	import VariablesTab from '$lib/components/app/service/VariablesTab.svelte';
	import DomainsTab from '$lib/components/app/service/DomainsTab.svelte';
	import SettingsTab from '$lib/components/app/service/SettingsTab.svelte';

	const serviceId = $derived(Number(page.params.serviceId));

	const svc = createQuery(() => ({
		queryKey: qk.service(serviceId),
		queryFn: () => getService(serviceId)
	}));
	const ACTIVE = ['queued', 'building', 'deploying'];
	const deploys = createQuery(() => ({
		queryKey: qk.deploys(serviceId),
		queryFn: () => getDeploys(serviceId),
		refetchInterval: (q) =>
			q.state.data?.some((d: Deploy) => ACTIVE.includes(d.status)) ? 3000 : false
	}));
	const metrics = createQuery(() => ({
		queryKey: qk.metrics(serviceId),
		queryFn: () => getMetrics(serviceId),
		refetchInterval: 10_000,
		retry: false
	}));

	const status = $derived(
		svc.data?.suspended ? 'suspended' : (deploys.data?.[0]?.status ?? 'none')
	);

	const tabs = ['Overview', 'Deploys', 'Logs', 'Variables', 'Domains', 'Settings'] as const;
	let tab = $state<(typeof tabs)[number]>('Overview');

	const totalCpu = $derived((metrics.data ?? []).reduce((a, m) => a + m.cpu_millicores, 0));
	const totalMem = $derived((metrics.data ?? []).reduce((a, m) => a + m.memory_bytes, 0));
	const mib = (b: number) => Math.round(b / (1024 * 1024));
</script>

<svelte:head><title>{svc.data?.name ?? 'Service'} · Uran</title></svelte:head>

{#if svc.isError}
	<div class="pad"><Alert>{svc.error.message}</Alert></div>
{:else}
	<PageHead
		crumbs={[
			{ label: 'Overview', href: '/app' },
			{ label: 'Project', href: svc.data ? `/app/projects/${svc.data.project_id}` : '/app' },
			{ label: svc.data?.name ?? 'Service' }
		]}
		title={svc.data?.name ?? 'Service'}
	>
		<StatusBadge {status} />
	</PageHead>

	<nav class="tabs">
		{#each tabs as t (t)}
			<button class="tab" class:active={tab === t} onclick={() => (tab = t)}>{t}</button>
		{/each}
	</nav>

	<div class="content">
		{#if tab === 'Overview'}
			{#if svc.data}
				{@const s = svc.data}
				<div class="info">
					<div class="kv">
						<span class="kv-ico"><Box size={15} /></span>
						<span class="kv-label">Type</span><b class="u-mono">{s.type}</b>
					</div>
					<div class="kv">
						<span class="kv-ico"><GitBranch size={15} /></span>
						<span class="kv-label">Branch</span><b class="u-mono">{s.branch || '—'}</b>
					</div>
					<div class="kv">
						<span class="kv-ico"><Cpu size={15} /></span>
						<span class="kv-label">Instance</span><b class="u-mono">{s.instance_size}</b>
					</div>
					<div class="kv">
						<span class="kv-ico"><Gauge size={15} /></span>
						<span class="kv-label">Scaling</span>
						<b class="u-mono"
							>{s.max_replicas > 0
								? `auto ${s.min_replicas}–${s.max_replicas}`
								: `${s.replicas}×`}</b
						>
					</div>
					{#if s.repo_url}
						<div class="kv wide">
							<span class="kv-ico"><FolderGit2 size={15} /></span>
							<span class="kv-label">Repository</span><b class="u-mono">{s.repo_url}</b>
						</div>
					{/if}
					{#if s.internal_host}
						<div class="kv wide">
							<span class="kv-ico"><Globe size={15} /></span>
							<span class="kv-label">URL</span>
							<a
								class="u-mono link"
								href="https://{s.internal_host}"
								target="_blank"
								rel="noreferrer"
							>
								{s.internal_host}
								<ExternalLink size={13} />
							</a>
						</div>
					{/if}
				</div>

				<h3 class="sub"><Activity size={16} /> Live usage</h3>
				{#if metrics.isError}
					<p class="muted">Metrics unavailable.</p>
				{:else if (metrics.data ?? []).length === 0}
					<p class="muted">No running pods.</p>
				{:else}
					<div class="metrics">
						<div class="metric"><span>Pods</span><b>{metrics.data?.length}</b></div>
						<div class="metric"><span>CPU</span><b>{totalCpu}m</b></div>
						<div class="metric"><span>Memory</span><b>{mib(totalMem)} MiB</b></div>
					</div>
				{/if}
			{/if}
		{:else if tab === 'Deploys'}
			<DeploysTab {serviceId} />
		{:else if tab === 'Logs'}
			<LogsTab {serviceId} />
		{:else if tab === 'Variables'}
			<VariablesTab {serviceId} />
		{:else if tab === 'Domains'}
			<DomainsTab {serviceId} />
		{:else if tab === 'Settings'}
			{#if svc.data}<SettingsTab service={svc.data} />{/if}
		{/if}
	</div>
{/if}

<style>
	.pad {
		padding: var(--space-l);
	}
	.tabs {
		display: flex;
		gap: var(--space-2xs);
		padding: 0 var(--space-l);
		border-bottom: 1px solid var(--border);
		overflow-x: auto;
	}
	.tab {
		padding: 0.7em 0.9em;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--fg-muted);
		font-size: var(--step--1);
		font-weight: 500;
		cursor: pointer;
		white-space: nowrap;
		transition: color var(--dur-2) var(--ease-out);
	}
	.tab:hover {
		color: var(--fg);
	}
	.tab.active {
		color: var(--fg);
		border-bottom-color: var(--accent);
	}
	.content {
		padding: var(--space-l);
	}
	.info {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: var(--space-s);
		margin-bottom: var(--space-xl);
	}
	.kv {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		column-gap: var(--space-2xs);
		row-gap: 2px;
		padding: var(--space-s) var(--space-m);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}
	.kv.wide {
		grid-column: 1 / -1;
	}
	.kv-ico {
		grid-row: 1 / span 2;
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		color: var(--accent);
		background: var(--accent-soft);
		border-radius: var(--radius-sm);
	}
	.kv-label {
		font-size: var(--step--2);
		color: var(--fg-subtle);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}
	.kv b {
		font-weight: 500;
		overflow-wrap: anywhere;
	}
	.link {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		color: var(--accent);
	}
	.sub {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		font-size: var(--step-1);
		margin-bottom: var(--space-s);
	}
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
		gap: var(--space-s);
	}
	.metric {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: var(--space-m);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}
	.metric span {
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.metric b {
		font-size: var(--step-2);
		font-family: var(--font-mono);
	}
</style>
