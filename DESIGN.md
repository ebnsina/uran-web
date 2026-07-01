---
version: 1.0
name: Uran
description: A calm, dark-first developer-platform system on Honolulu Blue, with one consistent rounded-xl radius and self-hosted variable type.
theme: dark-default (light available via toggle)
colors:
  accent: '#007FBF' # Honolulu Blue — signal / primary
  accent-hover: '#3AA6DE'
  accent-press: '#0069A0'
  accent-contrast: '#FFFFFF'
  ok: '#4EC77F'
  warn: '#FFC24B'
  danger: '#F5375F'
  # Dark theme (default)
  bg: '#0B0C0E'
  surface: '#111316'
  surface-2: '#16191D'
  fg: '#ECEAE6'
  fg-muted: '#9A978F'
  fg-subtle: '#6A6760'
  # Light theme
  light-bg: '#FFFFFF'
  light-canvas: '#E9EBEF' # dashboard grey canvas
  light-surface: '#FFFFFF'
  light-surface-2: '#F1F2F4'
  light-fg: '#18181B'
  light-fg-muted: '#52525B'
  light-fg-subtle: '#8A8A93'
typography:
  fontSans: 'Mona Sans Variable' # self-hosted, weight + width axes
  fontMono: 'Geist Mono Variable' # self-hosted; used for numbers, IDs, code, badges
  numerals: tabular # tabular-nums app-wide so figures align
  display: # hero + big statements
    fontSize: 'clamp(2.4rem, 4.5vw + 1rem, 3.25rem)'
    fontWeight: 600
    fontStretch: '112%' # Mona Sans width axis — confident editorial display
    lineHeight: 1.15
  headline-lg: { fontSize: '35px', fontWeight: 600, lineHeight: 1.2 }
  headline-md: { fontSize: '26px', fontWeight: 600, lineHeight: 1.19 }
  headline-sm: { fontSize: '19px', fontWeight: 600, lineHeight: 1.21 }
  body: { fontSize: '16px', lineHeight: 1.6 }
  mono-label: { fontFamily: 'Geist Mono', ligatures: none, numerals: tabular }
rounded:
  xl: 14px # ONE radius for buttons, inputs, cards, panels, dialogs
  xs: 10px # tiny chips
  full: 999px # circles only — avatars, dots, spinners, health bars
spacing:
  # Fluid scale (clamp), roughly: 3xs 4 · 2xs 8 · xs 12 · s 16 · m 24 · l 32 · xl 48 · 2xl 64 · 3xl 96
  rhythm: 'section gaps tight, content padding generous'
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.accent-contrast}'
    rounded: '{rounded.xl}'
    fontWeight: 600
    hover: 'accent-hover + shadow-2'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.fg}'
    border: 'border-strong'
    rounded: '{rounded.xl}'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.fg-muted}'
    rounded: '{rounded.xl}'
  input:
    backgroundColor: '{colors.surface-2}'
    textColor: '{colors.fg}'
    border: 'border'
    rounded: '{rounded.xl}'
  card:
    backgroundColor: '{colors.surface}'
    border: 'border'
    rounded: '{rounded.xl}'
  status-badge:
    rounded: '{rounded.xl}'
    fontFamily: 'Geist Mono'
    dot: 'circle ({rounded.full})'
  callout:
    backgroundColor: 'tone @12% tint'
    icon: 'circular badge, tone-coloured'
    rounded: '{rounded.xl}'
    tones: [info, success, warning, danger, accent]
---

# Uran

## Overview

Uran's interface is a calm, confident developer platform: dark by default, anchored by a single **Honolulu Blue** accent used sparingly for signal (primary actions, active states, links, focus). The marketing site leans editorial — large display type, generous whitespace, and a live deploy console — while the dashboard is dense-but-scannable: a grey canvas holding a white rounded content panel, tabular numbers, and consistent tables. Everything reads from design tokens in `src/lib/styles/tokens.css`; re-skinning happens there and only there.

