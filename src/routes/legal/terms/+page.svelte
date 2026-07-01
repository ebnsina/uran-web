<script lang="ts">
	import MarketingShell from '$lib/components/site/MarketingShell.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Terms of Service · Uran</title></svelte:head>
<MarketingShell
	user={data.user}
	eyebrow="Legal"
	title="Terms of Service"
	lede="A plain-language summary while our full terms are finalised."
>
	<h2>Using Uran</h2>
	<p>
		By using Uran you agree to deploy only content you have the rights to, and not to abuse the
		platform or other tenants.
	</p>
	<h2>Availability</h2>
	<p>
		Uran is provided on an “as is” basis during this alpha. We’ll do our best to keep your services
		running, but don’t yet offer a formal SLA.
	</p>
	<h2>Contact</h2>
	<p>Questions about these terms? Email <a href="mailto:legal@uran.sh">legal@uran.sh</a>.</p>
</MarketingShell>
