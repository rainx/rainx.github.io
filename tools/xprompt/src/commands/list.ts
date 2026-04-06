import { buildCatalog } from '../catalog.js';
import type { IAtomSnippet, ICompositeSnippet } from '../types.js';

interface IListOptions {
  type?: 'atoms' | 'composites';
  category?: string;
  tag?: string;
  json: boolean;
}

function parseArgs(args: string[]): IListOptions {
  const opts: IListOptions = { json: false };
  for (let i = 0; i < args.length; i += 1) {
    switch (args[i]) {
      case '--type':
        i += 1;
        opts.type = args[i] as 'atoms' | 'composites';
        break;
      case '--category':
        i += 1;
        opts.category = args[i];
        break;
      case '--tag':
        i += 1;
        opts.tag = args[i];
        break;
      case '--json':
        opts.json = true;
        break;
      default:
        break;
    }
  }
  return opts;
}

export function runList(promptsDir: string, args: string[]): void {
  const opts = parseArgs(args);
  const catalog = buildCatalog(promptsDir);

  let atoms: IAtomSnippet[] =
    opts.type === 'composites' ? [] : catalog.atoms;
  let composites: ICompositeSnippet[] =
    opts.type === 'atoms' ? [] : catalog.composites;

  if (opts.category) {
    atoms = atoms.filter((a) => a.category === opts.category);
  }

  if (opts.tag) {
    const { tag } = opts;
    atoms = atoms.filter((a) => a.tags.includes(tag));
    composites = composites.filter((c) => c.tags.includes(tag));
  }

  if (opts.json) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ atoms, composites }, null, 2));
    return;
  }

  for (const a of atoms) {
    // eslint-disable-next-line no-console
    console.log(
      `  [ATOM]      ${a.id.padEnd(24)} ${a.name}  (${a.category})`,
    );
  }
  for (const c of composites) {
    // eslint-disable-next-line no-console
    console.log(
      `  [COMPOSITE] ${c.id.padEnd(24)} ${c.name}  (${c.includes.length} snippets)`,
    );
  }

  const total = atoms.length + composites.length;
  if (total === 0) {
    // eslint-disable-next-line no-console
    console.log('No snippets found.');
  }
}
