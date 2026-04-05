# xprompt Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a composable prompt snippet system with CLI tool (`xprompt`) and web UI (`/prompt`).

**Architecture:** Two-layer snippet system (atoms + composites) stored as markdown with YAML frontmatter. CLI owns all parsing logic and generates `catalog.json`. Web UI is an independent Vite multi-page sub-app consuming the pre-built JSON.

**Tech Stack:** TypeScript, Node.js (CLI via tsx), React 19, Vite multi-page, gray-matter (frontmatter parsing)

**Spec:** `docs/superpowers/specs/2026-04-05-xprompt-design.md`

---

## Chunk 1: CLI Core — Parser, Resolver, and Build Command

### Task 1: Project scaffolding and dependencies

**Files:**
- Create: `tools/xprompt/package.json`
- Create: `tools/xprompt/tsconfig.json`
- Create: `tools/xprompt/src/types.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Create `tools/xprompt/package.json`**

```json
{
  "name": "xprompt",
  "version": "0.1.0",
  "private": true,
  "type": "module"
}
```

- [ ] **Step 2: Create `tools/xprompt/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `tools/xprompt/src/types.ts`**

```typescript
export interface AtomSnippet {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  content: string;
}

export interface CompositeSnippet {
  id: string;
  name: string;
  includes: string[];
  tags: string[];
  description: string;
  content: string;
  composed: string;
}

export interface Catalog {
  atoms: AtomSnippet[];
  composites: CompositeSnippet[];
}
```

- [ ] **Step 4: Install gray-matter dependency**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io && pnpm add -D gray-matter
```

gray-matter is used by the CLI (run via tsx) to parse YAML frontmatter from markdown files. It's a devDependency since it's only used at build time.

- [ ] **Step 5: Append to `.gitignore`**

Add these lines at the end of `.gitignore`:

```
# xprompt
prompts/catalog.json
.superpowers/
```

- [ ] **Step 6: Commit**

```bash
git add tools/xprompt/package.json tools/xprompt/tsconfig.json tools/xprompt/src/types.ts .gitignore
git commit -m "feat(xprompt): scaffold CLI project with types"
```

---

### Task 2: Parser module

**Files:**
- Create: `tools/xprompt/src/parser.ts`

The parser reads a markdown file, extracts YAML frontmatter via gray-matter, validates required fields, and returns a typed snippet object.

- [ ] **Step 1: Create `tools/xprompt/src/parser.ts`**

```typescript
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { AtomSnippet, CompositeSnippet } from './types.js';

interface RawFrontmatter {
  id?: string;
  name?: string;
  category?: string;
  tags?: string[];
  description?: string;
  includes?: string[];
}

function validateRequired(
  fields: Record<string, unknown>,
  required: string[],
  filePath: string,
): void {
  for (const field of required) {
    if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
      throw new Error(`Missing required field "${field}" in ${filePath}`);
    }
  }
}

export function parseAtom(filePath: string): AtomSnippet {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as RawFrontmatter;

  validateRequired(fm, ['id', 'name', 'category', 'description'], filePath);

  return {
    id: fm.id!,
    name: fm.name!,
    category: fm.category!,
    tags: fm.tags ?? [],
    description: fm.description!,
    content: content.trim(),
  };
}

