# Vite Static Blog (Obsidian → Markdown) — SPEC

## Goal
- Replace Quartz with a Vite-based static site.
- Keep Obsidian markdown as source.
- Preserve local graph (per‑page) capability.
- Keep design minimal (PatrickCollison-like).

## Non‑Goals (for v1)
- Real‑time editing in browser
- Multi‑author workflow
- Fulltext search (optional later)
- Comments

## Content Source
- Obsidian vault markdown.
- A build step copies only `public` tagged notes (same behavior as today).
- Frontmatter fields supported: `title`, `tags`, `date` (optional).

## Build Pipeline
1) **Copy notes** from vault → `content/` (filter by `tags: [public]`).
2) **Parse markdown** into HTML + metadata.
3) **Generate routes** for each page.
4) **Generate graph data** (links between notes).
5) **Emit static site** via Vite build.

## Tech Stack
- Vite (static build)
- Framework: React
- Markdown: `remark` + `remark-html`
- Syntax highlighting: (later)
- Graph: `react-force-graph-2d`

## Data Model
### Page
- `slug`
- `title`
- `bodyHtml`
- `excerpt`
- `tags[]`
- `date`
- `linksOut[]`

### Graph
- `nodes`: `{ id, title, slug }`
- `edges`: `{ source, target }`
- local graph: filter nodes by N‑hop from current page

## UI / Layout
- Single column, full width
- Minimal header/footer
- No sidebar
- Optional local graph component on page

## Output
- Static HTML + assets
- Deploy to Cloudflare Pages

## Open Questions
- Search requirement (deferred)
- RSS requirement (deferred)

## Next Steps
1) Decide framework
2) Define route structure
3) Implement markdown pipeline
4) Implement graph generator
5) Apply minimal UI theme
