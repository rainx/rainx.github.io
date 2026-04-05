export interface AtomSnippet {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  content: string;
}

export interface CompositeSnippet {
  id: string;
  name: string;
  includes: string[];
  tags: string[];
  description: string;
  content: string;
  composed: string;
}

export interface Catalog {
  atoms: AtomSnippet[];
  composites: CompositeSnippet[];
}
