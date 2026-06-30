/** Auth calls against uran-api, returning parsed, typed results. Server-only. */
import { request } from './client';
import {
	authResponse,
	user,
	type AuthResponse,
	type LoginInput,
	type RegisterInput,
	type User
} from './schemas';

export function login(input: LoginInput, fetch?: typeof globalThis.fetch): Promise<AuthResponse> {
	return request('/v1/auth/login', { method: 'POST', body: input, schema: authResponse, fetch });
}

export function register(
	input: RegisterInput,
	fetch?: typeof globalThis.fetch
): Promise<AuthResponse> {
	return request('/v1/auth/register', { method: 'POST', body: input, schema: authResponse, fetch });
}

export function me(token: string, fetch?: typeof globalThis.fetch): Promise<User> {
	return request('/v1/me', { token, schema: user, fetch });
}

export function logout(token: string, fetch?: typeof globalThis.fetch): Promise<void> {
	return request('/v1/auth/logout', { method: 'POST', token, fetch });
}
