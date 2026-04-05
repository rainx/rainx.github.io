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
