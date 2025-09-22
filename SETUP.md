# Venue Simulator – Initial Setup

This guide (plus the included scripts) bootstraps a **Vite + React + TypeScript** app with **ESLint + Prettier** in a clean structure:

```
venue-simulator/
├─ .vscode/
│  └─ settings.json
├─ venue-simulator.code-workspace   (optional)
└─ my-app/
   ├─ package.json
   ├─ vite.config.ts
   ├─ tsconfig.json
   ├─ .eslintrc.cjs
   └─ src/ …
```

> **Assumptions**
>
> - You have **Node.js LTS (≥18, recommended 20)** installed.
> - You run these from the **repo root** (`venue-simulator`).
> - Package manager: **npm** (adjust to pnpm/yarn if you prefer).

---

## Quick Start (Windows PowerShell)

From the repository root:

```powershell
# 1) Run the bootstrap script (creates my-app if missing, installs deps, writes configs)
./scripts/setup.ps1

# 2) Start developing
cd my-app
npm run dev
```

> If PowerShell blocks scripts, allow current-user scripts:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

---

## Quick Start (Bash / Git Bash / WSL / macOS)

```bash
# make executable once
chmod +x scripts/setup.sh

# run
./scripts/setup.sh

# develop
cd my-app
npm run dev
```

---

## What the scripts do

1. **Create `my-app/`** (if it doesn’t exist) via Vite’s template: `react-ts`.
2. **Install ESLint & Prettier dev dependencies.**
3. **Create configs**: `.eslintrc.cjs`, `.prettierrc`, and root `.vscode/settings.json`.
4. **Add npm scripts** to `my-app/package.json`: `lint`, `format`.
5. (Optional) **Create** `venue-simulator.code-workspace` at repo root.

---

## Files the scripts create / update

### 1) `.vscode/settings.json` (at repo root)

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

### 2) `my-app/.eslintrc.cjs`

```js
module.exports = {
  root: true,
  env: { browser: true, es2023: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  plugins: ["react", "react-hooks", "@typescript-eslint", "react-refresh"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
```

### 3) `my-app/.prettierrc`

```json
{
  "singleQuote": false,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

### 4) `my-app/package.json` (scripts section added)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier -w ."
  }
}
```

### 5) (Optional) `venue-simulator.code-workspace`

```json
{
  "folders": [{ "path": "." }],
  "settings": {
    "editor.formatOnSave": true,
    "files.exclude": { "**/node_modules": true, "**/dist": true }
  }
}
```

---

## Scripts

### `scripts/setup.ps1` (Windows PowerShell)

> Save as `scripts/setup.ps1` at the repo root.

```powershell
Param(
  [string]$AppDir = "my-app"
)

# Ensure scripts folder exists
$script:Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $script:Root
Set-Location $RepoRoot

Write-Host "Repo root:" (Get-Location)

# 1) Create Vite app if missing
if (-Not (Test-Path "$AppDir/package.json")) {
  Write-Host "Creating Vite + React + TS app in '$AppDir'..."
  npm create vite@latest $AppDir -- --template react-ts
}

# 2) Install base deps
Set-Location $AppDir
Write-Host "Installing project dependencies..."
npm install

Write-Host "Installing ESLint + Prettier dev dependencies..."
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier eslint-config-prettier

# 3) Write ESLint config
$eslintPath = ".eslintrc.cjs"
if (-Not (Test-Path $eslintPath)) {
  @'
module.exports = {
  root: true,
  env: { browser: true, es2023: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  plugins: ["react", "react-hooks", "@typescript-eslint", "react-refresh"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
  }
};
'@ | Out-File -Encoding UTF8 $eslintPath
}

# 4) Write Prettier config
$prettierPath = ".prettierrc"
if (-Not (Test-Path $prettierPath)) {
  '{
  "singleQuote": false,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
' | Out-File -Encoding UTF8 $prettierPath
}

# 5) Patch package.json scripts
$pkgPath = "package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
if (-Not $pkg.scripts) { $pkg | Add-Member -MemberType NoteProperty -Name scripts -Value (@{}) }
$pkg.scripts.dev = "vite"
$pkg.scripts.build = "vite build"
$pkg.scripts.preview = "vite preview"
$pkg.scripts.lint = "eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0"
$pkg.scripts.format = "prettier -w ."
$pkg | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 $pkgPath

# 6) Ensure root VS Code settings
Set-Location ..
New-Item -ItemType Directory -Force -Path ".vscode" | Out-Null
$settingsPath = ".vscode/settings.json"
@'
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
'@ | Out-File -Encoding UTF8 $settingsPath

# 7) Optional: write workspace file if missing
$ws = "venue-simulator.code-workspace"
if (-Not (Test-Path $ws)) {
  '{
  "folders": [{ "path": "." }],
  "settings": {
    "editor.formatOnSave": true,
    "files.exclude": { "**/node_modules": true, "**/dist": true }
  }
}
' | Out-File -Encoding UTF8 $ws
}

Write-Host "\n✅ Setup complete. Next:"
Write-Host "   cd $AppDir"
Write-Host "   npm run dev"
```

