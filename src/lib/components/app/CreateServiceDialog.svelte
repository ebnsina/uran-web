<!-- Create-service dialog. Fields adapt to the chosen service type. -->
<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Button, TextField, Select, Dialog, Alert } from '$lib';
	import { createService, qk } from '$lib/query/resources';
	import { SERVICE_TYPES } from '$lib/api/resources';

	interface Props {
		open: boolean;
		projectId: number;
	}
	let { open = $bindable(), projectId }: Props = $props();

	const client = useQueryClient();

	let name = $state('');
	let type = $state('web');
	let repoUrl = $state('');
	let branch = $state('main');
	let schedule = $state('');

	const typeOptions = SERVICE_TYPES.map((t) => ({ value: t, label: t }));
	const needsRepo = $derived(type !== 'static' ? true : true); // all build from a repo
	const isCron = $derived(type === 'cron');

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
		}
	}));

	function reset() {
		name = '';
		type = 'web';
		repoUrl = '';
		branch = 'main';
		schedule = '';
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
		<TextField label="Name" name="name" bind:value={name} placeholder="my-api" required />
		<Select label="Type" name="type" bind:value={type} options={typeOptions} />
		{#if needsRepo}
			<TextField
				label="Repository URL"
				name="repo_url"
				bind:value={repoUrl}
				placeholder="https://github.com/me/repo.git"
				required
			/>
			<TextField label="Branch" name="branch" bind:value={branch} placeholder="main" />
		{/if}
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
		<Button type="submit" full loading={create.isPending}>Create service</Button>
	</form>
</Dialog>
