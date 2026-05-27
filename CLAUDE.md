# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (`pnpm@10.33.0`, declared in `package.json`).

- `pnpm dev` — start the Next.js dev server
- `pnpm build` — production build (`next build`)
- `pnpm start` — run the production server
- `pnpm lint` — `next lint` (ESLint 9 + `eslint-config-next`)

There is no test runner configured.

Note: `next.config.ts` sets `typescript.ignoreBuildErrors: true` and `tsconfig.json` has `strict: false`. Builds will succeed even with type errors — do not rely on the build to catch them.

## Architecture

### Stack

Next.js 16 App Router + React 19 + Tailwind 3 + shadcn-style Radix components, TanStack Query, Sonner/Radix toast. Path alias `@/*` → `./src/*`.

### Routing pattern (Next App Router → legacy SPA views)

This project was migrated from a Vite/React SPA to Next.js. The migration kept the SPA's component tree intact and wired App Router routes to it as a thin shell:

- `app/<route>/page.tsx` files are 1-line wrappers that import a corresponding view from `src/views/<Name>.tsx` and render it.
- `app/layout.tsx` defines all static `metadata`/`viewport` and wraps children in `app/providers.tsx` (a `"use client"` component holding `QueryClientProvider`, `TooltipProvider`, `Toaster`s, and `OrderModalProvider`).
- Every view in `src/views/` is `"use client"`. Adding a new page = add `app/<slug>/page.tsx` + `src/views/<Name>.tsx`.
- Dynamic routes use Next params, e.g. `app/blog/[slug]/page.tsx` → `src/views/BlogPost.tsx` (reads slug via `useParams` from `next/navigation`).

Because views are all client components, server-side data fetching is **not** used yet — content lives in static files (`src/lib/data/blog.ts`, `src/lib/data/menu.json`, `src/lib/stores.ts`).

### Two parallel SEO systems

Both are active and intentional — don't consolidate without understanding:

1. **`app/layout.tsx` metadata** — Next.js `Metadata`/`Viewport` exports for the root document (favicons, default OG, twitter, robots).
2. **`src/components/Seo.tsx`** — a client `useEffect` SEO updater inherited from the SPA. Per-view, it imperatively `upsertMeta`/`upsertLink`s document head tags and injects JSON-LD (`ld-page-0/1/2` + a site-level `ld-site-restaurant`). Every view passes its own `title`, `description`, `path`, and optional `jsonLd` to `<Seo />`.

If you change SEO, consider whether the new value belongs in route-level Next `metadata` (preferred for crawlers) or `Seo.tsx` (legacy, runs after hydration).

### Stubbed editing infrastructure

The site used to ship inline content editing for a WordPress wrapper (XO admin dashboard). After the Next.js migration, all of it is stubbed:

- `src/contexts/EditContext.tsx` exposes `useEdit()` returning constants (`isEditing: false`, `isLoggedIn: false`, no-op setters, `getDraftValue` always returns the default).
- `src/hooks/use-edit-toggle.ts` — same shape, kept for compile compatibility.
- `src/components/ui/inline-edit.tsx` renders `dangerouslySetInnerHTML={{ __html: value }}` and ignores `onChange`.
- `src/components/ui/media-edit.tsx` renders `children` in a positioned wrapper and ignores `onChange`.

Components throughout the tree still call `useEdit()`, `getDraftValue("some_key", "default text")`, and wrap content in `<InlineEdit>` / `<MediaEdit>`. Treat the calls as **fallback-with-default rendering** — they always render the default. Don't remove them piecemeal; if you need actual editing back, restore the providers rather than rewriting consumers.

### Cross-cutting state

- `OrderModalContext` (in `app/providers.tsx`) — `useOrderModal().open()` from any client component opens the global `OrderStorePickerModal`. Used by Navbar, Footer, CTAs to let users pick Astoria vs Flushing before being sent to Chowbus.
- `STORES` in `src/lib/stores.ts` is the source of truth for both locations (address, maps URL, Chowbus order URL, weekly hours). Hours use a custom convention where `close > 24` means closes that many hours past midnight (e.g. `26` = 2 AM next day). `getOpenStatus(hours, now)` handles wraparound; use it instead of recomputing.

### Blog content

`src/lib/data/blog.ts` exports `DEMO_POSTS: BlogPost[]` with full HTML bodies inline. `views/Blog.tsx` lists them; `views/BlogPost.tsx` looks up by slug and renders `dangerouslySetInnerHTML` from `post.body`. Adding a post = add an entry to that array (image paths usually point to `/uploads/...` in `public/`).

### Images

`next.config.ts` whitelists `chickrocksusa.com` and `chickrocksus.com` for `next/image` remote patterns. Local hero/menu images live in `public/` (including `public/uploads/2026/...` paths that match the production WordPress structure). Most components reference these as plain `<img>` / CSS-background URLs, not `next/image`.

### Styling

- Tailwind config: brand fonts `Anton` (heading) and `Inter` (body) loaded via Google Fonts import at the top of `app/globals.css`. Colors are HSL CSS variables (orange primary `24 92% 50%`, red accent, cream backgrounds).
- shadcn config in `components.json` points to `src/index.css` (which no longer exists — `app/globals.css` is the real stylesheet). If running `shadcn add`, update the config first.
- Only a small subset of shadcn primitives is kept under `src/components/ui/`: `button`, `sonner`, `toast`, `toaster`, `tooltip`, plus the stubbed `inline-edit` / `media-edit`. Don't assume the full shadcn library is available — add primitives explicitly.

## Repo state caveats

- Branch `nextjs-transition` is mid-migration. `git status` still shows many deleted Vite-era files (`vite.config.ts`, `eslint.config.js`, `src/App.tsx`, `src/main.tsx`, `wp-templates/`, `index.html`, etc.) and renames `src/pages/*` → `src/views/*`. The new `app/` directory and `next.config.ts` are untracked. Don't be surprised by the staged churn.
- `.github/workflows/deploy.yml` is **stale** — it still runs `npm ci`/`npm run build` and uploads `./dist` for GitHub Pages (the old Vite SPA pipeline). It will not work for the Next.js build. Update or replace it before relying on CI deploys.
- `.gitignore` excludes `.claude/` and `live-snapshot/` (a saved snapshot of the production WP site used as a clone reference).
