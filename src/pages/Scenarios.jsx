import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, X, Sparkles, RotateCcw, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { useProgress } from '../context/ProgressContext';

const scenarioCategories = [
  { id: 'disruptive_passengers', label: 'Disruptive Passengers' },
  { id: 'medical_emergencies', label: 'Medical Emergencies' },
  { id: 'safety_violations', label: 'Safety Violations' },
  { id: 'service_recovery', label: 'Service Recovery' },
  { id: 'special_needs', label: 'Special Needs' },
  { id: 'team_coordination', label: 'Team Coordination' },
  { id: 'irregular_operations', label: 'Irregular Operations' },
];

function ScenarioDetail({ scenario, onBack, onNext }) {
  const { state, dispatch } = useProgress();
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  // Check if Nishtha already answered this scenario previously
  useEffect(() => {
    const existing = (state.scenarioResponses || []).find((r) => r.scenarioId === scenario.id);
    if (existing) {
      setSelected(existing.selectedOption);
      setRevealed(true);
    } else {
      setSelected(null);
      setRevealed(false);
      setShowFollowUp(false);
    }
  }, [scenario.id, state.scenarioResponses]);

  const handleAnswer = async (optionId) => {
    if (revealed || evaluating) return;
    setSelected(optionId);
    setEvaluating(true);

    try {
      const res = await api.submitScenarioAnswer(scenario.id, optionId);
      const isCorrect = res ? res.isCorrect : optionId === scenario.bestAnswer;
      dispatch({
        type: 'RECORD_SCENARIO_ANSWER',
        payload: { scenarioId: scenario.id, selectedOption: optionId, isCorrect },
      });
    } catch (err) {
      console.warn('Answer submit fallback:', err);
      dispatch({
        type: 'RECORD_SCENARIO_ANSWER',
        payload: { scenarioId: scenario.id, selectedOption: optionId, isCorrect: optionId === scenario.bestAnswer },
      });
    } finally {
      setEvaluating(false);
      setRevealed(true);
    }
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
    setShowFollowUp(false);
  };

  const isCorrect = selected === scenario.bestAnswer;

  return (
    <motion.div key={scenario.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-xs font-bold text-aerora-blue hover:underline block">
          ← Back to all scenarios
        </button>
        {revealed && (
          <button onClick={handleReset} className="flex items-center gap-1 text-xs font-bold text-aerora-muted hover:text-aerora-ink">
            <RotateCcw className="w-3.5 h-3.5" /> Re-practice Scenario
          </button>
        )}
      </div>

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

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {scenario.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isBest = opt.id === scenario.bestAnswer;

          let cardStyle = 'border-aerora-border bg-white hover:border-aerora-blue hover:shadow-sm cursor-pointer';
          let badgeStyle = 'bg-aerora-border text-aerora-ink';
          let badgeIcon = opt.id;

          if (revealed) {
            if (isBest) {
              // RIGHT OPTION (Always highlighted in Green)
              cardStyle = 'border-2 border-emerald-500 bg-emerald-50/90 shadow-sm';
              badgeStyle = 'bg-emerald-600 text-white';
              badgeIcon = '✓';
            } else if (isSelected && !isBest) {
              // WRONG SELECTED OPTION (Highlighted in Red)
              cardStyle = 'border-2 border-rose-500 bg-rose-50/90 shadow-sm';
              badgeStyle = 'bg-rose-600 text-white';
              badgeIcon = '✕';
            } else {
              // Non-selected options
              cardStyle = 'border-aerora-border bg-aerora-bg/60 opacity-40';
              badgeStyle = 'bg-aerora-border text-aerora-muted';
            }
          }

          return (
            <motion.button
              key={opt.id}
              onClick={() => handleAnswer(opt.id)}
              disabled={revealed || evaluating}
              whileTap={!revealed ? { scale: 0.99 } : {}}
              className={`w-full flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all ${cardStyle}`}
            >
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-colors ${badgeStyle}`}>
                {badgeIcon}
              </span>
              <div className="flex-1">
                <span className={`text-sm font-semibold leading-relaxed ${
                  revealed && isBest ? 'text-emerald-950 font-bold' :
                  revealed && isSelected && !isBest ? 'text-rose-950 font-bold' :
                  'text-aerora-ink'
                }`}>
                  {opt.text}
                </span>
                {revealed && isBest && (
                  <span className="block mt-1 text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                    ★ Best Airline Standard Action
                  </span>
                )}
                {revealed && isSelected && !isBest && (
                  <span className="block mt-1 text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">
                    ✕ Your Selected Choice
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Answer Evaluation Feedback */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 mb-6 border-2 shadow-sm ${
              isCorrect ? 'bg-emerald-50/80 border-emerald-300' : 'bg-amber-50/80 border-amber-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {isCorrect ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">Excellent Decision!</p>
                    <p className="text-[11px] font-bold text-emerald-600">Option {scenario.bestAnswer} is the gold standard.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm">✕</div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-rose-800">Incorrect Choice</p>
                    <p className="text-[11px] font-bold text-emerald-700">Correct standard: Option {scenario.bestAnswer}</p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white/80 rounded-xl p-4 border border-black/5 mb-4">
              <p className="text-xs font-extrabold text-aerora-ink uppercase tracking-wider mb-1.5">Why Option {scenario.bestAnswer} Works Best:</p>
              <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{scenario.explanation}</p>
            </div>

            {scenario.keySkills?.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-extrabold text-aerora-muted uppercase tracking-wider mb-1.5">Key Competencies Tested:</p>
                <div className="flex flex-wrap gap-1.5">
                  {scenario.keySkills.map((s) => (
                    <span key={s} className="text-[11px] font-extrabold px-3 py-1 bg-white border border-aerora-border rounded-full text-aerora-ink shadow-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {scenario.followUp && (
              <div className="border-t border-black/10 pt-4">
                <button
                  onClick={() => setShowFollowUp(!showFollowUp)}
                  className="flex items-center gap-1.5 text-xs font-extrabold text-aerora-blue hover:underline"
                >
                  <HelpCircle className="w-4 h-4" />
                  {showFollowUp ? 'Hide Interviewer Follow-Up Question' : 'View Interviewer Follow-Up Question 💬'}
                </button>
                {showFollowUp && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 bg-white p-4 rounded-xl border border-aerora-border">
                    <p className="text-xs font-extrabold text-aerora-ink mb-1">Interviewer Follow-Up:</p>
                    <p className="text-sm font-semibold text-aerora-muted italic mb-3">"{scenario.followUp}"</p>
                    <p className="text-xs font-extrabold text-aerora-green uppercase tracking-wider mb-1">Recommended Response:</p>
                    <p className="text-sm font-semibold text-aerora-ink">{scenario.followUpAnswer}</p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {revealed && onNext && (
        <button onClick={onNext} className="w-full bg-aerora-blue text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-colors shadow-md">
          Next Scenario →
        </button>
      )}
    </motion.div>
  );
}

export default function Scenarios() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);
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
        <p className="text-aerora-muted text-base font-medium mb-8 max-w-xl">50+ realistic in-flight scenarios with real-time answer verification via MongoDB Atlas.</p>
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
                  activeCategory === cat.id ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:bg-aerora-bg'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'}`}>{count}</span>
              </button>
            );
          })}

          <div className="mt-6 bg-white rounded-2xl p-4 border border-aerora-border shadow-sm">
            <p className="text-xs font-bold text-aerora-muted mb-1 uppercase tracking-wider">Completed Scenarios</p>
            <div className="text-3xl font-extrabold text-aerora-blue font-heading">{state.scenariosCompleted}</div>
          </div>
        </aside>

        {/* Scenario List or Detail */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedScenario ? (
              <ScenarioDetail
                key={selectedScenario.id}
                scenario={selectedScenario}
                onBack={() => setSelectedScenario(null)}
                onNext={selectedIdx < filteredScenarios.length - 1 ? () => setSelectedScenario(filteredScenarios[selectedIdx + 1]) : null}
              />
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {filteredScenarios.map((scenario) => {
                  const userResp = (state.scenarioResponses || []).find((r) => r.scenarioId === scenario.id);
                  const isDone = state.completedScenarios.includes(scenario.id);

                  return (
                    <div
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario)}
                      className="group bg-white rounded-2xl border-2 border-aerora-border p-5 hover:border-aerora-blue hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide border ${
                            scenario.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            scenario.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>{scenario.difficulty}</span>
                          <span className="text-xs font-bold text-aerora-muted">{scenarioCategories.find(c => c.id === scenario.category)?.label || 'General'}</span>
                          {isDone && (
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                              userResp?.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {userResp?.isCorrect ? '✓ Completed (Correct)' : '✓ Practiced'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-aerora-ink group-hover:text-aerora-blue transition-colors font-heading mb-1">{scenario.title}</h3>
                        <p className="text-xs font-semibold text-aerora-muted line-clamp-2 leading-relaxed">{scenario.situation}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-aerora-muted group-hover:text-aerora-blue group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
