import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { scenarios as fallbackScenarios, scenarioCategories } from '../data/scenarios';
import { api } from '../services/api';
import { useProgress } from '../context/ProgressContext';

function ScenarioDetail({ scenario, onBack, onNext }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const { dispatch } = useProgress();

  const handleAnswer = (optionId) => {
    if (revealed) return;
    setSelected(optionId);
    setRevealed(true);
    dispatch({ type: 'COMPLETE_SCENARIO', scenarioId: scenario.id });
  };

  const isCorrect = selected === scenario.bestAnswer;

  return (
    <motion.div key={scenario.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-xl">
      <button onClick={onBack} className="text-xs font-bold text-aerora-blue hover:underline mb-6 block">
        ← Back to all scenarios
      </button>

      <div className="flex items-center gap-2 mb-4">
        {scenario.isAiGenerated && (
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide bg-amber-500 text-white flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Generated
          </span>
        )}
        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide border ${
          scenario.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          scenario.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-rose-50 text-rose-700 border-rose-200'
        }`}>{scenario.difficulty}</span>
        <span className="text-xs font-bold text-aerora-muted">{scenarioCategories.find(c => c.id === scenario.category)?.label || 'General'}</span>
      </div>

      <h2 className="text-2xl font-extrabold text-aerora-ink mb-4 font-heading">{scenario.title}</h2>

      <div className="bg-white border-2 border-aerora-border rounded-2xl p-5 mb-6 shadow-sm">
        <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-2">The Customer Situation</p>
        <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{scenario.situation}</p>
      </div>

      <p className="text-xs font-extrabold text-aerora-muted uppercase tracking-wider mb-3">Select your professional course of action:</p>

      <div className="space-y-3 mb-6">
        {scenario.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isBest = opt.id === scenario.bestAnswer;
          let variant = 'default';
          if (revealed) {
            if (isBest) variant = 'correct';
            else if (isSelected && !isBest) variant = 'wrong';
          }

          return (
            <motion.button
              key={opt.id}
              onClick={() => handleAnswer(opt.id)}
              whileTap={!revealed ? { scale: 0.99 } : {}}
              className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all ${
                variant === 'correct'
                  ? 'border-aerora-green bg-aerora-greenLight'
                  : variant === 'wrong'
                  ? 'border-rose-400 bg-rose-50'
                  : revealed
                  ? 'border-aerora-border bg-aerora-bg opacity-50'
                  : 'border-aerora-border bg-white hover:border-aerora-blue hover:shadow-sm cursor-pointer'
              }`}
            >
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                variant === 'correct' ? 'bg-aerora-green text-white' :
                variant === 'wrong' ? 'bg-rose-500 text-white' :
                'bg-aerora-border text-aerora-ink'
              }`}>{opt.id}</span>
              <span className="text-sm font-semibold text-aerora-ink leading-relaxed">{opt.text}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-5 mb-6 border-2 ${isCorrect ? 'bg-aerora-greenLight border-aerora-green/40' : 'bg-aerora-amberLight border-aerora-amber/40'}`}>
            <div className="flex items-center gap-2 mb-3">
              {isCorrect ? <CheckCircle2 className="w-5 h-5 text-aerora-green" /> : <X className="w-5 h-5 text-aerora-amber" />}
              <p className={`text-xs font-extrabold uppercase tracking-wider ${isCorrect ? 'text-aerora-green' : 'text-aerora-amber'}`}>
                {isCorrect ? 'Correct Decision!' : `Best Choice: Option ${scenario.bestAnswer}`}
              </p>
            </div>
            <p className="text-sm font-semibold text-aerora-ink leading-relaxed mb-3">{scenario.explanation}</p>
            {scenario.keySkills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {scenario.keySkills.map((s) => (
                  <span key={s} className="text-[10px] font-extrabold px-2.5 py-1 bg-white border border-black/10 rounded-full text-aerora-ink">{s}</span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {revealed && onNext && (
        <button onClick={onNext} className="w-full bg-aerora-blue text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-colors shadow-sm">
          Next Scenario →
        </button>
      )}
    </motion.div>
  );
}

export default function Scenarios() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState(fallbackScenarios);
  const { state } = useProgress();

  useEffect(() => {
    async function loadScenarios() {
      const serverScenarios = await api.getScenarios();
      if (serverScenarios) setScenarios(serverScenarios);
    }
    loadScenarios();
  }, []);

  const filteredScenarios = activeCategory ? scenarios.filter((s) => s.category === activeCategory) : scenarios;
  const selectedIdx = filteredScenarios.findIndex((s) => s.id === selectedScenario?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Practice</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Situational Judgment</h1>
        <p className="text-aerora-muted text-base font-medium mb-8 max-w-xl">50+ realistic in-flight scenarios served via Express REST API.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <button
            onClick={() => { setActiveCategory(null); setSelectedScenario(null); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold mb-1.5 transition-colors ${
              !activeCategory ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:bg-aerora-bg'
            }`}
          >
            <span>All Scenarios</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${!activeCategory ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'}`}>{scenarios.length}</span>
          </button>
          {scenarioCategories.map((cat) => {
            const count = scenarios.filter((s) => s.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSelectedScenario(null); }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold mb-1.5 transition-colors ${
                  activeCategory === cat.id ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:bg-aerora-bg hover:text-aerora-ink'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'}`}>{count}</span>
              </button>
            );
          })}
        </aside>

        {/* Main */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedScenario ? (
              <ScenarioDetail
                key="detail"
                scenario={selectedScenario}
                onBack={() => setSelectedScenario(null)}
                onNext={selectedIdx < filteredScenarios.length - 1 ? () => setSelectedScenario(filteredScenarios[selectedIdx + 1]) : null}
              />
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider mb-4">{filteredScenarios.length} scenarios</p>
                <div className="space-y-2.5">
                  {filteredScenarios.map((s, i) => {
                    const isCompleted = state.completedScenarios.includes(s.id);
                    return (
                      <motion.button
                        key={s.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setSelectedScenario(s)}
                        className="w-full flex items-start gap-4 bg-white border-2 border-aerora-border rounded-2xl px-5 py-4 text-left hover:border-aerora-blue hover:shadow-md transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-extrabold font-mono mt-0.5 ${
                          isCompleted ? 'bg-aerora-greenLight text-aerora-green' : 'bg-aerora-bg text-aerora-muted'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4.5 h-4.5" /> : String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-aerora-ink group-hover:text-aerora-blue transition-colors mb-1 font-heading">{s.title}</p>
                          <p className="text-xs font-medium text-aerora-muted truncate">{s.situation.slice(0, 85)}...</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                            s.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' :
                            s.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' :
                            'bg-rose-50 text-rose-700'
                          }`}>{s.difficulty}</span>
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
