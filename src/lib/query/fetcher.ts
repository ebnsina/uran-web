/**
 * Browser-side fetch helper for the dashboard's TanStack Query layer. It calls
 * the app's own same-origin `/api/*` endpoints (which proxy to uran-api using
 * the httpOnly session cookie), so the token is never exposed to JS. Responses
 * are validated with zod, mirroring the server client's contract enforcement.
 *
 * This module is client-safe: it must NOT import the server API client, which
 * pulls in private env.
 */
import type { z } from 'zod';

/** Error carrying the proxied HTTP status (e.g. 401 → redirect to login). */
export class FetchError extends Error {
	constructor(
		readonly status: number,
		message: string
	) {
		super(message);
		this.name = 'FetchError';
	}
}

export async function apiGet<T>(url: string, schema: z.ZodType<T>): Promise<T> {
	const res = await fetch(url, { headers: { Accept: 'application/json' } });
	if (!res.ok) throw new FetchError(res.status, await message(res));
	return schema.parse(await res.json());
}

export async function apiSend(url: string, method: 'POST' | 'PATCH' | 'DELETE'): Promise<void> {
	const res = await fetch(url, { method, headers: { Accept: 'application/json' } });
	if (!res.ok) throw new FetchError(res.status, await message(res));
}

/** SvelteKit's error() responds with `{ message }`; fall back to a generic. */
async function message(res: Response): Promise<string> {
	try {
		const body = await res.json();
		if (body && typeof body.message === 'string') return body.message;
	} catch {
		/* ignore */
	}
	return `Request failed (${res.status})`;
}
