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
