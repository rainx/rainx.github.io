import { buildCatalog } from '../catalog.js';
import { composeByPick } from '../resolver.js';

export function runCompose(promptsDir: string, args: string[]): void {
  if (args.length === 0) {
    // eslint-disable-next-line no-console
    console.error(
      'Usage: xprompt compose <id> | xprompt compose --pick <id1> <id2>...',
    );
    process.exit(1);
  }

  const catalog = buildCatalog(promptsDir);

  if (args[0] === '--pick') {
    const ids = args.slice(1);
    if (ids.length === 0) {
      // eslint-disable-next-line no-console
      console.error('Usage: xprompt compose --pick <id1> <id2>...');
      process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.log(composeByPick(catalog.atoms, ids));
    return;
  }

  const id = args[0];
  const composite = catalog.composites.find((c) => c.id === id);
  if (composite) {
    // eslint-disable-next-line no-console
    console.log(composite.composed);
    return;
  }

  const atom = catalog.atoms.find((a) => a.id === id);
  if (atom) {
    // eslint-disable-next-line no-console
    console.log(atom.content);
    return;
  }

  // eslint-disable-next-line no-console
  console.error(`Unknown snippet ID: "${id}"`);
  process.exit(1);
}
