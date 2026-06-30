<!-- Org members: list, invite by email + role, change role, remove. -->
<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Plus, Trash2, Users } from '@lucide/svelte';
	import { Button, TextField, Select, Dialog, Alert, StatusBadge } from '$lib';
	import { getMembers, addMember, setMemberRole, removeMember, qk } from '$lib/query/resources';
	import { ORG_ROLES } from '$lib/api/resources';

	let { orgId }: { orgId: number } = $props();
	const client = useQueryClient();
	const invalidate = () => client.invalidateQueries({ queryKey: qk.members(orgId) });

	const members = createQuery(() => ({
		queryKey: qk.members(orgId),
		queryFn: () => getMembers(orgId)
	}));

	const roleOptions = ORG_ROLES.map((r) => ({ value: r, label: r }));

	let dialogOpen = $state(false);
	let email = $state('');
	let role = $state('member');

	const add = createMutation(() => ({
		mutationFn: () => addMember(orgId, email.trim(), role),
		onSuccess: () => {
			invalidate();
			dialogOpen = false;
			email = '';
			role = 'member';
		}
	}));
	const changeRole = createMutation(() => ({
		mutationFn: (v: { userId: number; role: string }) => setMemberRole(orgId, v.userId, v.role),
		onSuccess: invalidate
	}));
	const remove = createMutation(() => ({
		mutationFn: (userId: number) => removeMember(orgId, userId),
		onSuccess: invalidate
	}));

	function initials(m: { name: string; email: string }) {
		return (m.name || m.email || '?')
			.split(/\s+/)
			.map((s) => s[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	}
</script>

<section>
	<div class="sec-head">
		<h2><Users size={16} /> Members</h2>
		<Button size="sm" variant="secondary" onclick={() => (dialogOpen = true)}>
			<Plus size={16} /> Invite member
		</Button>
	</div>

	{#if members.isPending}
		<p class="muted">Loading…</p>
	{:else if members.isError}
		<Alert>{members.error.message}</Alert>
	{:else}
		<ul class="list">
			{#each members.data as m (m.user_id)}
				<li class="row">
					<span class="avatar">{initials(m)}</span>
					<div class="who">
						<b>{m.name || m.email}</b>
						<span class="email u-mono">{m.email}</span>
					</div>
					{#if m.role === 'owner'}
						<StatusBadge status="owner" />
					{:else}
						<div class="role">
							<Select
								label=""
								name="role-{m.user_id}"
								value={m.role}
								options={roleOptions}
								onchange={(e) =>
									changeRole.mutate({
										userId: m.user_id,
										role: (e.currentTarget as HTMLSelectElement).value
									})}
							/>
						</div>
						<button
							class="del"
							type="button"
							aria-label="Remove {m.email}"
							disabled={remove.isPending && remove.variables === m.user_id}
							onclick={() => remove.mutate(m.user_id)}
						>
							<Trash2 size={15} />
						</button>
					{/if}
				</li>
			{/each}
		</ul>
		{#if changeRole.isError}<Alert>{changeRole.error.message}</Alert>{/if}
		{#if remove.isError}<Alert>{remove.error.message}</Alert>{/if}
	{/if}
</section>

<Dialog bind:open={dialogOpen} title="Invite member">
	<form
		class="u-stack"
		style="--flow: var(--space-m)"
		onsubmit={(e) => {
			e.preventDefault();
			if (email.trim()) add.mutate();
		}}
	>
		{#if add.isError}<Alert>{add.error.message}</Alert>{/if}
		<TextField
			label="Email"
			name="email"
			type="email"
			bind:value={email}
			placeholder="teammate@company.com"
			required
		/>
		<Select label="Role" name="role" bind:value={role} options={roleOptions} />
		<Button type="submit" full loading={add.isPending}>Add member</Button>
	</form>
</Dialog>

<style>
	.sec-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-m);
	}
	.sec-head h2 {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		font-size: var(--step-1);
	}
	.muted {
		color: var(--fg-muted);
		font-size: var(--step--1);
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-s) var(--space-m);
		border-top: 1px solid var(--border);
	}
	.row:first-child {
		border-top: none;
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		flex-shrink: 0;
		border-radius: var(--radius-full);
		background: var(--accent-soft);
		color: var(--accent);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		font-weight: 700;
	}
	.who {
		flex: 1;
		min-width: 0;
	}
	.who b {
		display: block;
		font-size: var(--step-0);
	}
	.email {
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.role {
		width: 8rem;
	}
	.del {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		flex-shrink: 0;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--fg-muted);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			color var(--dur-2) var(--ease-out),
			border-color var(--dur-2) var(--ease-out);
	}
	.del:hover:not(:disabled) {
		color: var(--danger);
		border-color: var(--danger);
	}
	.del:disabled {
		opacity: 0.5;
	}
</style>
