<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Plus, Trash2, Copy, Check, KeyRound } from '@lucide/svelte';
	import { Button, TextField, Dialog, Alert, StatusBadge } from '$lib';
	import { getMe, keys } from '$lib/query/dashboard';
	import { getTokens, createToken, deleteToken, getAudit, qk } from '$lib/query/resources';
	import type { ApiTokenCreated } from '$lib/api/resources';
	import PageHead from '$lib/components/app/PageHead.svelte';

	const client = useQueryClient();
	const me = createQuery(() => ({ queryKey: keys.me, queryFn: getMe, staleTime: 60_000 }));
	const tokens = createQuery(() => ({ queryKey: qk.tokens, queryFn: getTokens }));
	const audit = createQuery(() => ({ queryKey: qk.audit, queryFn: getAudit }));

	let dialogOpen = $state(false);
	let name = $state('');
	let created = $state<ApiTokenCreated | null>(null);
	let copied = $state(false);

	const create = createMutation(() => ({
		mutationFn: () => createToken(name.trim()),
		onSuccess: (t) => {
			created = t;
			name = '';
			client.invalidateQueries({ queryKey: qk.tokens });
		}
	}));
	const revoke = createMutation(() => ({
		mutationFn: (id: number) => deleteToken(id),
		onSuccess: () => client.invalidateQueries({ queryKey: qk.tokens })
	}));

	async function copyToken() {
		if (!created) return;
		await navigator.clipboard.writeText(created.token);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
	function closeDialog() {
		dialogOpen = false;
		created = null;
	}
	const fmt = (s: string) => new Date(s).toLocaleString();
</script>

<svelte:head><title>Settings · Uran</title></svelte:head>

<PageHead crumbs={[{ label: 'Overview', href: '/app' }, { label: 'Settings' }]} title="Settings" />

<div class="body">
	<!-- Profile -->
	<section class="panel">
		<h2>Profile</h2>
		<div class="kvs">
			<div class="kv"><span>Name</span><b>{me.data?.name || '—'}</b></div>
			<div class="kv"><span>Email</span><b class="u-mono">{me.data?.email || '—'}</b></div>
		</div>
	</section>

	<!-- API tokens -->
	<section class="panel">
		<div class="panel-head">
			<h2>API tokens</h2>
			<Button size="sm" onclick={() => (dialogOpen = true)}><Plus size={16} /> New token</Button>
		</div>
		<p class="hint">
			Personal access tokens authenticate the CLI and CI. Treat them like passwords.
		</p>

		{#if tokens.isPending}
			<p class="muted">Loading…</p>
		{:else if tokens.isError}
			<Alert>{tokens.error.message}</Alert>
		{:else if tokens.data.length === 0}
			<p class="muted">No tokens yet.</p>
		{:else}
			<ul class="list">
				{#each tokens.data as t (t.id)}
					<li class="row">
						<span class="ico"><KeyRound size={16} /></span>
						<div class="grow">
							<b>{t.name}</b>
							<span class="sub u-mono"
								>{t.prefix}… · created {fmt(t.created_at)}{t.last_used_at
									? ` · last used ${fmt(t.last_used_at)}`
									: ' · never used'}</span
							>
						</div>
						<button
							class="del"
							type="button"
							aria-label="Revoke {t.name}"
							disabled={revoke.isPending && revoke.variables === t.id}
							onclick={() => revoke.mutate(t.id)}
						>
							<Trash2 size={15} />
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<!-- Audit log -->
	<section class="panel">
		<h2>Recent activity</h2>
		{#if audit.isPending}
			<p class="muted">Loading…</p>
		{:else if audit.isError}
			<Alert>{audit.error.message}</Alert>
		{:else if audit.data.length === 0}
			<p class="muted">No activity recorded.</p>
		{:else}
			<ul class="audit">
				{#each audit.data as a (a.id)}
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

<Dialog bind:open={dialogOpen} title="New API token">
	{#if created}
		<div class="created">
			<Alert tone="ok">Copy this token now — it won't be shown again.</Alert>
			<div class="token-row">
				<code>{created.token}</code>
				<button class="copy" type="button" aria-label="Copy token" onclick={copyToken}>
					{#if copied}<Check size={15} />{:else}<Copy size={15} />{/if}
				</button>
			</div>
			<Button full onclick={closeDialog}>Done</Button>
		</div>
	{:else}
		<form
			class="u-stack"
			style="--flow: var(--space-m)"
			onsubmit={(e) => {
				e.preventDefault();
				if (name.trim()) create.mutate();
			}}
		>
			{#if create.isError}<Alert>{create.error.message}</Alert>{/if}
			<TextField label="Name" name="name" bind:value={name} placeholder="ci-deploy" required />
			<Button type="submit" full loading={create.isPending}>Create token</Button>
		</form>
	{/if}
</Dialog>

<style>
	.body {
		padding: var(--space-l);
		display: grid;
		gap: var(--space-m);
		max-width: 48rem;
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
	.panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.panel h2 {
		font-size: var(--step-1);
	}
	.hint,
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.kvs {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: var(--space-s);
	}
	.kv {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.kv span {
		font-size: var(--step--2);
		color: var(--fg-subtle);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-s) var(--space-m);
		border-top: 1px solid var(--border);
	}
	.row:first-child {
		border-top: none;
	}
	.ico {
		color: var(--fg-subtle);
		display: inline-flex;
	}
	.grow {
		flex: 1;
		min-width: 0;
	}
	.grow b {
		display: block;
		font-size: var(--step-0);
	}
	.sub {
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.del {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--fg-muted);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			color var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out);
	}
	.del:hover:not(:disabled) {
		color: var(--danger);
		border-color: var(--danger);
	}
	.del:disabled {
		opacity: 0.5;
	}
	.audit {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	.audit li {
		display: grid;
		grid-template-columns: 3.5rem 1fr auto auto;
		align-items: center;
		gap: var(--space-s);
		padding: 0.5rem 0;
		border-top: 1px solid var(--border);
		font-size: var(--step--1);
	}
	.audit li:first-child {
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

	.created {
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
	}
	.token-row {
		display: flex;
		gap: var(--space-2xs);
	}
	.token-row code {
		flex: 1;
		min-width: 0;
		padding: 0.6em 0.7em;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		font-size: var(--step--1);
		word-break: break-all;
	}
	.copy {
		display: grid;
		place-items: center;
		width: 2.2rem;
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

	@media (max-width: 36rem) {
		.audit li {
			grid-template-columns: 3rem 1fr auto;
		}
		.audit .when {
			display: none;
		}
	}
</style>
