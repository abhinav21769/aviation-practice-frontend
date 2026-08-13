import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, BookOpen, CheckCircle2, RotateCcw, Star, Sparkles, Plane } from 'lucide-react';
import { api } from '../services/api';
import { useProgress } from '../context/ProgressContext';

const questionCategories = [
  { id: 'personal', label: 'Personal' },
  { id: 'customer_service', label: 'Customer Service' },
  { id: 'teamwork', label: 'Teamwork' },
  { id: 'behavioral', label: 'Behavioral' },
  { id: 'pressure', label: 'Handling Pressure' },
  { id: 'airline', label: 'Airline-Specific' },
];

const AIRLINES = ['Emirates', 'Qatar Airways', 'Singapore Airlines', 'Delta Air Lines', 'British Airways'];

function STARBuilder({ question, savedParts, onPartsChange, onApplyToAnswer }) {
  const [parts, setParts] = useState(
    savedParts || { situation: '', task: '', action: '', result: '' }
  );

  useEffect(() => {
    if (savedParts) {
      setParts(savedParts);
    } else {
      setParts({ situation: '', task: '', action: '', result: '' });
    }
  }, [question.id, savedParts]);

  const labels = {
    situation: { label: 'S — Situation', hint: 'What was the context? Set the scene briefly.' },
    task: { label: 'T — Task', hint: 'What was expected of you in that situation?' },
    action: { label: 'A — Action', hint: 'What specifically did YOU do? Focus on your actions.' },
    result: { label: 'R — Result', hint: 'What was the positive outcome? What did you learn?' },
  };

  const handlePartChange = (key, val) => {
    const updated = { ...parts, [key]: val };
    setParts(updated);
    if (onPartsChange) onPartsChange(updated);
  };

  const allFilled = Object.values(parts).some((v) => v && v.trim().length > 10);
  const full = Object.values(parts).filter(Boolean).join(' ').trim();

  return (
    <div className="space-y-4 bg-white p-5 rounded-2xl border-2 border-aerora-border shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <p className="text-xs font-extrabold text-aerora-blue uppercase tracking-wider">STAR Answer Framework</p>
        </div>
        {full && onApplyToAnswer && (
          <button
            type="button"
            onClick={() => onApplyToAnswer(full)}
            className="text-xs font-bold text-aerora-blue hover:underline"
          >
            Insert into practice answer ↓
          </button>
        )}
      </div>

      {Object.entries(labels).map(([key, { label, hint }]) => (
        <div key={key}>
          <label className="block text-xs font-bold text-aerora-ink mb-1">{label}</label>
          <p className="text-xs font-medium text-aerora-muted mb-1.5">{hint}</p>
          <textarea
            value={parts[key] || ''}
            onChange={(e) => handlePartChange(key, e.target.value)}
            className="w-full border border-aerora-border rounded-xl p-3 text-sm font-medium text-aerora-ink bg-aerora-bg resize-none h-20 focus:outline-none focus:border-aerora-blue transition-colors"
            placeholder={`Your ${label.toLowerCase()}...`}
          />
        </div>
      ))}

      {full.length > 30 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="border-2 border-emerald-300 bg-emerald-50/70 rounded-xl p-4">
          <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-2">Structured STAR Summary</p>
          <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{full}</p>
        </motion.div>
      )}
    </div>
  );
}

