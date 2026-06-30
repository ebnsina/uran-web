<!-- Create-database dialog. Fields adapt to engine + tier. -->
<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Button, TextField, Select, Slider, Checkbox, Dialog, Alert } from '$lib';
	import { createDatabase, qk, type CreateDatabaseInput } from '$lib/query/resources';
	import { DB_ENGINES, DB_TIERS, INSTANCE_SIZES, STORAGE_OPTIONS } from '$lib/api/resources';

	interface Props {
		open: boolean;
		projectId: number;
	}
	let { open = $bindable(), projectId }: Props = $props();

	const client = useQueryClient();

	let name = $state('');
	let engine = $state('postgres');
	let tier = $state('standard');
	let size = $state('small');
	let storage = $state('10Gi');
	let instances = $state(1);
	let minInstances = $state(1);
	let maxInstances = $state(3);
	let pooling = $state(false);
	let backups = $state(false);

	const isPg = $derived(engine === 'postgres');
	const isAutoscale = $derived(isPg && tier === 'autoscale');

	const engineOptions = DB_ENGINES.map((e) => ({ value: e, label: e }));
	const tierOptions = DB_TIERS.map((t) => ({ value: t, label: t }));
	const sizeOptions = INSTANCE_SIZES.map((s) => ({ value: s, label: s }));
	const storageOptions = STORAGE_OPTIONS.map((s) => ({ value: s, label: s }));

	const create = createMutation(() => ({
		mutationFn: () => {
			const input: CreateDatabaseInput = {
				name: name.trim(),
				engine,
				tier: isPg ? tier : 'standard',
				size,
				storage,
				pooling: isPg && pooling,
				backups: isPg && backups
			};
			if (isAutoscale) {
				input.min_instances = minInstances;
				input.max_instances = Math.max(maxInstances, minInstances);
			} else {
				input.instances = engine === 'redis' ? 1 : instances;
			}
			return createDatabase(projectId, input);
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: qk.databases(projectId) });
			open = false;
		}
	}));
</script>

<Dialog bind:open title="New database">
	<form
		class="u-stack"
		style="--flow: var(--space-m)"
		onsubmit={(e) => {
			e.preventDefault();
			if (name.trim()) create.mutate();
		}}
	>
		{#if create.isError}<Alert>{create.error.message}</Alert>{/if}
		<TextField label="Name" name="name" bind:value={name} placeholder="production-db" required />
		<div class="row">
			<Select label="Engine" name="engine" bind:value={engine} options={engineOptions} />
			{#if isPg}
				<Select label="Tier" name="tier" bind:value={tier} options={tierOptions} />
			{/if}
		</div>
		<div class="row">
			<Select label="Size" name="size" bind:value={size} options={sizeOptions} />
			<Select label="Storage" name="storage" bind:value={storage} options={storageOptions} />
		</div>

		{#if isAutoscale}
			<div class="row">
				<Slider label="Min instances" name="min" bind:value={minInstances} min={1} max={10} />
				<Slider label="Max instances" name="max" bind:value={maxInstances} min={1} max={10} />
			</div>
		{:else if engine !== 'redis'}
			<Slider label="Instances" name="instances" bind:value={instances} min={1} max={10} />
		{/if}

		{#if isPg}
			<Checkbox
				label="Connection pooling"
				name="pooling"
				bind:checked={pooling}
				hint="PgBouncer in front of the database."
			/>
			<Checkbox
				label="Continuous backups + PITR"
				name="backups"
				bind:checked={backups}
				hint="Daily + on-demand, with point-in-time recovery."
			/>
		{/if}

		<Button type="submit" full loading={create.isPending}>Create database</Button>
	</form>
</Dialog>

<style>
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-s);
	}
</style>
