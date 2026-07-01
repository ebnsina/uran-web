<script lang="ts">
	// Self-hosted variable fonts (no external CDN, no layout shift). The full
	// weight axis ships in one file each; both are wired to the --font-* tokens.
	import '@fontsource-variable/mona-sans/wdth.css';
	import '@fontsource-variable/geist-mono';

	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
