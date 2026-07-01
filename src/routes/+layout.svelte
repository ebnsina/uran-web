<script lang="ts">
	// Self-hosted variable fonts (no external CDN, no layout shift). Mona Sans
	// ships the weight + width axes in one file; both wire to the --font-* tokens.
	import '@fontsource-variable/mona-sans/wdth.css';
	import '@fontsource-variable/geist-mono';

	import '../app.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const TITLE = 'Uran — Ship code, not infrastructure';
	const DESCRIPTION =
		'Uran is the developer platform that turns a git push into a running, routed, TLS-terminated service — with managed databases, autoscaling, and preview environments.';

	const canonical = $derived(`${page.url.origin}${page.url.pathname}`);
	const ogImage = $derived(`${page.url.origin}/og.png`);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content={DESCRIPTION} />
	<meta name="theme-color" content="#0b0c0e" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={canonical} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Uran" />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Uran — Ship code, not infrastructure" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

{@render children()}
