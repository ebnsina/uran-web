<script lang="ts">
	import MarketingShell from '$lib/components/site/MarketingShell.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Contact · Uran</title></svelte:head>

<MarketingShell
	user={data.user}
	eyebrow="Contact"
	title="Talk to us."
	lede="Questions, feedback, or need a hand getting deployed? We'd love to hear from you."
>
	<h2>Support</h2>
	<p>
		<a href="mailto:support@uran.sh">support@uran.sh</a> — for anything about your account or deployments.
	</p>
	<h2>Sales</h2>
	<p><a href="mailto:hello@uran.sh">hello@uran.sh</a> — for teams evaluating Uran.</p>
</MarketingShell>
