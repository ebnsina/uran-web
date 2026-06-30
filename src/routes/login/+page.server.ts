import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { login } from '$lib/api/auth';
import { ApiError } from '$lib/api/client';
import { loginInput } from '$lib/api/schemas';
import { setSession } from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.user) redirect(303, redirectTarget(url));
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch, url }) => {
		const form = Object.fromEntries(await request.formData());
		const parsed = loginInput.safeParse(form);
		if (!parsed.success) {
			return fail(400, {
				email: String(form.email ?? ''),
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		try {
			const { token } = await login(parsed.data, fetch);
			setSession(cookies, token);
		} catch (err) {
			const message = err instanceof ApiError ? err.message : 'Something went wrong';
			return fail(err instanceof ApiError ? err.status : 500, {
				email: parsed.data.email,
				message
			});
		}

		redirect(303, redirectTarget(url));
	}
};

/** Honour a ?next= path (same-origin only) so guards can bounce users back. */
function redirectTarget(url: URL): string {
	const next = url.searchParams.get('next');
	return next && next.startsWith('/') ? next : '/app';
}
