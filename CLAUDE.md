@AGENTS.md

# cookhouse-webplatform — Next.js web app

Next.js + Tailwind + Clerk, talking to `cookhouse-api` over tRPC. The root
`CLAUDE.md` holds the confirmed stack, the naming situation, and the domain
rules this app has to render faithfully — read it first.

**This app never touches Postgres.** All data comes through the tRPC API.

## tRPC wiring

- `src/lib/trpc.ts` — `createTRPCReact<AppRouter>()`, importing the router
  **type only** from `@cookhouse/api-contract` (currently `file:../cookhouse-api/contract`
  in `package.json`, a local link — swap for a real published version once
  `cookhouse-api` is its own repo). Not a direct import of `cookhouse-api`'s
  source: the two are meant to become separate repos, and this package is what
  keeps tRPC's type inference working across that boundary. See
  `cookhouse-api/CLAUDE.md` → Contract package for how it's built and why it's
  safe. `import type` is erased at compile time either way, so no backend code
  (and no Prisma) ships in the bundle.
- `src/app/providers.tsx` — client + `QueryClientProvider`. `httpBatchLink`
  attaches the Clerk token via `getToken()` on every request.
- Backend URL comes from `NEXT_PUBLIC_BACKEND_URL`, defaulting to
  `http://localhost:4000`. Both dev servers must be running.

Because the backend is a separate origin, it needs CORS to allow the
`authorization` header — already configured, but relevant if the port changes.

## Auth

Clerk is set up via the Clerk CLI and linked to a real app; dev keys live in
`.env.local`. `src/proxy.ts` runs `clerkMiddleware()`, and its matcher must keep
`'/__clerk/:path*'` **after** `'/(api|trpc)(.*)'`.

**Households are Clerk Organizations, and this is the biggest frontend
consequence in the project.** Every recipe and grocery-list procedure requires
an *active organization* on the session, not just a signed-in user. Without one
the API returns `FORBIDDEN: Select a household to continue`.

So the app needs an organization gate before any household feature: surface
`<OrganizationSwitcher />` (or a create-household flow) and treat that
`FORBIDDEN` as "pick a household", never as a generic error toast.

**`ClerkProvider`'s `appearance.variables` (`app/layout.tsx`) points Clerk at
this app's own CSS custom properties** (`colorPrimary: "var(--accent)"`,
`colorText: "var(--ink)"`, etc.), not resolved hex values. Left unset, Clerk
renders `<OrganizationSwitcher />`/`<UserButton />` with its own defaults — a
purple brand color nowhere in this design, and text colored for a light
background that goes illegible once the app switches to dark. Pointing at
the `var()` references directly means this needed setting once: the browser
repaints Clerk's UI the same way it repaints everything else when the
underlying custom property changes on theme toggle, no reactive plumbing
needed.

## State

**Don't reach for a state library by default.** tRPC runs on TanStack Query,
which owns all server state — recipes, lists, purchases — including caching and
invalidation. Mutations should invalidate the relevant query rather than hand-
rolling local copies.

**Zustand** is installed for UI-only state: modals, filter selections, form
drafts. **react-hook-form + zod** handle forms; reuse the backend's input
schemas where practical so validation can't drift.

`zod` is pinned to **v3 to match the backend** — the `AppRouter` type crosses
the package boundary via `@cookhouse/api-contract`, and mismatched majors break
inference in confusing ways.

## Folder & component architecture

Mirrors the backend's module convention (`cookhouse-api/CLAUDE.md`) —
deliberately the same word, same shape, so "the recipes module" means the
same thing on both sides of the API.

