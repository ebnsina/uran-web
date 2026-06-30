<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, TextField } from '$lib';
	import Alert from '$lib/components/ui/Alert.svelte';
	import AuthShell from '$lib/components/site/AuthShell.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let submitting = $state(false);
</script>

<svelte:head><title>Log in · Uran</title></svelte:head>

<AuthShell
	eyebrow="Welcome back"
	title="Log in to Uran"
	subtitle="Pick up where your last deploy left off."
>
	<form
		method="POST"
		class="u-stack"
		style="--flow: var(--space-m)"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
			};
		}}
	>
		{#if form?.message}
			<Alert>{form.message}</Alert>
		{/if}

		<TextField
			label="Email"
			name="email"
			type="email"
			autocomplete="email"
			placeholder="you@company.com"
			value={form?.email ?? ''}
			error={form?.errors?.email?.[0]}
			required
		/>
		<TextField
			label="Password"
			name="password"
			type="password"
			autocomplete="current-password"
			placeholder="••••••••"
			error={form?.errors?.password?.[0]}
			required
		/>

		<Button type="submit" size="lg" full loading={submitting}>Log in</Button>
	</form>

	{#snippet footer()}
		New to Uran? <a class="link" href="/register">Create an account</a>
	{/snippet}
</AuthShell>

<style>
	.link {
		color: var(--accent);
		transition: color var(--dur-2) var(--ease-out);
	}
	.link:hover {
		color: var(--accent-hover);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
