// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { User } from '$lib/api/schemas';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/** Authenticated user for the request, or null when signed out. */
			user: User | null;
			/** Session token, available to server load/actions for API calls. */
			token: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
