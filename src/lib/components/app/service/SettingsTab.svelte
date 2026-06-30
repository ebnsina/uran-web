<!-- Service settings: scaling, autoscaling, instance size, health, suspend. -->
<script lang="ts">
	import { untrack } from 'svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Button, Select, Checkbox, Slider, TextField, Alert } from '$lib';
	import {
		scaleService,
		setHealthPath,
		suspendService,
		resumeService,
		qk
	} from '$lib/query/resources';
	import { INSTANCE_SIZES, type Service } from '$lib/api/resources';

	let { service }: { service: Service } = $props();
	const client = useQueryClient();
	const id = $derived(service.id);
	const invalidate = () => client.invalidateQueries({ queryKey: qk.service(id) });

	// Scaling form, seeded once from the service (initial value is intentional).
	let size = $state(untrack(() => service.instance_size));
	let autoscale = $state(untrack(() => service.max_replicas > 0));
	let replicas = $state(untrack(() => service.replicas || 1));
	let minR = $state(untrack(() => service.min_replicas || 1));
	let maxR = $state(untrack(() => service.max_replicas || 3));
	let healthPath = $state(untrack(() => service.health_path ?? ''));

	const sizeOptions = INSTANCE_SIZES.map((s) => ({ value: s, label: s }));

	const scale = createMutation(() => ({
		mutationFn: () =>
			scaleService(id, {
				instance_size: size,
				...(autoscale
					? { min_replicas: minR, max_replicas: Math.max(maxR, minR) }
					: { replicas, max_replicas: 0 })
			}),
		onSuccess: invalidate
	}));
	const health = createMutation(() => ({
		mutationFn: () => setHealthPath(id, healthPath.trim()),
		onSuccess: invalidate
	}));
	const toggleSuspend = createMutation(() => ({
		mutationFn: () => (service.suspended ? resumeService(id) : suspendService(id)),
		onSuccess: invalidate
	}));
</script>

<div class="grid">
	<section class="panel">
		<h3>Scaling</h3>
		<Select label="Instance size" name="size" bind:value={size} options={sizeOptions} />
		<Checkbox label="Autoscale on CPU" name="autoscale" bind:checked={autoscale} />
		{#if autoscale}
			<div class="two">
				<Slider label="Min replicas" name="min" bind:value={minR} min={1} max={10} />
				<Slider label="Max replicas" name="max" bind:value={maxR} min={1} max={10} />
			</div>
		{:else}
			<Slider label="Replicas" name="replicas" bind:value={replicas} min={1} max={10} />
		{/if}
		{#if scale.isError}<Alert>{scale.error.message}</Alert>{/if}
		<Button loading={scale.isPending} onclick={() => scale.mutate()}>Apply scaling</Button>
	</section>

	<section class="panel">
		<h3>Health check</h3>
		<TextField
			label="Health path"
			name="health"
			bind:value={healthPath}
			placeholder="/healthz"
			hint="Empty disables the readiness/liveness probe."
		/>
		{#if health.isError}<Alert>{health.error.message}</Alert>{/if}
		<Button variant="secondary" loading={health.isPending} onclick={() => health.mutate()}>
			Save health path
		</Button>
	</section>

	<section class="panel danger">
		<h3>{service.suspended ? 'Resume' : 'Suspend'}</h3>
		<p>
			{service.suspended
				? 'Service is suspended (scaled to zero). Resume to bring it back online.'
				: 'Scale the service to zero replicas to save resources. You can resume any time.'}
		</p>
		{#if toggleSuspend.isError}<Alert>{toggleSuspend.error.message}</Alert>{/if}
		<Button
			variant={service.suspended ? 'primary' : 'secondary'}
			loading={toggleSuspend.isPending}
			onclick={() => toggleSuspend.mutate()}
		>
			{service.suspended ? 'Resume service' : 'Suspend service'}
		</Button>
	</section>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
		gap: var(--space-m);
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
	.panel p {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-s);
	}
	.danger {
		border-color: color-mix(in oklab, var(--danger) 30%, var(--border));
	}
</style>
