<script lang="ts">
	import {
		createQuery,
		createMutation,
		useQueryClient,
		keepPreviousData
	} from '@tanstack/svelte-query';
	import { Plus, Trash2, Copy, Check, KeyRound, Search } from '@lucide/svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { Button, TextField, Dialog, ConfirmDialog, Alert, StatusBadge } from '$lib';
	import { getMe, keys } from '$lib/query/dashboard';
	import { getTokens, createToken, deleteToken, getAudit, qk } from '$lib/query/resources';
	import type { ApiTokenCreated } from '$lib/api/resources';
	import { toast } from '$lib/toast.svelte';
	import PageHead from '$lib/components/app/PageHead.svelte';

	const client = useQueryClient();
	const me = createQuery(() => ({ queryKey: keys.me, queryFn: getMe, staleTime: 60_000 }));
	const tokens = createQuery(() => ({ queryKey: qk.tokens, queryFn: getTokens }));

	// ── Audit log: server-side search / filter / pagination, state in the URL ──
	const PAGE_SIZE = 15;
	const METHODS = ['', 'POST', 'PATCH', 'DELETE'];

	const auditQ = $derived(page.url.searchParams.get('q') ?? '');
	const auditMethod = $derived(page.url.searchParams.get('method') ?? '');
	const auditPageNum = $derived(Math.max(1, Number(page.url.searchParams.get('page')) || 1));

	const audit = createQuery(() => ({
		queryKey: qk.audit({ q: auditQ, method: auditMethod, page: auditPageNum }),
		queryFn: () =>
			getAudit({
				q: auditQ,
				method: auditMethod,
				limit: PAGE_SIZE,
				offset: (auditPageNum - 1) * PAGE_SIZE
			}),
		placeholderData: keepPreviousData
	}));
	const totalPages = $derived(Math.max(1, Math.ceil((audit.data?.total ?? 0) / PAGE_SIZE)));

	function setParams(next: Record<string, string | null>) {
		const sp = new SvelteURLSearchParams(page.url.searchParams.toString());
		for (const [k, v] of Object.entries(next)) {
			if (v) sp.set(k, v);
			else sp.delete(k);
		}
		const qs = sp.toString();
		goto(qs ? `?${qs}` : page.url.pathname, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	}

	// Debounced search → URL (resets to page 1).
	let searchInput = $state(page.url.searchParams.get('q') ?? '');
	let searchTimer: ReturnType<typeof setTimeout>;
	$effect(() => {
		const val = searchInput.trim();
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			if (val !== (page.url.searchParams.get('q') ?? '')) setParams({ q: val || null, page: null });
		}, 300);
	});
	const setMethod = (m: string) => setParams({ method: m || null, page: null });
	const goPage = (p: number) => setParams({ page: p > 1 ? String(p) : null });

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
		onSuccess: () => {
			client.invalidateQueries({ queryKey: qk.tokens });
			toast.success('Token revoked');
		}
	}));
	let confirmRevoke = $state(false);
	let revokeId = $state<number | null>(null);
	const revokeName = $derived(tokens.data?.find((t) => t.id === revokeId)?.name ?? 'this token');

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
							onclick={() => {
								revokeId = t.id;
								confirmRevoke = true;
							}}
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
		<div class="audit-head">
			<h2>Recent activity</h2>
			<label class="search">
				<Search size={15} />
				<input
					type="search"
					placeholder="Search path…"
					bind:value={searchInput}
					aria-label="Search audit log"
				/>
			</label>
		</div>

		<div class="filters" role="group" aria-label="Filter by method">
			{#each METHODS as m (m)}
				<button
					type="button"
					class="chip"
					class:active={auditMethod === m}
					onclick={() => setMethod(m)}
				>
					{m || 'All'}
				</button>
			{/each}
		</div>

		{#if audit.isError}
			<Alert>{audit.error.message}</Alert>
		{:else if audit.isPending}
			<p class="muted">Loading…</p>
		{:else if audit.data.items.length === 0}
			<p class="muted">
				{auditQ || auditMethod ? 'No matching activity.' : 'No activity recorded.'}
			</p>
		{:else}
			<ul class="audit" class:stale={audit.isPlaceholderData}>
				{#each audit.data.items as a (a.id)}
					<li>
						<span class="method u-mono">{a.method}</span>
						<span class="path u-mono">{a.path}</span>
						<StatusBadge status={String(a.status)} />
						<span class="when">{fmt(a.created_at)}</span>
					</li>
				{/each}
			</ul>
			<div class="pager">
				<span class="muted">{audit.data.total} result{audit.data.total === 1 ? '' : 's'}</span>
				<div class="pager-btns">
					<Button
						size="sm"
						variant="secondary"
						disabled={auditPageNum <= 1}
						onclick={() => goPage(auditPageNum - 1)}
					>
						Prev
					</Button>
					<span class="muted">Page {auditPageNum} of {totalPages}</span>
					<Button
						size="sm"
						variant="secondary"
						disabled={auditPageNum >= totalPages}
						onclick={() => goPage(auditPageNum + 1)}
					>
						Next
					</Button>
				</div>
			</div>
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

<ConfirmDialog
	bind:open={confirmRevoke}
	title="Revoke token"
	message="Revoke {revokeName}? Any CLI or CI using it will stop working immediately."
	confirmLabel="Revoke"
	loading={revoke.isPending}
	onconfirm={() => {
		if (revokeId !== null) revoke.mutate(revokeId);
		confirmRevoke = false;
	}}
/>

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

	.audit-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
		flex-wrap: wrap;
	}
	.search {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: 0.45em 0.9em;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-full);
		color: var(--fg-subtle);
		min-width: 14rem;
	}
	.search input {
		flex: 1;
		min-width: 0;
		border: none;
		background: transparent;
		color: var(--fg);
		font-size: var(--step--1);
		outline: none;
	}
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
		margin: var(--space-m) 0;
	}
	.chip {
		padding: 0.35em 0.9em;
		border: 1px solid var(--border);
		background: var(--surface);
		border-radius: var(--radius-full);
		font-size: var(--step--1);
		font-weight: 600;
		color: var(--fg-muted);
		cursor: pointer;
		transition:
			background var(--dur-2) var(--ease-out),
			color var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out);
	}
	.chip:hover {
		border-color: var(--border-strong);
		color: var(--fg);
	}
	.chip.active {
		background: var(--fg);
		color: var(--bg);
		border-color: var(--fg);
	}
	.audit.stale {
		opacity: 0.55;
		transition: opacity var(--dur-2) var(--ease-out);
	}
	.pager {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
		flex-wrap: wrap;
		margin-top: var(--space-m);
		padding-top: var(--space-s);
		border-top: 1px solid var(--border);
	}
	.pager-btns {
		display: flex;
		align-items: center;
		gap: var(--space-s);
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
