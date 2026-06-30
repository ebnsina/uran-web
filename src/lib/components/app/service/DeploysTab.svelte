<!-- Service deploys: trigger a deploy, list history, roll back, view logs. -->
<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Rocket, RotateCcw, ScrollText } from '@lucide/svelte';
	import { Button, StatusBadge, Alert } from '$lib';
	import { getDeploys, triggerDeploy, rollbackDeploy, qk } from '$lib/query/resources';
	import type { Deploy } from '$lib/api/resources';

	let { serviceId }: { serviceId: number } = $props();
	const client = useQueryClient();

	const ACTIVE = ['queued', 'building', 'deploying'];
	const deploys = createQuery(() => ({
		queryKey: qk.deploys(serviceId),
		queryFn: () => getDeploys(serviceId),
		refetchInterval: (q) =>
			q.state.data?.some((d: Deploy) => ACTIVE.includes(d.status)) ? 3000 : false
	}));

	const deploy = createMutation(() => ({
		mutationFn: () => triggerDeploy(serviceId),
		onSuccess: () => client.invalidateQueries({ queryKey: qk.deploys(serviceId) })
	}));
	const rollback = createMutation(() => ({
		mutationFn: (id: number) => rollbackDeploy(id),
		onSuccess: () => client.invalidateQueries({ queryKey: qk.deploys(serviceId) })
	}));

	function when(s: string) {
		return new Date(s).toLocaleString();
	}
</script>

<div class="head">
	<p class="hint">Build &amp; deploy the latest commit on the service's branch.</p>
	<Button size="sm" loading={deploy.isPending} onclick={() => deploy.mutate()}>
		<Rocket size={16} /> Deploy latest
	</Button>
</div>

{#if deploy.isError}<Alert>{deploy.error.message}</Alert>{/if}
{#if rollback.isError}<Alert>{rollback.error.message}</Alert>{/if}

{#if deploys.isPending}
	<p class="muted">Loading deploys…</p>
{:else if deploys.isError}
	<Alert>{deploys.error.message}</Alert>
{:else if deploys.data.length === 0}
	<p class="muted">No deploys yet. Trigger your first deploy above.</p>
{:else}
	<ul class="list">
		{#each deploys.data as d (d.id)}
			<li class="row">
				<StatusBadge status={d.status} />
				<div class="meta">
					<span class="sha u-mono">{d.commit_sha ? d.commit_sha.slice(0, 8) : d.image || '—'}</span>
					<span class="sub"
						>{d.kind}{d.pr_number ? ` · PR #${d.pr_number}` : ''} · {when(d.created_at)}</span
					>
				</div>
				<div class="actions">
					<Button href="/app/services/{serviceId}/deploys/{d.id}" variant="ghost" size="sm">
						<ScrollText size={15} /> Logs
					</Button>
					{#if d.image && d.status === 'live'}
						<Button
							variant="secondary"
							size="sm"
							loading={rollback.isPending && rollback.variables === d.id}
							onclick={() => rollback.mutate(d.id)}
						>
							<RotateCcw size={15} /> Redeploy
						</Button>
					{:else if d.image}
						<Button
							variant="secondary"
							size="sm"
							loading={rollback.isPending && rollback.variables === d.id}
							onclick={() => rollback.mutate(d.id)}
						>
							<RotateCcw size={15} /> Rollback
						</Button>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
		margin-bottom: var(--space-m);
	}
	.hint,
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.muted {
		padding: var(--space-l) 0;
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-s) var(--space-m);
		border-top: 1px solid var(--border);
	}
	.row:first-child {
		border-top: none;
	}
	.meta {
		flex: 1;
		min-width: 0;
	}
	.sha {
		font-size: var(--step-0);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}
	.sub {
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.actions {
		display: flex;
		gap: var(--space-2xs);
		flex-shrink: 0;
	}
</style>