export function parseComposite(filePath: string): CompositeSnippet {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as RawFrontmatter;

  validateRequired(fm, ['id', 'name', 'includes', 'description'], filePath);

  if (!Array.isArray(fm.includes) || fm.includes.length === 0) {
    throw new Error(`"includes" must be a non-empty array in ${filePath}`);
  }

  return {
    id: fm.id!,
    name: fm.name!,
    includes: fm.includes!,
    tags: fm.tags ?? [],
    description: fm.description!,
    content: content.trim(),
    composed: '', // filled by resolver
  };
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io && npx tsx --eval "import './tools/xprompt/src/parser.js'; console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add tools/xprompt/src/parser.ts
git commit -m "feat(xprompt): add markdown frontmatter parser"
```

---

### Task 3: Resolver module

**Files:**
- Create: `tools/xprompt/src/resolver.ts`

The resolver takes parsed atoms and composites, validates constraints (no composite-includes-composite, no unknown IDs, no duplicate IDs), and fills in the `composed` field.

- [ ] **Step 1: Create `tools/xprompt/src/resolver.ts`**

```typescript
import type { AtomSnippet, CompositeSnippet } from './types.js';

export function resolve(
  atoms: AtomSnippet[],
  composites: CompositeSnippet[],
): CompositeSnippet[] {
  // Check for duplicate IDs across all snippets
  const allIds = new Map<string, string>();
  for (const a of atoms) {
    if (allIds.has(a.id)) {
      throw new Error(`Duplicate snippet ID: "${a.id}" found in multiple files`);
    }
    allIds.set(a.id, 'atom');
  }
  for (const c of composites) {
    if (allIds.has(c.id)) {
      throw new Error(`Duplicate snippet ID: "${c.id}" found in multiple files`);
    }
    allIds.set(c.id, 'composite');
  }

  const atomMap = new Map(atoms.map((a) => [a.id, a]));

  return composites.map((composite) => {
    for (const refId of composite.includes) {
      const refType = allIds.get(refId);
      if (refType === undefined) {
        throw new Error(`Unknown atom ID: "${refId}" in composite "${composite.id}"`);
      }
      if (refType === 'composite') {
        throw new Error(
          `Composite cannot include another composite: "${refId}" in "${composite.id}"`,
        );
      }
    }

    const parts = composite.includes.map((id) => atomMap.get(id)!.content);
    if (composite.content) {
      parts.push(composite.content);
    }
    return { ...composite, composed: parts.join('\n\n') };
  });
}

export function composeByPick(atoms: AtomSnippet[], ids: string[]): string {
  const atomMap = new Map(atoms.map((a) => [a.id, a]));
  const parts: string[] = [];
  for (const id of ids) {
    const atom = atomMap.get(id);
    if (!atom) {
      throw new Error(`Unknown snippet ID: "${id}"`);
    }
    parts.push(atom.content);
  }
  return parts.join('\n\n');
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io && npx tsx --eval "import './tools/xprompt/src/resolver.js'; console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add tools/xprompt/src/resolver.ts
git commit -m "feat(xprompt): add snippet resolver with validation"
```

---

### Task 4: Catalog scanner

**Files:**
- Create: `tools/xprompt/src/catalog.ts`

Scans the `prompts/atoms/` and `prompts/composites/` directories, parses all `.md` files, validates, resolves composites, and returns a `Catalog` object.

- [ ] **Step 1: Create `tools/xprompt/src/catalog.ts`**

```typescript
import fs from 'node:fs';
import path from 'node:path';
import { parseAtom, parseComposite } from './parser.js';
import { resolve } from './resolver.js';
import type { Catalog } from './types.js';

function findMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

export function buildCatalog(promptsDir: string): Catalog {
  const atomsDir = path.join(promptsDir, 'atoms');
  const compositesDir = path.join(promptsDir, 'composites');

  const atoms = findMdFiles(atomsDir).map(parseAtom);
  const rawComposites = findMdFiles(compositesDir).map(parseComposite);
  const composites = resolve(atoms, rawComposites);

  return { atoms, composites };
}

export function writeCatalog(catalog: Catalog, outputPath: string): void {
  fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2), 'utf-8');
}
```

- [ ] **Step 2: Commit**

```bash
git add tools/xprompt/src/catalog.ts
git commit -m "feat(xprompt): add catalog scanner"
```

---

### Task 5: CLI entry point and build command

**Files:**
- Create: `tools/xprompt/src/cli.ts`
- Create: `tools/xprompt/src/commands/build.ts`

- [ ] **Step 1: Create `tools/xprompt/src/commands/build.ts`**

```typescript
import path from 'node:path';
import { buildCatalog, writeCatalog } from '../catalog.js';

