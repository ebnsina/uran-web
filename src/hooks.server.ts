/**
 * Resolves the session on every request: if a session cookie is present we ask
 * the API who it belongs to and hang the user off `locals`. A stale/invalid
 * token is cleared so the user lands as signed-out rather than in a broken loop.
 */
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { me } from '$lib/api/auth';
import { ApiError } from '$lib/api/client';
import { clearSession, getSession } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;
	event.locals.token = null;

	const token = getSession(event.cookies);
	if (token) {
		try {
			event.locals.user = await me(token, event.fetch);
			event.locals.token = token;
		} catch (err) {
			// 401 → token no longer valid; drop it. Other errors (API down) we
			// leave the cookie intact so a transient outage doesn't sign users out.
			if (err instanceof ApiError && err.status === 401) clearSession(event.cookies);
		}
	}

	return resolve(event);
};

/**
 * Last-resort handler for unexpected (uncaught) server errors. Logs the real
 * error server-side and returns a clean, non-leaking message to the client,
 * which the root +error.svelte renders.
 */
export const handleError: HandleServerError = ({ error, status }) => {
	if (status !== 404) console.error('[uran-web] unhandled error:', error);
	return { message: status === 404 ? 'Not found' : 'Something went wrong on our end.' };
};
