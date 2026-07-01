---
version: alpha
name: Dribbble Minimal
description: A clean, high-contrast creative marketplace system with soft surfaces, rounded controls, and a playful pink accent.
colors:
  primary: '#0D0C22'
  secondary: '#6E6D7A'
  tertiary: '#EA4C89'
  neutral: '#F3F3F4'
  surface: '#FFFFFF'
  on-surface: '#0D0C22'
  error: '#E5484D'
  primary-60: '#3B3A4F'
  primary-90: '#E7E7EB'
  tertiary-60: '#F7A1C4'
  tertiary-90: '#FDE9F1'
typography:
  headline-display:
    fontFamily: Mona Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: 0px
  headline-lg:
    fontFamily: Mona Sans
    fontSize: 35px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0px
  headline-md:
    fontFamily: Mona Sans
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.19
    letterSpacing: 0px
  headline-sm:
    fontFamily: Mona Sans
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.21
    letterSpacing: 0px
  body-lg:
    fontFamily: Mona Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  body-md:
    fontFamily: Mona Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.64
    letterSpacing: 0px
  body-sm:
    fontFamily: Mona Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.54
    letterSpacing: 0px
  label-lg:
    fontFamily: Mona Sans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0px
  label-md:
    fontFamily: Mona Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0px
  label-sm:
    fontFamily: Mona Sans
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0px
  label-caps:
    fontFamily: Mona Sans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.06em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 36px
  gutter: 24px
  section: 64px
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.full}'
    padding: '10px 20px'
    height: '40px'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.full}'
    padding: '10px 20px'
    height: '40px'
  button-tertiary:
    backgroundColor: 'transparent'
    textColor: '{colors.primary}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.none}'
    padding: '0px'
  chip:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.full}'
    padding: '8px 14px'
    height: '32px'
  chip-active:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.primary}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.full}'
    padding: '8px 14px'
    height: '32px'
  input:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.primary}'
    typography: '{typography.body-md}'
    rounded: '{rounded.full}'
    padding: '16px 20px'
    height: '52px'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    rounded: '{rounded.md}'
    padding: '16px'
  banner:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    typography: '{typography.body-md}'
    rounded: '{rounded.none}'
    padding: '16px 24px'
---

# Dribbble Minimal

## Overview

This interface feels polished, airy, and creator-focused, balancing a professional marketplace tone with a distinctly playful creative energy. The layout prioritizes browsing and discovery, with large hero messaging, soft pills, and vivid accent moments that keep the experience friendly rather than corporate. Spacing is generous and the visual hierarchy is clear, making the page feel modern, confident, and easy to scan.

## Colors

