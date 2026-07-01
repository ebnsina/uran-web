<script lang="ts">
	import { page } from '$app/state';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { Plus, Box, Database as DbIcon } from '@lucide/svelte';
	import { Button, StatusBadge } from '$lib';
	import { getServices, getProjectStatus, getDatabases, qk } from '$lib/query/resources';
	import type { Project } from '$lib/api/resources';
	import PageHead from '$lib/components/app/PageHead.svelte';
	import ResourceList from '$lib/components/app/ResourceList.svelte';
	import CreateServiceDialog from '$lib/components/app/CreateServiceDialog.svelte';
	import CreateDatabaseDialog from '$lib/components/app/CreateDatabaseDialog.svelte';

	const projectId = $derived(Number(page.params.projectId));
	const client = useQueryClient();

	// Best-effort project name from the cache (populated when navigating in).
	const project = $derived.by(() => {
		for (const [, data] of client.getQueriesData<Project[]>({ queryKey: ['orgs'] })) {
			const p = data?.find?.((x) => x.id === projectId);
			if (p) return p;
		}
		return undefined;
	});

	const services = createQuery(() => ({
		queryKey: qk.services(projectId),
		queryFn: () => getServices(projectId)
	}));
	const status = createQuery(() => ({
		queryKey: qk.projectStatus(projectId),
		queryFn: () => getProjectStatus(projectId),
		refetchInterval: 8000
	}));
	const databases = createQuery(() => ({
		queryKey: qk.databases(projectId),
		queryFn: () => getDatabases(projectId)
	}));

	const statusOf = $derived(
		new Map((status.data ?? []).map((s) => [s.service_id, s.suspended ? 'suspended' : s.status]))
	);

	let svcDialog = $state(false);
	let dbDialog = $state(false);
</script>

<svelte:head><title>{project?.name ?? 'Project'} · Uran</title></svelte:head>

<PageHead
	crumbs={[{ label: 'Overview', href: '/app' }, { label: project?.name ?? 'Project' }]}
	title={project?.name ?? 'Project'}
/>

<div class="body">
	<section>
		<div class="sec-head">
			<h2><Box size={16} /> Services</h2>
			<Button size="sm" onclick={() => (svcDialog = true)}><Plus size={16} /> New service</Button>
		</div>
		<ResourceList
			query={services}
			empty={{
				title: 'No services yet',
				hint: 'Deploy a web service, worker, static site, or cron job.',
				icon: Box
			}}
		>
			{#snippet item(s)}
				<a class="card" href="/app/services/{s.id}">
					<span class="ico"><Box size={18} /></span>
					<div class="grow">
						<h3>{s.name}</h3>
						<p class="u-mono">{s.type}</p>
					</div>
					{#if statusOf.get(s.id)}<StatusBadge status={statusOf.get(s.id)!} />{/if}
				</a>
			{/snippet}
			{#snippet action()}
				<Button size="sm" onclick={() => (svcDialog = true)}><Plus size={16} /> New service</Button>
			{/snippet}
		</ResourceList>
	</section>

	<section>
		<div class="sec-head">
			<h2><DbIcon size={16} /> Databases</h2>
			<Button size="sm" variant="secondary" onclick={() => (dbDialog = true)}
				><Plus size={16} /> New database</Button
			>
		</div>
		<ResourceList
			query={databases}
			empty={{
				title: 'No databases yet',
				hint: 'Provision managed Postgres or Redis.',
				icon: DbIcon
			}}
		>
			{#snippet item(d)}
				<a class="card" href="/app/databases/{d.id}">
					<span class="ico"><DbIcon size={18} /></span>
					<div class="grow">
						<h3>{d.name}</h3>
						<p class="u-mono">{d.engine} · {d.size}</p>
					</div>
					<StatusBadge status={d.status} />
				</a>
			{/snippet}
			{#snippet action()}
				<Button size="sm" variant="secondary" onclick={() => (dbDialog = true)}>
					<Plus size={16} /> New database
				</Button>
			{/snippet}
		</ResourceList>
	</section>
</div>

<CreateServiceDialog bind:open={svcDialog} {projectId} />
<CreateDatabaseDialog bind:open={dbDialog} {projectId} />

<style>
	.body {
		padding: var(--space-l);
		display: grid;
		gap: var(--space-2xl);
	}
	.sec-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-m);
	}
	.sec-head h2 {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		font-size: var(--step-1);
		color: var(--fg);
	}
	.card {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-m);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		transition:
			transform var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out);
	}
	.card:hover {
		transform: translateY(-2px);
		border-color: var(--accent);
	}
	.ico {
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		flex-shrink: 0;
		color: var(--accent);
		background: var(--accent-soft);
		border-radius: var(--radius-sm);
	}
	.grow {
		flex: 1;
		min-width: 0;
	}
	.card h3 {
		font-size: var(--step-0);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.card p {
		margin-top: 2px;
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}
</style>
