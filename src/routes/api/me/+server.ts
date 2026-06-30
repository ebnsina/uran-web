import { error, json } from '@sveltejs/kit';
import { me } from '$lib/api/auth';
import { ApiError } from '$lib/api/client';
import type { RequestHandler } from './$types';

// Proxies GET /v1/me using the httpOnly session cookie (resolved in hooks).
export const GET: RequestHandler = async ({ locals, fetch }) => {
	if (!locals.token) error(401, 'Not authenticated');
	try {
		return json(await me(locals.token, fetch));
	} catch (err) {
		if (err instanceof ApiError) error(err.status, err.message);
		throw err;
	}
};