function QuestionDetail({ question, onBack, onNext }) {
  const { state, dispatch } = useProgress();
  const [answer, setAnswer] = useState('');
  const [starParts, setStarParts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Pre-fill user answer if revisited
  useEffect(() => {
    const saved = (state.questionResponses || []).find((r) => r.questionId === question.id);
    if (saved) {
      setAnswer(saved.answer || '');
      setStarParts(saved.starAnswer || null);
      setSubmitted(true);
    } else {
      setAnswer('');
      setStarParts(null);
      setSubmitted(false);
    }
  }, [question.id, state.questionResponses]);

  const handleSubmit = async () => {
    if (answer.trim().length < 5 && !starParts) return;
    setSaving(true);
    dispatch({
      type: 'COMPLETE_QUESTION',
      payload: {
        questionId: question.id,
        answer,
        starAnswer: starParts,
      },
    });
    setSaving(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswer('');
    setStarParts({ situation: '', task: '', action: '', result: '' });
    setSubmitted(false);
  };

  return (
    <motion.div key={question.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-aerora-blue hover:underline transition-colors">
          ← Back to all questions
        </button>
        {submitted && (
          <button onClick={handleReset} className="flex items-center gap-1 text-xs font-bold text-aerora-muted hover:text-aerora-ink">
            <RotateCcw className="w-3.5 h-3.5" /> Clear & Write New Answer
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        {question.airline && (
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide bg-aerora-blue text-white flex items-center gap-1">
            <Plane className="w-3 h-3" /> {question.airline}
          </span>
        )}
        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide ${
          question.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
          question.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
          'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>{question.difficulty}</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-aerora-ink leading-snug mb-8 font-heading">
        "{question.question}"
      </h2>

      <div className="space-y-6 mb-8">
        <div className="bg-aerora-blueLight rounded-2xl p-5 border border-blue-100">
          <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-2">What Interviewers Are Looking For</p>
          <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{question.whatTheyLookFor}</p>
        </div>

        <div className="border-2 border-aerora-border rounded-2xl p-5 bg-white shadow-xs">
          <p className="text-[11px] font-extrabold text-aerora-muted uppercase tracking-wider mb-2">Recommended Framework</p>
          <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{question.framework}</p>
        </div>

        <div className="bg-aerora-bg rounded-2xl p-5 border-l-4 border-aerora-blue">
          <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-2">Model Answer Guidance</p>
          <p className="text-sm font-medium text-aerora-ink leading-relaxed italic">"{question.exampleAnswer}"</p>
        </div>
      </div>

      {question.starApplicable && (
        <div className="mb-8">
          <STARBuilder
            question={question}
            savedParts={starParts}
            onPartsChange={(parts) => setStarParts(parts)}
            onApplyToAnswer={(fullText) => setAnswer(fullText)}
          />
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-extrabold text-aerora-ink">Your Personal Practice Answer</label>
          {submitted && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ✓ Saved in your profile
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-aerora-muted mb-2">Structure your thoughts naturally — your answer is automatically remembered whenever you revisit this question.</p>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full border-2 border-aerora-border rounded-2xl p-4 text-sm font-medium text-aerora-ink bg-white resize-none h-36 focus:outline-none focus:border-aerora-blue transition-colors shadow-xs"
          placeholder="Write your answer here..."
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving || answer.trim().length < 5}
          className="flex-1 bg-aerora-blue text-white py-3 rounded-xl text-sm font-bold tracking-wide disabled:opacity-40 hover:bg-aerora-blue/90 transition-colors shadow-sm"
        >
          {submitted ? 'Update Saved Answer' : 'Save & Mark Complete'}
        </button>

        {onNext && (
          <button onClick={onNext} className="px-5 py-3 border-2 border-aerora-border rounded-xl text-sm font-bold text-aerora-ink hover:bg-aerora-bg transition-colors">
            Next Question →
          </button>
        )}
      </div>

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 text-emerald-800 font-bold text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Answer saved successfully!
        </motion.div>
      )}
    </motion.div>
  );
}

export default function InterviewPrep() {
  const [activeCategory, setActiveCategory] = useState('personal');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedAirline, setSelectedAirline] = useState('Emirates');
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const { state } = useProgress();

  useEffect(() => {
    async function loadQuestions() {
      const serverQuestions = await api.getQuestions();
      if (serverQuestions && serverQuestions.length > 0) {
        setQuestions(serverQuestions);
      }
    }
    loadQuestions();
  }, []);

  const categoryQuestions = questions.filter((q) => {
    const matchCat = q.category === activeCategory;
    const matchSearch = search ? q.question.toLowerCase().includes(search.toLowerCase()) : true;
    return matchCat && matchSearch;
  });

  const handleGenerateAiQuestion = async () => {
    setGenerating(true);
    const newQ = await api.generateAiQuestion(selectedAirline);
    if (newQ) {
      setQuestions([newQ, ...questions]);
      setActiveCategory('airline');
      setSelectedQuestion(newQ);
    }
    setGenerating(false);
  };

  const selectedIdx = categoryQuestions.findIndex((q) => q.id === selectedQuestion?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Preparation</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Interview Preparation</h1>
        <p className="text-aerora-muted text-base font-medium mb-8 max-w-xl">Master HR, behavioral, and airline-specific interview questions tailored for cabin crew aspirants.</p>
      </motion.div>

      {/* AI Airline Prompt Generator Banner */}
      <div className="bg-gradient-to-r from-aerora-ink to-aerora-blue p-6 rounded-3xl text-white mb-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> AI Airline Generator
            </div>
            <h3 className="text-xl font-extrabold font-heading mb-1">Targeting a specific airline?</h3>
            <p className="text-xs text-white/80 font-medium">Generate realistic practice questions tailored to your chosen airline.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
              className="bg-white/10 text-white font-bold border border-white/20 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer focus:bg-white/20"
            >
              {AIRLINES.map((a) => (
                <option key={a} value={a} className="bg-aerora-ink text-white font-bold">{a}</option>
              ))}
            </select>
            <button
              onClick={handleGenerateAiQuestion}
              disabled={generating}
              className="bg-white text-aerora-blue px-5 py-2.5 rounded-xl text-xs font-extrabold hover:bg-white/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {generating ? 'Generating Prompt...' : 'Generate Airline Question ✨'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full border-2 border-aerora-border rounded-xl px-4 py-2.5 text-sm font-semibold bg-white focus:outline-none focus:border-aerora-blue"
            />
          </div>

          <div className="space-y-1.5 mb-6">
            {questionCategories.map((cat) => {
              const count = questions.filter((q) => q.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedQuestion(null); }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-colors text-left ${
                    activeCategory === cat.id ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:text-aerora-ink hover:bg-aerora-bg'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl p-4 border border-aerora-border shadow-sm">
            <p className="text-xs font-bold text-aerora-muted mb-1 uppercase tracking-wider">Completed Questions</p>
            <div className="text-3xl font-extrabold text-aerora-blue font-heading">{state.questionsAnswered}</div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedQuestion ? (
              <QuestionDetail
                key="detail"
                question={selectedQuestion}
                onBack={() => setSelectedQuestion(null)}
                onNext={selectedIdx < categoryQuestions.length - 1 ? () => setSelectedQuestion(categoryQuestions[selectedIdx + 1]) : null}
              />
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider mb-4">{categoryQuestions.length} questions in {questionCategories.find(c => c.id === activeCategory)?.label}</p>
                <div className="space-y-2.5">
                  {categoryQuestions.map((q, i) => {
                    const isCompleted = state.completedQuestions.includes(q.id);
                    return (
                      <motion.button
                        key={q.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setSelectedQuestion(q)}
                        className="w-full flex items-center gap-4 bg-white border-2 border-aerora-border rounded-2xl px-5 py-4 text-left hover:border-aerora-blue hover:shadow-md transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-extrabold font-mono ${
                          isCompleted ? 'bg-aerora-greenLight text-aerora-green' : 'bg-aerora-bg text-aerora-muted'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4.5 h-4.5" /> : String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            {q.isAiGenerated && (
                              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">AI Generated</span>
                            )}
                            {q.airline && (
                              <span className="text-[10px] font-extrabold text-aerora-blue bg-aerora-blueLight px-2 py-0.5 rounded-full">{q.airline}</span>
                            )}
                            {isCompleted && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                ✓ Answered
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-aerora-ink group-hover:text-aerora-blue transition-colors leading-snug truncate">
                            {q.question}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {q.starApplicable && (
                            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-aerora-blueLight text-aerora-blue rounded-full">STAR</span>
                          )}
                          <ChevronRight className="w-4 h-4 text-aerora-border group-hover:text-aerora-blue transition-colors" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
