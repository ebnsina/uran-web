<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		QueryClient,
		QueryClientProvider,
		QueryCache,
		MutationCache
	} from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import AppShell from '$lib/components/app/AppShell.svelte';
	import Toaster from '$lib/components/ui/Toaster.svelte';
	import CommandPalette from '$lib/components/app/CommandPalette.svelte';
	import { FetchError } from '$lib/query/fetcher';

	let { children }: { children: Snippet } = $props();

	// Any 401 (expired/invalid session) sends the user back to login with a
	// return path — handled once here so individual queries don't have to.
	let redirecting = false;
	function on401(err: unknown) {
		if (err instanceof FetchError && err.status === 401 && !redirecting) {
			redirecting = true;
			goto(`/login?next=${encodeURIComponent(location.pathname)}`);
		}
	}

	// Client-only (this subtree is ssr:false), so one client per browser session.
	const queryClient = new QueryClient({
		queryCache: new QueryCache({ onError: on401 }),
		mutationCache: new MutationCache({ onError: on401 }),
		defaultOptions: {
			queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false }
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<AppShell>
		{@render children()}
	</AppShell>
	<CommandPalette />
</QueryClientProvider>

<Toaster />
