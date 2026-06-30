/**
 * Thin, typed HTTP client for uran-api. Lives server-side only (it reads a
 * private env var and carries the session token) — the browser never talks to
 * the control plane directly; it goes through SvelteKit endpoints/actions.
 *
 * Responses are validated with a caller-supplied zod schema so handlers receive
 * parsed, typed data and a contract drift fails loudly.
 */
import { env } from '$env/dynamic/private';
import { apiError } from './schemas';
import type { z } from 'zod';

/** Error carrying the upstream HTTP status and the API's message. */
export class ApiError extends Error {
	constructor(
		readonly status: number,
		message: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

function baseUrl(): string {
	const url = env.URAN_API_URL;
	// Fail-fast: no silent default. Misconfiguration should be loud, not lossy.
	if (!url) throw new Error('URAN_API_URL is not set');
	return url.replace(/\/$/, '');
}

interface RequestOptions<T> {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	body?: unknown;
	token?: string;
	/** Schema to parse a JSON response body with. Omit for 204/no-content. */
	schema?: z.ZodType<T>;
	fetch?: typeof fetch;
}

export async function request<T = void>(path: string, opts: RequestOptions<T> = {}): Promise<T> {
	const { method = 'GET', body, token, schema, fetch: f = fetch } = opts;

	const headers: Record<string, string> = { Accept: 'application/json' };
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	if (token) headers.Authorization = `Bearer ${token}`;

	let res: Response;
	try {
		res = await f(`${baseUrl()}${path}`, {
			method,
			headers,
			body: body !== undefined ? JSON.stringify(body) : undefined
		});
	} catch {
		throw new ApiError(503, 'Cannot reach the Uran API');
	}

	if (!res.ok) {
		const parsed = apiError.safeParse(await res.json().catch(() => null));
		throw new ApiError(
			res.status,
			parsed.success ? parsed.data.error : `Request failed (${res.status})`
		);
	}

	if (res.status === 204 || !schema) return undefined as T;
	return schema.parse(await res.json());
}
