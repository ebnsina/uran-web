<script lang="ts">
	import MarketingShell from '$lib/components/site/MarketingShell.svelte';
	import { CircleCheck } from '@lucide/svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const components = ['API', 'Builds', 'Deploys', 'Routing & TLS', 'Databases', 'Dashboard'];
</script>

<svelte:head><title>Status · Uran</title></svelte:head>

<MarketingShell
	user={data.user}
	eyebrow="Status"
	title="All systems operational."
	lede="Live status of the Uran platform. A full status page with incident history is coming soon."
>
	<ul class="status">
		{#each components as c (c)}
			<li>
				<span class="name">{c}</span>
				<span class="ok"><CircleCheck size={15} /> Operational</span>
			</li>
		{/each}
	</ul>
</MarketingShell>

<style>
	.status {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
		background: var(--surface);
	}
	.status li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-s) var(--space-m);
		border-top: 1px solid var(--border);
	}
	.status li:first-child {
		border-top: none;
	}
	.name {
		font-weight: 500;
	}
	.ok {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		font-size: var(--step--1);
		color: var(--ok);
	}
</style>
