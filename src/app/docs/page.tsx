import Link from "next/link";

import { CommandBlock } from "@/components/site/command-block";
import { CopyButton } from "@/components/site/copy-button";
import { SiteHeader } from "@/components/site/site-header";
import { MAX_URLS_PER_LINKY } from "@/lib/linky/urls";

const BASE_URL =
  process.env.NEXT_PUBLIC_LINKY_BASE_URL ??
  process.env.LINKY_BASE_URL ??
  "https://getalinky.com";

const SKILL_COMMAND =
  "npx skills add https://github.com/MichaelHoughtonDeBox/linky --skill linky -g";

const CURL_COMMAND = [
  `curl -X POST "${BASE_URL}/api/links" \\`,
  '  -H "content-type: application/json" \\',
  "  --data-binary '{",
  '    "urls": [',
  '      "https://example.com",',
  '      "https://example.org"',
  "    ],",
  '    "source": "agent"',
  "  }'",
].join("\n");

const CLI_COMMAND = `npx @linky/linky create "https://example.com" "https://example.org" --base-url "${BASE_URL}" --json`;

const SDK_COMMAND = [
  "const { createLinky } = require(\"@linky/linky\");",
  "",
  "const result = await createLinky({",
  "  urls: [\"https://example.com\", \"https://example.org\"],",
  `  baseUrl: "${BASE_URL}",`,
  '  source: "agent",',
  "});",
  "",
  "console.log(result.url);",
].join("\n");

const LOCAL_SETUP_COMMANDS = [
  "cp .env.example .env.local",
  "npm install",
  "psql \"$DATABASE_URL\" -f db/schema.sql",
  "npm run dev",
].join("\n");

const COPY_ALL_AGENT_COMMANDS = [
  "# Linky quickstart for agents",
  SKILL_COMMAND,
  "",
  "# Create one launch link via CLI",
  CLI_COMMAND,
  "",
  "# Create one launch link via curl",
  CURL_COMMAND,
  "",
  "# Create one launch link via SDK",
  SDK_COMMAND,
].join("\n");

export default function DocsPage() {
  return (
    <div className="terminal-stage flex flex-1 items-start justify-center px-5 py-5 sm:py-6">
      <main className="site-shell w-full max-w-6xl p-5 sm:p-6 lg:p-7">
        <SiteHeader currentPath="/docs" />

        <section className="site-hero">
          <p className="terminal-label mb-3">Docs</p>
          <h1 className="display-title mb-3 text-4xl leading-[0.95] font-semibold text-foreground sm:text-5xl">
            Agent-first docs for Linky
          </h1>
          <p className="terminal-muted max-w-3xl text-sm leading-relaxed sm:text-base">
            Linky turns many URLs into one short launch link. Use these commands
            to integrate Linky with agents, scripts, CLI workflows, and direct API
            calls.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {/* This keeps "copy all" available at the top of docs. */}
            <CopyButton
              text={COPY_ALL_AGENT_COMMANDS}
              label="Copy all agent commands"
              copiedLabel="All commands copied"
              className="terminal-copy-action px-4 py-2 text-xs sm:text-sm"
            />
            <Link href="/" className="terminal-secondary px-4 py-2 text-sm">
              Back to homepage
            </Link>
          </div>
        </section>

        <section className="site-section">
          <h2 className="display-title mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
            1) Install and create
          </h2>
          <div className="site-command-grid">
            <CommandBlock
              title="Install Linky skill"
              command={SKILL_COMMAND}
              note="Recommended for persistent agent workflows."
            />
            <CommandBlock
              title="Create via CLI"
              command={CLI_COMMAND}
              note="Use --json for machine-readable output in agents."
            />
            <CommandBlock
              title="Create via curl"
              command={CURL_COMMAND}
              note="Direct API path for any HTTP-capable agent."
            />
            <CommandBlock
              title="Create via SDK"
              command={SDK_COMMAND}
              note="Useful for scripts and internal tooling."
            />
          </div>
        </section>

        <section className="site-section">
          <h2 className="display-title mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
            2) API contract
          </h2>
          <div className="site-divider-list">
            <article className="site-divider-item">
              <p className="terminal-label mb-2">POST /api/links</p>
              <p className="terminal-muted text-sm leading-relaxed">
                Send JSON with `urls` and optional metadata. On success you
                receive <code>{"{ slug, url }"}</code> and use that URL to launch{" "}
                <code>/l/[slug]</code>.
              </p>
            </article>
            <article className="site-divider-item">
              <p className="terminal-label mb-2">Supported source values</p>
              <p className="terminal-muted text-sm leading-relaxed">
                web, cli, sdk, agent, unknown.
              </p>
            </article>
            <article className="site-divider-item">
              <p className="terminal-label mb-2">Limits and validation</p>
              <p className="terminal-muted text-sm leading-relaxed">
                Up to {MAX_URLS_PER_LINKY} URLs per Linky, URL length max 2048,
                and only http/https protocols are accepted.
              </p>
            </article>
            <article className="site-divider-item">
              <p className="terminal-label mb-2">Common errors</p>
              <p className="terminal-muted text-sm leading-relaxed">
                400 invalid payload, 429 rate limited, 500 temporary server issue.
              </p>
            </article>
          </div>
        </section>

        <section className="site-section">
          <h2 className="display-title mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
            3) Local development
          </h2>
          <CommandBlock
            title="Local setup commands"
            command={LOCAL_SETUP_COMMANDS}
            copyLabel="Copy setup"
            note="Run these in order. Local app runs on http://localhost:4040."
          />
        </section>
      </main>
    </div>
  );
}
