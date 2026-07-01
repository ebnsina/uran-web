<script lang="ts">
	import MarketingShell from '$lib/components/site/MarketingShell.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Blog · Uran</title></svelte:head>

<MarketingShell
	user={data.user}
	eyebrow="Blog"
	title="Notes from the Uran team."
	lede="Deep dives on builds, deploys, and running a modern PaaS. Our first posts are on the way — check back soon."
/>
