<script lang="ts">
	import type { Snippet } from 'svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import AppShell from '$lib/components/app/AppShell.svelte';
	import Toaster from '$lib/components/ui/Toaster.svelte';
	import CommandPalette from '$lib/components/app/CommandPalette.svelte';

	let { children }: { children: Snippet } = $props();

	// Client-only (this subtree is ssr:false), so one client per browser session.
	const queryClient = new QueryClient({
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