export function runBuild(promptsDir: string): void {
  const catalog = buildCatalog(promptsDir);
  const outputPath = path.join(promptsDir, 'catalog.json');
  writeCatalog(catalog, outputPath);
  const total = catalog.atoms.length + catalog.composites.length;
  console.log(
    `Built catalog: ${catalog.atoms.length} atoms, ${catalog.composites.length} composites (${total} total) → ${outputPath}`,
  );
}
```

- [ ] **Step 2: Create `tools/xprompt/src/cli.ts`**

```typescript
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolve prompts/ relative to the repo root (tools/xprompt/src/ → ../../..)
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const PROMPTS_DIR = path.join(REPO_ROOT, 'prompts');

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'build': {
      const { runBuild } = await import('./commands/build.js');
      runBuild(PROMPTS_DIR);
      break;
    }
    case 'list': {
      const { runList } = await import('./commands/list.js');
      runList(PROMPTS_DIR, args.slice(1));
      break;
    }
    case 'show': {
      const { runShow } = await import('./commands/show.js');
      runShow(PROMPTS_DIR, args[1]);
      break;
    }
    case 'compose': {
      const { runCompose } = await import('./commands/compose.js');
      runCompose(PROMPTS_DIR, args.slice(1));
      break;
    }
    default:
      console.log(`xprompt — composable prompt snippet manager

Usage:
  xprompt build                          Generate catalog.json
  xprompt list [--type <type>] [--category <cat>] [--tag <tag>] [--json]
  xprompt show <id>                      Show snippet content
  xprompt compose <id>                   Output composed snippet
  xprompt compose --pick <id1> <id2>...  Compose from selected atoms`);
      if (command) {
        console.error(`\nUnknown command: ${command}`);
        process.exit(1);
      }
  }
}

