import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, BookOpen, Globe, BookMarked, Plane } from 'lucide-react';
import { api } from '../../services/api';

const typeLabel = { question: 'Question', word: 'Vocabulary', scenario: 'Scenario' };
const typeColor = { question: 'text-aerora-blue bg-aerora-blueLight', word: 'text-emerald-700 bg-emerald-50', scenario: 'text-amber-700 bg-amber-50' };

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    async function loadIndex() {
      try {
        const [qRes, vRes, sRes] = await Promise.all([
          api.getQuestions(),
          api.getVocabulary(),
          api.getScenarios(),
        ]);
        const results = [];
        (qRes || []).slice(0, 40).forEach((q) =>
          results.push({ type: 'question', id: q.id, label: q.question, category: q.category, icon: BookOpen, to: `/interview-prep?q=${q.id}` })
        );
        (vRes || []).slice(0, 40).forEach((v) =>
          results.push({ type: 'word', id: v.id, label: v.word, category: v.category, icon: Globe, to: `/aviation-english?w=${v.id}` })
        );
        (sRes || []).slice(0, 30).forEach((s) =>
          results.push({ type: 'scenario', id: s.id, label: s.title, category: s.category, icon: BookMarked, to: `/scenarios?s=${s.id}` })
        );
        setSearchIndex(results);
      } catch (e) {
        console.warn('Search index load failed:', e);
      }
    }
    loadIndex();
  }, [open]);

  const results = query.trim().length > 1
    ? searchIndex.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  const handleSelect = (item) => {
    navigate(item.to);
    setQuery('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-aerora-ink/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-aerora-border overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-aerora-border">
                <Search className="w-4 h-4 text-aerora-muted flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions, aviation terms, scenarios..."
                  className="flex-1 text-sm text-aerora-ink placeholder:text-aerora-muted bg-transparent outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-aerora-muted hover:text-aerora-ink">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {results.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto p-2">
                  {results.map((item) => (
                    <li key={item.id + item.type}>
                      <button
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-aerora-bg transition-colors text-left"
                      >
                        <item.icon className="w-4 h-4 text-aerora-muted flex-shrink-0" />
                        <span className="flex-1 text-sm text-aerora-ink truncate">{item.label}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeColor[item.type]}`}>
                          {typeLabel[item.type]}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query.length > 1 ? (
                <div className="p-8 text-center text-aerora-muted text-sm">No results found</div>
              ) : (
                <div className="p-6 text-center">
                  <Plane className="w-8 h-8 text-aerora-border mx-auto mb-2" />
                  <p className="text-sm text-aerora-muted">Search questions, terms, or scenarios</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
