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
		<span class="pill u-mono {phaseMeta[phase].cls}">
			<span class="led"></span>{phaseMeta[phase].label}
		</span>
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

	<div class="bar" aria-hidden="true">
		<span class="fill" style="width: {progress}%"></span>
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
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		padding: 0.25em 0.6em;
		font-size: var(--step--2);
		border-radius: var(--radius);
		border: 1px solid var(--border-strong);
		color: var(--fg-muted);
		transition: color var(--dur-2) var(--ease-out);
	}
	.led {
		width: 7px;
		height: 7px;
		border-radius: var(--radius-full);
		background: currentColor;
	}
	.pill.is-build {
		color: var(--warn);
	}
	.pill.is-deploy {
		color: var(--accent);
	}
	.pill.is-live {
		color: var(--ok);
	}
	.pill.is-live .led {
		animation: blink 1.4s steps(2, jump-none) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.35;
		}
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

	.bar {
		position: relative;
		height: 5px;
		background: color-mix(in oklab, var(--fg) 8%, transparent);
		overflow: hidden;
	}
	.fill {
		position: relative;
		display: block;
		height: 100%;
		border-radius: 0 var(--radius-full) var(--radius-full) 0;
		background: linear-gradient(
			90deg,
			color-mix(in oklab, var(--accent) 70%, transparent),
			var(--accent) 60%,
			var(--blue-300)
		);
		box-shadow:
			0 0 10px -1px color-mix(in oklab, var(--accent) 80%, transparent),
			0 0 2px var(--accent);
		transition: width var(--dur-3) var(--ease-out);
	}
	/* Moving sheen along the fill for a lively, premium feel. */
	.fill::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in oklab, #fff 55%, transparent),
			transparent
		);
		transform: translateX(-100%);
		animation: sheen 1.8s var(--ease-out) infinite;
	}
	@keyframes sheen {
		to {
			transform: translateX(100%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fill::after {
			animation: none;
			opacity: 0;
		}
	}
</style>
