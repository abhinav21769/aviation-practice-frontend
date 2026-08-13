import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle2, ExternalLink,
  Image as ImageIcon, Loader2, ArrowLeft, Volume2, VolumeX, Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useProgress } from '../context/ProgressContext';
import AviationLoader, { GridSkeleton } from '../components/shared/AviationLoader';

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

function speakText(text, rate = 0.88) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate; // clear, natural cabin crew articulation
  utterance.pitch = 1.0;
  utterance.lang = 'en-US';

  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(
    (v) => (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Karen') || v.lang.startsWith('en'))
  );
  if (naturalVoice) utterance.voice = naturalVoice;

  window.speechSynthesis.speak(utterance);
}

function WordDetailView({ word, isLearned, onLearn, onNext, onPrev, hasNext, hasPrev, onBack }) {
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingExample, setIsSpeakingExample] = useState(false);

  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(word.word + ' cabin crew aircraft aviation')}`;

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

  const handleSpeakWord = () => {
    setIsSpeaking(true);
    speakText(word.word, 0.85);
    setTimeout(() => setIsSpeaking(false), 1200);
  };

  const handleSpeakExample = () => {
    if (!word.exampleSentence) return;
    setIsSpeakingExample(true);
    speakText(word.exampleSentence, 0.92);
    setTimeout(() => setIsSpeakingExample(false), 3000);
  };

  return (
    <motion.div
      key={word.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      {/* Top Back & Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-extrabold text-aerora-blue hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all terms</span>
        </button>

        <div className="flex items-center gap-2">
          {hasPrev && (
            <button
              onClick={onPrev}
              className="px-3.5 py-1.5 rounded-xl border-2 border-aerora-border text-xs font-bold text-aerora-ink hover:bg-white transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              className="px-3.5 py-1.5 rounded-xl border-2 border-aerora-border text-xs font-bold text-aerora-ink hover:bg-white transition-colors flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-7 sm:p-9 rounded-3xl border-2 border-aerora-border shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Content, Pronunciation & Meaning */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block text-xs font-extrabold uppercase tracking-wider bg-aerora-blueLight text-aerora-blue px-3.5 py-1.5 rounded-full">
                  {word.category?.replace('_', ' ')}
                </span>

                {isLearned && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Learned
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink font-heading">{word.word}</h2>
                {/* Pronunciator Audio Button */}
                <button
                  onClick={handleSpeakWord}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all border shadow-xs ${
                    isSpeaking
                      ? 'bg-aerora-blue text-white border-aerora-blue scale-105 shadow-md'
                      : 'bg-aerora-blueLight text-aerora-blue border-blue-200 hover:bg-aerora-blue hover:text-white'
                  }`}
                  title="Listen to crystal-clear English pronunciation"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-amber-300' : ''}`} />
                  <span>{isSpeaking ? 'Speaking...' : 'Listen 🔊'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-xs font-bold text-aerora-blue italic bg-aerora-blueLight px-2 py-0.5 rounded-md">{word.partOfSpeech}</span>
                <span className="text-sm font-semibold text-aerora-muted">· /{word.pronunciation}/</span>
              </div>
            </div>

            {/* Meaning & Examples */}
            <div className="space-y-4">
              <div className="bg-aerora-bg rounded-2xl p-5 border border-aerora-border/60">
                <p className="text-xs font-extrabold text-aerora-muted uppercase tracking-wider mb-1.5">Aviation Meaning</p>
                <p className="text-base font-semibold text-aerora-ink leading-relaxed">{word.definition}</p>
              </div>

              {word.exampleSentence && (
                <div className="border-l-4 border-aerora-blue pl-5 py-3 bg-aerora-blueLight/30 rounded-r-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-extrabold text-aerora-blue uppercase tracking-wider">In-Flight Example</p>
                    <button
                      onClick={handleSpeakExample}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-aerora-blue hover:underline bg-white px-2.5 py-1 rounded-lg border border-blue-100 shadow-xs"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isSpeakingExample ? 'animate-pulse text-amber-500' : ''}`} />
                      <span>{isSpeakingExample ? 'Playing announcement...' : 'Listen in-flight sentence 🔊'}</span>
                    </button>
                  </div>
                  <p className="text-base font-medium text-aerora-ink italic leading-relaxed">"{word.exampleSentence}"</p>
                </div>
              )}

              {word.relatedWords && word.relatedWords.length > 0 && (
                <div>
                  <p className="text-xs font-extrabold text-aerora-muted uppercase tracking-wider mb-2">Related Aviation Terms</p>
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

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onLearn(word.id)}
                className="w-full bg-aerora-blue text-white py-4 rounded-2xl text-base font-bold tracking-wide hover:bg-aerora-blue/90 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark Learned & Next Term →
              </button>
            </div>
          </div>

          {/* Right Column: Live Internet Images & Search */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-aerora-ink">
                <ImageIcon className="w-4 h-4 text-aerora-blue" />
                <span>Live Visual Reference</span>
              </div>
              {images.length > 1 && (
                <span className="text-xs font-bold text-aerora-muted">
                  {activeImgIdx + 1} of {images.length} photos
                </span>
              )}
            </div>

            {loadingImages ? (
              <div className="h-64 sm:h-72 rounded-2xl bg-aerora-bg border border-aerora-border flex flex-col items-center justify-center gap-2.5 text-aerora-muted">
                <Loader2 className="w-7 h-7 animate-spin text-aerora-blue" />
                <span className="text-xs font-semibold">Fetching live photos from internet...</span>
              </div>
            ) : images.length > 0 ? (
              <div className="space-y-3">
                {/* Main Photo */}
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-black/5 border border-aerora-border shadow-xs group">
                  <img
                    src={images[activeImgIdx]}
                    alt={word.word}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full border border-white/20">
                    Web Photo
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImgIdx(i)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
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
              <div className="p-6 rounded-2xl bg-aerora-bg border border-aerora-border text-center">
                <p className="text-sm font-semibold text-aerora-muted mb-2">No direct photo preview returned.</p>
                <a
                  href={googleImagesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-aerora-blue hover:underline"
                >
                  Open Google Images for {word.word} ↗
                </a>
              </div>
            )}

            {/* Google Images Button */}
            <a
              href={googleImagesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-aerora-blue text-white rounded-2xl text-xs font-extrabold shadow-sm hover:bg-aerora-blue/90 transition-all group"
            >
              <span>Search More Photos on Google Images</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AviationEnglish() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedWord, setSelectedWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vocabulary, setVocabulary] = useState([]);
  const { state, dispatch } = useProgress();

  useEffect(() => {
    async function loadVocab() {
      setLoading(true);
      const serverVocab = await api.getVocabulary();
      if (serverVocab && serverVocab.length > 0) {
        setVocabulary(serverVocab);
      }
      setLoading(false);
    }
    loadVocab();
  }, []);

  const categoryWords = activeCategory === 'all'
    ? vocabulary
    : vocabulary.filter((w) => w.category === activeCategory);

  const selectedIdx = categoryWords.findIndex((w) => w.id === selectedWord?.id);

  const handleLearn = (wordId) => {
    dispatch({ type: 'LEARN_WORD', wordId });
    if (selectedIdx >= 0 && selectedIdx < categoryWords.length - 1) {
      setSelectedWord(categoryWords[selectedIdx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedWord(null);
    }
  };

  const handleNext = () => {
    if (selectedIdx >= 0 && selectedIdx < categoryWords.length - 1) {
      setSelectedWord(categoryWords[selectedIdx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (selectedIdx > 0) {
      setSelectedWord(categoryWords[selectedIdx - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {!selectedWord && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Aviation English</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Aviation Vocabulary & Visual Guide</h1>
          <p className="text-aerora-muted text-base font-medium max-w-xl">Explore essential aviation terms with live internet visual references and audio pronunciations.</p>
        </motion.div>
      )}

      {selectedWord ? (
        <AnimatePresence mode="wait">
          <WordDetailView
            word={selectedWord}
            isLearned={(state.savedWords || []).includes(selectedWord.id)}
            onLearn={handleLearn}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={selectedIdx < categoryWords.length - 1}
            hasPrev={selectedIdx > 0}
            onBack={() => setSelectedWord(null)}
          />
        </AnimatePresence>
      ) : (
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
                    onClick={() => {
                      setActiveCategory(cat.id);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                      activeCategory === cat.id ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:text-aerora-ink hover:bg-aerora-bg'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 bg-white rounded-2xl p-5 border border-aerora-border shadow-sm">
              <p className="text-xs font-bold text-aerora-muted mb-1 uppercase tracking-wider">Learned Words</p>
              <div className="text-3xl font-extrabold text-aerora-blue font-heading">{state.wordsLearned}</div>
            </div>
          </aside>

          {/* Main Terms List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider">
                {categoryWords.length} terms {activeCategory !== 'all' ? `in ${vocabularyCategories.find(c => c.id === activeCategory)?.label}` : ''}
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                <AviationLoader message="Loading cabin crew aviation vocabulary..." size="sm" />
                <GridSkeleton count={8} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {categoryWords.map((word, i) => {
                  const isLearned = (state.savedWords || []).includes(word.id);

                  return (
                    <motion.div
                      key={word.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.25) }}
                      className="flex items-center justify-between bg-white border-2 border-aerora-border rounded-2xl p-4 text-left hover:border-aerora-blue hover:shadow-md transition-all group"
                    >
                      <div
                        onClick={() => {
                          setSelectedWord(word);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 min-w-0 pr-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base font-extrabold text-aerora-ink group-hover:text-aerora-blue transition-colors font-heading truncate">
                            {word.word}
                          </p>
                          {isLearned && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              ✓ Learned
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-aerora-blue italic bg-aerora-blueLight px-2 py-0.5 rounded-md">
                            {word.partOfSpeech}
                          </span>
                          <span className="text-xs font-medium text-aerora-muted truncate">
                            /{word.pronunciation}/
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Quick Pronunciation Audio Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(word.word, 0.85);
                          }}
                          className="p-2 rounded-xl bg-aerora-bg hover:bg-aerora-blueLight text-aerora-blue hover:text-aerora-blue transition-colors"
                          title={`Listen pronunciation for ${word.word}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedWord(word);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-1 text-aerora-border group-hover:text-aerora-blue group-hover:translate-x-1 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
