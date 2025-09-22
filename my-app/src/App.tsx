import React, { useEffect, useMemo, useRef, useState, type JSX } from "react";
import Finance from "./Finance";
import Restaurant from "./Restaurant";
import Simulation from "./Simulation";

type TabId = "finance" | "restaurant" | "simulation";

const TABS: { id: TabId; label: string; render: () => JSX.Element }[] = [
  { id: "finance", label: "Finance", render: () => <Finance /> },
  { id: "restaurant", label: "Restaurant", render: () => <Restaurant /> },
  { id: "simulation", label: "Simulation", render: () => <Simulation /> },
];

export default function App() {
  // initial tab from hash
  const initial: TabId = (() => {
    const fromHash = (
      typeof window !== "undefined" ? window.location.hash.replace("#", "") : ""
    ) as TabId;
    return TABS.some((t) => t.id === fromHash) ? fromHash : "finance";
  })();

  const [active, setActive] = useState<TabId>(initial);

  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    finance: null,
    restaurant: null,
    simulation: null,
  });

  // keep hash in sync
  useEffect(() => {
    if (window.location.hash !== `#${active}`) {
      history.replaceState(null, "", `#${active}`);
    }
  }, [active]);

  // respond to hash changes (back/forward or deep links)
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "") as TabId;
      if (TABS.some((t) => t.id === h)) setActive(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const activeIndex = useMemo(
    () => TABS.findIndex((t) => t.id === active),
    [active]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    let nextIndex = activeIndex;
    if (e.key === "ArrowLeft")
      nextIndex = (activeIndex - 1 + TABS.length) % TABS.length;
    if (e.key === "ArrowRight") nextIndex = (activeIndex + 1) % TABS.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = TABS.length - 1;
    const next = TABS[nextIndex].id;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const styles = {
    wrapper: {
      fontFamily: "system-ui, sans-serif",
      padding: "20px",
      maxWidth: 900,
      margin: "0 auto",
    },
    titleRow: {
      display: "flex",
      alignItems: "baseline",
      gap: 12,
      marginBottom: 8,
    },
    timer: { fontVariantNumeric: "tabular-nums" as const, color: "#666" },
    tablist: {
      display: "flex",
      gap: 8,
      borderBottom: "1px solid #ddd",
      paddingBottom: 8,
      marginBottom: 16,
    } as const,
    tab: (selected: boolean): React.CSSProperties => ({
      appearance: "none",
      padding: "10px 14px",
      borderRadius: "8px 8px 0 0",
      cursor: "pointer",
      fontWeight: 600,
      outlineOffset: 2,
      ...(selected
        ? {
            background: "#f5f5f5",
            border: "1px solid #ddd",
            borderBottom: "1px solid #f5f5f5",
          }
        : { color: "#555" }),
    }),
    panel: {
      border: "1px solid #ddd",
      borderRadius: "0 8px 8px 8px",
      padding: 16,
      background: "white",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.titleRow}>
        <h1 style={{ margin: 0 }}>This is a test</h1>
      </div>

      <div
        role="tablist"
        aria-label="Primary Tabs"
        style={styles.tablist}
        onKeyDown={handleKeyDown}
      >
        {TABS.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`${tab.id}-tab`}
              aria-selected={selected}
              aria-controls={`${tab.id}-panel`}
              tabIndex={selected ? 0 : -1}
              style={styles.tab(selected)}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <section
            key={tab.id}
            role="tabpanel"
            id={`${tab.id}-panel`}
            aria-labelledby={`${tab.id}-tab`}
            hidden={!selected}
            style={styles.panel}
          >
            {tab.render()}
          </section>
        );
      })}
    </div>
  );
}