## Colors

- **Accent — Honolulu Blue (#007FBF):** the one signal colour. Primary buttons, active nav, links, focus rings, the hero highlight, and live/deploy accents. Hover lightens (`#3AA6DE`), press darkens (`#0069A0`). Reserve it — most of the UI is neutral.
- **Neutrals (ink / paper):** dark theme is a near-black ink canvas (`#0B0C0E`) with lighter surfaces (`#111316`, `#16191D`) and off-white text (`#ECEAE6` → muted → subtle). Light theme is white surfaces on a distinct grey dashboard canvas (`#E9EBEF`), near-black text (`#18181B`).
- **Status hues:** `ok #4EC77F`, `warn #FFC24B`, `danger #F5375F` — used only for state (status badges, alerts, destructive actions), never decoration.
- **Accent-soft:** a ~13% Honolulu-Blue tint for icon badges, soft highlight panels, and callout surfaces.

## Typography

Two self-hosted variable families. **Mona Sans** is the UI/display face — its **width axis** is exploited on large headings (`font-stretch: 112%`) with weight 600 for a wide, editorial display look; body sits at 16px/1.6. **Geist Mono** carries everything numeric or code-like — IDs, paths, timestamps, the deploy console, and status/`Soon` badges — with coding ligatures off and **tabular figures** so numbers align. Tabular numerals are enabled app-wide so counters and tables never jitter.

## Layout & Spacing

Fluid `clamp()` scales for both type and space. The rhythm keeps **section gaps tight** but **content padding generous** — cards and rows breathe, sections don't sprawl. The marketing layout is a wide, max-width composition (editorial hero left, live deploy console right); the dashboard is a grey canvas with a white, rounded content panel and a transparent sidebar whose active item is a solid accent pill. List views (orgs, services, databases, audit) are scannable tables with clickable rows.

## Elevation & Depth

Depth is soft and layered, never heavy: gentle multi-stop shadows (`--shadow-1/2/3`), a subtle accent halo behind the hero preview, and tonal surface contrast rather than borders where possible. No glassmorphism.

## Shapes

**One radius.** `--radius` (14px, rounded-xl) applies to every rectangular surface — buttons, inputs, cards, panels, dialogs — so the whole UI feels cohesive. `--radius-xs` (10px) is only for tiny chips; `--radius-full` is reserved for genuinely circular things (avatars, status dots, spinners, health bars). Buttons are rounded-xl, not pills.

## Components

- **Buttons** all render through one `Button` component (variants `primary` / `secondary` / `ghost` / `danger`, sizes `sm` / `md` / `lg`). Primary is a solid Honolulu-Blue rounded-xl fill; secondary is a bordered white/surface fill; ghost is text-only. Semibold labels.
- **Inputs** (`TextField`, `Select`) use a neutral `surface-2` fill, subtle border, rounded-xl.
- **Cards** are `surface` + subtle border + rounded-xl, mostly flat with a soft hover-lift where interactive.
- **Status badges** are rounded-xl mono chips with a coloured dot; **Callouts** are tone-tinted panels with a circular icon badge (`info / success / warning / danger / accent`).
- **Feedback:** toasts (bottom-right), confirm dialogs for destructive actions, empty states with an icon + CTA, sparklines for metrics, and slot-machine `RollingNumber`s for headline counters.
- **Logo:** a custom two-facet paper-plane mark ("Uran = to take flight") in an accent badge beside the wordmark.

## Do's and Don'ts

- Do keep the accent rare — signal only (primary action, active, link, focus).
- Do use Geist Mono + tabular figures for anything numeric or code-like.
- Do keep one 14px radius on rectangles; reserve `full` for circles.
- Do read/write every colour, size, radius, and timing from `tokens.css`.
- Don't introduce a second brand colour or gradients-for-decoration.
- Don't hand-roll buttons/badges — use the shared components.
- Don't advertise features the API doesn't implement; mark them `Soon` (see the landing roadmap).
