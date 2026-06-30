<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, TextField } from '$lib';
	import Alert from '$lib/components/ui/Alert.svelte';
	import AuthShell from '$lib/components/site/AuthShell.svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();
	let submitting = $state(false);
</script>

<svelte:head><title>Create account · Uran</title></svelte:head>

<AuthShell
	eyebrow="Get started"
	title="Create your account"
	subtitle="Deploy your first service in minutes. No credit card required."
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
			label="Name"
			name="name"
			autocomplete="name"
			placeholder="Ada Lovelace"
			value={form?.name ?? ''}
			error={form?.errors?.name?.[0]}
			required
		/>
		<TextField
			label="Email"
			name="email"
			type="email"
			autocomplete="email"
			placeholder="you@company.com"
			value={form?.email ?? data.email}
			error={form?.errors?.email?.[0]}
			required
		/>
		<TextField
			label="Password"
			name="password"
			type="password"
			autocomplete="new-password"
			placeholder="At least 8 characters"
			hint="Use 8 or more characters."
			error={form?.errors?.password?.[0]}
			required
		/>

		<Button type="submit" size="lg" full loading={submitting}>Create account</Button>
	</form>

	{#snippet footer()}
		Already have an account? <a class="link" href="/login">Log in</a>
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
