# Venue Simulation

A browser-based simulation and analytical tool to assess the feasibility and operations of running a restaurant/bar in different formats.  
This project focuses on **number-crunching**, **reproducible stochastic simulations**, and **clear UI-driven dashboards** (financials, staffing, bar operations, events) rather than game-like rendering.

---

## Goals

- **Reproducible simulation engine** – seeded randomness so experiments can be repeated.
- **Interactive UI** – results shown as charts, tables, and compact controls.
- **Scenario management** – export/import of simulation parameters and results.
- **Lightweight & accessible** – focus on data and dashboards, not 3D graphics.

---

## Current Tech Stack

| Area          | Choice                             | Notes                                              |
| ------------- | ---------------------------------- | -------------------------------------------------- |
| Build Tool    | **Vite**                           | Fast dev server & bundler                          |
| Language      | **TypeScript**                     | Type safety & maintainability                      |
| UI Library    | **React**                          | Well-supported, scalable                           |
| Testing       | **Vitest** + React Testing Library | Unit/component tests, Jest-compatible APIs         |
| Styling       | (TBD)                              | Will add as UI grows (CSS modules, Tailwind, etc.) |
| Visualization | (Planned)                          | Will choose lightweight chart library later        |

---

## High-Level Design

- **Client-side runtime** – simulations run in browser; Web Workers considered for CPU-heavy loops.
- **Deterministic simulation engine** – explicit PRNG seed for reproducibility.
- **Tab-based UI** – Financial, Bar, Staff, Events, Simulation.
- **Data display** – charts & tables with CSV/JSON export.
- **Optional backend** – future addition if simulations need more compute or persistence.

---

## Current Status

✅ **Scaffolded Vite + React + TypeScript app**  
✅ **Minimal "App" page with ticking counter**  
✅ **Vitest + @testing-library/react working for unit/component tests**  
✅ **First passing test (`App.test.tsx`) validating counter increments**

---

## Project Roadmap (Short-Term)

1. **Simulation Kernel**

   - Build deterministic PRNG and basic time-series generator.
   - Replace counter demo with first real simulation (e.g. arrivals over time).

2. **UI Layout**

   - Implement tab bar: Financial, Bar, Staff, Events, Simulation.
   - Add parameter controls and start/stop buttons.

3. **Charts & Visualization**

   - Pick charting library (Recharts, Chart.js, or similar).
   - Display generated data as interactive charts.

4. **Testing & Reproducibility**
   - Add deterministic unit tests for PRNG and simulation outputs.
   - Expand test coverage using Vitest watch mode & coverage reports.
   - Unit tests and system tests are run separately as the mass grows.

---

## Testing

Tests live under `__tests__/`. Example:

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

test("00 renders heading", () => {
  render(<App />);

  // Assert that "This is a test" appears
  expect(screen.getByText("This is a test")).toBeInTheDocument();
});
```
