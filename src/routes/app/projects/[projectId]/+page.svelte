<script lang="ts">
	import { page } from '$app/state';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Plus, Box, Database as DbIcon, ArrowRight, Pencil, Trash2 } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Button, StatusBadge, Alert, EmptyState, Dialog, TextField, ConfirmDialog } from '$lib';
	import {
		getServices,
		getProject,
		renameProject,
		deleteProject,
		getProjectStatus,
		getDatabases,
		qk
	} from '$lib/query/resources';
	import { toast } from '$lib/toast.svelte';
	import type { Project } from '$lib/api/resources';
	import PageHead from '$lib/components/app/PageHead.svelte';
	import CreateServiceDialog from '$lib/components/app/CreateServiceDialog.svelte';
	import CreateDatabaseDialog from '$lib/components/app/CreateDatabaseDialog.svelte';

	const projectId = $derived(Number(page.params.projectId));
	const client = useQueryClient();

	// Fetch the project directly so name + org_id are available on a deep link
	// (falling back to any cached copy for an instant title).
	const cachedProject = $derived.by(() => {
		// Only match project-list caches: the ['orgs'] prefix also covers the org
		// list, whose items share the id space but have no org_id — guard for it.
		for (const [, data] of client.getQueriesData<Project[]>({ queryKey: ['orgs'] })) {
			const p = data?.find?.((x) => x.id === projectId && 'org_id' in x);
			if (p) return p;
		}
		return undefined;
	});
	const projectQuery = createQuery(() => ({
		queryKey: qk.project(projectId),
		queryFn: () => getProject(projectId)
	}));
	const project = $derived(projectQuery.data ?? cachedProject);

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
	const skeletons = [0, 1, 2];

	let renameOpen = $state(false);
	let deleteOpen = $state(false);
	let renameName = $state('');

	const rename = createMutation(() => ({
		mutationFn: () => renameProject(projectId, renameName.trim()),
		onSuccess: (p) => {
			client.invalidateQueries({ queryKey: qk.project(projectId) });
			if (project?.org_id) client.invalidateQueries({ queryKey: qk.projects(project.org_id) });
			renameOpen = false;
			toast.success('Project renamed');
			void p;
		}
	}));

	const remove = createMutation(() => ({
		mutationFn: () => deleteProject(projectId),
		onSuccess: async () => {
			const org = project?.org_id;
			if (org) client.invalidateQueries({ queryKey: qk.projects(org) });
			deleteOpen = false;
			toast.success('Project deleted');
			await goto(org ? `/app/orgs/${org}` : '/app');
		}
	}));
</script>

<svelte:head><title>{project?.name ?? 'Project'} · Uran</title></svelte:head>

<PageHead
	crumbs={[{ label: 'Overview', href: '/app' }, { label: project?.name ?? 'Project' }]}
	title={project?.name ?? 'Project'}
>
	<Button
		size="sm"
		variant="ghost"
		onclick={() => {
			renameName = project?.name ?? '';
			renameOpen = true;
		}}
	>
		<Pencil size={15} /> Rename
	</Button>
	<Button size="sm" variant="ghost" onclick={() => (deleteOpen = true)}>
		<Trash2 size={15} /> Delete
	</Button>
</PageHead>