```
src/
├── app/                       Next.js routes ONLY — thin, no logic
│   ├── recipes/layout.tsx      <AppNav /> + <HouseholdGate /> for every recipe route
│   ├── recipes/page.tsx        renders <RecipeListScreen /> and nothing else
│   └── recipes/[id]/page.tsx   awaits params (Promise in Next 16), renders the Screen
├── modules/<domain>/          the actual feature, e.g. modules/recipes/
│   ├── RecipeListScreen.tsx    logical — composes hooks + components, thin
│   ├── components/             presentational only — props in, JSX out
│   │   └── *.stories.tsx        Storybook, co-located (see below)
│   ├── hooks/                  ALL tRPC calls live here — useRecipeList, etc.
│   ├── types.ts                 prop types, inferred from AppRouter (see below)
│   ├── utils.ts                 module-local pure helpers (added once one earns it)
│   └── *.module.css            feature-local styles (added when Tailwind alone gets unwieldy)
├── modules/household/         HouseholdGate — the org gate, ahead of every feature
├── components/common/         promoted here only once 2+ modules genuinely need it
│   ├── LoadingState.tsx, ErrorState.tsx, EmptyState.tsx
│   ├── AppNav.tsx, ThemeToggle.tsx
│   └── *.stories.tsx
├── hooks/                     shared hooks (useDebounce, etc.)
├── state/                     Zustand stores — still last resort, per State above
├── lib/                       trpc.ts, pure utils
└── app/globals.css            Tailwind + the theme tokens below
```

**Prop types are inferred from the router, not hand-written.** A module's
`types.ts` derives them with `inferRouterOutputs<AppRouter>` — e.g.
`RecipeSummary = RouterOutputs["recipes"]["list"]["recipes"][number]`.
Redeclaring these as local interfaces creates a second source of truth that
drifts silently; inferring them turns a backend shape change into a type error
here.

**The household gate lives in a route layout, not in each Screen.**
`app/recipes/layout.tsx` wraps everything in `<HouseholdGate />` so no
household-scoped query can run without an active organization — the gate has to
sit *above* the hooks, or every screen fires a FORBIDDEN before it renders.
Grocery list and spending will want the same wrapper; promote it to a shared
route group when the second one lands rather than copying the layout.

**Logical vs. presentational, concretely:** a Screen component is the only
thing in a module allowed to hold data-fetching state, and even a Screen
should not construct a `trpc.recipes.list.useQuery(...)` call inline —
**that belongs in a hook.** `modules/recipes/hooks/useRecipeList.ts` owns the
query (input shaping, loading/error shape); `useFavoriteRecipe.ts` owns the
mutation, including its cache-invalidation `onSuccess`. The Screen imports
the hook, never `trpc` directly. This is what stops "add a feature to this
query" from meaning "read and understand this whole component," and it's
the one file a later change (say, cursor-based pagination instead of
skip/take) touches instead of every Screen that lists recipes.

Everything under `components/` takes props and renders — no data fetching, no
`trpc` import, ever. That's the boundary that makes the Storybook setup below
trivial: a presentational component needs no provider mocking to render in
isolation, because it doesn't depend on any.

**Loading, error, and empty states are shared components, not ad hoc JSX per
screen.** `LoadingState`, `ErrorState`, `EmptyState` in `components/common/` —
empty is easy to forget and is a real, common state, not an edge case: a
brand-new household's recipe list is legitimately empty, not broken. Every
hook-consuming Screen renders one of these for its `isLoading`/`isError`/
no-data case rather than inventing its own spinner or error text.

One real gap this surfaces: `design/kitchen-screens.html` only shows the
fully-loaded happy path — no loading, error, or empty state is mocked
anywhere. Build these from the mockup's existing visual language (its
`.callout` treatment is a reasonable starting point for `ErrorState`; a
muted `--surface-2` skeleton for `LoadingState`) rather than improvising a
new idiom, but know you're extrapolating, not matching an approved design —
worth a real design pass once these exist, the same scrutiny the four main
screens got.

**`components/common/` has a barrel (`index.ts`), and nothing else does.**
Once a file imports two or more things from `components/common/` — which
happens constantly, since every hook-consuming Screen needs a loading/error
state plus whatever field primitives it uses — importing each by its own file
path is pure boilerplate, so `import { CHTextInput, CHSelect } from
"@/components/common"` replaces two (or more) lines with one. A single import
from this folder stays a direct path (`@/components/common/AppNav`) — the
barrel earns its keep on 2+, not on principle. Module-local `components/`
folders (`modules/recipes/components/`, etc.) don't get one: those are usually
one or two named things per file for that module alone, not a shared,
growing set the way `components/common/` is.

