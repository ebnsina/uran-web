/**
 * Smooth in-page navigation without leaving a #fragment in the URL.
 *
 * Attach to an anchor whose href contains a hash (e.g. `#index`). On click it
 * scrolls the target into view and prevents the default jump, so the address
 * bar stays clean. Falls back to normal anchor behaviour without JS. Smoothness
 * and reduced-motion are handled by the global `scroll-behavior` CSS.
 */
export function smoothAnchor(event: MouseEvent) {
	const anchor = event.currentTarget as HTMLAnchorElement;
	const id = anchor.hash.slice(1);
	if (!id) return;
	const target = document.getElementById(id);
	if (!target) return;
	event.preventDefault();
	target.scrollIntoView({ block: 'start' });
}
