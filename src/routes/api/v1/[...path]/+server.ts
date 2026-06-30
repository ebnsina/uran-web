/**
 * Generic authenticated proxy to the uran-api control plane.
 *
 * Any request to /api/v1/<path> is forwarded to ${URAN_API_URL}/v1/<path> with
 * the user's httpOnly session token attached as a Bearer header. The token never
 * reaches the browser; per-resource authorization (RBAC) is enforced upstream by
 * the API, so this proxy only adds authentication, it never widens access.
 *
 * Status and JSON body are passed through verbatim so the client can parse
 * success payloads with zod and surface API errors ({"error": "..."}).
 */
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const BODYLESS = new Set(['GET', 'HEAD']);

const proxy: RequestHandler = async ({ params, request, url, locals, fetch }) => {
	if (!locals.token) error(401, 'Not authenticated');

	const base = env.URAN_API_URL?.replace(/\/$/, '');
	if (!base) error(500, 'URAN_API_URL is not set');

	const headers: Record<string, string> = {
		Authorization: `Bearer ${locals.token}`,
		Accept: 'application/json'
	};
	const init: RequestInit = { method: request.method, headers };

	if (!BODYLESS.has(request.method)) {
		const body = await request.text();
		if (body) {
			init.body = body;
			headers['Content-Type'] = 'application/json';
		}
	}

	let res: Response;
	try {
		res = await fetch(`${base}/v1/${params.path}${url.search}`, init);
	} catch {
		error(503, 'Cannot reach the Uran API');
	}

	// Stream the body through (don't buffer) so SSE / chunked log endpoints work.
	return new Response(res.body, {
		status: res.status,
		headers: {
			'Content-Type': res.headers.get('content-type') ?? 'application/json',
			'Cache-Control': 'no-cache'
		}
	});
};

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