**Most of `components/common/` is flat — `Component.tsx` beside a future
`Component.stories.tsx` — except `CHButton/` and `CHLink/`, which are each
their own folder** (just `CHButton/CHButton.tsx`, no local `index.ts` — the
top-level barrel imports the file directly, `export { CHButton } from
"./CHButton/CHButton"`, deliberately, so there's exactly one barrel in this
folder rather than a barrel-of-a-barrel per component). That's a deliberate
per-component exception, not a partial migration left unfinished: each gets
its own copy of its Tailwind constants rather than sharing one file, on the
principle that a common component should be manageable in isolation,
including deleting or editing one without reasoning about who else reads its
internals. Whether
this becomes the default for every component here, or stays scoped to the two
that prompted it, is still open.

**Extract dense logic into a util, not a growing component or hook** — same
rule as the backend's `lib/`: pure, no React, no tRPC, directly testable. A
module-local `modules/recipes/utils.ts` for logic specific to that module
(formatting a cook time as "25 min"); promote to shared `lib/` only once,
again, a second module needs the same thing.

**Promote to `components/common/` on the rule of three, not on sight** —
the same principle as the backend's "add a service file when the logic
earns it." A `Pill` used only by recipes stays in
`modules/recipes/components/` until a *second* module genuinely needs the
same thing. Premature promotion is exactly the kind of abstraction this
project avoids elsewhere; a component only "becomes common" once something
else actually needs it, not because it looks reusable.

**Theming is CSS variables, not per-component logic.** The published mockup
(`design/kitchen-screens.html`) defines the full token set — `--ground`,
`--surface`, `--ink`, `--accent`, etc. — for both light and dark. That token
system is ported into `app/globals.css`, and the tokens are mapped onto
Tailwind utility names there too.