main().catch((err: Error) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
```

- [ ] **Step 3: Create seed prompt snippets for testing**

Create `prompts/atoms/typography/font-preferences.md`:

```markdown
---
id: font-preferences
name: 字体偏好
category: typography
tags: [font, design, visual]
description: 排版字体选择偏好
---

- 非 sans-serif 字体优先
- 中文：Source Han Sans
- 英文：Inter, Open Sans
- Monospaced：Fira Code
```

Create `prompts/atoms/visual/color-palette.md`:

```markdown
---
id: color-palette
name: 配色偏好
category: visual
tags: [color, design, visual]
description: 颜色选取偏好
---

- 主色调偏好暖色系
- 背景使用低饱和度色彩
- 强调色使用高对比度
- 避免纯黑背景，使用深灰（如 #1a1a2e）
```

Create `prompts/composites/presentation.md`:

```markdown
---
id: presentation
name: 演示文稿制作
includes:
  - font-preferences
  - color-palette
tags: [presentation, design]
description: 制作演示文稿时的完整提示词
---

## 额外指导

- 每页内容不超过 3 个要点
- 使用 16:9 比例
- 关键数据用图表而非文字
```

- [ ] **Step 4: Test the build command**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io && npx tsx tools/xprompt/src/cli.ts build
```

Expected output: `Built catalog: 2 atoms, 1 composites (3 total) → /Users/rainx/OpenSourceProjects/rainx.github.io/prompts/catalog.json`

- [ ] **Step 5: Verify catalog.json content**

```bash
cat prompts/catalog.json | head -30
```

Verify the JSON contains 2 atoms, 1 composite with a correctly composed field.

- [ ] **Step 6: Commit**

```bash
git add tools/xprompt/src/cli.ts tools/xprompt/src/commands/build.ts prompts/atoms/ prompts/composites/
git commit -m "feat(xprompt): add CLI entry point, build command, and seed snippets"
```

---

## Chunk 2: CLI Commands — list, show, compose

### Task 6: List command

**Files:**
- Create: `tools/xprompt/src/commands/list.ts`

- [ ] **Step 1: Create `tools/xprompt/src/commands/list.ts`**

```typescript
import { buildCatalog } from '../catalog.js';
import type { AtomSnippet, CompositeSnippet } from '../types.js';

interface ListOptions {
  type?: 'atoms' | 'composites';
  category?: string;
  tag?: string;
  json: boolean;
}

function parseArgs(args: string[]): ListOptions {
  const opts: ListOptions = { json: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--type':
        opts.type = args[++i] as 'atoms' | 'composites';
        break;
      case '--category':
        opts.category = args[++i];
        break;
      case '--tag':
        opts.tag = args[++i];
        break;
      case '--json':
        opts.json = true;
        break;
    }
  }
  return opts;
}

export function runList(promptsDir: string, args: string[]): void {
  const opts = parseArgs(args);
  const catalog = buildCatalog(promptsDir);

  let atoms: AtomSnippet[] = opts.type === 'composites' ? [] : catalog.atoms;
  let composites: CompositeSnippet[] = opts.type === 'atoms' ? [] : catalog.composites;

  if (opts.category) {
    atoms = atoms.filter((a) => a.category === opts.category);
    // composites have no category field — skip filtering
  }

  if (opts.tag) {
    atoms = atoms.filter((a) => a.tags.includes(opts.tag!));
    composites = composites.filter((c) => c.tags.includes(opts.tag!));
  }

  if (opts.json) {
    console.log(JSON.stringify({ atoms, composites }, null, 2));
    return;
  }

  for (const a of atoms) {
    console.log(`  [ATOM]      ${a.id.padEnd(24)} ${a.name}  (${a.category})`);
  }
  for (const c of composites) {
    console.log(`  [COMPOSITE] ${c.id.padEnd(24)} ${c.name}  (${c.includes.length} snippets)`);
  }

  const total = atoms.length + composites.length;
  if (total === 0) {
    console.log('No snippets found.');
  }
}
```

- [ ] **Step 2: Test list command**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io
npx tsx tools/xprompt/src/cli.ts list
npx tsx tools/xprompt/src/cli.ts list --type atoms
npx tsx tools/xprompt/src/cli.ts list --category typography
npx tsx tools/xprompt/src/cli.ts list --json
```

- [ ] **Step 3: Commit**

```bash
git add tools/xprompt/src/commands/list.ts
git commit -m "feat(xprompt): add list command with filtering"
```

---

### Task 7: Show command

**Files:**
- Create: `tools/xprompt/src/commands/show.ts`

- [ ] **Step 1: Create `tools/xprompt/src/commands/show.ts`**

```typescript
import { buildCatalog } from '../catalog.js';

export function runShow(promptsDir: string, id: string): void {
  if (!id) {
    console.error('Usage: xprompt show <id>');
    process.exit(1);
  }

  const catalog = buildCatalog(promptsDir);

  const atom = catalog.atoms.find((a) => a.id === id);
  if (atom) {
    console.log(atom.content);
    return;
  }

  const composite = catalog.composites.find((c) => c.id === id);
  if (composite) {
    console.log(composite.composed);
    return;
  }

  console.error(`Unknown snippet ID: "${id}"`);
  process.exit(1);
}
```

- [ ] **Step 2: Test show command**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io
npx tsx tools/xprompt/src/cli.ts show font-preferences
npx tsx tools/xprompt/src/cli.ts show presentation
```

Verify: `show font-preferences` outputs just the atom content. `show presentation` outputs the full composed content (font-preferences + color-palette + extra guidance).

- [ ] **Step 3: Commit**

```bash
git add tools/xprompt/src/commands/show.ts
git commit -m "feat(xprompt): add show command"
```

---

### Task 8: Compose command

**Files:**
- Create: `tools/xprompt/src/commands/compose.ts`

- [ ] **Step 1: Create `tools/xprompt/src/commands/compose.ts`**

```typescript
import { buildCatalog } from '../catalog.js';
import { composeByPick } from '../resolver.js';

export function runCompose(promptsDir: string, args: string[]): void {
  if (args.length === 0) {
    console.error('Usage: xprompt compose <id> | xprompt compose --pick <id1> <id2>...');
    process.exit(1);
  }

  const catalog = buildCatalog(promptsDir);

  if (args[0] === '--pick') {
    const ids = args.slice(1);
    if (ids.length === 0) {
      console.error('Usage: xprompt compose --pick <id1> <id2>...');
      process.exit(1);
    }
    console.log(composeByPick(catalog.atoms, ids));
    return;
  }

  const id = args[0];
  const composite = catalog.composites.find((c) => c.id === id);
  if (composite) {
    console.log(composite.composed);
    return;
  }

  // Also allow composing a single atom
  const atom = catalog.atoms.find((a) => a.id === id);
  if (atom) {
    console.log(atom.content);
    return;
  }

  console.error(`Unknown snippet ID: "${id}"`);
  process.exit(1);
}
```

- [ ] **Step 2: Test compose command**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io
npx tsx tools/xprompt/src/cli.ts compose presentation
npx tsx tools/xprompt/src/cli.ts compose --pick font-preferences color-palette
```

- [ ] **Step 3: Commit**

```bash
git add tools/xprompt/src/commands/compose.ts
git commit -m "feat(xprompt): add compose command"
```

---

### Task 9: Add npm scripts to root package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add xprompt scripts to root `package.json`**

Add these entries to the `"scripts"` section:

```json
"predev": "tsx tools/xprompt/src/cli.ts build",
"prebuild": "tsx tools/xprompt/src/cli.ts build",
"xprompt": "tsx tools/xprompt/src/cli.ts"
```

Note: `prebuild` should be added but the existing `"predeploy": "pnpm build"` chain means deploy will also trigger `prebuild` → `xprompt build` automatically.

- [ ] **Step 2: Test the script**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io && pnpm xprompt list
```

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat(xprompt): add npm scripts for CLI integration"
```

---

## Chunk 3: Web UI — Prompt Sub-App

### Task 10: Web sub-app entry point and Vite config

**Files:**
- Create: `prompt/index.html` (project root level, so Vite outputs to `dist/prompt/index.html`)
- Create: `src/prompt/main.tsx`
- Create: `src/prompt/types.ts`
- Modify: `vite.config.ts`

Note: The entry HTML lives at `prompt/index.html` (project root), not inside `src/`, so Vite produces `dist/prompt/index.html` — matching the deployment URL `www.rainx.cc/prompt`.

- [ ] **Step 1: Create `prompt/index.html`**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>xprompt — Prompt Snippets</title>
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/src/assets/favicon-32x32.png"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/prompt/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `src/prompt/types.ts`**

```typescript
export interface AtomSnippet {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  content: string;
}

export interface CompositeSnippet {
  id: string;
  name: string;
  includes: string[];
  tags: string[];
  description: string;
  content: string;
  composed: string;
}

export interface Catalog {
  atoms: AtomSnippet[];
  composites: CompositeSnippet[];
}
```

- [ ] **Step 3: Create `src/prompt/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 4: Modify `vite.config.ts`**

Update the Vite config to add the prompt sub-app as a second entry point. Use the `fileURLToPath` + `import.meta.url` pattern for ESM compatibility (consistent with `cli.ts`):

```typescript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        prompt: path.resolve(__dirname, 'prompt/index.html'),
      },
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-dom/client'],
          'vendor-motion': ['motion'],
        },
      },
    },
  },
});
```

- [ ] **Step 5: Ensure `catalog.json` exists for import**

Run: `pnpm xprompt build`

- [ ] **Step 6: Commit**

```bash
git add prompt/index.html src/prompt/main.tsx src/prompt/types.ts vite.config.ts
git commit -m "feat(prompt-web): add sub-app entry point and Vite multi-page config"
```

---

### Task 11: Main App component with layout

**Files:**
- Create: `src/prompt/app.tsx`
- Create: `src/prompt/app.module.css`

Note: The spec lists separate component files (`search-bar.tsx`, `snippet-list.tsx`, etc.). For this small UI, we intentionally keep everything in a single `app.tsx` to avoid premature decomposition. The spec's component list serves as logical sections within the file. We can extract later if the file grows.

- [ ] **Step 1: Create `src/prompt/app.module.css`**

```css
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1a1a2e;
  color: #e0e0e0;
  font-family: 'Inter', 'Source Han Sans', sans-serif;
}

.header {
  padding: 16px 24px;
  border-bottom: 1px solid #16213e;
  flex-shrink: 0;

  & h1 {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  & span {
    font-size: 12px;
    color: #888;
    margin-left: 8px;
  }
}

.body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 320px;
  border-right: 1px solid #16213e;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.searchBox {
  padding: 12px 16px;
  border-bottom: 1px solid #16213e;
  flex-shrink: 0;

  & input {
    width: 100%;
    background: #16213e;
    border: 1px solid #0f3460;
    border-radius: 6px;
    padding: 8px 12px;
    color: #e0e0e0;
    font-size: 13px;
    outline: none;
    box-sizing: border-box;

    &::placeholder {
      color: #666;
    }

    &:focus {
      border-color: #e94560;
    }
  }
}

.filters {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid #16213e;
  flex-shrink: 0;
}

.filterTag {
  background: #16213e;
  color: #888;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  border: none;
  transition: all 0.15s;

  &:hover {
    color: #ccc;
  }
}

.filterTagActive {
  background: #0f3460;
  color: #e94560;
}

.snippetList {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.snippetItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: #16213e;
  }
}

.snippetItemActive {
  background: #0f3460;
  border-left: 2px solid #e94560;
}

.snippetLabel {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 3px;
}

.badgeAtom {
  color: #e94560;
  background: rgba(233, 69, 96, 0.1);
}

.badgeComposite {
  color: #53d769;
  background: rgba(83, 215, 105, 0.1);
}

.snippetName {
  font-size: 13px;
  color: #ccc;
}

.snippetMeta {
  font-size: 11px;
  color: #555;
}

.preview {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.previewEmpty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #555;
  font-size: 14px;
}

.previewHeader {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #16213e;
}

.previewTitle {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
}

.previewDesc {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.previewIncludes {
  font-size: 11px;
  color: #666;
  margin-top: 8px;
}

.previewContent {
  font-size: 14px;
  line-height: 1.7;
  color: #ccc;
  white-space: pre-wrap;
  font-family: 'Fira Code', monospace;
}

.copyButton {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #e94560;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s;

  &:hover {
    background: #c73652;
  }
}

.copySuccess {
  background: #53d769;

  &:hover {
    background: #45b85a;
  }
}

.emptyMessage {
  text-align: center;
  padding: 32px 16px;
  color: #555;
  font-size: 13px;
}

.typeFilters {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  border-bottom: 1px solid #16213e;
  flex-shrink: 0;
}
```

- [ ] **Step 2: Create `src/prompt/app.tsx`**

```tsx
import { useCallback, useMemo, useState } from 'react';
import catalog from '../../prompts/catalog.json';
import styles from './app.module.css';
import type { AtomSnippet, Catalog, CompositeSnippet } from './types';

type Snippet =
  | (AtomSnippet & { type: 'atom' })
  | (CompositeSnippet & { type: 'composite' });

const data = catalog as Catalog;

function getAllSnippets(): Snippet[] {
  const atoms: Snippet[] = data.atoms.map((a) => ({ ...a, type: 'atom' }));
  const composites: Snippet[] = data.composites.map((c) => ({
    ...c,
    type: 'composite',
  }));
  return [...atoms, ...composites];
}

function getCategories(): string[] {
  const cats = new Set(data.atoms.map((a) => a.category));
  return Array.from(cats).sort();
}

export function App() {
  const allSnippets = useMemo(getAllSnippets, []);
  const categories = useMemo(getCategories, []);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'all' | 'atom' | 'composite'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    let result = allSnippets;
    if (activeType !== 'all') {
      result = result.filter((s) => s.type === activeType);
    }
    if (activeCategory) {
      result = result.filter(
        (s) => s.type === 'atom' && s.category === activeCategory,
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [allSnippets, search, activeCategory, activeType]);

  const selected = useMemo(
    () => allSnippets.find((s) => s.id === selectedId) ?? null,
    [allSnippets, selectedId],
  );

  const getDisplayContent = useCallback((snippet: Snippet): string => {
    if (snippet.type === 'composite') return snippet.composed;
    return snippet.content;
  }, []);

  const handleCopy = useCallback(async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(getDisplayContent(selected));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selected, getDisplayContent]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          xprompt<span>Composable Prompt Snippets</span>
        </h1>
      </div>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search snippets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.typeFilters}>
            {(['all', 'atom', 'composite'] as const).map((t) => (
              <button
                key={t}
                className={`${styles.filterTag} ${activeType === t ? styles.filterTagActive : ''}`}
                onClick={() => setActiveType(t)}
              >
                {t === 'all' ? 'all' : t === 'atom' ? 'atoms' : 'composites'}
              </button>
            ))}
          </div>
          <div className={styles.filters}>
            <button
              className={`${styles.filterTag} ${activeCategory === null ? styles.filterTagActive : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              all categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterTag} ${activeCategory === cat ? styles.filterTagActive : ''}`}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={styles.snippetList}>
            {filtered.length === 0 ? (
              <div className={styles.emptyMessage}>No snippets found</div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  className={`${styles.snippetItem} ${selectedId === s.id ? styles.snippetItemActive : ''}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <div className={styles.snippetLabel}>
                    <span
                      className={`${styles.badge} ${s.type === 'atom' ? styles.badgeAtom : styles.badgeComposite}`}
                    >
                      {s.type}
                    </span>
                    <span className={styles.snippetName}>{s.name}</span>
                  </div>
                  <span className={styles.snippetMeta}>
                    {s.type === 'atom'
                      ? s.category
                      : `${s.includes.length} snippets`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className={styles.preview}>
          {!selected ? (
            <div className={styles.previewEmpty}>
              点击左侧片段预览内容
            </div>
          ) : (
            <>
              <div className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>{selected.name}</h2>
                <p className={styles.previewDesc}>{selected.description}</p>
                {selected.type === 'composite' && (
                  <div className={styles.previewIncludes}>
                    includes: {selected.includes.join(', ')}
                  </div>
                )}
              </div>
              <div className={styles.previewContent}>
                {getDisplayContent(selected)}
              </div>
              <button
                className={`${styles.copyButton} ${copied ? styles.copySuccess : ''}`}
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io && pnpm build
```

Expected: Build succeeds, `dist/prompt/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add src/prompt/app.tsx src/prompt/app.module.css
git commit -m "feat(prompt-web): add main app component with search, filter, and preview"
```

---

## Chunk 4: Integration and Polish

### Task 13: Update tsconfig to exclude tools directory from main build

**Files:**
- Modify: `tsconfig.json`

The main `tsconfig.json` includes `"src"` but `tsc` in the build step shouldn't compile `tools/`. Since `tools/` is outside `src/`, this should already work. However, the prompt sub-app imports `catalog.json` from `prompts/` which is outside `src/`. Verify and fix if needed.

- [ ] **Step 1: Check if `pnpm build` (tsc step) passes cleanly**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io && npx tsc --noEmit
```

If there are errors related to imports from outside `src/`, update `tsconfig.json` to add `"prompts"` to the `include` array, or use `resolveJsonModule` to handle it.

- [ ] **Step 2: Fix any TypeScript errors and commit**

```bash
git add tsconfig.json
git commit -m "fix: resolve TypeScript config for prompt sub-app"
```

---

### Task 14: Final integration test

**Files:** (no new files)

- [ ] **Step 1: Clean build from scratch**

```bash
cd /Users/rainx/OpenSourceProjects/rainx.github.io
rm -f prompts/catalog.json
pnpm build
```

Verify: `prebuild` runs `xprompt build`, generates catalog, then Vite builds both apps.

- [ ] **Step 2: Test CLI commands**

```bash
pnpm xprompt list
pnpm xprompt show font-preferences
pnpm xprompt show presentation
pnpm xprompt compose presentation
pnpm xprompt compose --pick font-preferences color-palette
```

All should produce correct output.

- [ ] **Step 3: Test web UI**

```bash
pnpm preview
```

Visit `http://localhost:4173/prompt/`:
- Verify snippets appear in the left panel
- Verify clicking a snippet shows preview on the right
- Verify search filtering works
- Verify type filter (atoms/composites/all) works
- Verify Copy button works
- Verify main site at `http://localhost:4173/` still works normally

- [ ] **Step 4: Verify output structure**

```bash
ls dist/prompt/
```

Expected: `dist/prompt/index.html` exists (correct path for GitHub Pages deployment).

- [ ] **Step 5: Final commit if any last fixes were needed**
