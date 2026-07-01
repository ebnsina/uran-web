<!--
  Root error boundary — renders a designed page for any route error (404, 500…).
  Standalone (its own header/footer) so it works for both marketing and app.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { Logo, Button } from '$lib';
	import { ArrowLeft, Home } from '@lucide/svelte';

	const status = $derived(page.status);
	const is404 = $derived(status === 404);
	const title = $derived(is404 ? 'Page not found' : 'Something went wrong');
	const message = $derived(
		is404
			? "The page you're looking for doesn't exist or may have moved."
			: (page.error?.message ?? 'An unexpected error occurred. Please try again.')
	);
</script>

<svelte:head><title>{status} · Uran</title></svelte:head>

<main class="err">
	<div class="err-top">
		<Logo />
	</div>

	<div class="err-body">
		<p class="code u-mono">{status}</p>
		<h1>{title}</h1>
		<p class="msg">{message}</p>
		<div class="actions">
			<Button href="/" size="lg"><Home size={16} /> Back home</Button>
			{#if !is404}
				<Button variant="secondary" size="lg" onclick={() => location.reload()}>
					<ArrowLeft size={16} /> Try again
				</Button>
			{:else}
				<Button href="/docs" variant="secondary" size="lg">Read the docs</Button>
			{/if}
		</div>
	</div>
</main>

<style>
	.err {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		padding: var(--space-l);
	}
	.err-body {
		flex: 1;
		display: grid;
		align-content: center;
		justify-items: start;
		max-width: 40rem;
		margin: 0 auto;
		width: 100%;
	}
	.code {
		font-size: var(--h-display);
		font-weight: 600;
		font-stretch: 112%;
		line-height: 1;
		color: var(--accent);
	}
	.err-body h1 {
		margin-top: var(--space-s);
		font-size: var(--h-md);
		font-weight: 600;
	}
	.msg {
		margin-top: var(--space-s);
		color: var(--fg-muted);
		font-size: var(--step-1);
		line-height: var(--leading-normal);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-s);
		margin-top: var(--space-l);
	}
</style>