**`--ground` is not this app's background — `--surface` is, including on
`<body>`.** In the mockup, `--ground` belongs to `.page`, the design
artifact's own background behind each mocked-up browser frame; `.frame`
(the actual app content, one browser window) sits on `--surface`. This app
has no outer page — it *is* the frame — so `body` uses `bg-surface`, matching
`.frame`, not `bg-ground`. Got this backwards once already: `body` shipped on
`--ground`, which is a shade darker/more tan than intended and made
`AppNav` (which sets no background of its own, inheriting `body`'s) read as
faintly the wrong color everywhere, not just on one screen. `--ground` stays
defined in the token set for fidelity but has no real usage in this app.

**This is Tailwind v4, so there is no `tailwind.config.ts`** — configuration is
CSS-first. The mapping lives in an `@theme inline` block in `globals.css`
(`--color-ground: var(--ground)`, and so on); `inline` is what keeps them as
`var()` references so a runtime theme swap actually reaches the utilities. A
component then just writes `bg-surface text-ink`. Don't add a config file to
get colours in — that's the v3 shape.

**`--danger` is a token now, not a hardcoded hex.** The error/destructive red
(`#B4442F` light, `#E0806B` dark) had been repeated as a raw `text-[#B4442F]`/
`border-[#B4442F]` literal across ~18 files — form validation errors,
`DeleteRecipeLink`'s armed state, `GroceryListFooter`'s "Remove all," the
favorite heart, `StapleRow`'s overdue status, and Clerk's own `colorDanger` in
`layout.tsx` — with no token backing any of them, unlike every other colour in
the app. Added `--danger` to `:root` and both dark blocks plus
`--color-danger: var(--danger)` in `@theme inline`, same as `--accent`/
`--amber`, then swapped every occurrence to `text-danger`/`border-danger`
(including the `/35`/`/70` opacity-modified ones on the favorite heart) and
`colorDanger: "var(--danger)"`. No token existed for this in
`design/kitchen-screens.html` either — its own CSS repeats the same raw hex —
so the dark-mode value is a new pick (a lighter, warmer red for a dark
background), not a ported one, following the same lighten-for-dark
relationship `--accent` and `--amber` already establish.

Theme is switched by a `data-app-theme` attribute on `<html>`. **Absent means
"follow the system"** — `globals.css` handles that with `prefers-color-scheme`,
so the default path needs no attribute, no inline script, and has no hydration
mismatch. `ThemeToggle` sets the attribute explicitly to override, and treats
the attribute (not React state) as the source of truth, reading it back with
`useSyncExternalStore` — mirroring it into state would mean restoring from
localStorage via a setState-in-effect, which `react-hooks/set-state-in-effect`
rejects and which cascades renders.

Flipping the theme touches one attribute, zero components. Don't hardcode a hex
value or a stock Tailwind color in a component — if it isn't one of the
mockup's tokens, it doesn't have a home yet, and that's worth resolving rather
than working around.

**Storybook renders presentational components in isolation** — this is the
concrete payoff of the props-in/JSX-out rule above, not a separate initiative.
Because these components own no data fetching, a story needs no `tRPC`
mock, no `QueryClientProvider`, no Clerk provider — just the props. Every
component in a `components/` folder (both `components/common/` and a
module's own) gets a co-located `Component.stories.tsx`; Screens don't, since
they need real providers and live data to mean anything and mocking that is
not worth it here.

Set up a theme-switching toolbar in `.storybook/preview.ts` (a decorator that
toggles the same theme attribute `app/globals.css` reads) so every story
previews in both light and dark for free — this is where the "flip one
attribute" payoff from the theming rule above becomes something you can
actually look at per-component, not just trust in the abstract.

Not installed yet — `npx storybook@latest init` in `cookhouse-webplatform`
detects Next.js + Tailwind automatically. Do this as part of scaffolding the
first module, not as a later add-on, so `RecipeCard.stories.tsx` exists
alongside `RecipeCard.tsx` from the start rather than being backfilled.

**Styles separate from components:** prefer Tailwind utility classes for
layout and spacing, but pull a genuinely complex or highly conditional
`className` string out into a co-located `*.module.css` rather than growing
one that's unreadable — the grocery list's row grid is a likely candidate.
That file lives inside the module that owns it, not in a global stylesheet;
a feature's peculiar layout is that feature's business, not everyone's.

**Docs:** match the backend's convention — a doc comment states purpose and,
if non-obvious, what it does and why; never restate what the JSX already
shows. Most presentational components need no comment at all.

## Forms

**Validation schemas and types live in their own file, not inline in a
component.** A form imports its zod schema from a co-located `*.schema.ts` —
or, per the State section above, the backend's own `*.input.ts` directly —
rather than defining `z.object({...})` inside the component body. Same for
any non-trivial prop or state type: a `types.ts` beside the component, not
inlined. Inlining a small, genuinely one-off schema or type (a single search
box's `z.object({ search: z.string() })`) is fine — the test is whether
anything other than the component right below it will ever read it.

### Recipe create flow: one submit, images attached after create

Resolves the image-upload/recipeId gap noted in the Rendering rules section
below (`attachImage` requires an existing recipe row).

**Decided: the form saves in one submit.** Fill everything in — name,
description, times, photos, ingredients, method, tags — press **Save recipe**
once. Internally the screen calls `recipes.create` first, then runs the
presign/PUT/`attachImage` cycle for each photo using the id that just came
back.

Photos picked before the recipe exists are held in component state with
object-URL previews and rendered in the same strip as attached ones, marked
`ON SAVE` so it's clear they aren't stored yet. `useRecipeImages(null)`
buffers; `flushTo(id)` uploads them once there is an id. Editing an existing
recipe skips all of that — there's an id from the start, so uploads happen
immediately on pick.

If the recipe saves but a photo upload fails, the screen stays put and shows
"Recipe saved, but an image didn't upload" rather than navigating away — the
recipe genuinely exists at that point, so the remaining files shouldn't be
silently dropped.

**An earlier version staged this as an explicit two-phase reveal** — type a
name, press Continue to mint a bare `Recipe` row and get an id, and only then
reveal the rest of the form. It was built and then rejected on use: being made
to commit a half-recipe before you can fill it in is bad UX, and a backend
write-ordering constraint is the frontend's problem to absorb, not the user's
to step through. Worth remembering before reaching for staged creation again
on a later form with the same shape (a receipt with an image, say).

### Future idea — do not implement yet: schema-driven form generation

Discussed at length, deliberately not built. Recorded so the reasoning isn't
lost and nobody re-derives or reflexively re-proposes it without this context.

The idea: instead of hand-composing each form, the backend emits a UI
descriptor per field (`{ type: "textfield", maxLength: 34, required: true }`),
*generated from* the existing zod schema for generic fields — so there's no
second hand-maintained source of truth to drift from the validator — with an
explicit escape hatch for anything bespoke (`{ type: "custom", component:
"IngredientRepeater" }`). A generic frontend renderer walks the descriptor,
dispatching to a small registry of field primitives for the generic cases and
named custom components for the rest.

What makes this more than idle genericity: the "custom" fields aren't
arbitrary. `RecipeIngredient`, `GroceryListItem`, and `Purchase` already share
the same real shape — `quantity` + `unitId` + `ingredientId` — in the Prisma
schema today. A shared `MeasuredIngredient` field-shape would be naming
something already true about the domain, not inventing structure to justify
a framework. Same logic for images: parameterizing one `ImageField` by
`isMultiple` would cover both a future single receipt photo and a multi-image
recipe gallery, instead of two near-duplicate uploaders.

Why it's not built now: there is exactly one form in the entire app so far
(recipes). Building a generic engine from one data point is the
abstraction-before-evidence trap this project avoids everywhere else
(services added when they earn it, `components/common/` promoted on the rule
of three, not on sight). Revisit once a **second** form exists and the
repetition is observed firsthand rather than predicted — ideally once the
`MeasuredIngredient` shape shows up in a real second UI, such as a grocery
"add item" form. That second occurrence is what would actually justify
extracting it.

## Rendering rules that come from backend decisions

These look like bugs if you don't know them. Full reasoning is in the root
`CLAUDE.md`.

- **A grocery row can legitimately have no quantity.** When recipes measured an
  ingredient in incompatible units (cups vs grams), *or* when nobody ever gave
  it a quantity at all, the API returns `quantity: null` either way — that is
  the correct answer, not missing data. Render it as plain "flour" via
  `formatAmount`. Do **not** hide the row, show `0`, or treat it as an error.
  **Don't add a marker distinguishing the two cases**, despite the published
  mockup drawing a dashed "cups + grams" badge for it — discussed and
  deliberately dropped (see root `CLAUDE.md`'s grocery-list domain rules): the
  API doesn't return which case happened, and building that badge honestly
  would need a schema change nobody decided to make.
- **One row per ingredient, always.** Never group or split list rows in the UI —
  the merge already happened server-side.
- **No per-row "who added/checked this" column.** `GroceryListItem.addedBy` /
  `checkedBy` are real, queryable relations, but per-item attribution was
  judged not worth the space on a list used one-handed in a shop — and the
  mockup's own responsive CSS already hides its `.who` avatar column below
  640px, which is the same call. A list-level "last edited by X · 4 min ago"
  line exists instead (`groceryLists.getActive`'s `lastEdited` field), backed
  by a real `GroceryListItem.updatedAt` column.
- **`RecipeImage.storageKey` is not a URL.** Call `recipes.images` to get
  render-ready URLs; those may be short-lived presigned links, so don't cache
  them in component state across long sessions.
- **Image upload is two steps:** `createImageUpload` returns a presigned PUT →
  the browser uploads the file **directly to the bucket** → `attachImage`
  records it. Files never pass through the backend. Multiple images means
  repeating this per file.
- **Favorites are personal, not household-wide** — two members see different
  hearts filled on the same recipe. Both `recipes.list` and `recipes.getById`
  return an **`isFavorited`** boolean for the calling user; it's derived
  server-side (a flat id lookup joined in memory, not a nested relation
  include), so read it rather than tracking heart state client-side.
  `create`/`update` deliberately **don't** return it — mutations invalidate
  the query instead of populating the cache.
- **Tags can only be picked, never typed.** Creating tags is admin-only, so the
  picker must be a closed list from `tags.list`.
- **`recipes.list` is paginated** and returns `{ recipes, total, skip, take }`,
  with `take` capped at 100 server-side.
- **`recipes.list` returns tags but no images**, so recipe cards have no
  thumbnail to render. `RecipeCard` draws a colour field keyed to the recipe id
  instead — the same stand-in treatment the mockup uses. Real thumbnails need
  the list query to include the first `RecipeImage` and mint a URL for it;
  that's a backend change, not something to paper over with a per-card
  `recipes.images` call (that's an N+1 across the page).
- **`Recipe.instructions` is typed `unknown` at the API boundary**, not as a
  step array. It's a Prisma `Json` column, and `JsonValue` is recursive — tRPC
  walks output types to infer what serializes, and that recursion makes the web
  app's `inferRouterOutputs` fail with TS2589 ("excessively deep"). The service
  re-types it via `OpaqueInstructions<T>`; parse it client-side with
  `parseSteps` in `modules/recipes/utils.ts`, which drops malformed entries
  rather than trusting the shape. Adding another deeply-included `Json` field
  to a router output will hit the same wall.
- **Edit/delete are open to any household member**, not just the recipe's
  author — see root `CLAUDE.md` for why the original author-or-admin rule was
  dropped. `useRecipe`'s `canEdit` just checks that the recipe loaded and
  someone's signed in; no per-recipe authorship check is needed since reaching
  the screen at all already implies household membership.
- **`Recipe.sourceUrl` has no frontend surface at all** — the create/edit
  form's field and the detail page's "View original recipe" link were both
  built and then pulled the same session, once it became clear nothing on
  the backend actually does anything with the URL (no scraper, no metadata
  fetch — just a plain nullable string column). Exposing a field for that
  read as an orphaned, half-finished feature rather than something worth
  keeping around unused. The column and the backend's `.url()` input
  validation are untouched — this was a frontend-only call — so reintroducing
  the field is cheap if the real import feature below ever gets built.
- **Polling (`refetchInterval`) is opt-in on both recipe hooks, not
  unconditional** — see root `CLAUDE.md`'s "Real-time layer" decision for the
  interval values and why grocery lists poll faster than recipes.
  `useGroceryList` polls unconditionally (its query has exactly one
  consumer), but `useRecipeList` and `useRecipe` are each shared by a second
  screen the polling decision doesn't cover, so both take a `{ poll?:
  boolean }` option defaulting to `false`: `RecipeListScreen` and
  `RecipeDetailScreen` pass `poll: true`; `AddFromRecipesScreen` (also built
  on `useRecipeList`) and `RecipeFormScreen`'s edit mode (also built on
  `useRecipe`) don't. The edit-mode case is the one that actually matters —
  `useForm`'s `values: fromRecipeDetail(recipe, steps)` re-seeds the form
  whenever `recipe` changes identity, so polling there would risk a
  background refetch silently discarding an in-progress, unsaved edit the
  moment it lands.

## Spending reports UI

**Built** — `modules/spending/`, at `/spending`. Decided in a scoping
conversation before any of it was built, and the backend
(`cookhouse-api/src/modules/spending/`) already matched this shape, so what
follows is what actually got built, not just the plan.

- **Trend gets a real chart plus a table** — the one report where a chart
  earns its place, since "am I trending up or down" is a shape-over-time
  question a table of six numbers doesn't answer as fast. The table alongside
  it gives exact monthly figures for whoever wants to check one precisely.
- **Category and store breakdowns are one bar-list component each, not a
  separate chart and table.** A pie/bar chart next to a table showing the
  same handful of category-or-store totals is the same numbers rendered
  twice. One list where each row has the label, the exact dollar amount, and
  an inline bar for relative size (e.g. `Produce  $120  ▓▓▓▓▓▓▓`) gives both
  the visual comparison and the precise number without the duplication.
- **Drill-down is tap, never hover.** Tapping a month on the trend chart
  calls `spending.topItems` for just that month, on demand — hover doesn't
  exist on the phones this app is meant to work on (see the grocery list's
  own mobile-first note below), so a hover-only interaction would just be
  broken there, not merely suboptimal.
- **Date-range presets are this month, last month, trailing 3/6/9/12 months,
  and this calendar year (Jan–Dec)** — computed client-side into `from`/`to`
  and sent as-is; the backend has no preset concept at all (see root
  `CLAUDE.md`'s domain rules for why that split is deliberate). Trailing 12
  months and "this year" are both offered on purpose even though they
  overlap heavily — most of the year they show genuinely different numbers.

Two more promotions to `components/common/` happened building this, same
rule-of-three logic as `TagBadge`: **`TagChip`** (recipes' filter pill) is now
also spending's date-range chip — same selectable-pill component serving
both multi-select (tag filtering) and single-select (one active preset)
semantics, since which one applies is entirely the caller's choice of what
to do with `onToggle`, not something the chip itself needs to know. And
**`ExpandRow`** (the dashed "N more, view all" row) started in the receipt
review's matched-items list and is now shared by the trend table's collapsed
exact-figures and both spending bar-lists' truncation — generalized to accept
`label`/`actionLabel` text directly rather than baking in "view all" or
"collapse," since a expand-once row and a expand/collapse toggle read
differently and the component shouldn't need to know which.

## Mobile nav

**Built** — a cross-cutting nav pattern (`design/kitchen-screens.html` screen
09), not one more per-screen mobile pass, since the problem (too much crammed
into the top bar, no thumb-reach nav) shows up everywhere at once. Uses the
same `md:` breakpoint the grid already does (`RecipeListScreen`'s
`grid-cols-2 md:grid-cols-3`).

- **`AppNav`'s top bar collapses to just the brand `Link` and `UserButton`**
  below `md:`. The three `NAV_LINKS` (now exported from `AppNav.tsx` so
  `MobileTabBar` reuses the exact same array and `pathname.startsWith` active
  check rather than a second copy) hide via `hidden md:flex`;
  `OrganizationSwitcher` and `ThemeToggle` hide via `hidden md:block`.
- **`MobileTabBar`** renders those same three links as a `position: sticky;
  bottom: 0` bar, `md:hidden`, mounted once in `app/(app)/layout.tsx` after
  `HouseholdGate` — exactly three destinations is the textbook case for this
  pattern, and it keeps navigation in thumb reach the whole time the grocery
  list scrolls underneath it, worth more here than usual given that screen's
  own one-handed-in-a-shop goal.
- **The household switcher and theme toggle don't fold into `UserButton`'s
  own popover** — checked directly against Clerk's current docs (not assumed
  from training data, per this project's own verify-before-diagnosing habit):
  `UserButton.MenuItems` only accepts `UserButton.Action`/`UserButton.Link`
  items (`label` + `labelIcon` + an `onClick` or `href`), no slot for
  arbitrary component content, so `OrganizationSwitcher` and `ThemeToggle`
  can't literally render inside it. **`MobileAccountPanel`** is the mockup's
  own documented fallback for exactly this case: a real floating panel, the
  same `position: absolute`, anchored-right, no-backdrop mechanism
  `FilterPanel` already proved out, holding the real `OrganizationSwitcher`
  and `ThemeToggle` components. It's opened by one custom `UserButton.Action`
  ("Household & theme") inside `UserButton`'s own menu rather than a second
  avatar-like trigger competing for top-bar space — so the visible top bar
  really is just the two things the spec asked for. That action item renders
  at every width rather than being conditionally suppressed above `md:`
  (redundant with the always-visible desktop controls, but harmless, and
  avoids a `useMediaQuery`-style hook this project has no other use for).
- **`RecipeToolbar` stacks below `md:`**: search, then Favorites, then
  Filters, then New recipe, each its own full-width row — search first,
  refining next, creating last, not however `flex-wrap` happens to break it
  (today's behavior). Favorites and Filters are plain direct children rather
  than paired into one row, on purpose: `FilterPanel` renders inline
  (`position: static`) at this width, and pairing them in a shared flex row
  was tried first — `align-items: stretch`'s default meant the panel opening
  and growing that row's height stretched Favorites' cell to match, floating
  the button's centered label in the middle of the now-tall row instead of
  pinned at the top. One row each sidesteps the whole class of bug rather
  than patching it with `items-start`. At `md:` all four are plain flex items
  in one row via the same classes, reproducing today's desktop layout.
  `FilterButton` gained `className` (the wrapper `FilterPanel` anchors to)
  and `triggerClassName` (the button itself) so the toolbar can size it
  without `FilterButton` needing to know why.

## Design

Four-screen UI exploration (recipe list, detail, create/edit, grocery list).

- **Source:** `design/kitchen-screens.html` at the repo root — edit this file.
- **Published:** https://claude.ai/code/artifact/c05df303-e2e1-460c-9c00-78bb8cda8e60

To revise it, edit the source then republish **passing that URL as `url`** —
publishing without it creates a second, unrelated artifact instead of updating
this one.

Direction is warm neutrals with a herb-green accent, serif recipe titles, and
monospace tabular figures for quantities so amounts align down a list. The
product name is unresolved — the wordmark there is a placeholder.

The grocery list is the screen most likely used one-handed in a shop and
deserves a mobile-first pass; the mockup draws it at desktop width.

## Commands

```bash
pnpm dev        # next dev (backend must run too)
pnpm build      # next build
pnpm lint
npx tsc --noEmit
```
