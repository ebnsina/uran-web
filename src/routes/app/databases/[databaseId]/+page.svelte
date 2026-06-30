<script lang="ts">
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Copy, Check, Eye, DatabaseBackup, Trash2 } from '@lucide/svelte';
	import { Button, Select, Slider, StatusBadge, Alert } from '$lib';
	import {
		getDatabase,
		getDbConnection,
		getBackups,
		scaleDatabase,
		triggerBackup,
		deleteDatabase,
		qk
	} from '$lib/query/resources';
	import { INSTANCE_SIZES, STORAGE_OPTIONS } from '$lib/api/resources';
	import PageHead from '$lib/components/app/PageHead.svelte';

	const dbId = $derived(Number(page.params.databaseId));
	const client = useQueryClient();

	const db = createQuery(() => ({
		queryKey: qk.database(dbId),
		queryFn: () => getDatabase(dbId),
		refetchInterval: (q) => (q.state.data?.status === 'creating' ? 4000 : false)
	}));

	let revealConn = $state(false);
	const conn = createQuery(() => ({
		queryKey: qk.dbConnection(dbId),
		queryFn: () => getDbConnection(dbId),
		enabled: revealConn && db.data?.status === 'ready'
	}));

	const backups = createQuery(() => ({
		queryKey: qk.backups(dbId),
		queryFn: () => getBackups(dbId),
		enabled: !!db.data?.backups,
		refetchInterval: 15_000
	}));

	// Scale form (seeded once).
	let size = $state('');
	let storage = $state('');
	let instances = $state(1);
	$effect(() => {
		const d = db.data;
		if (d && !size) {
			untrack(() => {
				size = d.size;
				storage = d.storage;
				instances = d.instances || 1;
			});
		}
	});

	const sizeOptions = INSTANCE_SIZES.map((s) => ({ value: s, label: s }));
	// Storage presets, including the current value if it's non-standard.
	const storageOptions = $derived(
		(STORAGE_OPTIONS.includes(storage as (typeof STORAGE_OPTIONS)[number]) || !storage
			? STORAGE_OPTIONS
			: [storage, ...STORAGE_OPTIONS]
		).map((s) => ({ value: s, label: s }))
	);
	const invalidate = () => client.invalidateQueries({ queryKey: qk.database(dbId) });

	const scale = createMutation(() => ({
		mutationFn: () => scaleDatabase(dbId, { instances, size, storage }),
		onSuccess: invalidate
	}));
	const backup = createMutation(() => ({
		mutationFn: () => triggerBackup(dbId),
		onSuccess: () => client.invalidateQueries({ queryKey: qk.backups(dbId) })
	}));
	const remove = createMutation(() => ({
		mutationFn: () => deleteDatabase(dbId),
		onSuccess: () => goto(db.data ? `/app/projects/${db.data.project_id}` : '/app')
	}));

	let copied = $state('');
	async function copy(uri: string) {
		await navigator.clipboard.writeText(uri);
		copied = uri;
		setTimeout(() => (copied = ''), 1500);
	}

	const isRedis = $derived(db.data?.engine === 'redis');
</script>

<svelte:head><title>{db.data?.name ?? 'Database'} · Uran</title></svelte:head>

