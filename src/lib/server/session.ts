/**
 * Session cookie management. The API issues an opaque session token; we keep it
 * in an httpOnly cookie so it is never exposed to client-side JS (XSS-safe).
 */
import type { Cookies } from '@sveltejs/kit';

const COOKIE = 'uran_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setSession(cookies: Cookies, token: string): void {
	cookies.set(COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: MAX_AGE
	});
}

export function getSession(cookies: Cookies): string | undefined {
	return cookies.get(COOKIE);
}

export function clearSession(cookies: Cookies): void {
	cookies.delete(COOKIE, { path: '/' });
}
