import { useCallback, useMemo, useState } from 'react';
import catalog from '../../prompts/catalog.json';
import styles from './app.module.css';
import type { AtomSnippet, Catalog, CompositeSnippet } from './types';

type Snippet =
  | (AtomSnippet & { type: 'atom' })
  | (CompositeSnippet & { type: 'composite' });

const data = catalog as Catalog;

function getAllSnippets(): Snippet[] {
  const atoms: Snippet[] = data.atoms.map((a) => ({ ...a, type: 'atom' }));
  const composites: Snippet[] = data.composites.map((c) => ({
    ...c,
    type: 'composite',
  }));
  return [...atoms, ...composites];
}

function getCategories(): string[] {
  const cats = new Set(data.atoms.map((a) => a.category));
  return Array.from(cats).sort();
}

export function App() {
  const allSnippets = useMemo(getAllSnippets, []);
  const categories = useMemo(getCategories, []);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'all' | 'atom' | 'composite'>(
    'all',
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    let result = allSnippets;
    if (activeType !== 'all') {
      result = result.filter((s) => s.type === activeType);
    }
    if (activeCategory) {
      result = result.filter(
        (s) => s.type === 'atom' && s.category === activeCategory,
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [allSnippets, search, activeCategory, activeType]);

  const selected = useMemo(
    () => allSnippets.find((s) => s.id === selectedId) ?? null,
    [allSnippets, selectedId],
  );

  const getDisplayContent = useCallback((snippet: Snippet): string => {
    if (snippet.type === 'composite') return snippet.composed;
    return snippet.content;
  }, []);

  const handleCopy = useCallback(async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(getDisplayContent(selected));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selected, getDisplayContent]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          xprompt<span>Composable Prompt Snippets</span>
        </h1>
      </div>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search snippets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.typeFilters}>
            {(['all', 'atom', 'composite'] as const).map((t) => (
              <button
                key={t}
                className={`${styles.filterTag} ${activeType === t ? styles.filterTagActive : ''}`}
                onClick={() => setActiveType(t)}
              >
                {t === 'all' ? 'all' : t === 'atom' ? 'atoms' : 'composites'}
              </button>
            ))}
          </div>
          <div className={styles.filters}>
            <button
              className={`${styles.filterTag} ${activeCategory === null ? styles.filterTagActive : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              all categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterTag} ${activeCategory === cat ? styles.filterTagActive : ''}`}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={styles.snippetList}>
            {filtered.length === 0 ? (
              <div className={styles.emptyMessage}>No snippets found</div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  className={`${styles.snippetItem} ${selectedId === s.id ? styles.snippetItemActive : ''}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <div className={styles.snippetLabel}>
                    <span
                      className={`${styles.badge} ${s.type === 'atom' ? styles.badgeAtom : styles.badgeComposite}`}
                    >
                      {s.type}
                    </span>
                    <span className={styles.snippetName}>{s.name}</span>
                  </div>
                  <span className={styles.snippetMeta}>
                    {s.type === 'atom'
                      ? s.category
                      : `${s.includes.length} snippets`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className={styles.preview}>
          {!selected ? (
            <div className={styles.previewEmpty}>
              点击左侧片段预览内容
            </div>
          ) : (
            <>
              <div className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>{selected.name}</h2>
                <p className={styles.previewDesc}>{selected.description}</p>
                {selected.type === 'composite' && (
                  <div className={styles.previewIncludes}>
                    includes: {selected.includes.join(', ')}
                  </div>
                )}
              </div>
              <div className={styles.previewContent}>
                {getDisplayContent(selected)}
              </div>
              <button
                className={`${styles.copyButton} ${copied ? styles.copySuccess : ''}`}
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
