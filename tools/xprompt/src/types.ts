export interface IAtomSnippet {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  content: string;
}

export interface ICompositeSnippet {
  id: string;
  name: string;
  includes: string[];
  tags: string[];
  description: string;
  content: string;
  composed: string;
}

export interface ICatalog {
  atoms: IAtomSnippet[];
  composites: ICompositeSnippet[];
}
