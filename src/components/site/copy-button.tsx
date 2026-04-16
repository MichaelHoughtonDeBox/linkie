"use client";

import { useEffect, useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
};

const DEFAULT_RESET_MS = 1800;

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    // Reset the copied state so the button can be reused repeatedly.
    const timeout = window.setTimeout(() => setCopied(false), DEFAULT_RESET_MS);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={
        className ??
        "terminal-secondary inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm"
      }
      type="button"
      aria-live="polite"
    >
      <span>{copied ? copiedLabel : label}</span>
      <span aria-hidden="true" className="terminal-copy-icon">
        {/* This keeps the affordance visible even when the label changes to Copied. */}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <rect x="9" y="9" width="12" height="12" rx="0" />
          <rect x="3" y="3" width="12" height="12" rx="0" />
        </svg>
      </span>
    </button>
  );
}
