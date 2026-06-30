/**
 * Client-side query/mutation definitions for the dashboard. Query keys live
 * here as a single source so invalidation stays consistent.
 */
import { orgList, user, type Org, type User } from '$lib/api/schemas';
import { apiGet, apiSend } from './fetcher';

export const keys = {
	me: ['me'] as const,
	orgs: ['orgs'] as const
};

export const getMe = (): Promise<User> => apiGet('/api/me', user);
export const getOrgs = (): Promise<Org[]> => apiGet('/api/orgs', orgList);
export const postLogout = (): Promise<void> => apiSend('/api/logout', 'POST');
