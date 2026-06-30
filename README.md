# uran-web

The dashboard for **Uran** — the developer platform that turns a git push into a
running, routed, TLS-terminated service. This is the SvelteKit front end for the
`uran-api` control plane (a sibling repository).

> Ship code, not infrastructure.

## Stack

- **SvelteKit 2 + Svelte 5** (runes) with TypeScript
- **Zod** for end-to-end validation (form inputs _and_ API responses)
- Self-hosted variable fonts: **Google Sans Flex** (UI) + **Geist Mono** (code)
- No CSS framework — a small, token-driven design system (see below)

## Design system

Every colour, font, size, radius, shadow, and timing lives in
`src/lib/styles/tokens.css` as CSS custom properties — the **single source of
truth**. Components reference only semantic tokens (`--bg`, `--fg`, `--accent`,
`--border`, …), never raw values, so the whole product can be re-skinned (new
brand colour, light mode, tighter spacing) by editing one file.

Brand: **acid lime on ink**. Motion is centralised too — Svelte transitions live
in `src/lib/motion/`, and microinteractions gate on `prefers-reduced-motion`.

## Architecture

The browser never talks to the control plane directly. All API calls run
server-side through SvelteKit load functions and form actions; the session token
is stored in an **httpOnly cookie** and attached to API requests in
`hooks.server.ts`.

```
src/
  app.css                 global base layer (imports tokens)
  hooks.server.ts         resolves the session → locals.user on every request
  lib/
    api/                  typed client + zod schemas (server-only)
    server/session.ts     httpOnly session cookie helpers
    motion/               reusable Svelte transitions
    components/
      ui/                 Button, TextField, Alert, Logo, Reveal …
      site/               SiteHeader, SiteFooter, DeployPanel, AuthShell
    styles/tokens.css     <- single source of truth
  routes/
    +page.svelte          marketing landing
    login / register      zod-validated auth (form actions)
    app/                  authenticated dashboard (guarded)
```

## Develop

```sh
npm install
cp .env.example .env      # set URAN_API_URL to your uran-api instance
npm run dev
```

| Command           | Does                         |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Production build             |
| `npm run preview` | Preview the production build |
| `npm run check`   | `svelte-check` type checking |
| `npm run lint`    | ESLint + Prettier check      |
| `npm run format`  | Format with Prettier         |

## Configuration

| Variable       | Required | Description                                            |
| -------------- | -------- | ------------------------------------------------------ |
| `URAN_API_URL` | yes      | Base URL of the `uran-api` control plane (server-only) |

There are no defaults — a missing variable fails fast.
