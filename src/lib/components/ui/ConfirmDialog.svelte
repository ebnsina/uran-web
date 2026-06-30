<!--
  Confirmation dialog for destructive actions. Bind `open`; provide a message and
  an `onconfirm` callback. Shows a danger confirm button with a loading state.
-->
<script lang="ts">
	import Dialog from './Dialog.svelte';
	import Button from './Button.svelte';

	interface Props {
		open: boolean;
		title: string;
		message: string;
		confirmLabel?: string;
		loading?: boolean;
		onconfirm: () => void;
	}
	let {
		open = $bindable(),
		title,
		message,
		confirmLabel = 'Delete',
		loading = false,
		onconfirm
	}: Props = $props();
</script>

<Dialog bind:open {title}>
	<p class="msg">{message}</p>
	<div class="actions">
		<Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
		<Button variant="danger" {loading} onclick={onconfirm}>{confirmLabel}</Button>
	</div>
</Dialog>

<style>
	.msg {
		color: var(--fg-muted);
		font-size: var(--step-0);
		line-height: 1.5;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-2xs);
		margin-top: var(--space-l);
	}
</style>
