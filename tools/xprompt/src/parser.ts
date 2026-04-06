import fs from 'node:fs';

// eslint-disable-next-line import-x/no-extraneous-dependencies
import matter from 'gray-matter';

import type { IAtomSnippet, ICompositeSnippet } from './types.js';

interface IRawFrontmatter {
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
    if (
      fields[field] === undefined ||
      fields[field] === null ||
      fields[field] === ''
    ) {
      throw new Error(`Missing required field "${field}" in ${filePath}`);
    }
  }
}

export function parseAtom(filePath: string): IAtomSnippet {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as IRawFrontmatter;

  validateRequired(fm, ['id', 'name', 'category', 'description'], filePath);

  return {
    id: fm.id as string,
    name: fm.name as string,
    category: fm.category as string,
    tags: fm.tags ?? [],
    description: fm.description as string,
    content: content.trim(),
  };
}

export function parseComposite(filePath: string): ICompositeSnippet {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as IRawFrontmatter;

  validateRequired(fm, ['id', 'name', 'includes', 'description'], filePath);

  if (!Array.isArray(fm.includes) || fm.includes.length === 0) {
    throw new Error(`"includes" must be a non-empty array in ${filePath}`);
  }

  return {
    id: fm.id as string,
    name: fm.name as string,
    includes: fm.includes,
    tags: fm.tags ?? [],
    description: fm.description as string,
    content: content.trim(),
    composed: '',
  };
}
