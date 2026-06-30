/**
 * Browser-side fetch helpers for the dashboard's TanStack Query layer. They call
 * the app's own same-origin /api/v1/* proxy (which attaches the httpOnly session
 * cookie), so the token is never exposed to JS. Responses are validated with zod.
 *
 * Client-safe: must NOT import the server API client (it pulls in private env).
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

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

async function call<T>(
	method: Method,
	url: string,
	opts: { body?: unknown; schema?: z.ZodType<T> } = {}
): Promise<T> {
	const init: RequestInit = { method, headers: { Accept: 'application/json' } };
	if (opts.body !== undefined) {
		(init.headers as Record<string, string>)['Content-Type'] = 'application/json';
		init.body = JSON.stringify(opts.body);
	}

	const res = await fetch(url, init);
	if (!res.ok) throw new FetchError(res.status, await message(res));
	if (res.status === 204 || !opts.schema) return undefined as T;
	return opts.schema.parse(await res.json());
}

export function apiGet<T>(url: string, schema: z.ZodType<T>): Promise<T> {
	return call('GET', url, { schema });
}
export function apiPost<T = void>(url: string, body?: unknown, schema?: z.ZodType<T>): Promise<T> {
	return call('POST', url, { body, schema });
}
export function apiPatch<T = void>(url: string, body?: unknown, schema?: z.ZodType<T>): Promise<T> {
	return call('PATCH', url, { body, schema });
}
export function apiDelete(url: string): Promise<void> {
	return call('DELETE', url);
}

/** API errors come back as {"error": "..."}; SvelteKit's own as {"message": "..."}. */
async function message(res: Response): Promise<string> {
	try {
		const body = await res.json();
		if (typeof body?.error === 'string') return body.error;
		if (typeof body?.message === 'string') return body.message;
	} catch {
		/* ignore */
	}
	return `Request failed (${res.status})`;
}
