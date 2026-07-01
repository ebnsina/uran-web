/**
 * Theme state (dark default + light). The current theme is applied to
 * <html data-theme> pre-paint by the inline script in app.html; this module
 * keeps a reactive mirror for the UI and persists changes to localStorage.
 */
import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';
const STORAGE_KEY = 'uran-theme';

function initial(): Theme {
	if (!browser) return 'dark';
	return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

let current = $state<Theme>(initial());

export const theme = {
	get value(): Theme {
		return current;
	},
	set(next: Theme) {
		current = next;
		if (browser) {
			document.documentElement.dataset.theme = next;
			localStorage.setItem(STORAGE_KEY, next);
		}
	},
	toggle() {
		this.set(current === 'dark' ? 'light' : 'dark');
	}
};
