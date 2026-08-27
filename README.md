# Cookhouse

The web frontend for **Cookhouse**, a household food & grocery app: shared
recipes, a collaborative grocery list, staple reminders, receipt-scan spending
tracking, and spending reports — all scoped to a household, not a single
user.

This package is the Next.js client. It owns no data of its own — everything
comes from [`cookhouse-api`](https://github.com/Benson-D/cookhouse-api) over
tRPC, which is the only service that talks to the database.

## Status

Backend and frontend are both built for recipes, grocery lists, staple
management, image upload, receipt scanning, and spending reports. Recipe URL
import is the only feature with a backend and no frontend consumer yet.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** — CSS-first theming, no `tailwind.config.ts`; the full
  light/dark token set lives in `src/app/globals.css`
- **Clerk**, configured as a B2B app — households map to Clerk Organizations,
  so every household-scoped feature sits behind an active-organization gate
- **tRPC** client + **TanStack Query** for all server state; no client state
  library by default (**Zustand** is installed for UI-only state, on the rare
  occasion something needs it)
- **React Hook Form** + **zod** for forms
- **Recharts** for the one chart this app has (spending's monthly trend);
  everything else chart-shaped is a plain styled bar-list, not a library
- **date-fns** for date arithmetic
- **Storybook** for presentational components in isolation

## Architecture

- `src/modules/<domain>/` — one folder per feature, each split into a
  `Screen`, presentational `components/`, and `hooks/` that own the tRPC
  calls.
- `src/components/common/` — shared components, promoted once a second
  module needs one.
- `src/app/` — routes only, no logic.
- Types are inferred from the backend's published `@cookhouse/api-contract`
  package, never hand-written.
- Theming is CSS custom properties, flipped by one attribute on `<html>`.

See this repo's `CLAUDE.md` for the reasoning behind each of these.

## Getting started

Needs Node matching `.nvmrc` (`nvm use`) and the backend
([`cookhouse-api`](https://github.com/Benson-D/cookhouse-api)) running
alongside it.

```bash
cp .env.local.example .env.local   # fill in Clerk keys + backend URL
pnpm install
pnpm dev                            # http://localhost:3000
```

Other commands:

```bash
pnpm build        # production build
pnpm lint
npx tsc --noEmit
pnpm storybook     # component stories, http://localhost:6006
```

## Design

Built from a single-file HTML/CSS mockup (`design/kitchen-screens.html`) kept
in the broader project workspace alongside this repo and `cookhouse-api` —
not part of this repository itself, since the two packages are independent,
separately-published repos.
