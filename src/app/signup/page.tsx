import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";

export default function SignupPage() {
  return (
    <div className="terminal-stage flex flex-1 items-start justify-center px-5 py-5 sm:py-6">
      <main className="site-shell w-full max-w-4xl p-5 sm:p-6 lg:p-7">
        <SiteHeader currentPath="/signup" />

        <section className="site-hero">
          <p className="terminal-label mb-3">Sign up</p>
          <h1 className="display-title mb-3 text-4xl leading-[0.95] font-semibold text-foreground sm:text-5xl">
            Accounts coming soon
          </h1>
          <p className="terminal-muted max-w-2xl text-sm leading-relaxed sm:text-base">
            Linky account features are in progress. For now, you can still create
            and share Linky launch URLs from the homepage and API.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/" className="terminal-action px-4 py-2 text-sm">
              Create a Linky
            </Link>
            <Link href="/docs" className="terminal-secondary px-4 py-2 text-sm">
              Read docs
            </Link>
            <a
              href="https://github.com/MichaelHoughtonDeBox/linky"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-secondary px-4 py-2 text-sm"
            >
              GitHub
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
