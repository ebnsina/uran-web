import { redirect } from '@sveltejs/kit';
import { logout } from '$lib/api/auth';
import { clearSession, getSession } from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';

// /logout is action-only; a stray GET just goes home.
export const load: PageServerLoad = () => {
	redirect(303, '/');
};

export const actions: Actions = {
	default: async ({ cookies, fetch }) => {
		const token = getSession(cookies);
		if (token) await logout(token, fetch).catch(() => {}); // best-effort revoke
		clearSession(cookies);
		redirect(303, '/');
	}
};
