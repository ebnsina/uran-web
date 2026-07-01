<script lang="ts">
	import MarketingShell from '$lib/components/site/MarketingShell.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Privacy Policy · Uran</title></svelte:head>
<MarketingShell
	user={data.user}
	eyebrow="Legal"
	title="Privacy Policy"
	lede="A plain-language summary while our full policy is finalised."
>
	<h2>What we collect</h2>
	<p>
		Your account details (name, email), the repositories and services you connect, and operational
		logs needed to run and secure the platform.
	</p>
	<h2>How we use it</h2>
	<p>
		Only to operate Uran — building, deploying, routing, and billing your usage. We don’t sell your
		data.
	</p>
	<h2>Contact</h2>
	<p>Privacy questions? Email <a href="mailto:privacy@uran.sh">privacy@uran.sh</a>.</p>
</MarketingShell>
