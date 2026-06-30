/** Org calls against uran-api. Server-only (carries the session token). */
import { request } from './client';
import { orgList, type Org } from './schemas';

export function listOrgs(token: string, fetch?: typeof globalThis.fetch): Promise<Org[]> {
	return request('/v1/orgs', { token, schema: orgList, fetch });
}
