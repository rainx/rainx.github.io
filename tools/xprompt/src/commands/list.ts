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

  let atoms: AtomSnippet[] =
    opts.type === 'composites' ? [] : catalog.atoms;
  let composites: CompositeSnippet[] =
    opts.type === 'atoms' ? [] : catalog.composites;

  if (opts.category) {
    atoms = atoms.filter((a) => a.category === opts.category);
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
    console.log(
      `  [ATOM]      ${a.id.padEnd(24)} ${a.name}  (${a.category})`,
    );
  }
  for (const c of composites) {
    console.log(
      `  [COMPOSITE] ${c.id.padEnd(24)} ${c.name}  (${c.includes.length} snippets)`,
    );
  }

  const total = atoms.length + composites.length;
  if (total === 0) {
    console.log('No snippets found.');
  }
}