---

### `scripts/setup.sh` (Bash / Git Bash / WSL / macOS)

> Save as `scripts/setup.sh` at the repo root and `chmod +x scripts/setup.sh` once.

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR=${1:-"my-app"}

# 1) Create Vite app if missing
if [ ! -f "$APP_DIR/package.json" ]; then
  echo "Creating Vite + React + TS app in '$APP_DIR'..."
  npm create vite@latest "$APP_DIR" -- --template react-ts
fi

# 2) Install deps
pushd "$APP_DIR" >/dev/null
npm install
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier eslint-config-prettier

# 3) ESLint config
if [ ! -f .eslintrc.cjs ]; then
  cat > .eslintrc.cjs <<'EOF'
module.exports = {
  root: true,
  env: { browser: true, es2023: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  plugins: ["react", "react-hooks", "@typescript-eslint", "react-refresh"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
  }
};
EOF
fi

# 4) Prettier config
if [ ! -f .prettierrc ]; then
  cat > .prettierrc <<'EOF'
{
  "singleQuote": false,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
EOF
fi

# 5) Patch package.json scripts using Node
node - <<'NODE'
const fs = require('fs');
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = Object.assign({}, pkg.scripts, {
  dev: 'vite',
  build: 'vite build',
  preview: 'vite preview',
  lint: 'eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0',
  format: 'prettier -w .'
});
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
NODE

popd >/dev/null

# 6) Root VS Code settings
mkdir -p .vscode
cat > .vscode/settings.json <<'EOF'
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
EOF

# 7) Optional workspace file
if [ ! -f venue-simulator.code-workspace ]; then
  cat > venue-simulator.code-workspace <<'EOF'
{
  "folders": [{ "path": "." }],
  "settings": {
    "editor.formatOnSave": true,
    "files.exclude": { "**/node_modules": true, "**/dist": true }
  }
}
EOF
fi

echo "\n✅ Setup complete. Next steps:"
echo "   cd $APP_DIR"
echo "   npm run dev"
```

---

## After running the script

- Open **VS Code** using `venue-simulator.code-workspace` _or_ the repo folder.
- Install extensions: **ESLint** and **Prettier – Code formatter**.
- In the VS Code terminal:

```powershell
cd my-app
npm run dev
```

You now have:

- **Live dev** with Vite + React + TS
- **Auto-format on save** (Prettier)
- **ESLint warnings on save** (and auto-fix where possible)

---

## Troubleshooting

- **ESLint status icon is gray / not running:** Click the _ESLint_ status in the VS Code status bar and allow the workspace; or run `ESLint: Show Output`.
- **PowerShell execution policy blocks the script:** Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once.
- **Node version issue:** Ensure `node -v` is ≥ 18 (20.x recommended).
- **Port in use:** Start dev server on a different port: `npm run dev -- --port 5174`.
