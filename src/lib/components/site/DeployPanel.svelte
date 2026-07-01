<!--
  Animated hero visual: a faux deploy that cycles build → deploy → live. Lines
  type in, the status pill advances, and a progress bar fills — a compact,
  on-brand demonstration of the product's core loop. Respects reduced-motion
  (renders the finished state, no looping).
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	type Phase = 'build' | 'deploy' | 'live';

	const script: { phase: Phase; text: string }[] = [
		{ phase: 'build', text: '→ detected Dockerfile' },
		{ phase: 'build', text: '→ building image  ▸ cache hit 12/14 layers' },
		{ phase: 'build', text: '✓ pushed registry.uran.app/web:9f3c1a' },
		{ phase: 'deploy', text: '→ rolling out  ▸ 1/1 healthy' },
		{ phase: 'deploy', text: '→ routing  ▸ TLS issued for web.uran.app' },
		{ phase: 'live', text: '✓ live at https://web.uran.app  ·  142ms' }
	];

	let lines = $state<{ phase: Phase; text: string }[]>([]);
	let phase = $state<Phase>('build');
	let progress = $state(0);

	const phaseMeta: Record<Phase, { label: string; cls: string }> = {
		build: { label: 'Building', cls: 'is-build' },
		deploy: { label: 'Deploying', cls: 'is-deploy' },
		live: { label: 'Live', cls: 'is-live' }
	};

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	onMount(() => {
		if (reduced()) {
			lines = script;
			phase = 'live';
			progress = 100;
			return;
		}

		let i = 0;
		let timer: ReturnType<typeof setTimeout>;

		const tick = () => {
			if (i >= script.length) {
				timer = setTimeout(() => {
					lines = [];
					progress = 0;
					phase = 'build';
					i = 0;
					tick();
				}, 2600);
				return;
			}
			const next = script[i];
			lines = [...lines, next];
			phase = next.phase;
			progress = Math.round(((i + 1) / script.length) * 100);
			i++;
			timer = setTimeout(tick, next.phase === 'live' ? 700 : 620);
		};

		timer = setTimeout(tick, 400);
		return () => clearTimeout(timer);
	});
</script>

<div class="panel" role="img" aria-label="A deploy progressing from build to live">
	<div class="chrome">
		<div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
		<span class="title u-mono">uran deploy --service web</span>
		<div class="status {phaseMeta[phase].cls}">
			<span class="plabel u-mono">{phaseMeta[phase].label}</span>
			<span class="ring">
				<svg viewBox="0 0 36 36" aria-hidden="true">
					<circle class="rtrack" cx="18" cy="18" r="15" />
					<circle
						class="rprog"
						cx="18"
						cy="18"
						r="15"
						stroke-dasharray="94.25"
						stroke-dashoffset={94.25 * (1 - progress / 100)}
					/>
				</svg>
				<span class="pct u-mono">{phase === 'live' ? '✓' : progress}</span>
			</span>
		</div>
	</div>

	<div class="log u-mono">
		{#each lines as line, i (i)}
			<p
				class="line"
				class:ok={line.text.startsWith('✓')}
				transition:fly={{ y: 8, duration: 260, easing: expoOut }}
			>
				{line.text}
			</p>
		{/each}
		<span class="caret" aria-hidden="true"></span>
	</div>
</div>

<style>
	.panel {
		background: linear-gradient(180deg, var(--surface-2), var(--surface));
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-3);
		overflow: hidden;
	}
	.chrome {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-xs) var(--space-s);
		border-bottom: 1px solid var(--border);
		background: var(--bg-elevated);
	}
	.dots {
		display: flex;
		gap: 6px;
	}
	.dots span {
		width: 10px;
		height: 10px;
		border-radius: var(--radius-full);
		background: var(--ink-400);
	}
	.title {
		flex: 1;
		font-size: var(--step--2);
		color: var(--fg-subtle);
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.6em;
		color: var(--fg-muted);
		transition: color var(--dur-2) var(--ease-out);
	}
	.status.is-build {
		color: var(--warn);
	}
	.status.is-deploy {
		color: var(--accent);
	}
	.status.is-live {
		color: var(--ok);
	}
	.plabel {
		font-size: var(--step--2);
		font-weight: 600;
		color: currentColor;
	}
	.ring {
		position: relative;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
	}
	.ring svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}
	.rtrack {
		fill: none;
		stroke: color-mix(in oklab, var(--fg) 10%, transparent);
		stroke-width: 3;
	}
	.rprog {
		fill: none;
		stroke: currentColor;
		stroke-width: 3;
		stroke-linecap: round;
		transition: stroke-dashoffset var(--dur-3) var(--ease-out);
	}
	.pct {
		position: absolute;
		font-size: 0.62rem;
		font-weight: 700;
		color: currentColor;
	}
	.status.is-live .pct {
		font-size: 0.8rem;
	}

	.log {
		min-height: 13.5rem;
		padding: var(--space-s);
		font-size: var(--step--1);
		line-height: 1.9;
		color: var(--fg-muted);
	}
	.line {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.line.ok {
		color: var(--fg);
	}
	.caret {
		display: inline-block;
		width: 0.6em;
		height: 1.05em;
		vertical-align: -0.18em;
		background: var(--accent);
		animation: caret 1s steps(2, jump-none) infinite;
	}
	@keyframes caret {
		50% {
			opacity: 0;
		}
	}

	.status.is-live .rprog {
		animation: pulse 1.6s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.55;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.status.is-live .rprog {
			animation: none;
		}
	}
</style>
