<!-- Org registry credentials: list, add (registry/username/password), remove. -->
<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Plus, Trash2, KeySquare } from '@lucide/svelte';
	import { Button, TextField, Dialog, ConfirmDialog, Alert } from '$lib';
	import { getRegistryCreds, addRegistryCred, deleteRegistryCred, qk } from '$lib/query/resources';
	import { toast } from '$lib/toast.svelte';

	let { orgId }: { orgId: number } = $props();
	const client = useQueryClient();
	const invalidate = () => client.invalidateQueries({ queryKey: qk.registryCreds(orgId) });

	const creds = createQuery(() => ({
		queryKey: qk.registryCreds(orgId),
		queryFn: () => getRegistryCreds(orgId)
	}));

	let dialogOpen = $state(false);
	let registry = $state('');
	let username = $state('');
	let password = $state('');

	const add = createMutation(() => ({
		mutationFn: () =>
			addRegistryCred(orgId, {
				registry: registry.trim(),
				username: username.trim(),
				password
			}),
		onSuccess: () => {
			invalidate();
			dialogOpen = false;
			registry = '';
			username = '';
			password = '';
			toast.success('Registry credential added');
		}
	}));
	const remove = createMutation(() => ({
		mutationFn: (id: number) => deleteRegistryCred(orgId, id),
		onSuccess: () => {
			invalidate();
			toast.success('Registry credential removed');
		}
	}));

	let confirmRemove = $state(false);
	let removeTarget = $state<{ id: number; registry: string } | null>(null);
</script>

<section>
	<div class="sec-head">
		<h2><KeySquare size={16} /> Registry credentials</h2>
		<Button size="sm" variant="secondary" onclick={() => (dialogOpen = true)}>
			<Plus size={16} /> Add credential
		</Button>
	</div>
	<p class="hint">Authenticate pulls from private container registries (image deploys).</p>

	{#if creds.isPending}
		<p class="muted">Loading…</p>
	{:else if creds.isError}
		<Alert>{creds.error.message}</Alert>
	{:else if creds.data.length === 0}
		<p class="muted">No registry credentials.</p>
	{:else}
		<ul class="list">
			{#each creds.data as c (c.id)}
				<li class="row">
					<span class="ico"><KeySquare size={16} /></span>
					<div class="who">
						<b class="u-mono">{c.registry}</b>
						<span class="sub u-mono">{c.username}</span>
					</div>
					<button
						class="del"
						type="button"
						aria-label="Remove {c.registry}"
						onclick={() => {
							removeTarget = { id: c.id, registry: c.registry };
							confirmRemove = true;
						}}
					>
						<Trash2 size={15} />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<Dialog bind:open={dialogOpen} title="Add registry credential">
	<form
		class="u-stack"
		style="--flow: var(--space-m)"
		onsubmit={(e) => {
			e.preventDefault();
			if (registry.trim() && username.trim()) add.mutate();
		}}
	>
		{#if add.isError}<Alert>{add.error.message}</Alert>{/if}
		<TextField
			label="Registry"
			name="registry"
			bind:value={registry}
			placeholder="ghcr.io"
			required
		/>
		<TextField
			label="Username"
			name="username"
			bind:value={username}
			placeholder="username"
			required
		/>
		<TextField
			label="Password / token"
			name="password"
			type="password"
			bind:value={password}
			required
		/>
		<Button type="submit" full loading={add.isPending}>Add credential</Button>
	</form>
</Dialog>

<ConfirmDialog
	bind:open={confirmRemove}
	title="Remove credential"
	message="Remove credentials for {removeTarget?.registry ?? 'this registry'}?"
	confirmLabel="Remove"
	loading={remove.isPending}
	onconfirm={() => {
		if (removeTarget) remove.mutate(removeTarget.id);
		confirmRemove = false;
	}}
/>

<style>
	.sec-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-2xs);
	}
	.sec-head h2 {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		font-size: var(--step-1);
	}
	.hint {
		color: var(--fg-subtle);
		font-size: var(--step--1);
		margin-bottom: var(--space-m);
	}
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
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
	.who {
		flex: 1;
		min-width: 0;
	}
	.who b {
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
	.del:hover {
		color: var(--danger);
		border-color: var(--danger);
	}
</style>
