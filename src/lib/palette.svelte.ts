/** Shared open-state for the command palette (so the sidebar button can open it). */
let _open = $state(false);

export const palette = {
	get open(): boolean {
		return _open;
	},
	set open(v: boolean) {
		_open = v;
	},
	toggle(): void {
		_open = !_open;
	}
};
