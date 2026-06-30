import { listOrgs } from '$lib/api/orgs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	// The guard in +layout.server guarantees a token here.
	const orgs = await listOrgs(locals.token!, fetch).catch(() => []);
	return { orgs };
};
