/**
 * Tiny toast store. Push transient success/error/info messages from anywhere;
 * the <Toaster /> in the app layout renders them. Auto-dismiss after a TTL.
 */
export type ToastTone = 'success' | 'error' | 'info';
export interface Toast {
	id: number;
	tone: ToastTone;
	message: string;
}

let items = $state<Toast[]>([]);
let counter = 0;

export function getToasts(): Toast[] {
	return items;
}

export function dismissToast(id: number): void {
	items = items.filter((t) => t.id !== id);
}

function push(message: string, tone: ToastTone, ttl = 4000): number {
	const id = ++counter;
	items = [...items, { id, tone, message }];
	if (ttl) setTimeout(() => dismissToast(id), ttl);
	return id;
}

export const toast = {
	success: (m: string) => push(m, 'success'),
	error: (m: string) => push(m, 'error'),
	info: (m: string) => push(m, 'info')
};
