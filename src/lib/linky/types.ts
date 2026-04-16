export type LinkySource = "web" | "cli" | "sdk" | "agent" | "unknown";

export type LinkyMetadata = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Per-URL metadata.
//
// Stored positionally in the `url_metadata` JSONB column on linkies — index
// N in `url_metadata` corresponds to index N in `urls`. Missing / trailing
// entries default to an empty object.
//
// `openPolicy` is a hint consumed by the launcher when deciding whether to
// open a URL on a given device. Full policy evaluation lands in Sprint 2
// (URL-as-API); Sprint 1 stores the field but the launcher ignores it.
// ---------------------------------------------------------------------------

export type OpenPolicy = "always" | "desktop" | "mobile";

export type UrlMetadata = {
  note?: string;
  tags?: string[];
  openPolicy?: OpenPolicy;
};

export type CreateLinkyPayload = {
  urls: string[];
  source: LinkySource;
  metadata?: LinkyMetadata;
  // New in Sprint 1: optional headline + blurb + per-URL metadata, surfaced
  // in the launcher UI and the dashboard.
  title?: string;
  description?: string;
  urlMetadata?: UrlMetadata[];
};

export type CreateLinkyResponse = {
  slug: string;
  url: string;
};

export type LinkyOwner =
  | { type: "anonymous" }
  | { type: "user"; userId: string }
  | { type: "org"; orgId: string };

export type LinkyRecord = {
  id: number;
  slug: string;
  urls: string[];
  urlMetadata: UrlMetadata[];
  title: string | null;
  description: string | null;
  owner: LinkyOwner;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  source: LinkySource;
  metadata: LinkyMetadata | null;
};

// ---------------------------------------------------------------------------
// Patch payload.
//
// All fields are optional; only provided fields are updated. Passing
// `urls` requires `urlMetadata` to have the same length (or be omitted,
// in which case it's padded with empty objects on the server).
// ---------------------------------------------------------------------------

export type PatchLinkyPayload = {
  urls?: string[];
  urlMetadata?: UrlMetadata[];
  title?: string | null;
  description?: string | null;
};

export type LinkyVersionRecord = {
  versionNumber: number;
  urls: string[];
  urlMetadata: UrlMetadata[];
  title: string | null;
  description: string | null;
  editedByClerkUserId: string | null;
  editedAt: string;
};
