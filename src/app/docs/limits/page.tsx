import Link from "next/link";

import { MAX_URLS_PER_LINKY } from "@/lib/linky/urls";
import {
  MAX_CONDITION_DEPTH,
  MAX_RULES_PER_POLICY,
  MAX_TABS_PER_RULE,
} from "@/lib/linky/policy";

export default function DocsLimitsPage() {
  return (
    <>
      <p className="terminal-label">Reference — limits</p>
      <h1 className="display-title text-4xl leading-[0.95] font-semibold text-foreground sm:text-5xl">
        Limits & rate limits
      </h1>
      <p className="docs-lede">
        Hard caps that gate agent abuse. Everything here is sourced from the
        code — change a value in the repo and this page reflects it on next
        build.
      </p>

      <section className="docs-section">
        <p className="terminal-label">Per-Linky limits</p>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Limit</th>
                <th>Value</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>URLs per Linky</td>
                <td>{MAX_URLS_PER_LINKY}</td>
                <td>
                  <code>MAX_URLS_PER_LINKY</code> in{" "}
                  <code>src/lib/linky/urls.ts</code>
                </td>
              </tr>
              <tr>
                <td>Max URL length</td>
                <td>2048 characters</td>
                <td>
                  <code>MAX_URL_LENGTH</code> in{" "}
                  <code>src/lib/linky/urls.ts</code>
                </td>
              </tr>
              <tr>
                <td>Supported protocols</td>
                <td>
                  <code>http:</code>, <code>https:</code>
                </td>
                <td>
                  <code>SUPPORTED_PROTOCOLS</code> in{" "}
                  <code>src/lib/linky/urls.ts</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="docs-section">
        <p className="terminal-label">Policy limits</p>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Limit</th>
                <th>Value</th>
                <th>Enforced at</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rules per policy</td>
                <td>{MAX_RULES_PER_POLICY}</td>
                <td>Parse time (both <code>POST</code> and <code>PATCH</code>).</td>
              </tr>
              <tr>
                <td>Tabs per rule</td>
                <td>{MAX_TABS_PER_RULE}</td>
                <td>Parse time.</td>
              </tr>
              <tr>
                <td>Condition nesting depth</td>
                <td>{MAX_CONDITION_DEPTH}</td>
                <td>
                  Parse time — compound <code>and</code> / <code>or</code> /{" "}
                  <code>not</code> bodies can&apos;t nest deeper.
                </td>
              </tr>
              <tr>
                <td>Condition string value length</td>
                <td>512 characters</td>
                <td>Parse time, per value in an <code>in</code> list or a scalar op.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          All policy caps live in <code>src/lib/linky/policy.ts</code> as
          exported constants. See{" "}
          <Link href="/docs/personalize">Personalize</Link> for how they
          interact with the DSL.
        </p>
      </section>

      <section className="docs-section">
        <p className="terminal-label">Plan defaults</p>
        <p>
          From <code>getLimits</code> in{" "}
          <code>src/lib/server/entitlements.ts</code>. Stripe-backed plans
          will override these via the <code>entitlements</code> table; with
          no row present the defaults below apply.
        </p>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Max Linkies</th>
                <th>Max URLs per Linky</th>
                <th>Can edit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>anonymous</code>
                </td>
                <td>50</td>
                <td>25</td>
                <td>No (anonymous Linkies are immutable).</td>
              </tr>
              <tr>
                <td>
                  <code>free</code> (signed-in user or org)
                </td>
                <td>100</td>
                <td>25</td>
                <td>Yes (per ownership rules).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="docs-section">
        <p className="terminal-label">Anonymous create rate limit</p>
        <p>
          From <code>getRateLimitConfig</code> in{" "}
          <code>src/lib/server/config.ts</code>. Applies only to
          unauthenticated <code>POST /api/links</code>, keyed by client IP.
        </p>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Setting</th>
                <th>Default</th>
                <th>Override</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Window</td>
                <td>60,000 ms (1 minute)</td>
                <td>
                  <code>LINKY_RATE_LIMIT_WINDOW_MS</code>
                </td>
              </tr>
              <tr>
                <td>Max requests per window</td>
                <td>30</td>
                <td>
                  <code>LINKY_RATE_LIMIT_MAX_REQUESTS</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Exceeding the limit returns <code>429 RATE_LIMITED</code>. Agents
          should back off — a retry-after strategy is recommended.
        </p>
      </section>

      <nav className="docs-next" aria-label="Next steps">
        <span>Next:</span>
        <Link href="/docs/api">API reference</Link>
        <Link href="/docs/personalize">Personalize</Link>
      </nav>
    </>
  );
}
