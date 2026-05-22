#!/usr/bin/env node
import FirecrawlApp from "@mendable/firecrawl-js";

type CliArgs = {
  query: string;
  limit: number;
  json: boolean;
};

function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2);
  let limit = 5;
  let json = false;
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--limit" || a === "-n") {
      const next = args[++i];
      const n = Number(next);
      if (!Number.isFinite(n) || n <= 0) {
        throw new Error(`--limit expects a positive number, got: ${next}`);
      }
      limit = n;
    } else if (a === "--json") {
      json = true;
    } else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    } else {
      positional.push(a);
    }
  }

  if (positional.length === 0) {
    printHelp();
    process.exit(1);
  }

  return { query: positional.join(" "), limit, json };
}

function printHelp(): void {
  console.log(
    [
      "Usage: fc-search [options] <query...>",
      "",
      "Options:",
      "  -n, --limit <n>   Max results (default 5)",
      "      --json        Output raw JSON",
      "  -h, --help        Show this help",
      "",
      "Env:",
      "  FIRECRAWL_API_KEY  Required. Get one at https://firecrawl.dev",
    ].join("\n"),
  );
}

async function main(): Promise<void> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.error("Error: FIRECRAWL_API_KEY environment variable is not set.");
    process.exit(1);
  }

  const { query, limit, json } = parseArgs(process.argv);
  const app = new FirecrawlApp({ apiKey });

  const result = await app.search(query, { limit });

  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const items = result.data ?? [];
  if (items.length === 0) {
    console.log("No results.");
    return;
  }

  items.forEach((item, i) => {
    const title = item.metadata?.title ?? "(untitled)";
    const url = item.url ?? item.metadata?.sourceURL ?? "";
    const description = item.metadata?.description ?? "";
    console.log(`${i + 1}. ${title}`);
    if (url) console.log(`   ${url}`);
    if (description) console.log(`   ${description}`);
    console.log();
  });
}

main().catch((err) => {
  console.error("Search failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
