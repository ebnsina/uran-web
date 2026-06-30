<!--
  Decorative hero backdrop: a soft flare-orange aurora beam rising behind the
  headline, a brighter core, and a faint starfield. Full-bleed, pointer-inert,
  and tuned down on the light theme. Purely ambient — aria-hidden.
-->
<div class="glow" aria-hidden="true">
	<span class="beam"></span>
	<span class="core"></span>
	<span class="stars"></span>
</div>

<style>
	.glow {
		position: absolute;
		inset: -6rem 0 auto 0;
		height: 130%;
		left: 50%;
		width: 100vw;
		transform: translateX(-50%);
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
		-webkit-mask-image: linear-gradient(180deg, black 55%, transparent);
		mask-image: linear-gradient(180deg, black 55%, transparent);
	}

	/* The aurora beam — a blurred, tilted radial blob to the upper right. */
	.beam {
		position: absolute;
		top: -28%;
		left: 56%;
		width: 46vw;
		height: 120%;
		background: radial-gradient(
			50% 50% at 50% 50%,
			color-mix(in oklab, var(--accent) 60%, transparent),
			transparent 70%
		);
		filter: blur(64px);
		transform: rotate(20deg);
		opacity: 0.55;
		animation: sway 16s var(--ease-in-out) infinite;
	}

	/* Brighter, tighter core for a hint of a light source. */
	.core {
		position: absolute;
		top: -16%;
		left: 64%;
		width: 16vw;
		height: 70%;
		background: radial-gradient(
			50% 50% at 50% 50%,
			color-mix(in oklab, var(--accent) 85%, white 10%),
			transparent 65%
		);
		filter: blur(40px);
		transform: rotate(20deg);
		opacity: 0.5;
		animation: sway 16s var(--ease-in-out) infinite reverse;
	}

	/* Faint starfield, masked to fade out toward the content. */
	.stars {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(
				1px 1px at 20% 30%,
				color-mix(in oklab, var(--fg) 60%, transparent),
				transparent
			),
			radial-gradient(
				1px 1px at 70% 20%,
				color-mix(in oklab, var(--fg) 50%, transparent),
				transparent
			),
			radial-gradient(
				1px 1px at 85% 45%,
				color-mix(in oklab, var(--accent) 70%, transparent),
				transparent
			),
			radial-gradient(
				1px 1px at 45% 15%,
				color-mix(in oklab, var(--fg) 45%, transparent),
				transparent
			),
			radial-gradient(
				1px 1px at 60% 55%,
				color-mix(in oklab, var(--fg) 40%, transparent),
				transparent
			),
			radial-gradient(
				1px 1px at 30% 60%,
				color-mix(in oklab, var(--accent) 55%, transparent),
				transparent
			);
		opacity: 0.5;
		-webkit-mask-image: radial-gradient(120% 90% at 70% 10%, black, transparent 70%);
		mask-image: radial-gradient(120% 90% at 70% 10%, black, transparent 70%);
	}

	@keyframes sway {
		0%,
		100% {
			transform: rotate(20deg) translate3d(0, 0, 0);
		}
		50% {
			transform: rotate(16deg) translate3d(-2%, 2%, 0);
		}
	}

	/* Calmer on the light theme so it stays a warm haze, not a smear. */
	:global([data-theme='light']) .beam {
		opacity: 0.28;
	}
	:global([data-theme='light']) .core {
		opacity: 0.22;
	}
	:global([data-theme='light']) .stars {
		opacity: 0.25;
	}

	@media (prefers-reduced-motion: reduce) {
		.beam,
		.core {
			animation: none;
		}
	}
</style>
