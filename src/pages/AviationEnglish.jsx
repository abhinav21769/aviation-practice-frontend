import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react';
import { vocabulary as fallbackVocab, vocabularyCategories, getDailyWord as fallbackDaily } from '../data/vocabulary';
import { api } from '../services/api';
import { useProgress } from '../context/ProgressContext';

function WordCard({ word, isSaved, onSave, onLearn }) {
  return (
    <div className="max-w-md bg-white p-6 rounded-2xl border-2 border-aerora-border shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-aerora-ink mb-1 font-heading">{word.word}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-aerora-blue italic">{word.partOfSpeech}</span>
            <span className="text-xs font-semibold text-aerora-muted">· /{word.pronunciation}/</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onSave(word.id)} className="p-2.5 rounded-xl border border-aerora-border hover:bg-aerora-bg transition-colors">
            {isSaved
              ? <BookmarkCheck className="w-5 h-5 text-aerora-blue fill-aerora-blue/20" />
              : <Bookmark className="w-5 h-5 text-aerora-muted" />
            }
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-aerora-bg rounded-xl p-4 border border-aerora-border/60">
          <p className="text-[11px] font-extrabold text-aerora-muted uppercase tracking-wider mb-1.5">Aviation Definition</p>
          <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{word.definition}</p>
        </div>

        <div className="border-l-4 border-aerora-blue pl-4">
          <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-1">In-Flight Example</p>
          <p className="text-sm font-semibold text-aerora-ink italic">"{word.exampleSentence}"</p>
        </div>

        {word.relatedWords && (
          <div>
            <p className="text-[11px] font-extrabold text-aerora-muted uppercase tracking-wider mb-2">Related Terms</p>
            <div className="flex flex-wrap gap-2">
              {word.relatedWords.map((w) => (
                <span key={w} className="text-xs font-bold px-3 py-1 bg-aerora-bg text-aerora-ink rounded-full border border-aerora-border">{w}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onLearn(word.id)}
        className="w-full bg-aerora-blue text-white py-3 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-colors shadow-sm"
      >
        Mark Learned & Next Term →
      </button>
    </div>
  );
}

function FlashCard({ word }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(!flipped)} className="cursor-pointer w-full max-w-sm mx-auto aspect-[3/2] perspective-1000">
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.4 }} className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 bg-white border-2 border-aerora-border rounded-3xl flex items-center justify-center backface-hidden shadow-md">
          <div className="text-center px-6">
            <p className="text-3xl font-extrabold text-aerora-ink mb-2 font-heading">{word.word}</p>
            <p className="text-xs font-bold text-aerora-blue italic">{word.partOfSpeech}</p>
            <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider mt-6">Tap to Flip Card 🔄</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-aerora-blue text-white border-2 border-aerora-blue rounded-3xl flex items-center justify-center shadow-md p-6 text-center" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          <div>
            <p className="text-sm font-semibold leading-relaxed mb-3">{word.definition}</p>
            <p className="text-xs font-medium text-white/80 italic">"{word.exampleSentence}"</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AviationEnglish() {
  const [activeCategory, setActiveCategory] = useState('aircraft');
  const [selectedWord, setSelectedWord] = useState(null);
  const [mode, setMode] = useState('browse');
  const [flashIdx, setFlashIdx] = useState(0);
  const [vocabulary, setVocabulary] = useState(fallbackVocab);
  const [dailyWord, setDailyWord] = useState(fallbackDaily());
  const { state, dispatch } = useProgress();

  useEffect(() => {
    async function loadVocab() {
      const serverVocab = await api.getVocabulary();
      if (serverVocab) setVocabulary(serverVocab);
      const serverDaily = await api.getDailyWord();
      if (serverDaily) setDailyWord(serverDaily);
    }
    loadVocab();
  }, []);

  const categoryWords = vocabulary.filter((w) => w.category === activeCategory);
  const flashcardWords = categoryWords;
  const currentFlashcard = flashcardWords[flashIdx % (flashcardWords.length || 1)];

  const handleSave = (wordId) => dispatch({ type: 'SAVE_WORD', wordId });
  const handleLearn = () => {
    dispatch({ type: 'LEARN_WORD' });
    const idx = categoryWords.findIndex((w) => w.id === selectedWord?.id);
    const next = categoryWords[idx + 1];
    setSelectedWord(next || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Aviation English</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Vocabulary & Flashcards</h1>
        <p className="text-aerora-muted text-base font-medium mb-8 max-w-xl">Master 100+ aviation terms served via Express REST API.</p>
      </motion.div>

      {/* Daily Word */}
      {dailyWord && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-aerora-ink rounded-3xl p-7 mb-8 text-white relative overflow-hidden shadow-md">
          <p className="text-[11px] font-extrabold tracking-[0.2em] text-amber-400 uppercase mb-2">Featured Term of the Day</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-1 font-heading">{dailyWord.word}</h2>
          <p className="text-white/60 text-xs font-bold italic mb-3">/{dailyWord.pronunciation}/</p>
          <p className="text-sm font-semibold text-white/90 leading-relaxed max-w-lg mb-4">{dailyWord.definition}</p>
          <p className="text-xs font-medium text-white/70 italic">"{dailyWord.exampleSentence}"</p>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="flex gap-2 mb-4 p-1 bg-aerora-bg rounded-xl border border-aerora-border">
            <button onClick={() => setMode('browse')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${mode === 'browse' ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted'}`}>Browse List</button>
            <button onClick={() => setMode('flashcard')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${mode === 'flashcard' ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted'}`}>3D Flashcards</button>
          </div>

          <div className="space-y-1.5">
            {vocabularyCategories.map((cat) => {
              const count = vocabulary.filter((w) => w.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedWord(null); setFlashIdx(0); }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
                    activeCategory === cat.id ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:text-aerora-ink hover:bg-aerora-bg'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {mode === 'flashcard' ? (
            <div className="text-center">
              <p className="text-xs font-bold text-aerora-muted mb-8 uppercase tracking-wider">
                Card {flashIdx + 1} of {flashcardWords.length}
              </p>
              {currentFlashcard && <FlashCard word={currentFlashcard} />}
              <div className="flex justify-center gap-4 mt-8">
                <button onClick={() => setFlashIdx(Math.max(0, flashIdx - 1))} className="px-5 py-2.5 border-2 border-aerora-border rounded-xl text-sm font-bold text-aerora-ink hover:bg-aerora-bg transition-colors">← Previous</button>
                <button onClick={() => setFlashIdx(flashIdx + 1)} className="px-5 py-2.5 bg-aerora-blue text-white rounded-xl text-sm font-bold hover:bg-aerora-blue/90 transition-colors shadow-sm">Next Card →</button>
              </div>
            </div>
          ) : selectedWord ? (
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
              <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider mb-4">{categoryWords.length} terms in {vocabularyCategories.find(c => c.id === activeCategory)?.label}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryWords.map((word, i) => {
                  const isSaved = state.savedWords.includes(word.id);
                  return (
                    <motion.button
                      key={word.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedWord(word)}
                      className="flex items-center justify-between bg-white border-2 border-aerora-border rounded-2xl px-5 py-4 text-left hover:border-aerora-blue hover:shadow-md transition-all group"
                    >
                      <div>
                        <p className="text-base font-extrabold text-aerora-ink group-hover:text-aerora-blue transition-colors font-heading">{word.word}</p>
                        <p className="text-xs font-bold text-aerora-muted italic">{word.partOfSpeech}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSaved && <BookmarkCheck className="w-4 h-4 text-aerora-blue fill-aerora-blue/20" />}
                        <ChevronRight className="w-4 h-4 text-aerora-border group-hover:text-aerora-blue transition-colors" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
