"use client";

import { useMemo, useState, useTransition } from "react";

type ApiKeyPermission = "links:read" | "links:write" | "keys:admin";

type ApiKeyItem = {
  id: number;
  name: string;
  scope: "user" | "org";
  scopes: ApiKeyPermission[];
  keyPrefix: string;
  createdAt: string;
  createdAtLabel: string;
  lastUsedAt: string | null;
  lastUsedAtLabel: string | null;
  revokedAt: string | null;
  revokedAtLabel: string | null;
};

type Props = {
  subjectType: "user" | "org";
  initialKeys: ApiKeyItem[];
};

type ApiKeyDto = {
  id: number;
  name: string;
  scope: "user" | "org";
  scopes: ApiKeyPermission[];
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

type CreateApiKeyResponse = {
  apiKey: ApiKeyDto;
  rawKey: string;
  warning?: string;
};

// Three preset scope sets. The underlying array supports combinations
// (e.g. ['links:read', 'keys:admin']) but the UI exposes the three
// common ones — anything fancier goes through the API directly.
type ScopePreset = "read" | "write" | "admin";

const SCOPE_PRESETS: Record<
  ScopePreset,
  { label: string; description: string; scopes: ApiKeyPermission[] }
> = {
  read: {
    label: "Read-only",
    description:
      "List and view Linkies. Read insights. Cannot edit or delete. Safe for LLM context.",
    scopes: ["links:read"],
  },
  write: {
    label: "Read & write",
    description:
      "Everything read-only can do, plus editing Linkies. Cannot delete (admin only). Today's default.",
    scopes: ["links:write"],
  },
  admin: {
    label: "Admin",
    description:
      "Everything above, plus minting and revoking other API keys. Mint rarely; treat like a root credential.",
    scopes: ["keys:admin"],
  },
};

function labelForScopes(scopes: ApiKeyPermission[]): string {
  if (scopes.includes("keys:admin")) return "Admin";
  if (scopes.includes("links:write")) return "Read & write";
  if (scopes.includes("links:read")) return "Read-only";
  return scopes.join(", ") || "Unknown";
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

function withLabels(item: ApiKeyDto): ApiKeyItem {
  return {
    ...item,
    scopes: item.scopes ?? ["links:write"],
    createdAtLabel: formatRelative(item.createdAt),
    lastUsedAtLabel: item.lastUsedAt ? formatRelative(item.lastUsedAt) : null,
    revokedAtLabel: item.revokedAt ? formatRelative(item.revokedAt) : null,
  };
}

export function ApiKeysPanel({ subjectType, initialKeys }: Props) {
  const [keys, setKeys] = useState<ApiKeyItem[]>(initialKeys);
  const [name, setName] = useState("");
  const [preset, setPreset] = useState<ScopePreset>("write");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [revealedWarning, setRevealedWarning] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeKeys = useMemo(
    () => keys.filter((item) => item.revokedAt === null),
    [keys],
  );

  const revokedKeys = useMemo(
    () => keys.filter((item) => item.revokedAt !== null),
    [keys],
  );

  const handleCreate = () => {
    setError(null);
    setSuccess(null);
    setRevealedKey(null);
    setRevealedWarning(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/me/keys", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name,
            scopes: SCOPE_PRESETS[preset].scopes,
          }),
        });

        const body = (await response.json().catch(() => ({}))) as
          | { error?: string }
          | CreateApiKeyResponse;

        if (!response.ok) {
          setError("error" in body ? (body.error ?? "Could not create API key.") : "Could not create API key.");
          return;
        }

        if (!("apiKey" in body) || typeof body.rawKey !== "string") {
          setError("Linky returned an invalid API-key response.");
          return;
        }

        setKeys((prev) => [withLabels(body.apiKey), ...prev]);
        setRevealedKey(body.rawKey);
        setRevealedWarning(body.warning ?? null);
        setSuccess(
          `${subjectType === "org" ? "Team" : "Personal"} API key created.`,
        );
        setName("");
      } catch {
        setError("Could not reach the Linky API. Check your connection and retry.");
      }
    });
  };

  const handleRevoke = (apiKeyId: number) => {
    setError(null);
    setSuccess(null);

    const confirmed = window.confirm(
      "Revoke this API key? Any CLI, CI, or MCP client using it will stop authenticating immediately.",
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/me/keys?id=${apiKeyId}`, {
          method: "DELETE",
        });

        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
          apiKey?: ApiKeyDto;
        };

        if (!response.ok || !body.apiKey) {
          setError(body.error ?? "Could not revoke API key.");
          return;
        }

        setKeys((prev) =>
          prev.map((item) =>
            item.id === apiKeyId ? withLabels(body.apiKey!) : item,
          ),
        );
        setSuccess("API key revoked.");
      } catch {
        setError("Could not reach the Linky API. Check your connection and retry.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <section className="terminal-card space-y-4 p-4 sm:p-5">
        <div>
          <p className="terminal-label mb-2">
            Create {subjectType === "org" ? "team" : "personal"} API key
          </p>
          <p className="terminal-muted max-w-2xl text-sm sm:text-base">
            This key authenticates automation for the active workspace. Use it
            with <code>linky update</code>, the SDK, or a future MCP server.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="e.g. release-bot, local-dev, cursor-agent"
            className="terminal-input text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={isPending || name.trim().length === 0}
            className="terminal-action px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create key
          </button>
        </div>

        {/* Sprint 2.7 Chunk D — scope picker. Three presets cover the
            dominant cases; anything more unusual (e.g. keys:admin + links:
            read without write) can still go through the API directly.
            Scope is IMMUTABLE once minted — to change it, revoke + re-issue. */}
        <fieldset className="space-y-2">
          <legend className="terminal-label mb-1">Scope</legend>
          <p className="terminal-muted mb-2 text-xs sm:text-sm">
            Locked at mint. To change later, revoke this key and issue a new one.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.entries(SCOPE_PRESETS) as [ScopePreset, typeof SCOPE_PRESETS[ScopePreset]][]).map(
              ([value, option]) => {
                const active = preset === value;
                return (
                  <label
                    key={value}
                    className={`cursor-pointer border p-3 text-xs sm:text-sm ${
                      active
                        ? "border-foreground bg-foreground text-[var(--accent-2)]"
                        : "border-[var(--panel-border)] bg-white text-foreground hover:border-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="scope"
                      value={value}
                      checked={active}
                      onChange={() => setPreset(value)}
                      className="sr-only"
                    />
                    <span className="block font-semibold">{option.label}</span>
                    <span
                      className={`mt-1 block text-xs leading-relaxed ${
                        active ? "" : "terminal-muted"
                      }`}
                    >
                      {option.description}
                    </span>
                  </label>
                );
              },
            )}
          </div>
        </fieldset>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}

        {revealedKey ? (
          <div className="border border-foreground p-3">
            <p className="terminal-label mb-2">Shown once</p>
            <pre className="overflow-x-auto text-sm break-all whitespace-pre-wrap">
              <code>{revealedKey}</code>
            </pre>
            {revealedWarning ? (
              <p className="terminal-muted mt-2 text-xs sm:text-sm">
                {revealedWarning}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="terminal-card p-4 sm:p-5">
        <p className="terminal-label mb-3">Active keys</p>
        {activeKeys.length === 0 ? (
          <p className="terminal-muted text-sm">
            No active keys for this workspace yet.
          </p>
        ) : (
          <div className="site-divider-list">
            {activeKeys.map((item) => (
              <article
                key={item.id}
                className="site-divider-item flex flex-wrap items-start justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground sm:text-base">
                      {item.name}
                    </p>
                    <span className="terminal-chip text-xs">
                      {labelForScopes(item.scopes)}
                    </span>
                  </div>
                  <p className="terminal-muted mt-1 break-all text-xs sm:text-sm">
                    {item.keyPrefix}
                  </p>
                  <p className="terminal-muted mt-1 text-xs">
                    created {item.createdAtLabel}
                    {item.lastUsedAtLabel
                      ? ` · used ${item.lastUsedAtLabel}`
                      : " · never used"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRevoke(item.id)}
                  disabled={isPending}
                  className="terminal-secondary px-3 py-1.5 text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Revoke
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="terminal-card p-4 sm:p-5">
        <p className="terminal-label mb-3">Revoked keys</p>
        {revokedKeys.length === 0 ? (
          <p className="terminal-muted text-sm">No revoked keys.</p>
        ) : (
          <div className="site-divider-list">
            {revokedKeys.map((item) => (
              <article key={item.id} className="site-divider-item">
                <p className="text-sm font-semibold text-foreground sm:text-base">
                  {item.name}
                </p>
                <p className="terminal-muted mt-1 break-all text-xs sm:text-sm">
                  {item.keyPrefix}
                </p>
                <p className="terminal-muted mt-1 text-xs">
                  revoked {item.revokedAtLabel ?? "recently"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
