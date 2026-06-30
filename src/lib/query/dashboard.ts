/**
 * Client-side query/mutation definitions for the dashboard. Query keys live
 * here as a single source so invalidation stays consistent.
 */
import { orgList, user, type Org, type User } from '$lib/api/schemas';
import { apiGet, apiPost } from './fetcher';

export const keys = {
	me: ['me'] as const,
	orgs: ['orgs'] as const
};

export const getMe = (): Promise<User> => apiGet('/api/v1/me', user);
export const getOrgs = (): Promise<Org[]> => apiGet('/api/v1/orgs', orgList);
/** Logout is special: it must clear the httpOnly cookie, so it hits a dedicated
 *  endpoint rather than the generic proxy. */
export const postLogout = (): Promise<void> => apiPost('/api/logout');
