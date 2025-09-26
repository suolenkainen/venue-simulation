import { useEffect, useState, type JSX } from "react";
import Clients from "./Clientel";
import MainSimulation from "./MainSimulation";
import Shows from "./Shows";

import "./global.css";

type TabId = "mainSimulation" | "clients" | "shows";

const TABS: { id: TabId; label: string; render: () => JSX.Element }[] = [
  {
    id: "mainSimulation",
    label: "Main Simulation",
    render: () => <MainSimulation />,
  },
  { id: "clients", label: "Clients", render: () => <Clients /> },
  {
    id: "shows",
    label: "Shows",
    render: () => <Shows />,
  },
];

export default function App() {
  // initial tab from hash
  const initial: TabId = (() => {
    const fromHash = (
      typeof window !== "undefined" ? window.location.hash.replace("#", "") : ""
    ) as TabId;
    return TABS.some((t) => t.id === fromHash) ? fromHash : "mainSimulation";
  })();

  const [active, setActive] = useState<TabId>(initial);

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

  const styles = {
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
  };

  return (
    <div className="tablist" role="tablist" aria-label="Primary Tabs">
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

      {TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <section
            className="tab-panel"
            key={tab.id}
            role="tabpanel"
            id={`${tab.id}-panel`}
            aria-labelledby={`${tab.id}-tab`}
            hidden={!selected}
          >
            {tab.render()}
          </section>
        );
      })}
    </div>
  );
}