{#if db.isError}
	<div class="pad"><Alert>{db.error.message}</Alert></div>
{:else}
	<PageHead
		crumbs={[
			{ label: 'Overview', href: '/app' },
			{ label: 'Project', href: db.data ? `/app/projects/${db.data.project_id}` : '/app' },
			{ label: db.data?.name ?? 'Database' }
		]}
		title={db.data?.name ?? 'Database'}
	>
		{#if db.data}<StatusBadge status={db.data.status} />{/if}
	</PageHead>

	<div class="body">
		{#if db.data}
			{@const d = db.data}
			<div class="info">
				<div class="kv"><span>Engine</span><b class="u-mono">{d.engine}</b></div>
				<div class="kv"><span>Tier</span><b class="u-mono">{d.tier}</b></div>
				<div class="kv"><span>Size</span><b class="u-mono">{d.size}</b></div>
				<div class="kv"><span>Storage</span><b class="u-mono">{d.storage}</b></div>
				<div class="kv">
					<span>Instances</span>
					<b class="u-mono"
						>{d.tier === 'autoscale' ? `${d.min_instances}–${d.max_instances}` : d.instances}</b
					>
				</div>
				<div class="kv"><span>Pooling</span><b class="u-mono">{d.pooling ? 'on' : 'off'}</b></div>
			</div>

			<!-- Connection -->
			<section class="panel">
				<h3>Connection</h3>
				{#if d.status !== 'ready'}
					<p class="muted">Connection details appear once the database is ready.</p>
				{:else if !revealConn}
					<Button variant="secondary" size="sm" onclick={() => (revealConn = true)}>
						<Eye size={15} /> Reveal connection details
					</Button>
				{:else if conn.isPending}
					<p class="muted">Loading…</p>
				{:else if conn.isError}
					<Alert>{conn.error.message}</Alert>
				{:else}
					{#each [['Primary', conn.data.uri], ['Read-only', conn.data.read_uri], ['Pooled', conn.data.pooled_uri]] as [label, uri] (label)}
						{#if uri}
							<div class="uri">
								<span class="uri-label">{label}</span>
								<code>{uri}</code>
								<button
									class="copy"
									type="button"
									aria-label="Copy {label} URI"
									onclick={() => copy(uri)}
								>
									{#if copied === uri}<Check size={15} />{:else}<Copy size={15} />{/if}
								</button>
							</div>
						{/if}
					{/each}
				{/if}
			</section>

			<!-- Scale -->
			<section class="panel">
				<h3>Scale</h3>
				<div class="row">
					<Select label="Size" name="size" bind:value={size} options={sizeOptions} />
					<Select label="Storage" name="storage" bind:value={storage} options={storageOptions} />
					{#if !isRedis}
						<Slider label="Instances" name="instances" bind:value={instances} min={1} max={10} />
					{/if}
				</div>
				{#if scale.isError}<Alert>{scale.error.message}</Alert>{/if}
				<Button loading={scale.isPending} onclick={() => scale.mutate()}>Apply</Button>
			</section>

			<!-- Backups -->
			{#if d.backups}
				<section class="panel">
					<div class="panel-head">
						<h3>Backups</h3>
						<Button
							size="sm"
							variant="secondary"
							loading={backup.isPending}
							onclick={() => backup.mutate()}
						>
							<DatabaseBackup size={15} /> Back up now
						</Button>
					</div>
					{#if backup.isError}<Alert>{backup.error.message}</Alert>{/if}
					{#if backups.isPending}
						<p class="muted">Loading…</p>
					{:else if (backups.data ?? []).length === 0}
						<p class="muted">No backups yet. Daily backups run automatically.</p>
					{:else}
						<ul class="bk">
							{#each backups.data ?? [] as b (b.name)}
								<li>
									<StatusBadge status={b.phase} />
									<span class="u-mono name">{b.name}</span>
									<span class="muted"
										>{b.stopped_at ? new Date(b.stopped_at).toLocaleString() : ''}</span
									>
								</li>
							{/each}
						</ul>
					{/if}
				</section>
			{/if}

			<!-- Danger -->
			<section class="panel danger">
				<h3>Delete database</h3>
				<p class="muted">Permanently deprovisions the database. This cannot be undone.</p>
				{#if remove.isError}<Alert>{remove.error.message}</Alert>{/if}
				<Button variant="secondary" loading={remove.isPending} onclick={() => remove.mutate()}>
					<Trash2 size={15} /> Delete {d.name}
				</Button>
			</section>
		{/if}
	</div>
{/if}

<style>
	.pad {
		padding: var(--space-l);
	}
	.body {
		padding: var(--space-l);
		display: grid;
		gap: var(--space-m);
		max-width: 50rem;
	}
	.info {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: var(--space-s);
	}
	.kv {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: var(--space-s) var(--space-m);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}
	.kv span {
		font-size: var(--step--2);
		color: var(--fg-subtle);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}
	.kv b {
		font-weight: 500;
	}
	.panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		padding: var(--space-l);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
	}
	.panel h3 {
		font-size: var(--step-1);
	}
	.panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.uri {
		display: flex;
		align-items: center;
		gap: var(--space-s);
	}
	.uri-label {
		flex-shrink: 0;
		width: 5rem;
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}
	.uri code {
		flex: 1;
		min-width: 0;
		padding: 0.5em 0.7em;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--step--1);
	}
	.copy {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		flex-shrink: 0;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--fg-muted);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	.copy:hover {
		color: var(--accent);
		border-color: var(--accent);
	}
	.row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
		gap: var(--space-s);
	}
	.bk {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}
	.bk li {
		display: flex;
		align-items: center;
		gap: var(--space-s);
	}
	.bk .name {
		flex: 1;
		font-size: var(--step--1);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.danger {
		border-color: color-mix(in oklab, var(--danger) 30%, var(--border));
	}
</style>