<div class="body">
	<!-- Services -->
	<section>
		<div class="sec-head">
			<h2><Box size={16} /> Services</h2>
			<Button size="sm" onclick={() => (svcDialog = true)}><Plus size={16} /> New service</Button>
		</div>

		{#if services.isError}
			<Alert>{services.error.message}</Alert>
		{:else if !services.isPending && services.data.length === 0}
			<EmptyState
				icon={Box}
				title="No services yet"
				hint="Deploy a web service, worker, static site, or cron job."
			>
				<Button size="sm" onclick={() => (svcDialog = true)}><Plus size={16} /> New service</Button>
			</EmptyState>
		{:else}
			<div class="table" style="--cols: 2fr 1fr auto auto">
				<div class="thead" role="row">
					<span>Service</span><span>Type</span><span>Status</span><span></span>
				</div>
				{#if services.isPending}
					{#each skeletons as i (i)}<div class="srow"></div>{/each}
				{:else}
					{#each services.data as s (s.id)}
						<a class="trow" href="/app/services/{s.id}">
							<span class="cell-name">
								<span class="badge"><Box size={15} /></span>
								<b>{s.name}</b>
							</span>
							<span class="u-mono muted">{s.type}</span>
							<span
								>{#if statusOf.get(s.id)}<StatusBadge status={statusOf.get(s.id)!} />{/if}</span
							>
							<span class="arrow"><ArrowRight size={16} /></span>
						</a>
					{/each}
				{/if}
			</div>
		{/if}
	</section>

	<!-- Databases -->
	<section>
		<div class="sec-head">
			<h2><DbIcon size={16} /> Databases</h2>
			<Button size="sm" variant="secondary" onclick={() => (dbDialog = true)}>
				<Plus size={16} /> New database
			</Button>
		</div>

		{#if databases.isError}
			<Alert>{databases.error.message}</Alert>
		{:else if !databases.isPending && databases.data.length === 0}
			<EmptyState
				icon={DbIcon}
				title="No databases yet"
				hint="Provision managed Postgres or Redis."
			>
				<Button size="sm" variant="secondary" onclick={() => (dbDialog = true)}>
					<Plus size={16} /> New database
				</Button>
			</EmptyState>
		{:else}
			<div class="table" style="--cols: 2fr 1fr 1fr auto auto">
				<div class="thead" role="row">
					<span>Database</span><span>Engine</span><span>Size</span><span>Status</span><span></span>
				</div>
				{#if databases.isPending}
					{#each skeletons as i (i)}<div class="srow"></div>{/each}
				{:else}
					{#each databases.data as d (d.id)}
						<a class="trow" href="/app/databases/{d.id}">
							<span class="cell-name">
								<span class="badge"><DbIcon size={15} /></span>
								<b>{d.name}</b>
							</span>
							<span class="u-mono muted">{d.engine}</span>
							<span class="u-mono muted">{d.size}</span>
							<span><StatusBadge status={d.status} /></span>
							<span class="arrow"><ArrowRight size={16} /></span>
						</a>
					{/each}
				{/if}
			</div>
		{/if}
	</section>
</div>

<CreateServiceDialog bind:open={svcDialog} {projectId} orgId={project?.org_id} />
<CreateDatabaseDialog bind:open={dbDialog} {projectId} />

<Dialog bind:open={renameOpen} title="Rename project">
	<form
		class="u-stack"
		style="--flow: var(--space-m)"
		onsubmit={(e) => {
			e.preventDefault();
			if (renameName.trim()) rename.mutate();
		}}
	>
		{#if rename.isError}<Alert>{rename.error.message}</Alert>{/if}
		<TextField label="Name" name="rename" bind:value={renameName} required />
		<Button type="submit" full loading={rename.isPending}>Save</Button>
	</form>
</Dialog>

<ConfirmDialog
	bind:open={deleteOpen}
	title="Delete project?"
	message="This permanently deletes {project?.name ??
		'this project'} and all its services and databases. This cannot be undone."
	confirmLabel="Delete project"
	loading={remove.isPending}
	onconfirm={() => remove.mutate()}
/>

<style>
	.body {
		padding: var(--space-m);
		display: grid;
		gap: var(--space-xl);
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
	}
	.table {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--surface);
	}
	.thead,
	.trow {
		display: grid;
		grid-template-columns: var(--cols);
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-xs) var(--space-m);
	}
	.thead {
		font-size: var(--step--2);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		color: var(--fg-subtle);
		border-bottom: 1px solid var(--border);
	}
	.trow {
		border-top: 1px solid var(--border);
		color: var(--fg);
		transition: background var(--dur-2) var(--ease-out);
	}
	.trow:first-of-type {
		border-top: none;
	}
	.trow:hover {
		background: var(--surface-2);
	}
	.cell-name {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		min-width: 0;
	}
	.badge {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		flex-shrink: 0;
		border-radius: var(--radius-sm);
		background: var(--accent-soft);
		color: var(--accent);
	}
	.cell-name b {
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.arrow {
		display: inline-flex;
		color: var(--fg-subtle);
		transition:
			transform var(--dur-2) var(--ease-out),
			color var(--dur-2) var(--ease-out);
	}
	.trow:hover .arrow {
		transform: translateX(3px);
		color: var(--accent);
	}
	.srow {
		height: 3.25rem;
		border-top: 1px solid var(--border);
		background: linear-gradient(
			100deg,
			var(--surface) 30%,
			var(--surface-2) 50%,
			var(--surface) 70%
		);
		background-size: 200% 100%;
		animation: shimmer 1.3s ease-in-out infinite;
	}
	.srow:first-of-type {
		border-top: none;
	}
	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}

	@media (max-width: 44rem) {
		.thead,
		.trow {
			grid-template-columns: 1fr auto auto;
		}
		.thead span:nth-child(2),
		.trow .muted {
			display: none;
		}
	}
</style>
