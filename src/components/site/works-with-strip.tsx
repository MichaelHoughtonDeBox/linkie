import Image from "next/image";

type StackLogo = {
  name: string;
  src: string;
};

const WORKS_WITH_LOGOS: StackLogo[] = [
  { name: "Cursor", src: "/stack-cursor.svg" },
  { name: "Claude", src: "/stack-claude.svg" },
  { name: "OpenAI", src: "/stack-openai.svg" },
  { name: "Gemini", src: "/stack-gemini.svg" },
  { name: "Codex", src: "/stack-codex.svg" },
  { name: "Windsurf", src: "/stack-windsurf.svg" },
  { name: "VS Code", src: "/stack-vscode.svg" },
  { name: "Warp", src: "/stack-warp.svg" },
];

export function WorksWithStrip() {
  return (
    <section className="site-section">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="display-title text-2xl font-semibold text-foreground sm:text-3xl">
          Works with your stack
        </h2>
        <p className="terminal-muted text-xs sm:text-sm">
          Agent tools and developer IDEs
        </p>
      </div>
      <div className="site-logo-grid">
        {WORKS_WITH_LOGOS.map((logo) => (
          <div key={logo.name} className="site-logo-chip">
            {/* Static SVG tiles keep the strip crisp on every density. */}
            <Image
              src={logo.src}
              alt={`${logo.name} monochrome mark`}
              width={220}
              height={72}
              className="site-logo-image"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
