# Venue Simulation

A browser-based simulation and analytical tool to assess the feasibility and operations of running a restaurant/bar in different formats. The project focuses on number-crunching, reproducible stochastic simulations, and clear UI-driven dashboards (financials, staffing, bar operations, events) rather than a graphical game.

## Goals

- Provide a reproducible simulation engine (seeded randomness) that runs in the browser for quick, interactive experiments.
- Present results as charts, tables and compact UI controls (tabs for Financial, Bar, Staff, Events, Simulation).
- Allow export/import of scenarios and parameters for repeated experiments.
- Keep the UI simple and accessible: no heavy 3D graphics or game-like rendering — mostly charts, tables and controls.

## High-level design notes

- Runtime: primarily client-side (runs in the browser). We will consider Web Workers and WASM for CPU-heavy tasks. If datasets or heavy computations exceed browser memory/CPU, we will add a small backend service (Node.js or Python) and run simulations server-side.
- UI: multi-tab layout. Each tab focuses on a domain model and exposes parameters that feed the simulation engine.
- Simulation engine: deterministic given a seed. Uses PRNG with explicit seed so experiments are reproducible.
- Data/visuals: charts and tables (e.g., Chart.js, D3, or lightweight chart library). CSV export and JSON scenario save/load supported.

## Tech options (short)

- Vite + React + TypeScript — my recommended default for familiarity, editor support and scalability.
- Vite + Svelte — very concise reactive code and low boilerplate; great for small UI-heavy apps.
- Plain HTML + vanilla JS — fastest to start if you want zero build step; harder to scale.

Performance helpers

- Use Web Workers to offload simulation loops from the main thread.
- Consider WebAssembly for hot-number-crunching if JS performance becomes a bottleneck.
- For server-side compute: a small API (Node/Express or Python/Flask) can accept scenario params and return simulation results.

## Requirements (from our conversation)

1. Runs in browser with simple UI controls (tabs, inputs, charts).
2. Multiple tabs: Financial, Bar, Staff, Events, Simulation.
3. Simulation uses seeded randomness for reproducibility.
4. Expect heavy number-crunching; support either in-browser compute (with Web Workers/WASM) or optional backend compute if needed.
5. Step-by-step development: start with a minimal scaffold and a tiny, working simulation, then expand each domain tab.

## Project TODO (short-term roadmap)

1. Project set-up and decisions
	- Choose stack (React/TS vs Svelte vs vanilla).
	- Create repository scaffold (Vite config, package.json, dev scripts).
2. Minimal runnable prototype (v0)
	- Single-page app with a tab bar (Financial, Bar, Staff, Events, Simulation).
	- Implement a tiny, deterministic simulation kernel (seeded PRNG) that generates a simple time-series (e.g., customer arrivals and service times).
	- Display a simple chart and parameter controls; allow start/stop/reset.
3. Domain modeling
	- Financial model: costs, revenues, ticket/cover charges, drink prices.
	- Staff model: shifts, capacity, service rates, wages.
	- Bar model: queue at bar, bartenders, throughput.
	- Events model: scheduled events, attendance profiles, ticketed vs walk-in attendees.
4. Performance and scaling
	- Move simulation into a Web Worker; profile CPU usage.
	- If needed, prototype a server compute API for large batch simulations.
5. UX, charts and exports
	- Add charts (time-series, histograms, summary metrics), scenario save/load, and CSV/JSON export.
6. Testing and reproducibility
	- Add deterministic tests for the PRNG and key model components.
7. Documentation and examples
	- Tutorials: how to create scenarios and interpret outputs.

## Immediate next steps (what I can do now)

1. Help you choose a stack (I can recommend one based on your comfort with TypeScript/React).
2. Scaffold a minimal runnable prototype (index.html, a UI with tabs, a seeded PRNG, a simple simulation loop and a chart).
3. Implement the simulation tab with a seeded arrival process and a chart so you can interact and see results.

Tell me which stack you'd like (or say "recommend for me"), and whether you want TypeScript. Once you confirm, I'll proceed to scaffold the minimal runnable prototype.

---

Last updated: 2025-09-22
