<!-- Create-service dialog: pick a repo via a public URL or a connected GitHub account. -->
<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { FolderGit2, Link2 } from '@lucide/svelte';
	import { Button, TextField, Select, Dialog, Alert } from '$lib';
	import { createService, getGithubStatus, getGithubRepos, qk } from '$lib/query/resources';
	import { SERVICE_TYPES, type GithubRepo } from '$lib/api/resources';
	import { toast } from '$lib/toast.svelte';

	interface Props {
		open: boolean;
		projectId: number;
		orgId?: number;
	}
	let { open = $bindable(), projectId, orgId }: Props = $props();

	const client = useQueryClient();

	let name = $state('');
	let type = $state('web');
	let repoUrl = $state('');
	let branch = $state('main');
	let schedule = $state('');
	let source = $state<'url' | 'github'>('url');

	const typeOptions = SERVICE_TYPES.map((t) => ({ value: t, label: t }));
	const isCron = $derived(type === 'cron');

	// GitHub connection + repos (only when the GitHub tab is active).
	const gh = createQuery(() => ({
		queryKey: qk.github(orgId ?? 0),
		queryFn: () => getGithubStatus(orgId!),
		enabled: open && source === 'github' && orgId != null
	}));
	const repos = createQuery(() => ({
		queryKey: qk.githubRepos(orgId ?? 0),
		queryFn: () => getGithubRepos(orgId!),
		enabled: open && source === 'github' && orgId != null && gh.data?.connected === true
	}));
	const repoOptions = $derived(
		(repos.data ?? []).map((r: GithubRepo) => ({ value: r.full_name, label: r.full_name }))
	);
	let picked = $state('');
	// When a repo is chosen, fill the clone URL + default branch.
	$effect(() => {
		const p = picked;
		const list = repos.data ?? [];
		if (!p) return;
		const r = list.find((x: GithubRepo) => x.full_name === p);
		if (r) {
			repoUrl = r.clone_url;
			branch = r.default_branch || 'main';
		}
	});

	const create = createMutation(() => ({
		mutationFn: () =>
			createService(projectId, {
				name: name.trim(),
				type,
				repo_url: repoUrl.trim(),
				branch: branch.trim() || 'main',
				schedule: isCron ? schedule.trim() : undefined
			}),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: qk.services(projectId) });
			client.invalidateQueries({ queryKey: qk.projectStatus(projectId) });
			reset();
			open = false;
			toast.success('Service created');
		}
	}));

	function reset() {
		name = '';
		type = 'web';
		repoUrl = '';
		branch = 'main';
		schedule = '';
		picked = '';
	}
</script>

<Dialog bind:open title="New service">
	<form
		class="u-stack"
		style="--flow: var(--space-m)"
		onsubmit={(e) => {
			e.preventDefault();
			if (name.trim() && repoUrl.trim()) create.mutate();
		}}
	>
		{#if create.isError}<Alert>{create.error.message}</Alert>{/if}

		<!-- Source picker -->
		<div class="tabs" role="tablist">
			<button
				type="button"
				class="tab"
				class:active={source === 'url'}
				onclick={() => (source = 'url')}
			>
				<Link2 size={15} /> Public repo
			</button>
			<button
				type="button"
				class="tab"
				class:active={source === 'github'}
				onclick={() => (source = 'github')}
			>
				<FolderGit2 size={15} /> GitHub
			</button>
		</div>

		{#if source === 'url'}
			<TextField
				label="Repository URL"
				name="repo_url"
				bind:value={repoUrl}
				placeholder="https://github.com/me/repo.git"
				required
			/>
			<TextField label="Branch" name="branch" bind:value={branch} placeholder="main" />
		{:else}
			{#if orgId == null}
				<Alert>Open a project to connect GitHub.</Alert>
			{:else if gh.isPending}
				<p class="muted">Checking connection…</p>
			{:else if gh.isError}
				<Alert>{gh.error.message}</Alert>
			{:else if !gh.data.enabled}
				<Alert>GitHub isn't configured on this instance.</Alert>
			{:else if !gh.data.connected}
				<div class="connect">
					<p class="muted">Connect your GitHub account to pick from your repositories.</p>
					<Button onclick={() => (location.href = gh.data.authorize_url!)}>
						<FolderGit2 size={16} /> Connect GitHub
					</Button>
				</div>
			{:else}
				<p class="account">
					Connected as <b>{gh.data.account}</b>
				</p>
				{#if repos.isPending}
					<p class="muted">Loading repositories…</p>
				{:else if repos.isError}
					<Alert>{repos.error.message}</Alert>
				{:else}
					<Select
						label="Repository"
						name="repo"
						bind:value={picked}
						options={[{ value: '', label: 'Select a repository…' }, ...repoOptions]}
					/>
					{#if picked}
						<TextField label="Branch" name="branch" bind:value={branch} placeholder="main" />
					{/if}
				{/if}
			{/if}
		{/if}

		<TextField label="Name" name="name" bind:value={name} placeholder="my-api" required />
		<Select label="Type" name="type" bind:value={type} options={typeOptions} />

		{#if isCron}
			<TextField
				label="Schedule (cron)"
				name="schedule"
				bind:value={schedule}
				placeholder="0 0 * * *"
				hint="Standard 5-field cron expression."
				required
			/>
		{/if}
		<Button type="submit" full loading={create.isPending} disabled={!repoUrl.trim()}>
			Create service
		</Button>
	</form>
</Dialog>

<style>
	.tabs {
		display: flex;
		gap: var(--space-2xs);
		padding: 3px;
		background: var(--surface-2);
		border-radius: var(--radius);
	}
	.tab {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45em;
		padding: 0.5em 0.7em;
		border: none;
		background: transparent;
		color: var(--fg-muted);
		font-size: var(--step--1);
		font-weight: 600;
		border-radius: calc(var(--radius) - 3px);
		cursor: pointer;
		transition:
			color var(--dur-2) var(--ease-out),
			background var(--dur-2) var(--ease-out);
	}
	.tab.active {
		color: var(--fg);
		background: var(--surface);
		box-shadow: var(--shadow-1);
	}
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.connect {
		display: grid;
		gap: var(--space-s);
		justify-items: start;
	}
	.account {
		font-size: var(--step--1);
		color: var(--fg-muted);
	}
</style>
