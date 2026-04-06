import { buildCatalog } from '../catalog.js';

export function runShow(promptsDir: string, id: string): void {
  if (!id) {
    // eslint-disable-next-line no-console
    console.error('Usage: xprompt show <id>');
    process.exit(1);
  }

  const catalog = buildCatalog(promptsDir);

  const atom = catalog.atoms.find((a) => a.id === id);
  if (atom) {
    // eslint-disable-next-line no-console
    console.log(atom.content);
    return;
  }

  const composite = catalog.composites.find((c) => c.id === id);
  if (composite) {
    // eslint-disable-next-line no-console
    console.log(composite.composed);
    return;
  }

  // eslint-disable-next-line no-console
  console.error(`Unknown snippet ID: "${id}"`);
  process.exit(1);
}
