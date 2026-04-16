import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";

export default function LinkyNotFound() {
  return (
    <div className="terminal-stage flex flex-1 items-start justify-center px-5 py-5 sm:py-6">
      <main className="site-shell w-full max-w-4xl p-5 sm:p-6 lg:p-7">
        <SiteHeader currentPath="/l" />
        <section className="site-hero text-center">
          <p className="terminal-label mb-3">RESOLVER STATUS</p>
          <h1 className="display-title mb-2 text-4xl font-semibold text-foreground">
            Linky not found
          </h1>
          <p className="terminal-muted mb-8 text-sm leading-relaxed">
            That short URL does not exist, may have been removed, or has an
            invalid slug.
          </p>
          <Link href="/" className="terminal-action inline-block px-6 py-3 text-sm">
            Create a new Linky
          </Link>
        </section>
      </main>
    </div>
  );
}
