<script lang="ts">
	import MarketingShell from '$lib/components/site/MarketingShell.svelte';
	import { Button } from '$lib';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Pricing · Uran</title></svelte:head>

<MarketingShell
	user={data.user}
	eyebrow="Pricing"
	title="Simple, usage-based pricing."
	lede="Start free. Pay only for the compute, storage, and bandwidth you use — no seats, no surprises. Detailed plans are on the way."
>
	<h2>Free to start</h2>
	<p>Create an account, connect a repo, and deploy your first service without a card.</p>
	<h2>Scale as you grow</h2>
	<p>
		Metered CPU, memory, persistent disks, and managed databases. See exactly what you're using on
		the service usage panel.
	</p>
	<p style="margin-top: 1.5rem">
		<Button href="/register" size="lg">Start free</Button>
	</p>
</MarketingShell>
