import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

const exerciseCategories = [
  { id: 'professionalise', label: 'Polite Transformations' },
  { id: 'announcements', label: 'PA Announcements' },
  { id: 'dialogues', label: 'Passenger Dialogues' },
  { id: 'grammar', label: 'Aviation Grammar' },
];

function ProfessionaliseExercise({ exercise }) {
  const [attempt, setAttempt] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!attempt.trim()) return;
    setLoading(true);
    const result = await api.evaluateResponse(exercise.informalVersion, attempt);
    setFeedback({
      score: result.overallScore,
      feedback: result.strengths[0] || 'Good effort in refining your tone.',
      professionalism: result.scores.professionalism,
      empathy: result.scores.confidence,
      clarity: result.scores.communication,
    });
    setLoading(false);
  };

  return (
    <div className="max-w-xl">
      <h3 className="text-2xl font-extrabold text-aerora-ink mb-6 font-heading">{exercise.title}</h3>

      <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 mb-5 shadow-sm">
        <p className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider mb-2">Informal / Direct Phrase:</p>
        <p className="text-base font-bold text-aerora-ink italic">"{exercise.informalVersion}"</p>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-extrabold text-aerora-ink mb-2">Rewrite as a warm, professional request:</label>
        <textarea
          value={attempt}
          onChange={(e) => setAttempt(e.target.value)}
          className="w-full border-2 border-aerora-border rounded-2xl p-4 text-sm font-semibold text-aerora-ink bg-white resize-none h-24 focus:outline-none focus:border-aerora-blue transition-colors"
          placeholder="Type your improved version..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!attempt.trim() || loading}
        className="mb-6 px-6 py-3 bg-aerora-blue text-white rounded-xl text-sm font-bold tracking-wide disabled:opacity-40 hover:bg-aerora-blue/90 transition-colors shadow-sm"
      >
        {loading ? 'Evaluating via Backend API...' : 'Evaluate Professional Tone'}
      </button>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-aerora-greenLight border-2 border-aerora-green/40 rounded-2xl p-5">
              <p className="text-xs font-extrabold text-aerora-green uppercase tracking-wider mb-1">Tone Score: {feedback.score}%</p>
              <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{feedback.feedback}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Professional', val: feedback.professionalism },
                { label: 'Empathy', val: feedback.empathy },
                { label: 'Clarity', val: feedback.clarity },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white rounded-xl p-3 text-center border border-aerora-border shadow-sm">
                  <div className="text-xl font-extrabold text-aerora-ink font-heading">{val}%</div>
                  <div className="text-xs font-bold text-aerora-muted">{label}</div>
                </div>
              ))}
            </div>

            <div className="border-l-4 border-aerora-blue pl-4 bg-aerora-blueLight p-4 rounded-r-2xl border border-blue-100">
              <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-1">Model Airline Phrasing</p>
              <p className="text-sm font-semibold text-aerora-ink italic">"{exercise.formalVersion}"</p>
            </div>

            <p className="text-xs font-semibold text-aerora-muted bg-white border border-aerora-border rounded-xl p-4">{exercise.explanation}</p>

            <button onClick={() => { setAttempt(''); setFeedback(null); }} className="flex items-center gap-2 text-sm font-bold text-aerora-blue hover:underline">
              <RotateCcw className="w-4 h-4" /> Try Practice Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PassengerResponseExercise({ exercise }) {
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!response.trim()) return;
    setLoading(true);
    const result = await api.evaluateResponse(exercise.passengerStatement, response);
    setFeedback({
      professionalism: result.scores.professionalism,
      empathy: result.scores.confidence,
      clarity: result.scores.communication,
      grammar: result.scores.grammar,
      tone: result.scores.structure,
      feedback: result.strengths[0] || 'Good empathetic response.',
    });
    setLoading(false);
  };

  return (
    <div className="max-w-xl">
      <div className="bg-aerora-ink rounded-2xl p-6 mb-6 text-white shadow-md">
        <p className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider mb-2">Passenger Statement</p>
        <p className="text-lg font-bold leading-relaxed">"{exercise.passengerStatement}"</p>
        {exercise.context && <p className="text-white/70 text-xs font-semibold mt-2 italic">Context: {exercise.context}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-xs font-extrabold text-aerora-ink mb-2">Your professional in-flight response:</label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full border-2 border-aerora-border rounded-2xl p-4 text-sm font-semibold bg-white resize-none h-28 focus:outline-none focus:border-aerora-blue transition-colors"
          placeholder="How would you address this passenger with empathy and confidence?"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!response.trim() || loading}
        className="mb-6 px-6 py-3 bg-aerora-blue text-white rounded-xl text-sm font-bold tracking-wide disabled:opacity-40 hover:bg-aerora-blue/90 transition-colors shadow-sm"
      >
        {loading ? 'Evaluating via Backend API...' : 'Evaluate Passenger Response'}
      </button>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { label: 'Professional', val: feedback.professionalism },
                { label: 'Empathy', val: feedback.empathy },
                { label: 'Clarity', val: feedback.clarity },
                { label: 'Grammar', val: feedback.grammar },
                { label: 'Tone', val: feedback.tone },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white rounded-xl p-3 text-center border-2 border-aerora-border shadow-sm">
                  <div className="text-lg font-extrabold text-aerora-ink font-heading">{val}%</div>
                  <div className="text-[10px] font-bold text-aerora-muted">{label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-4 border border-aerora-border shadow-sm">
              <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{feedback.feedback}</p>
            </div>

            <div className="border-l-4 border-aerora-green pl-4 bg-aerora-greenLight p-4 rounded-r-2xl border border-emerald-100">
              <p className="text-[11px] font-extrabold text-aerora-green uppercase tracking-wider mb-1">Ideal Model Response</p>
              <p className="text-sm font-semibold text-aerora-ink leading-relaxed">"{exercise.idealResponse}"</p>
            </div>

            <button onClick={() => { setResponse(''); setFeedback(null); }} className="flex items-center gap-2 text-sm font-bold text-aerora-blue hover:underline">
              <RotateCcw className="w-4 h-4" /> Practice Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnnouncementExercise({ exercise }) {
  const [attempt, setAttempt] = useState('');
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="max-w-xl">
      <h3 className="text-2xl font-extrabold text-aerora-ink mb-2 font-heading">{exercise.title}</h3>
      <p className="text-sm font-semibold text-aerora-muted mb-5">{exercise.prompt}</p>

      <textarea
        value={attempt}
        onChange={(e) => setAttempt(e.target.value)}
        className="w-full border-2 border-aerora-border rounded-2xl p-4 text-sm font-semibold bg-white resize-none h-32 focus:outline-none focus:border-aerora-blue transition-colors mb-4"
        placeholder="Write your PA announcement script..."
      />

      <div className="flex gap-3 mb-6">
        <button onClick={() => setRevealed(!revealed)} className="px-5 py-3 border-2 border-aerora-border text-aerora-ink rounded-xl text-sm font-bold hover:bg-aerora-bg transition-colors">
          {revealed ? 'Hide Model Script' : 'Show Model Script'}
        </button>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-aerora-blueLight border-2 border-blue-200 rounded-2xl p-5">
              <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-2">Model PA Announcement</p>
              <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{exercise.modelAnnouncement}</p>
            </div>
            {exercise.tips && <p className="text-xs font-semibold text-aerora-muted bg-white border border-aerora-border rounded-xl p-4">{exercise.tips}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EnglishCommunication() {
  const [activeCategory, setActiveCategory] = useState('professionalise');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    async function loadExercises() {
      const serverExercises = await api.getExercises();
      if (serverExercises) setExercises(serverExercises);
    }
    loadExercises();
  }, []);

  const categoryExercises = exercises.filter((e) => e.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Communication</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">English & Communication</h1>
        <p className="text-aerora-muted text-base font-medium mb-8 max-w-xl">Transform everyday informal speech into confident, cabin-crew-quality language via REST API.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="space-y-1.5">
            {exerciseCategories.map((cat) => {
              const count = exercises.filter((e) => e.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedExercise(null); }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-colors text-left ${
                    activeCategory === cat.id ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:bg-aerora-bg hover:text-aerora-ink'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedExercise ? (
              <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setSelectedExercise(null)} className="text-xs font-bold text-aerora-blue hover:underline mb-6 block">
                  ← Back to exercises
                </button>
                {selectedExercise.category === 'professionalise' && <ProfessionaliseExercise exercise={selectedExercise} />}
                {selectedExercise.category === 'passenger_response' && <PassengerResponseExercise exercise={selectedExercise} />}
                {selectedExercise.category === 'announcements' && <AnnouncementExercise exercise={selectedExercise} />}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider mb-4">{categoryExercises.length} exercises</p>
                <div className="space-y-2.5">
                  {categoryExercises.map((ex, i) => (
                    <motion.button
                      key={ex.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedExercise(ex)}
                      className="w-full flex items-start gap-4 bg-white border-2 border-aerora-border rounded-2xl px-5 py-4 text-left hover:border-aerora-blue hover:shadow-md transition-all group"
                    >
                      <div className="w-8 h-8 bg-aerora-blueLight rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-extrabold font-mono text-aerora-blue mt-0.5 border border-blue-100">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-aerora-ink group-hover:text-aerora-blue transition-colors mb-1 font-heading">
                          {ex.title || (ex.passengerStatement ? ex.passengerStatement.slice(0, 65) + '...' : 'Communication Exercise')}
                        </p>
                        {ex.informalVersion && <p className="text-xs font-semibold text-aerora-muted truncate italic">"{ex.informalVersion}"</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-aerora-border group-hover:text-aerora-blue transition-colors flex-shrink-0 mt-1" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
