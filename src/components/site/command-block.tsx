"use client";

import { CopyButton } from "./copy-button";

type CommandBlockProps = {
  title: string;
  command: string;
  note?: string;
  copyLabel?: string;
};

export function CommandBlock({
  title,
  command,
  note,
  copyLabel = "Copy command",
}: CommandBlockProps) {
  return (
    <section className="site-command-block site-command-panel">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="terminal-label">{title}</p>
        {/* Keep command copies one click for agent workflows. */}
        <CopyButton text={command} label={copyLabel} />
      </div>
      <pre className="site-code-block whitespace-pre-wrap break-all text-xs text-foreground sm:text-sm">
        <code>{command}</code>
      </pre>
      {note ? <p className="terminal-muted mt-3 text-xs">{note}</p> : null}
    </section>
  );
}
