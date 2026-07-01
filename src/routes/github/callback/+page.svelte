<!--
  GitHub OAuth callback. GitHub redirects here (in the user's browser, which
  carries the session) with ?code=…&state=<orgId>. We exchange the code via the
  API, then return the user to their organization.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib';
	import { connectGithub } from '$lib/query/resources';

	let phase = $state<'working' | 'done' | 'error'>('working');
	let message = $state('Connecting your GitHub account…');

	onMount(async () => {
		const code = page.url.searchParams.get('code');
		const org = Number(page.url.searchParams.get('state'));
		if (!code || !org) {
			phase = 'error';
			message = 'Missing authorization code.';
			return;
		}
		try {
			await connectGithub(org, code);
			phase = 'done';
			await goto(`/app/orgs/${org}`, { replaceState: true });
		} catch (e) {
			phase = 'error';
			message = e instanceof Error ? e.message : 'Could not connect GitHub.';
		}
	});
</script>

<svelte:head><title>Connecting GitHub · Uran</title></svelte:head>

<main class="wrap">
	<div class="card">
		{#if phase === 'working'}
			<span class="spinner" aria-hidden="true"></span>
			<p>{message}</p>
		{:else if phase === 'error'}
			<h1>Couldn't connect</h1>
			<p class="muted">{message}</p>
			<Button href="/app">Back to dashboard</Button>
		{:else}
			<p>Connected — redirecting…</p>
		{/if}
	</div>
</main>

<style>
	.wrap {
		display: grid;
		place-items: center;
		min-height: 100dvh;
		padding: var(--space-l);
	}
	.card {
		display: grid;
		justify-items: center;
		gap: var(--space-m);
		text-align: center;
		max-width: 24rem;
	}
	.muted {
		color: var(--fg-muted);
	}
	.spinner {
		width: 1.6rem;
		height: 1.6rem;
		border: 2px solid var(--border-strong);
		border-top-color: var(--accent);
		border-radius: var(--radius-full);
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
