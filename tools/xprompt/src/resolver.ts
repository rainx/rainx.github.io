import type { IAtomSnippet, ICompositeSnippet } from './types.js';

export function resolve(
  atoms: IAtomSnippet[],
  composites: ICompositeSnippet[],
): ICompositeSnippet[] {
  const allIds = new Map<string, string>();
  for (const a of atoms) {
    if (allIds.has(a.id)) {
      throw new Error(
        `Duplicate snippet ID: "${a.id}" found in multiple files`,
      );
    }
    allIds.set(a.id, 'atom');
  }
  for (const c of composites) {
    if (allIds.has(c.id)) {
      throw new Error(
        `Duplicate snippet ID: "${c.id}" found in multiple files`,
      );
    }
    allIds.set(c.id, 'composite');
  }

  const atomMap = new Map(atoms.map((a) => [a.id, a]));

  return composites.map((composite) => {
    for (const refId of composite.includes) {
      const refType = allIds.get(refId);
      if (refType === undefined) {
        throw new Error(
          `Unknown atom ID: "${refId}" in composite "${composite.id}"`,
        );
      }
      if (refType === 'composite') {
        throw new Error(
          `Composite cannot include another composite: "${refId}" in "${composite.id}"`,
        );
      }
    }

    const parts = composite.includes.map((id) => {
      const atom = atomMap.get(id);
      if (!atom) {
        throw new Error(
          `Atom "${id}" not found for composite "${composite.id}"`,
        );
      }
      return `### ${atom.name}\n\n${atom.content}`;
    });
    if (composite.content) {
      parts.push(composite.content);
    }
    return { ...composite, composed: parts.join('\n\n') };
  });
}

export function composeByPick(atoms: IAtomSnippet[], ids: string[]): string {
  const atomMap = new Map(atoms.map((a) => [a.id, a]));
  const parts: string[] = [];
  for (const id of ids) {
    const atom = atomMap.get(id);
    if (!atom) {
      throw new Error(`Unknown snippet ID: "${id}"`);
    }
    parts.push(`### ${atom.name}\n\n${atom.content}`);
  }
  return parts.join('\n\n');
}
