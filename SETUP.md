# 🎛 Venue Simulator – Initial Setup

This guide bootstraps a **Vite + React + TypeScript** project with **ESLint + Prettier** and a working **Vitest** setup for component testing.

```
venue-simulator/
├─ .vscode/
│  └─ settings.json
├─ venue-simulator.code-workspace   (optional, for VS Code)
└─ my-app/
   ├─ package.json
   ├─ vite.config.ts
   ├─ vitest.config.ts
   ├─ tsconfig.json
   ├─ .eslintrc.cjs
   ├─ src/
   │  ├─ App.tsx
   │  ├─ main.tsx
   │  └─ setupTests.ts
   └─ __tests__/
      └─ App.test.tsx
```

---

## 📋 Prerequisites

- **Node.js LTS ≥ 18** (20 recommended)
- **npm** (or pnpm/yarn if you prefer)
- Run commands from the **repo root** (`venue-simulator`)

---

## ⚡ Quick Start

### 🪟 Windows PowerShell

```powershell
# 1) Bootstrap the project
./scripts/setup.ps1

# 2) Start development server
cd my-app
npm run dev
```

> 💡 If PowerShell blocks scripts, enable execution for the current user:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

---

### 🐧 macOS / Linux / Git Bash / WSL

```bash
# One-time: make script executable
chmod +x scripts/setup.sh

# Run setup
./scripts/setup.sh

# Start development server
cd my-app
npm run dev
```

---

## 🛠 What the Setup Scripts Do

1. **Create** `my-app/` using Vite’s `react-ts` template (if missing)
2. **Install** dependencies
3. **Configure** ESLint + Prettier with recommended rules
4. **Patch** `package.json` with `lint` and `format` scripts
5. **Add** VS Code workspace settings and optional `.code-workspace` file

---

## 🧪 Vitest Setup (Testing)

We use **Vitest** + **React Testing Library** for unit/component tests.

### 1️⃣ Install Dev Dependencies

From inside `my-app`:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 2️⃣ Create `vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    include: ["**/*.{test,spec}.{ts,tsx}"],
  },
});
```

### 3️⃣ Add `setupTests.ts`

`src/setupTests.ts`:

```ts
import "@testing-library/jest-dom";
```

### 4️⃣ Add a First Test

Create `__tests__/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { vi, test, expect } from "vitest";
import App from "../src/App";

vi.useFakeTimers();

test("renders heading and counts up", () => {
  render(<App />);
  expect(screen.getByText("This is a test")).toBeInTheDocument();
  expect(screen.getByText(/00:00/)).toBeInTheDocument();
  vi.advanceTimersByTime(3000);
  expect(screen.getByText(/00:03/)).toBeInTheDocument();
});
```

### 5️⃣ Run the Tests

```bash
npm run test
```

Expected output:

```
✓ __tests__/App.test.tsx  (1)
  ✓ renders heading and counts up
```

You can also run an interactive UI mode:

```bash
npm run test -- --ui
```

---

## 📂 Key Files Created/Updated

### VS Code Settings (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "typescript", "typescriptreact"],
  "eslint.workingDirectories": [
    { "directory": "my-app", "changeProcessCWD": true }
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true
  }
}
```

_(...other file snippets remain the same as before for ESLint, Prettier, package scripts, etc.)_

---

## 🚦 After Setup

- Open the repo in **VS Code** (use `venue-simulator.code-workspace`)
- Install recommended extensions:
  - **ESLint**
  - **Prettier – Code Formatter**
- Start dev server: `npm run dev`
- Run tests: `npm run test`

✅ You now have:

- **Vite + React + TS** scaffold
- **ESLint + Prettier** auto-formatting
- **Vitest** ready for component/unit tests
- **First working test** for `App.tsx`

---

## 🧰 Troubleshooting

| Issue                    | Fix                                                                               |
| ------------------------ | --------------------------------------------------------------------------------- |
| ESLint icon is gray      | Click the **ESLint** status in VS Code status bar and enable it for the workspace |
| PowerShell blocks script | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`            |
| Node version too old     | `node -v` must be ≥ 18 (20 recommended)                                           |
| Tests not found          | Ensure `vitest.config.ts` includes `"**/*.{test,spec}.{ts,tsx}"` in `include`     |
