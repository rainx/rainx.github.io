import fs from 'node:fs';
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
    if (
      fields[field] === undefined ||
      fields[field] === null ||
      fields[field] === ''
    ) {
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
    composed: '',
  };
}
