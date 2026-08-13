import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Search, X, CheckCircle2, ExternalLink, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
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

function WordDetailPanel({ word, isLearned, onLearn, onNext, onPrev, hasNext, hasPrev, onClose }) {
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(word.word + ' cabin crew aircraft aviation')}`;

  // Fetch live internet photos whenever the selected word changes
  useEffect(() => {
    let isMounted = true;
    setLoadingImages(true);
    setActiveImgIdx(0);
    setImages([]);

    async function loadImages() {
      const fetched = await api.fetchWordImages(word.word);
      if (isMounted) {
        setImages(fetched || []);
        setLoadingImages(false);
      }
    }

    loadImages();
    return () => {
      isMounted = false;
    };
  }, [word.id, word.word]);

  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-aerora-border shadow-md">
      {/* Top Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-aerora-blueLight text-aerora-blue px-3 py-1 rounded-full mb-2">
            {word.category?.replace('_', ' ')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-aerora-ink font-heading">{word.word}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-bold text-aerora-blue italic">{word.partOfSpeech}</span>
            <span className="text-xs font-semibold text-aerora-muted">· /{word.pronunciation}/</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLearned && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Learned
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-aerora-border text-aerora-muted hover:text-aerora-ink hover:bg-aerora-bg lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Internet Images Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-aerora-ink">
            <ImageIcon className="w-3.5 h-3.5 text-aerora-blue" />
            <span>Live Internet Visual Reference</span>
          </div>
          {images.length > 1 && (
            <span className="text-[11px] font-bold text-aerora-muted">
              {activeImgIdx + 1} of {images.length} photos
            </span>
          )}
        </div>

        {loadingImages ? (
          <div className="h-48 sm:h-52 rounded-2xl bg-aerora-bg border border-aerora-border/60 flex flex-col items-center justify-center gap-2 text-aerora-muted">
            <Loader2 className="w-6 h-6 animate-spin text-aerora-blue" />
            <span className="text-xs font-semibold">Fetching live photos from internet...</span>
          </div>
        ) : images.length > 0 ? (
          <div className="space-y-2">
            {/* Main Active Photo */}
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-black/5 border border-aerora-border/60 group">
              <img
                src={images[activeImgIdx]}
                alt={word.word}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-white/20">
                Web Photo
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImgIdx === i ? 'border-aerora-blue scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-aerora-bg border border-aerora-border/60 text-center">
            <p className="text-xs font-semibold text-aerora-muted mb-2">No direct live photo preview returned.</p>
            <a
              href={googleImagesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-aerora-blue hover:underline"
            >
              <Search className="w-3.5 h-3.5" /> Open Google Images for {word.word} ↗
            </a>
          </div>
        )}
      </div>

      {/* Google Images Direct Button */}
      <div className="mb-6">
        <a
          href={googleImagesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-aerora-blue text-white rounded-xl text-xs font-extrabold shadow-sm hover:bg-aerora-blue/90 transition-all group"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search More Photos on Google Images</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
        </a>
      </div>

      {/* Content Details */}
      <div className="space-y-4 mb-6">
        <div className="bg-aerora-bg rounded-2xl p-4 border border-aerora-border/60">
          <p className="text-[11px] font-extrabold text-aerora-muted uppercase tracking-wider mb-1">Aviation Meaning</p>
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
            <p className="text-[11px] font-extrabold text-aerora-muted uppercase tracking-wider mb-1.5">Related Aviation Terms</p>
            <div className="flex flex-wrap gap-1.5">
              {word.relatedWords.map((w) => (
                <span key={w} className="text-xs font-bold px-2.5 py-0.5 bg-white text-aerora-ink rounded-full border border-aerora-border shadow-xs">
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={() => onLearn(word.id)}
          className="w-full bg-aerora-blue text-white py-3 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark Learned & Next Term →
        </button>

        <div className="flex gap-2">
          {hasPrev && (
            <button
              onClick={onPrev}
              className="flex-1 py-2 px-3 rounded-xl border-2 border-aerora-border text-xs font-bold text-aerora-ink hover:bg-aerora-bg transition-colors flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              className="flex-1 py-2 px-3 rounded-xl border-2 border-aerora-border text-xs font-bold text-aerora-ink hover:bg-aerora-bg transition-colors flex items-center justify-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
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
      if (serverVocab && serverVocab.length > 0) {
        setVocabulary(serverVocab);
        // Default select the first item on desktop
        if (!selectedWord) setSelectedWord(serverVocab[0]);
      }
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

  const selectedIdx = filteredWords.findIndex((w) => w.id === selectedWord?.id);

  const handleLearn = (wordId) => {
    dispatch({ type: 'LEARN_WORD', wordId });
    if (selectedIdx >= 0 && selectedIdx < filteredWords.length - 1) {
      setSelectedWord(filteredWords[selectedIdx + 1]);
    } else if (filteredWords.length > 0) {
      setSelectedWord(filteredWords[0]);
    }
  };

  const handleNext = () => {
    if (selectedIdx >= 0 && selectedIdx < filteredWords.length - 1) {
      setSelectedWord(filteredWords[selectedIdx + 1]);
    }
  };

  const handlePrev = () => {
    if (selectedIdx > 0) {
      setSelectedWord(filteredWords[selectedIdx - 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Aviation English</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Aviation Vocabulary & Visual Guide</h1>
        <p className="text-aerora-muted text-base font-medium mb-8 max-w-xl">Explore essential aviation terms with live internet visual references.</p>
      </motion.div>

      {/* Search Filter Bar */}
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Categories */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="space-y-1.5">
            {vocabularyCategories.map((cat) => {
              const count = cat.id === 'all'
                ? vocabulary.length
                : vocabulary.filter((w) => w.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    const list = cat.id === 'all' ? vocabulary : vocabulary.filter((w) => w.category === cat.id);
                    if (list.length > 0) setSelectedWord(list[0]);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
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

        {/* Middle Terms List */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider">
              {filteredWords.length} terms {activeCategory !== 'all' ? `in ${vocabularyCategories.find(c => c.id === activeCategory)?.label}` : ''}
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
            <div className="space-y-2.5">
              {filteredWords.map((word, i) => {
                const isLearned = (state.savedWords || []).includes(word.id);
                const isSelected = selectedWord?.id === word.id;

                return (
                  <motion.button
                    key={word.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.015, 0.2) }}
                    onClick={() => setSelectedWord(word)}
                    className={`w-full flex items-center justify-between rounded-2xl p-4 text-left transition-all group border-2 ${
                      isSelected
                        ? 'bg-aerora-blueLight/50 border-aerora-blue shadow-sm'
                        : 'bg-white border-aerora-border hover:border-aerora-blue/50 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-base font-extrabold font-heading truncate transition-colors ${
                          isSelected ? 'text-aerora-blue' : 'text-aerora-ink group-hover:text-aerora-blue'
                        }`}>
                          {word.word}
                        </p>
                        {isLearned && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Learned
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-aerora-muted line-clamp-1">
                        {word.definition}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-bold text-aerora-blue italic bg-aerora-blueLight px-2 py-0.5 rounded">
                        {word.partOfSpeech}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-all ${
                        isSelected ? 'text-aerora-blue translate-x-1' : 'text-aerora-border group-hover:text-aerora-blue'
                      }`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side Detail Panel (Sticky on Desktop) */}
        <div className="lg:w-[420px] xl:w-[450px] flex-shrink-0">
          <div className="lg:sticky lg:top-6">
            {selectedWord ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedWord.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <WordDetailPanel
                    word={selectedWord}
                    isLearned={(state.savedWords || []).includes(selectedWord.id)}
                    onLearn={handleLearn}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    hasNext={selectedIdx < filteredWords.length - 1}
                    hasPrev={selectedIdx > 0}
                    onClose={() => setSelectedWord(null)}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="bg-white p-8 rounded-3xl border-2 border-aerora-border text-center">
                <div className="w-12 h-12 rounded-2xl bg-aerora-blueLight text-aerora-blue flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-aerora-ink mb-1">Select Any Vocabulary Term</h3>
                <p className="text-xs font-medium text-aerora-muted">
                  Click on any term from the list to fetch live internet photos, in-flight examples, and pronunciation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
