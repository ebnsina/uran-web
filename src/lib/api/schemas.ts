/**
 * Zod schemas — the boundary contract with uran-api. Every payload leaving the
 * browser is validated against an *input* schema (shared with the form layer)
 * and every response coming back is parsed with a *response* schema, so a drift
 * in the API surfaces as a typed error instead of an undefined-access crash.
 */
import { z } from 'zod';

/* ── Shared field rules (reused by forms + requests) ─────────────────── */

export const email = z
	.string()
	.trim()
	.min(1, 'Email is required')
	.email('Enter a valid email')
	.transform((v) => v.toLowerCase());

export const password = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.max(200, 'Password is too long');

/* ── Auth inputs ─────────────────────────────────────────────────────── */

export const loginInput = z.object({
	email,
	password: z.string().min(1, 'Password is required')
});
export type LoginInput = z.infer<typeof loginInput>;

export const registerInput = z.object({
	name: z.string().trim().min(1, 'Name is required').max(80, 'Name is too long'),
	email,
	password
});
export type RegisterInput = z.infer<typeof registerInput>;

/* ── API response shapes ─────────────────────────────────────────────── */

export const user = z.object({
	id: z.number(),
	email: z.string(),
	name: z.string(),
	created_at: z.string()
});
export type User = z.infer<typeof user>;

export const authResponse = z.object({
	token: z.string(),
	user
});
export type AuthResponse = z.infer<typeof authResponse>;

/* ── Orgs ────────────────────────────────────────────────────────────── */

export const org = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	created_at: z.string()
});
export type Org = z.infer<typeof org>;

export const orgList = z.array(org);

export const apiError = z.object({ error: z.string() });
