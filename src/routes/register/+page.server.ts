import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { register } from '$lib/api/auth';
import { ApiError } from '$lib/api/client';
import { registerInput } from '$lib/api/schemas';
import { setSession } from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.user) redirect(303, '/app');
	// Prefill from the landing-page email capture (?email=…).
	return { email: url.searchParams.get('email') ?? '' };
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const form = Object.fromEntries(await request.formData());
		const parsed = registerInput.safeParse(form);
		if (!parsed.success) {
			return fail(400, {
				name: String(form.name ?? ''),
				email: String(form.email ?? ''),
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		try {
			const { token } = await register(parsed.data, fetch);
			setSession(cookies, token);
		} catch (err) {
			const message = err instanceof ApiError ? err.message : 'Something went wrong';
			return fail(err instanceof ApiError ? err.status : 500, {
				name: parsed.data.name,
				email: parsed.data.email,
				message
			});
		}

		redirect(303, '/app');
	}
};
