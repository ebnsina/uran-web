<!-- Environment variables: list, add/upsert, delete. -->
<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Trash2, Plus } from '@lucide/svelte';
	import { Button, TextField, Checkbox, Alert } from '$lib';
	import { getEnv, setEnv, deleteEnv, qk } from '$lib/query/resources';
	import { toast } from '$lib/toast.svelte';

	let { serviceId }: { serviceId: number } = $props();
	const client = useQueryClient();

	const env = createQuery(() => ({
		queryKey: qk.env(serviceId),
		queryFn: () => getEnv(serviceId)
	}));

	let key = $state('');
	let value = $state('');
	let secret = $state(false);
	let buildTime = $state(false);

	const invalidate = () => client.invalidateQueries({ queryKey: qk.env(serviceId) });

	const save = createMutation(() => ({
		mutationFn: () => setEnv(serviceId, { key: key.trim(), value, secret, build_time: buildTime }),
		onSuccess: () => {
			invalidate();
			key = '';
			value = '';
			secret = false;
			buildTime = false;
			toast.success('Variable saved');
		}
	}));
	const remove = createMutation(() => ({
		mutationFn: (k: string) => deleteEnv(serviceId, k),
		onSuccess: () => {
			invalidate();
			toast.success('Variable removed');
		}
	}));
</script>

<form
	class="add"
	onsubmit={(e) => {
		e.preventDefault();
		if (key.trim()) save.mutate();
	}}
>
	<TextField label="Key" name="key" bind:value={key} placeholder="DATABASE_URL" required />
	<TextField label="Value" name="value" bind:value placeholder="postgres://…" />
	<div class="flags">
		<Checkbox label="Secret" name="secret" bind:checked={secret} />
		<Checkbox label="Build-time" name="build_time" bind:checked={buildTime} />
	</div>
	<Button type="submit" size="md" loading={save.isPending}><Plus size={16} /> Set</Button>
</form>

{#if save.isError}<Alert>{save.error.message}</Alert>{/if}
{#if remove.isError}<Alert>{remove.error.message}</Alert>{/if}

{#if env.isPending}
	<p class="muted">Loading variables…</p>
{:else if env.isError}
	<Alert>{env.error.message}</Alert>
{:else if env.data.length === 0}
	<p class="muted">No variables set.</p>
{:else}
	<ul class="list">
		{#each env.data as v (v.key)}
			<li class="row">
				<span class="k u-mono">{v.key}</span>
				<span class="v u-mono">{v.secret ? '••••••••' : v.value || '—'}</span>
				<span class="tags">
					{#if v.secret}<span class="tag">secret</span>{/if}
					{#if v.build_time}<span class="tag">build</span>{/if}
				</span>
				<button
					class="del"
					type="button"
					aria-label="Delete {v.key}"
					disabled={remove.isPending && remove.variables === v.key}
					onclick={() => remove.mutate(v.key)}
				>
					<Trash2 size={15} />
				</button>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.add {
		display: grid;
		grid-template-columns: 1fr 1fr auto auto;
		align-items: end;
		gap: var(--space-s);
		margin-bottom: var(--space-m);
	}
	.flags {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
		padding: var(--space-l) 0;
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
		display: grid;
		grid-template-columns: minmax(8rem, 14rem) 1fr auto auto;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-s) var(--space-m);
		border-top: 1px solid var(--border);
	}
	.row:first-child {
		border-top: none;
	}
	.k {
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.v {
		color: var(--fg-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--step--1);
	}
	.tags {
		display: flex;
		gap: 0.3em;
	}
	.tag {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		color: var(--accent);
		border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
		border-radius: var(--radius-xs);
		padding: 0 0.4em;
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

	@media (max-width: 40rem) {
		.add {
			grid-template-columns: 1fr;
		}
	}
</style>
