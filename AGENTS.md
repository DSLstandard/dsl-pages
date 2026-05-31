# AGENTS.md — dsl-pages

## Project overview

**dsl-pages** is a collection of browser-based tools hosted statically on `pages.stay-in.uk`. There is **no backend** — everything runs client-side in the browser. Note that most code is AI-generated and then audited by a human.

- **Framework:** React Router v7 (SPA)
- **SSR:** disabled (`ssr: false`)
- **SSG:** all pages are pre-rendered (`prerender: true`) — this is a fully static site
- **Styling:** Tailwind CSS v4 + shadcn/ui (radix-nova style, neutral base)
- **State:** Zustand (available, use if needed)
- **Package manager:** pnpm

## Commands

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build (static pre-render) |
| `pnpm typecheck` | Run `react-router typegen` then `tsc --noEmit` |
| `pnpm preview` | Preview production build locally |

## Key architectural rules

### Adding a page

1. **Create the feature directory:** `app/feats/app_<page_name>/`
2. **Create the page component:** `app/feats/app_<page_name>/page.tsx`
   - Must have a **default export** for the page component
   - Must export `meta` from `createMetaFromPageInfo(...)` (see existing pages for the pattern)
3. **Create the page info:** `app/feats/app_<page_name>/page_info.ts`
   - Must export a `PageInfo` object with `file`, `pathname`, `title`, `menuDescription`
4. **Register the page:** import the new `PageInfo` into
   `app/feats/page_info/dsl_page_infos.ts` and add it to the `DSL_PAGE_INFOS`
   array. The route is **automatically generated** at build time by
   `app/routes.ts` from `DSL_PAGE_INFOS`. The page will also automatically
   appear in the **search bar** (`app/feats/page_search_bar/`) and **index
   page** menus.

### Meta tags

Use `createMetaFromPageInfo(pageInfo)` from `app/feats/page_info/meta_util.ts` to generate `<title>` and `<meta name="description">` tags from a `PageInfo` object. The pattern (as seen in every page):

```typescript
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { myPageInfo } from "./page_info"

export const meta = createMetaFromPageInfo(myPageInfo)

export default function MyPage() { ... }
```

## Path aliases

`@/*` maps to `app/*` (configured in `tsconfig.json` and `vite.config.ts`).
