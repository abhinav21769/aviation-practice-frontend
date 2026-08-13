import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, ChevronRight, Search, X, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useProgress } from '../context/ProgressContext';

const vocabularyCategories = [
  { id: 'all', label: 'All Terms' },
  { id: 'aircraft', label: 'Aircraft' },
  { id: 'airport', label: 'Airport' },
  { id: 'cabin', label: 'Cabin' },
  { id: 'service', label: 'Service' },
  { id: 'safety', label: 'Safety' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'operations', label: 'Operations' },
  { id: 'announcements', label: 'Announcements' },
];

function WordCard({ word, isSaved, onSave, onLearn }) {
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(word.word + ' cabin crew aircraft aviation')}`;
  const wikimediaUrl = `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(word.word + ' aviation')}`;

  return (
    <div className="max-w-xl bg-white p-7 rounded-3xl border-2 border-aerora-border shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-aerora-blueLight text-aerora-blue px-3 py-1 rounded-full mb-3">
            {word.category?.replace('_', ' ')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-1 font-heading">{word.word}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-aerora-blue italic">{word.partOfSpeech}</span>
            <span className="text-xs font-semibold text-aerora-muted">· /{word.pronunciation}/</span>
          </div>
        </div>
        <button
          onClick={() => onSave(word.id)}
          className="p-2.5 rounded-xl border-2 border-aerora-border hover:border-aerora-blue hover:bg-aerora-bg transition-all"
        >
          {isSaved
            ? <BookmarkCheck className="w-5 h-5 text-aerora-blue fill-aerora-blue/20" />
            : <Bookmark className="w-5 h-5 text-aerora-muted" />
          }
        </button>
      </div>

      {/* External Search Links */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        <a
          href={googleImagesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-aerora-blue text-white rounded-xl text-xs font-extrabold shadow-sm hover:bg-aerora-blue/90 transition-all group"
        >
          <Search className="w-4 h-4" />
          <span>Search Photos on Google Images</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
        </a>
        <a
          href={wikimediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 bg-aerora-bg text-aerora-ink rounded-xl text-xs font-bold border border-aerora-border hover:border-aerora-blue hover:text-aerora-blue transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Diagrams ↗</span>
        </a>
      </div>

      {/* Content Details */}
      <div className="space-y-4 mb-8">
        <div className="bg-aerora-bg rounded-2xl p-4 border border-aerora-border/60">
          <p className="text-[11px] font-extrabold text-aerora-muted uppercase tracking-wider mb-1.5">Aviation Meaning</p>
          <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{word.definition}</p>
        </div>

        {word.exampleSentence && (
          <div className="border-l-4 border-aerora-blue pl-4 py-1">
            <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-1">In-Flight Example</p>
            <p className="text-sm font-semibold text-aerora-ink italic leading-relaxed">"{word.exampleSentence}"</p>
          </div>
        )}

        {word.relatedWords && word.relatedWords.length > 0 && (
          <div>
            <p className="text-[11px] font-extrabold text-aerora-muted uppercase tracking-wider mb-2">Related Aviation Terms</p>
            <div className="flex flex-wrap gap-2">
              {word.relatedWords.map((w) => (
                <span key={w} className="text-xs font-bold px-3 py-1 bg-white text-aerora-ink rounded-full border border-aerora-border shadow-xs">
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onLearn(word.id)}
        className="w-full bg-aerora-blue text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-colors shadow-md"
      >
        Mark Learned & Next Term →
      </button>
    </div>
  );
}

export default function AviationEnglish() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedWord, setSelectedWord] = useState(null);
  const [search, setSearch] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const { state, dispatch } = useProgress();

  useEffect(() => {
    async function loadVocab() {
      const serverVocab = await api.getVocabulary();
      if (serverVocab) setVocabulary(serverVocab);
    }
    loadVocab();
  }, []);

  const filteredWords = vocabulary.filter((w) => {
    const matchCategory = activeCategory === 'all' || w.category === activeCategory;
    const matchSearch = search.trim()
      ? w.word.toLowerCase().includes(search.toLowerCase()) ||
        w.definition.toLowerCase().includes(search.toLowerCase()) ||
        (w.relatedWords && w.relatedWords.some((r) => r.toLowerCase().includes(search.toLowerCase())))
      : true;
    return matchCategory && matchSearch;
  });

  const handleSave = (wordId) => dispatch({ type: 'SAVE_WORD', wordId });
  const handleLearn = () => {
    dispatch({ type: 'LEARN_WORD' });
    const idx = filteredWords.findIndex((w) => w.id === selectedWord?.id);
    const next = filteredWords[idx + 1];
    setSelectedWord(next || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Aviation English</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Aviation Vocabulary & Reference Guide</h1>
        <p className="text-aerora-muted text-base font-medium mb-8 max-w-xl">Learn essential aviation terminology, cabin equipment, and standard phraseology.</p>
      </motion.div>

      {/* Instant Search Filter Bar */}
      <div className="relative mb-8 max-w-2xl">
        <Search className="w-5 h-5 text-aerora-muted absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search any aviation term, equipment, definition, or keyword..."
          className="w-full bg-white border-2 border-aerora-border rounded-2xl pl-12 pr-10 py-3.5 text-sm font-semibold text-aerora-ink placeholder-aerora-muted/70 focus:outline-none focus:border-aerora-blue shadow-sm transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-aerora-muted hover:text-aerora-ink"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Categories */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="space-y-1.5">
            {vocabularyCategories.map((cat) => {
              const count = cat.id === 'all'
                ? vocabulary.length
                : vocabulary.filter((w) => w.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedWord(null); }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
                    activeCategory === cat.id ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:text-aerora-ink hover:bg-aerora-bg'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 bg-white rounded-2xl p-4 border border-aerora-border shadow-sm">
            <p className="text-xs font-bold text-aerora-muted mb-1 uppercase tracking-wider">Learned Words</p>
            <div className="text-3xl font-extrabold text-aerora-blue font-heading">{state.wordsLearned}</div>
          </div>
        </aside>

        {/* Main Terms List or Word Detail */}
        <div className="flex-1">
          {selectedWord ? (
            <AnimatePresence mode="wait">
              <motion.div key={selectedWord.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <button onClick={() => setSelectedWord(null)} className="text-xs font-bold text-aerora-blue hover:underline mb-6 block">
                  ← Back to terms list
                </button>
                <WordCard
                  word={selectedWord}
                  isSaved={state.savedWords.includes(selectedWord.id)}
                  onSave={handleSave}
                  onLearn={handleLearn}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider">
                  {filteredWords.length} terms found {activeCategory !== 'all' ? `in ${vocabularyCategories.find(c => c.id === activeCategory)?.label}` : ''}
                </p>
                {search && (
                  <button onClick={() => setSearch('')} className="text-xs font-bold text-aerora-blue hover:underline">
                    Clear Search
                  </button>
                )}
              </div>

              {filteredWords.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border-2 border-aerora-border">
                  <p className="text-base font-bold text-aerora-ink mb-1">No terms found matching "{search}"</p>
                  <p className="text-xs font-medium text-aerora-muted mb-4">Try searching for words like "galley", "apron", "vest", or "engine".</p>
                  <button onClick={() => { setSearch(''); setActiveCategory('all'); }} className="px-4 py-2 bg-aerora-blue text-white rounded-xl text-xs font-bold">
                    View All Terms
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredWords.map((word, i) => {
                    const isSaved = state.savedWords.includes(word.id);

                    return (
                      <motion.button
                        key={word.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.02, 0.3) }}
                        onClick={() => setSelectedWord(word)}
                        className="flex items-center justify-between bg-white border-2 border-aerora-border rounded-2xl p-4 text-left hover:border-aerora-blue hover:shadow-md transition-all group"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-base font-extrabold text-aerora-ink group-hover:text-aerora-blue transition-colors font-heading truncate">
                            {word.word}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-aerora-blue italic bg-aerora-blueLight px-1.5 py-0.2 rounded">
                              {word.partOfSpeech}
                            </span>
                            <span className="text-[11px] font-medium text-aerora-muted truncate">
                              /{word.pronunciation}/
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a
                            href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(word.word + ' cabin crew aircraft aviation')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Search real photos of ${word.word} on Google Images`}
                            className="p-2 text-aerora-muted hover:text-aerora-blue hover:bg-aerora-blueLight rounded-xl border border-transparent hover:border-blue-100 transition-all"
                          >
                            <Search className="w-4 h-4" />
                          </a>
                          {isSaved && <BookmarkCheck className="w-4 h-4 text-aerora-blue fill-aerora-blue/20" />}
                          <ChevronRight className="w-4 h-4 text-aerora-border group-hover:text-aerora-blue group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
