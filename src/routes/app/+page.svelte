<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Building2, ArrowRight, Plus, Activity, FolderGit2, History } from '@lucide/svelte';
	import { Button, TextField, Dialog, Alert, StatusBadge, EmptyState, RollingNumber } from '$lib';
	import { getMe, getOrgs, createOrg, keys } from '$lib/query/dashboard';
	import { getAudit, qk } from '$lib/query/resources';
	import PageHead from '$lib/components/app/PageHead.svelte';
	import { toast } from '$lib/toast.svelte';

	const client = useQueryClient();
	const me = createQuery(() => ({ queryKey: keys.me, queryFn: getMe, staleTime: 60_000 }));
	const orgs = createQuery(() => ({ queryKey: keys.orgs, queryFn: getOrgs }));
	const audit = createQuery(() => ({
		queryKey: qk.audit({ limit: 8 }),
		queryFn: () => getAudit({ limit: 8 })
	}));

	const firstName = $derived((me.data?.name || '').split(/\s+/)[0] || 'there');

	let dialogOpen = $state(false);
	let name = $state('');
	const create = createMutation(() => ({
		mutationFn: () => createOrg(name.trim()),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: keys.orgs });
			dialogOpen = false;
			name = '';
			toast.success('Organization created');
		}
	}));

	function badge(o: { slug: string; name: string }) {
		return (o.name || o.slug).slice(0, 2).toUpperCase();
	}
	const fmt = (s: string) => new Date(s).toLocaleString();
	const fmtDate = (s: string) => new Date(s).toLocaleDateString();
</script>

<svelte:head><title>Overview · Uran</title></svelte:head>

<PageHead crumbs={[{ label: 'Overview' }]} title="Welcome back, {firstName}.">
	<Button size="sm" onclick={() => (dialogOpen = true)}><Plus size={16} /> New organization</Button>
</PageHead>

<div class="body">
	<!-- Stats -->
	<div class="stats">
		<div class="stat">
			<span class="stat-ico"><Building2 size={17} /></span>
			<div>
				<b
					>{#if orgs.data}<RollingNumber value={orgs.data.length} />{:else}—{/if}</b
				>
				<span>Organizations</span>
			</div>
		</div>
		<div class="stat">
			<span class="stat-ico"><History size={17} /></span>
			<div>
				<b
					>{#if audit.data}<RollingNumber value={audit.data.total} />{:else}—{/if}</b
				>
				<span>Recent actions</span>
			</div>
		</div>
	</div>

	<div class="cols">
		<!-- Organizations table -->
		<section>
			<h2 class="sec-title"><Building2 size={16} /> Organizations</h2>
			{#if orgs.isPending}
				<p class="muted">Loading…</p>
			{:else if orgs.isError}
				<Alert>{orgs.error.message}</Alert>
			{:else if orgs.data.length === 0}
				<EmptyState
					icon={Building2}
					title="Create your first organization"
					hint="Organizations hold your projects, services and databases."
				>
					<Button size="sm" onclick={() => (dialogOpen = true)}>
						<Plus size={16} /> New organization
					</Button>
				</EmptyState>
			{:else}
				<div class="table" role="table">
					<div class="thead u-mono" role="row">
						<span>Organization</span>
						<span>Slug</span>
						<span>Created</span>
						<span></span>
					</div>
					{#each orgs.data as o (o.id)}
						<a class="trow" href="/app/orgs/{o.id}" role="row">
							<span class="org">
								<span class="badge u-mono">{badge(o)}</span>
								<b>{o.name}</b>
							</span>
							<span class="u-mono muted">{o.slug}</span>
							<span class="muted">{fmtDate(o.created_at)}</span>
							<span class="arrow"><ArrowRight size={16} /></span>
						</a>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Recent activity -->
		<section>
			<h2 class="sec-title"><Activity size={16} /> Recent activity</h2>
			{#if audit.isPending}
				<p class="muted">Loading…</p>
			{:else if audit.isError}
				<Alert>{audit.error.message}</Alert>
			{:else if audit.data.items.length === 0}
				<div class="quiet">
					<span class="quiet-ico"><FolderGit2 size={18} /></span>
					<p>No activity yet. Create a project and deploy to see it here.</p>
				</div>
			{:else}
				<ul class="feed">
					{#each audit.data.items as a (a.id)}
						<li>
							<span class="method u-mono">{a.method}</span>
							<span class="path u-mono">{a.path}</span>
							<StatusBadge status={String(a.status)} />
							<span class="when">{fmt(a.created_at)}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</div>

<Dialog bind:open={dialogOpen} title="New organization">
	<form
		class="u-stack"
		style="--flow: var(--space-m)"
		onsubmit={(e) => {
			e.preventDefault();
			if (name.trim()) create.mutate();
		}}
	>
		{#if create.isError}<Alert>{create.error.message}</Alert>{/if}
		<TextField label="Name" name="name" bind:value={name} placeholder="Acme Inc" required />
		<Button type="submit" full loading={create.isPending}>Create organization</Button>
	</form>
</Dialog>

<style>
	.body {
		padding: var(--space-m);
		display: grid;
		gap: var(--space-m);
	}

	/* Stat cards */
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: var(--space-s);
	}
	.stat {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-m);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
	}
	.stat-ico {
		display: grid;
		place-items: center;
		width: 2.6rem;
		height: 2.6rem;
		flex-shrink: 0;
		color: var(--accent);
		background: var(--accent-soft);
		border-radius: var(--radius-sm);
	}
	.stat b {
		display: block;
		font-size: var(--step-3);
		line-height: 1;
		font-family: var(--font-mono);
	}
	.stat span {
		font-size: var(--step--1);
		color: var(--fg-subtle);
	}

	.cols {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-l);
		align-items: start;
	}
	.sec-title {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		font-size: var(--step-1);
		margin-bottom: var(--space-m);
	}
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}

	/* Table */
	.table {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--surface);
	}
	.thead,
	.trow {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr auto;
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
	.org {
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
		font-size: var(--step--2);
		font-weight: 700;
	}
	.org b {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.arrow {
		display: inline-flex;
		color: var(--fg-subtle);
		transition: transform var(--dur-2) var(--ease-out);
	}
	.trow:hover .arrow {
		transform: translateX(3px);
		color: var(--accent);
	}

	/* Activity feed */
	.feed {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background: var(--surface);
		overflow: hidden;
	}
	.feed li {
		display: grid;
		grid-template-columns: 3.2rem 1fr auto auto;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-s) var(--space-m);
		border-top: 1px solid var(--border);
		font-size: var(--step--1);
	}
	.feed li:first-child {
		border-top: none;
	}
	.method {
		color: var(--accent);
		font-size: var(--step--2);
	}
	.path {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--fg-muted);
	}
	.when {
		font-size: var(--step--2);
		color: var(--fg-subtle);
		white-space: nowrap;
	}
	.quiet {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-l);
		background: var(--surface);
		border: 1px dashed var(--border-strong);
		border-radius: var(--radius-md);
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.quiet-ico {
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		flex-shrink: 0;
		color: var(--fg-subtle);
		background: var(--surface-2);
		border-radius: var(--radius-sm);
	}

	@media (min-width: 60rem) {
		.cols {
			grid-template-columns: 1.3fr 1fr;
		}
	}
	@media (max-width: 40rem) {
		.thead,
		.trow {
			grid-template-columns: 1fr auto;
		}
		.thead span:nth-child(2),
		.thead span:nth-child(3),
		.trow > .muted {
			display: none;
		}
		.feed li {
			grid-template-columns: 3rem 1fr auto;
		}
		.feed .when {
			display: none;
		}
	}
</style>
