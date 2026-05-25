---
name: firecrawl-search
description: Search the web with Firecrawl and return ranked results (title, URL, description). Use when the user asks to search the web, look something up online, find pages/articles about a topic, or research a query through Firecrawl. Requires FIRECRAWL_API_KEY.
---

# Firecrawl Search

Runs a web search through Firecrawl's `search` endpoint and returns the top results.
This skill wraps the project's `fc-search` CLI (`src/search.ts`) — it does not
reimplement the search logic.

## Prerequisites

- `FIRECRAWL_API_KEY` must be set in the environment (get a key at https://firecrawl.dev).
  If it is missing, ask the user for one or point them at `.env.example`.
- Dependencies installed (`npm install`). The CLI runs via `tsx`, so no build step is needed.

## How to run

From the repository root, invoke the CLI with the user's query:

```bash
npm run search -- "<query>"
```

Useful flags (pass them after `--`):

- `-n, --limit <n>` — max number of results (default 5)
- `--json` — emit raw JSON instead of the human-readable list

Examples:

```bash
npm run search -- "best open source web scrapers"
npm run search -- --limit 10 "claude code skills"
npm run search -- --json "firecrawl pricing"
```

## Reporting results

- For normal use, run without `--json` and relay the numbered title / URL / description list.
- When you need to act on the results programmatically (e.g. pick a URL to scrape next),
  use `--json` and parse `result.data[]` — each item has `url`, `metadata.title`,
  `metadata.description`, and optional scraped `markdown` / `html`.
- If the CLI exits non-zero, surface the error message; a missing/invalid key prints a
  clear `FIRECRAWL_API_KEY` error.
