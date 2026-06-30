import type { LayoutServerLoad } from './$types';

/** Expose the authenticated user (if any) to every page. */
export const load: LayoutServerLoad = ({ locals }) => {
	return { user: locals.user };
};
