"use client";

import { useEffect, useRef, useState } from "react";

function decodeUrls(hash: string): string[] {
  if (!hash || hash.length < 2) return [];
  try {
    const encoded = hash.slice(1); // remove #
    const json = atob(encoded);
    const urls = JSON.parse(json);
    if (Array.isArray(urls) && urls.every((u) => typeof u === "string")) {
      return urls;
    }
  } catch {
    // invalid hash
  }
  return [];
}

function encodeUrls(urls: string[]): string {
  return btoa(JSON.stringify(urls));
}

/**
 * Opens multiple URLs by programmatically clicking hidden <a> tags.
 * This is more reliable than window.open() which browsers aggressively block.
 */
function openAllUrls(urls: string[]) {
  urls.forEach((url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

export default function Home() {
  const [urls, setUrls] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const hasUrls = urls.length > 0;
  const autoOpenAttempted = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    const decoded = decodeUrls(hash);
    if (decoded.length > 0) {
      setUrls(decoded);
    }
  }, []);

  // Auto-open is unlikely to work without a user gesture, so we always show
  // the Open All button. But we try once anyway.
  useEffect(() => {
    if (urls.length > 0 && !autoOpenAttempted.current) {
      autoOpenAttempted.current = true;
      openAllUrls(urls);
    }
  }, [urls]);

  const handleCreate = () => {
    const parsed = input
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (parsed.length === 0) return;
    const hash = encodeUrls(parsed);
    const linkieUrl = `${window.location.origin}/#${hash}`;
    navigator.clipboard.writeText(linkieUrl);
    alert("Linkie URL copied to clipboard!");
  };

  // Landing page with URLs to open
  if (hasUrls) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex flex-1 w-full max-w-2xl flex-col items-center justify-center py-16 px-6">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-2">
            Linkie
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            {urls.length} link{urls.length === 1 ? "" : "s"} ready to open.
          </p>

          <button
            onClick={() => openAllUrls(urls)}
            className="mb-8 rounded-full bg-black text-white dark:bg-white dark:text-black px-8 py-3 text-lg font-medium hover:opacity-80 transition-opacity"
          >
            Open All ({urls.length})
          </button>

          <ul className="w-full space-y-2">
            {urls.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors truncate"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </main>
      </div>
    );
  }

  // Home page - create a Linkie
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-2xl flex-col items-center justify-center py-16 px-6">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-2">
          Linkie
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          One link to open them all.
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Paste URLs here, one per line...\nhttps://github.com/org/repo/pull/1\nhttps://github.com/org/repo/pull/2"}
          className="w-full h-48 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none mb-4"
        />
        <button
          onClick={handleCreate}
          className="rounded-full bg-black text-white dark:bg-white dark:text-black px-8 py-3 text-base font-medium hover:opacity-80 transition-opacity"
        >
          Create Linkie
        </button>
      </main>
    </div>
  );
}
