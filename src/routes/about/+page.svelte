<script lang="ts">
	import MarketingShell from '$lib/components/site/MarketingShell.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>About · Uran</title></svelte:head>

<MarketingShell
	user={data.user}
	eyebrow="Company"
	title="We turn a git push into production."
	lede="Uran is a Git-driven platform-as-a-service. Our goal is simple: let developers ship code and forget the infrastructure underneath."
>
	<h2>What we believe</h2>
	<p>
		Shipping should be one push away. Routing, TLS, scaling, and rollbacks are table stakes — they
		should just work, out of the box.
	</p>
	<h2>Where we're headed</h2>
	<p>
		We're building toward the full platform: workflows, private networking, and more. Follow along
		in the <a href="/changelog">changelog</a>.
	</p>
</MarketingShell>
