<script lang="ts">
	import MarketingShell from '$lib/components/site/MarketingShell.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Changelog · Uran</title></svelte:head>

<MarketingShell
	user={data.user}
	eyebrow="Changelog"
	title="What's new."
	lede="Every notable change to the platform, newest first."
>
	<h2>Recent</h2>
	<p>
		Persistent disks, image deploys, usage metering, registry credentials, and a redesigned
		dashboard with search &amp; pagination on the audit log.
	</p>
	<p>A dated, versioned changelog is coming soon.</p>
</MarketingShell>
