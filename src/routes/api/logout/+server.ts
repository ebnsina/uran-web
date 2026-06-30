import { json } from '@sveltejs/kit';
import { logout } from '$lib/api/auth';
import { clearSession, getSession } from '$lib/server/session';
import type { RequestHandler } from './$types';

// Revokes the session upstream (best-effort) and clears the cookie.
export const POST: RequestHandler = async ({ cookies, fetch }) => {
	const token = getSession(cookies);
	if (token) await logout(token, fetch).catch(() => {});
	clearSession(cookies);
	return json({ ok: true });
};
