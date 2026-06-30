<!-- Custom domains: list, add, remove. -->
<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Trash2, Plus, Globe } from '@lucide/svelte';
	import { Button, TextField, Alert } from '$lib';
	import { getDomains, addDomain, deleteDomain, qk } from '$lib/query/resources';

	let { serviceId }: { serviceId: number } = $props();
	const client = useQueryClient();

	const domains = createQuery(() => ({
		queryKey: qk.domains(serviceId),
		queryFn: () => getDomains(serviceId)
	}));
	const invalidate = () => client.invalidateQueries({ queryKey: qk.domains(serviceId) });

	let host = $state('');
	const add = createMutation(() => ({
		mutationFn: () => addDomain(serviceId, host.trim()),
		onSuccess: () => {
			invalidate();
			host = '';
		}
	}));
	const remove = createMutation(() => ({
		mutationFn: (d: string) => deleteDomain(serviceId, d),
		onSuccess: invalidate
	}));
</script>

<form
	class="add"
	onsubmit={(e) => {
		e.preventDefault();
		if (host.trim()) add.mutate();
	}}
>
	<TextField
		label="Custom domain"
		name="domain"
		bind:value={host}
		placeholder="app.example.com"
		required
	/>
	<Button type="submit" loading={add.isPending}><Plus size={16} /> Add</Button>
</form>
<p class="hint">Point a CNAME/A record at Uran; a certificate is issued automatically.</p>

{#if add.isError}<Alert>{add.error.message}</Alert>{/if}
{#if remove.isError}<Alert>{remove.error.message}</Alert>{/if}

{#if domains.isPending}
	<p class="muted">Loading domains…</p>
{:else if domains.isError}
	<Alert>{domains.error.message}</Alert>
{:else if domains.data.length === 0}
	<p class="muted">No custom domains.</p>
{:else}
	<ul class="list">
		{#each domains.data as d (d.id)}
			<li class="row">
				<span class="ico"><Globe size={16} /></span>
				<span class="host u-mono">{d.domain}</span>
				<button
					class="del"
					type="button"
					aria-label="Remove {d.domain}"
					disabled={remove.isPending && remove.variables === d.domain}
					onclick={() => remove.mutate(d.domain)}
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
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: var(--space-s);
	}
	.hint {
		margin-top: var(--space-2xs);
		margin-bottom: var(--space-m);
		color: var(--fg-subtle);
		font-size: var(--step--1);
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
	.host {
		flex: 1;
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
</style>
