import Link from "next/link";

import { LiveLinkyDemo } from "@/components/site/live-linky-demo";
import { SiteHeader } from "@/components/site/site-header";
import { WorksWithStrip } from "@/components/site/works-with-strip";

const USE_CASES = [
  "Launch PR review bundles for standups and release trains.",
  "Run incident response checklists from one shareable URL.",
  "Hand off full context packs between agents and teammates.",
  "Package research sessions for demos, clients, and async updates.",
];

const FAQ_ITEMS = [
  {
    question: "What can I bundle into a Linky?",
    answer:
      "Any valid http or https URL. Paste links from docs, dashboards, tickets, repos, and runbooks.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Not yet. Link creation is public and agent-friendly while account features are in progress.",
  },
  {
    question: "Can my agent create Linky links directly?",
    answer:
      "Yes. Agents can call the public API, run the CLI, or use the npm package API.",
  },
  {
    question: "What happens when someone opens a Linky URL?",
    answer:
      "They land on /l/[slug], click Open All, and launch every saved tab with manual fallback links if popups are blocked.",
  },
];

export default function Home() {
  return (
    <div className="terminal-stage flex flex-1 items-start justify-center px-5 py-5 sm:py-6">
      <main className="site-shell w-full max-w-6xl p-5 sm:p-6 lg:p-7">
        <SiteHeader currentPath="/" />

        <section className="site-hero">
          <p className="terminal-label mb-3">Agent-first launch orchestration</p>
          <h1 className="display-title mb-3 text-5xl leading-[0.9] font-semibold text-foreground sm:text-6xl">
            One Linky to open them all.
          </h1>
          <p className="terminal-muted max-w-3xl text-sm leading-relaxed sm:text-base">
            Give Linky a list of URLs and get back one short launcher link.
            Purpose-built for agents, workflows, and fast context handoffs.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/docs" className="terminal-secondary px-4 py-2 text-sm">
              Read docs
            </Link>
            <Link href="/signup" className="terminal-secondary px-4 py-2 text-sm">
              Sign up (coming soon)
            </Link>
          </div>
        </section>

        <LiveLinkyDemo />
        <WorksWithStrip />

        <section className="site-section">
          <h2 className="display-title mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
            Use cases
          </h2>
          <div className="site-divider-list">
            {USE_CASES.map((item) => (
              <article key={item} className="site-divider-item">
                <p className="terminal-muted text-sm leading-relaxed">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="site-section">
          <h2 className="display-title mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
            FAQ
          </h2>
          <div className="site-divider-list">
            {FAQ_ITEMS.map((item) => (
              <article key={item.question} className="site-divider-item">
                <h3 className="mb-2 text-sm font-semibold text-foreground sm:text-base">
                  {item.question}
                </h3>
                <p className="terminal-muted text-sm leading-relaxed">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
