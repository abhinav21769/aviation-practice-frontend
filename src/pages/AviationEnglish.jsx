import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, ChevronRight, Search, X, Sparkles, BookOpen, Volume2 } from 'lucide-react';
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

const specificTermImages = {
  // Aircraft
  'Fuselage': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  'Jet Engine': 'https://images.unsplash.com/photo-1583073030863-74450d26bd5b?auto=format&fit=crop&w=800&q=80',
  'Cockpit': 'https://images.unsplash.com/photo-1517976487507-579fb364c7da?auto=format&fit=crop&w=800&q=80',
  'Landing Gear': 'https://images.unsplash.com/photo-1559087867-ce4c91325525?auto=format&fit=crop&w=800&q=80',
  'Winglet': 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
  'Empennage': 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=800&q=80',
  'Radome': 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80',
  'Flaps': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
  'APU': 'https://images.unsplash.com/photo-1519074069444-1ba4fff16def?auto=format&fit=crop&w=800&q=80',

  // Airport
  'Apron': 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
  'Jetway': 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80',
  'Terminal': 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
  'Runway': 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
  'Taxiway': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  'Control Tower': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
  'Boarding Gate': 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80',

  // Cabin
  'Galley': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
  'Jumpseat': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'Overhead Bin': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
  'Trolley': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'Bulkhead': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
  'Lavatory': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',

  // Safety & Emergency
  'Life Vest': 'https://images.unsplash.com/photo-1519074069444-1ba4fff16def?auto=format&fit=crop&w=800&q=80',
  'Oxygen Mask': 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
  'Smoke Hood': 'https://images.unsplash.com/photo-1519074069444-1ba4fff16def?auto=format&fit=crop&w=800&q=80',
  'Fire Extinguisher': 'https://images.unsplash.com/photo-1583073030863-74450d26bd5b?auto=format&fit=crop&w=800&q=80',
  'First Aid Kit': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80',
  'Evacuation Slide': 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
  'Defibrillator': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  'Safety Demo': 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80',

  // Service
  'Meal Tray': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'Beverage Cart': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'Duty Free': 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=800&q=80',
  'Special Meal': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',

  // Operations & Announcements
  'Crosscheck': 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80',
  'Arm Doors': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
  'Disarm Doors': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
  'Deplaning': 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80',
  'Pushback': 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
  'Turbulence': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
};

const categoryFallbacks = {
  aircraft: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  airport: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
  cabin: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
  service: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  safety: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
  emergency: 'https://images.unsplash.com/photo-1519074069444-1ba4fff16def?auto=format&fit=crop&w=800&q=80',
  operations: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
  announcements: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80',
};

function getWordImage(word) {
  if (!word) return categoryFallbacks.aircraft;
  if (specificTermImages[word.word]) return specificTermImages[word.word];
  const matchedKey = Object.keys(specificTermImages).find(
    (k) => word.word.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(word.word.toLowerCase())
  );
  if (matchedKey) return specificTermImages[matchedKey];
  return categoryFallbacks[word.category] || categoryFallbacks.aircraft;
}

function WordCard({ word, isSaved, onSave, onLearn }) {
  const imageUrl = getWordImage(word);

  return (
    <div className="max-w-xl bg-white p-6 rounded-3xl border-2 border-aerora-border shadow-md">
      {/* Visual Image Representation */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-52 sm:h-60 bg-aerora-bg border border-aerora-border/50">
        <img
          src={imageUrl}
          alt={word.word}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              {word.category?.replace('_', ' ')}
            </span>
            <span className="text-xs font-semibold text-white/90">
              Visual Reference Guide
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-aerora-ink mb-1 font-heading">{word.word}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-aerora-blue italic bg-aerora-blueLight px-2 py-0.5 rounded-md">{word.partOfSpeech}</span>
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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Aviation Vocabulary & Visual Guide</h1>
        <p className="text-aerora-muted text-base font-medium mb-8 max-w-xl">Learn essential aviation terminology, cabin equipment, and standard phraseology with visual references.</p>
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
                    const thumbUrl = getWordImage(word);

                    return (
                      <motion.button
                        key={word.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.02, 0.3) }}
                        onClick={() => setSelectedWord(word)}
                        className="flex items-center gap-3.5 bg-white border-2 border-aerora-border rounded-2xl p-3.5 text-left hover:border-aerora-blue hover:shadow-md transition-all group"
                      >
                        {/* Thumbnail Image */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-aerora-bg border border-aerora-border/60 flex-shrink-0">
                          <img
                            src={thumbUrl}
                            alt={word.word}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
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

                        <div className="flex items-center gap-1.5 flex-shrink-0">
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
