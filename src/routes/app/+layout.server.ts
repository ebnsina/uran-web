import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

/** Auth guard for the whole /app area. Bounces to login with a return path. */
export const load: LayoutServerLoad = ({ locals, url }) => {
	if (!locals.user) {
		const next = encodeURIComponent(url.pathname + url.search);
		redirect(303, `/login?next=${next}`);
	}
	return { user: locals.user };
};
