import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";

export function LinkyResolverError() {
  return (
    <div className="terminal-stage flex flex-1 items-start justify-center px-5 py-5 sm:py-6">
      <main className="site-shell w-full max-w-4xl p-5 sm:p-6 lg:p-7">
        <SiteHeader currentPath="/l" />
        <section className="site-hero text-center">
          <p className="terminal-label mb-3">RESOLVER STATUS</p>
          <h1 className="display-title mb-2 text-4xl font-semibold text-foreground">
            Linky temporarily unavailable
          </h1>
          <p className="terminal-muted mb-8 text-sm leading-relaxed">
            We could not load this launch deck right now. Please retry in a moment.
          </p>
          <Link href="/" className="terminal-action inline-block px-6 py-3 text-sm">
            Back to creator
          </Link>
        </section>
      </main>
    </div>
  );
}
