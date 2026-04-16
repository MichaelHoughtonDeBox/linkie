"use client";

import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = {
  currentPath?: "/" | "/docs" | "/signup" | "/l";
};

const GITHUB_REPO_URL = "https://github.com/MichaelHoughtonDeBox/linky";

export function SiteHeader({ currentPath = "/" }: SiteHeaderProps) {
  return (
    <header className="site-topbar">
      <Link href="/" className="site-brand" aria-label="Linky home">
        <Image
          src="/logo-mark.svg"
          alt="Linky logo"
          width={28}
          height={28}
          className="border border-foreground bg-white"
          priority
        />
        <span className="display-title text-lg leading-none font-semibold text-foreground">
          Linky
        </span>
      </Link>
      <nav className="site-nav" aria-label="Primary">
        <Link
          href="/docs"
          className={`site-nav-link ${currentPath === "/docs" ? "is-active" : ""}`}
        >
          Docs
        </Link>
        <Link
          href="/signup"
          className={`site-nav-link ${currentPath === "/signup" ? "is-active" : ""}`}
        >
          Sign up
        </Link>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-nav-link"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
