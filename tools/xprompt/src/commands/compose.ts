import { buildCatalog } from '../catalog.js';
import { composeByPick } from '../resolver.js';

export function runCompose(promptsDir: string, args: string[]): void {
  if (args.length === 0) {
    console.error(
      'Usage: xprompt compose <id> | xprompt compose --pick <id1> <id2>...',
    );
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

  const atom = catalog.atoms.find((a) => a.id === id);
  if (atom) {
    console.log(atom.content);
    return;
  }

  console.error(`Unknown snippet ID: "${id}"`);
  process.exit(1);
}