- **Primary (#0D0C22):** The deep ink used for headlines, navigation, button fills, and most body text. It gives the system its strong editorial contrast and anchors the otherwise light interface.
- **Secondary (#6E6D7A):** A softened neutral used for supporting navigation and secondary metadata. It keeps the UI calm without competing with the primary text.
- **Tertiary (#EA4C89):** The signature pink accent used for emphasis, active states, and calls to action. It adds the playful Dribbble personality and draws the eye to key conversion points.
- **Neutral (#F3F3F4):** A very light gray used for subtle fields, chips, and muted surfaces. It separates content areas gently without heavy borders.
- **Surface (#FFFFFF):** The dominant canvas color for the page and most components. It keeps the interface bright, open, and minimal.
- **On-surface (#0D0C22):** The default readable text color on white and light backgrounds. It maintains the strong contrast expected in a content-heavy marketplace.
- **Error (#E5484D):** Reserved for destructive or invalid states. It should be used sparingly so it does not compete with the brand pink accent.
- **Primary-60 (#3B3A4F):** A softer variant for subdued text, icons, and disabled elements.
- **Primary-90 (#E7E7EB):** A near-neutral tint useful for borders, dividers, and low-emphasis containers.
- **Tertiary-60 (#F7A1C4):** A lighter pink for hover backgrounds, badges, and gentle emphasis.
- **Tertiary-90 (#FDE9F1):** A pale pink wash suitable for active chip backgrounds and soft highlight panels.

## Typography

The system uses Mona Sans as the only visible family, with Helvetica Neue, Helvetica, Arial, and sans-serif as fallbacks. Headlines range from a large 48px display treatment down to 19px section headings, with the largest weights used for emphasis and the smaller headings staying light and airy. Body copy is compact and highly readable at 14px–16px, while labels and controls use 13px–14px semibold text for clear interaction affordance. Letter spacing is mostly neutral, with only the small caps-style utility label using slightly increased tracking for a crisp navigation and category feel.

## Layout & Spacing

The layout is a wide, fixed-max-width style composition with strong left-right balance: a large editorial hero on the left and a featured visual on the right. Content is grouped in spacious bands, with generous whitespace between the nav, hero, filters, search, and gallery sections. The spacing rhythm favors 4px, 12px, 16px, 20px, and 36px increments, which keeps details tight while preserving a premium, breathable cadence. Cards and controls use compact internal padding, while full-width bars such as search and banners stretch across the main content area with clear edge alignment.

## Elevation & Depth

Depth is subtle and mostly achieved through contrast, soft borders, and tonal layering rather than dramatic shadows. Primary buttons and selected pills feel tactile because of their dark fills and rounded silhouettes, while lighter components rely on white surfaces against the page background. Cards and thumbnails are usually flat or nearly flat, with gentle edge definition that supports the browsing-first experience. The sticky promotional banner at the bottom introduces a stronger layered feel, but overall the system stays restrained and clean.

## Shapes

The shape language is friendly and highly rounded, especially for buttons, chips, and inputs. Full pill radii dominate interactive elements, giving the brand a soft, approachable, consumer-friendly personality. Cards and media containers use smaller radii, typically around 8px to 16px, which preserves structure while still feeling polished. The overall effect is modern and playful rather than sharp or architectural.

## Components

Buttons are the clearest interactive hierarchy in the system. `button-primary` is a dark, filled pill with white text, compact 10px 20px padding, and a 40px height for strong conversion actions. `button-secondary` uses a white fill with a faint border and soft shadow, making it suitable for alternate actions like log in or filters. `button-tertiary` should remain text-only and unobtrusive for low-priority navigation links. Button text should stay semibold and compact, and the brand favors pill shapes over square corners for all major actions.

Cards should use `card` styling: white surfaces, subtle borders, and modest padding. Visual cards may be more expressive through imagery, but their framing remains restrained so the content leads. Inputs use the `input` token: light neutral fill, full-pill rounding, and generous horizontal padding to make search bars feel broad and touch-friendly. Chips use `chip` or `chip-active` for browsing filters and category selection; inactive chips are white and quiet, while active chips shift to the neutral tint for clearer selection.

The top navigation prefers lightweight link styling with semibold labels and minimal decoration. Dropdown indicators and small utility icons should remain understated, using the primary text color rather than separate accent colors. The bottom promotional banner should be treated as a full-width persistent surface with dark fill, white text, and a single high-priority action button. For lists and feature bullets, use compact icon markers and moderate line-height so dense content still feels easy to scan.

## Do's and Don'ts

- Do keep the interface bright, open, and whitespace-rich.
- Do use the dark primary color for critical text and primary actions.
- Do reserve the pink tertiary accent for emphasis, active states, and standout CTA moments.
- Do keep controls pill-shaped and semibold for a friendly marketplace feel.
- Don't introduce heavy shadows or glassmorphism; depth should stay subtle.
- Don't overuse border colors or divider lines; rely on spacing and tonal contrast first.
- Don't make headlines overly condensed or decorative; Mona Sans should stay clean and modern.
- Don't replace rounded interactive elements with sharp corners except for rare utility surfaces.

---

## Implementation notes (uran-web)

The spec above maps onto the CSS custom properties in `src/lib/styles/tokens.css`
(single source of truth). Key mappings:

| Spec                           | Token                                                                 |
| ------------------------------ | --------------------------------------------------------------------- |
| primary / on-surface `#0D0C22` | `--fg` (light)                                                        |
| secondary `#6E6D7A`            | `--fg-muted`                                                          |
| tertiary `#EA4C89`             | `--accent` (pink ramp `--pink-400`)                                   |
| tertiary-60/-90                | `--pink-300` / `--accent-soft`                                        |
| neutral `#F3F3F4`              | `--surface-2`, `--canvas`                                             |
| surface `#FFFFFF`              | `--surface`, `--bg`                                                   |
| error `#E5484D`                | `--danger`                                                            |
| primary-90 `#E7E7EB`           | `--border`                                                            |
| rounded md/lg/xl/full          | `--radius-xs` 8 / `--radius` 16 / `--radius-2xl` 24 / `--radius-full` |

Component rules:

- **Primary button** — dark ink fill, white text, **pill** (`--radius-full`). Themed via `--_bg: var(--fg); --_fg: var(--bg)` so it inverts cleanly in dark mode.
- **Secondary button** — white fill, faint border, pill.
- **Inputs** — neutral fill, **pill** rounding, generous horizontal padding.
- **Cards** — white surface, subtle border, `--radius` (16px), flat/near-flat.
- **Chips/badges** — pill; the pink accent is reserved for emphasis and active states, not every control.
