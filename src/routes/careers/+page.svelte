<script lang="ts">
	import MarketingShell from '$lib/components/site/MarketingShell.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Careers · Uran</title></svelte:head>

<MarketingShell
	user={data.user}
	eyebrow="Careers"
	title="Build the platform you'd want to use."
	lede="We're a small team obsessed with developer experience. We don't have open roles listed yet — but we're always happy to meet great people."
>
	<h2>Get in touch</h2>
	<p>
		Think you'd be a fit? Email us at <a href="mailto:careers@uran.sh">careers@uran.sh</a> with what you'd
		love to work on.
	</p>
</MarketingShell>
