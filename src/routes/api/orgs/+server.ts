import { error, json } from '@sveltejs/kit';
import { listOrgs } from '$lib/api/orgs';
import { ApiError } from '$lib/api/client';
import type { RequestHandler } from './$types';

// Proxies GET /v1/orgs using the httpOnly session cookie.
export const GET: RequestHandler = async ({ locals, fetch }) => {
	if (!locals.token) error(401, 'Not authenticated');
	try {
		return json(await listOrgs(locals.token, fetch));
	} catch (err) {
		if (err instanceof ApiError) error(err.status, err.message);
		throw err;
	}
};
