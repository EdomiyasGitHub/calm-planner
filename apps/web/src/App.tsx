import { useEffect, useState } from "react";
import { APP_NAME } from "@calm/core";
import { fetchHealth, type Health } from "./api";

type Status = { kind: "loading" } | { kind: "ok"; health: Health } | { kind: "offline" };

const TABS = ["Today", "Calendar", "Inbox", "Browse"] as const;

export function App() {
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then((health) => setStatus({ kind: "ok", health }))
      .catch(() => {
        if (!controller.signal.aborted) setStatus({ kind: "offline" });
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="shell">
      <header className="header">
        <h1>{APP_NAME}</h1>
        <p className="muted">Foundations build · Phase 0</p>
      </header>

      <main className="content">
        <section className="card" aria-live="polite">
          <h2>System check</h2>
          {status.kind === "loading" && <p className="muted">Checking the server…</p>}
          {status.kind === "offline" && <p className="warn">Server unreachable. You may be offline.</p>}
          {status.kind === "ok" && (
            <ul className="checks">
              <li>
                API <strong>{status.health.api}</strong> · {status.health.env}
              </li>
              <li className={status.health.db === "ok" ? "good" : "warn"}>
                Database {status.health.db === "ok" ? `ready (schema ${status.health.schemaVersion})` : "error"}
              </li>
            </ul>
          )}
        </section>
      </main>

      <nav className="tabs" aria-label="Main">
        {TABS.map((tab, i) => (
          <button key={tab} type="button" className="tab" aria-current={i === 0 ? "page" : undefined}>
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
