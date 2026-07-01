<script lang="ts">
	import { page } from '$app/state';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Plus, FolderGit2, Pencil, Trash2 } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Button, TextField, Dialog, ConfirmDialog, Alert } from '$lib';
	import { getOrgs, keys } from '$lib/query/dashboard';
	import { getProjects, createProject, renameOrg, deleteOrg, qk } from '$lib/query/resources';
	import ResourceList from '$lib/components/app/ResourceList.svelte';
	import PageHead from '$lib/components/app/PageHead.svelte';
	import MembersSection from '$lib/components/app/MembersSection.svelte';
	import RegistryCredsSection from '$lib/components/app/RegistryCredsSection.svelte';
	import { toast } from '$lib/toast.svelte';

	const orgId = $derived(Number(page.params.orgId));
	const client = useQueryClient();

	const orgs = createQuery(() => ({ queryKey: keys.orgs, queryFn: getOrgs, staleTime: 60_000 }));
	const org = $derived(orgs.data?.find((o) => o.id === orgId));

	const projects = createQuery(() => ({
		queryKey: qk.projects(orgId),
		queryFn: () => getProjects(orgId)
	}));

	let dialogOpen = $state(false);
	let name = $state('');

	const create = createMutation(() => ({
		mutationFn: () => createProject(orgId, name.trim()),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: qk.projects(orgId) });
			dialogOpen = false;
			name = '';
			toast.success('Project created');
		}
	}));

	let renameOpen = $state(false);
	let deleteOpen = $state(false);
	let renameName = $state('');

	const rename = createMutation(() => ({
		mutationFn: () => renameOrg(orgId, renameName.trim()),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: keys.orgs });
			renameOpen = false;
			toast.success('Organization renamed');
		}
	}));

	const remove = createMutation(() => ({
		mutationFn: () => deleteOrg(orgId),
		onSuccess: async () => {
			client.invalidateQueries({ queryKey: keys.orgs });
			deleteOpen = false;
			toast.success('Organization deleted');
			await goto('/app');
		}
	}));
</script>

<svelte:head><title>Projects · Uran</title></svelte:head>

<PageHead
	crumbs={[{ label: 'Overview', href: '/app' }, { label: org?.name ?? 'Organization' }]}
	title="Projects"
>
	<Button
		size="sm"
		variant="ghost"
		onclick={() => {
			renameName = org?.name ?? '';
			renameOpen = true;
		}}
	>
		<Pencil size={15} /> Rename
	</Button>
	<Button size="sm" variant="ghost" onclick={() => (deleteOpen = true)}>
		<Trash2 size={15} /> Delete
	</Button>
	<Button size="sm" onclick={() => (dialogOpen = true)}>
		<Plus size={16} /> New project
	</Button>
</PageHead>

<div class="body">
	<section>
		<h2 class="sec-title">Projects</h2>
		<ResourceList
			query={projects}
			empty={{
				title: 'No projects yet',
				hint: 'Group your services and databases into a project.',
				icon: FolderGit2
			}}
		>
			{#snippet item(p)}
				<a class="card" href="/app/projects/{p.id}">
					<span class="ico"><FolderGit2 size={18} /></span>
					<div>
						<h3>{p.name}</h3>
						<p class="u-mono">{p.slug}</p>
					</div>
				</a>
			{/snippet}
			{#snippet action()}
				<Button size="sm" onclick={() => (dialogOpen = true)}>
					<Plus size={16} /> New project
				</Button>
			{/snippet}
		</ResourceList>
	</section>

	<MembersSection {orgId} />

	<RegistryCredsSection {orgId} />
</div>

<Dialog bind:open={dialogOpen} title="New project">
	<form
		class="u-stack"
		style="--flow: var(--space-m)"
		onsubmit={(e) => {
			e.preventDefault();
			if (name.trim()) create.mutate();
		}}
	>
		{#if create.isError}<Alert>{create.error.message}</Alert>{/if}
		<TextField label="Name" name="name" bind:value={name} placeholder="my-project" required />
		<Button type="submit" full loading={create.isPending}>Create project</Button>
	</form>
</Dialog>

<Dialog bind:open={renameOpen} title="Rename organization">
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
	title="Delete organization?"
	message="This permanently deletes {org?.name ??
		'this organization'} and all its projects, services and databases. This cannot be undone."
	confirmLabel="Delete organization"
	loading={remove.isPending}
	onconfirm={() => remove.mutate()}
/>

<style>
	.body {
		padding: var(--space-l);
		display: grid;
		gap: var(--space-2xl);
	}
	.sec-title {
		font-size: var(--step-1);
		margin-bottom: var(--space-m);
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
	.card h3 {
		font-size: var(--step-0);
	}
	.card p {
		margin-top: 2px;
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}
</style>
