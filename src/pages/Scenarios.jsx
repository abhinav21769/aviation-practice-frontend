import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookMarked, CheckCircle2, ChevronRight, RotateCcw,
  Sparkles, HelpCircle, ArrowLeft, ShieldCheck, Target, Award
} from 'lucide-react';
import { api } from '../services/api';
import { useProgress } from '../context/ProgressContext';
import AviationLoader, { CardSkeleton } from '../components/shared/AviationLoader';

const scenarioCategories = [
  { id: 'medical', label: 'Medical Emergencies' },
  { id: 'disruptive_passenger', label: 'Disruptive Passengers' },
  { id: 'safety_security', label: 'Safety & Security' },
  { id: 'service_recovery', label: 'Service Recovery' },
  { id: 'crew_cooperation', label: 'Crew Communication' },
  { id: 'special_needs', label: 'Special Needs Passengers' },
  { id: 'irregular_ops', label: 'Irregular Operations' },
];

function ScenarioDetail({ scenario, onBack, onNext }) {
  const { state, dispatch } = useProgress();
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  // Check if scenario was already completed
  useEffect(() => {
    const existing = (state.scenarioResponses || []).find((r) => r.scenarioId === scenario.id);
    if (existing) {
      setSelected(existing.selectedOption);
      setRevealed(true);
    } else {
      setSelected(null);
      setRevealed(false);
    }
  }, [scenario.id, state.scenarioResponses]);

  const handleAnswer = async (optionId) => {
    if (revealed || evaluating) return;
    setSelected(optionId);
    setEvaluating(true);

    const isCorrect = optionId === scenario.bestAnswer;

    // Dispatch locally and persist to MongoDB
    dispatch({
      type: 'RECORD_SCENARIO_ANSWER',
      payload: {
        scenarioId: scenario.id,
        selectedOption: optionId,
        isCorrect,
      },
    });

    try {
      await api.saveScenarioResponse(scenario.id, optionId, isCorrect);
    } catch (err) {
      console.error('Failed to persist scenario response:', err);
    }

    setEvaluating(false);
    setRevealed(true);
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
    setShowFollowUp(false);
  };

  const isCorrect = selected === scenario.bestAnswer;

  return (
    <motion.div
      key={scenario.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-extrabold text-aerora-blue hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all scenarios</span>
        </button>

        {revealed && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-aerora-border text-xs font-bold text-aerora-muted hover:text-aerora-ink hover:bg-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-practice Scenario
          </button>
        )}
      </div>

      <div className="bg-white p-7 sm:p-9 rounded-3xl border-2 border-aerora-border shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Situation & Options */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
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
                <span className="text-xs font-bold text-aerora-muted">
                  {scenarioCategories.find(c => c.id === scenario.category)?.label || 'General Scenario'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-aerora-ink font-heading">{scenario.title}</h2>
            </div>

            {/* The Situation */}
            <div className="bg-aerora-bg rounded-2xl p-5 border border-aerora-border/60">
              <p className="text-xs font-extrabold text-aerora-blue uppercase tracking-wider mb-2">The Customer Situation</p>
              <p className="text-base font-semibold text-aerora-ink leading-relaxed">{scenario.situation}</p>
            </div>

            {/* Options List */}
            <div>
              <p className="text-xs font-extrabold text-aerora-muted uppercase tracking-wider mb-3">
                Select your professional course of action:
              </p>

              <div className="space-y-3">
                {scenario.options.map((opt) => {
                  const isSelected = selected === opt.id;
                  const isBest = opt.id === scenario.bestAnswer;

                  let cardStyle = 'border-aerora-border bg-white hover:border-aerora-blue hover:shadow-sm cursor-pointer';
                  let badgeStyle = 'bg-aerora-border text-aerora-ink';
                  let badgeIcon = opt.id;

                  if (revealed) {
                    if (isBest) {
                      cardStyle = 'border-2 border-emerald-500 bg-emerald-50/90 shadow-sm';
                      badgeStyle = 'bg-emerald-600 text-white';
                      badgeIcon = '✓';
                    } else if (isSelected && !isBest) {
                      cardStyle = 'border-2 border-rose-500 bg-rose-50/90 shadow-sm';
                      badgeStyle = 'bg-rose-600 text-white';
                      badgeIcon = '✕';
                    } else {
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
                      className={`w-full flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all border-2 ${cardStyle}`}
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
            </div>
          </div>

          {/* Right Column: Feedback, Explanation & Follow-Up */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {!revealed ? (
              <div className="bg-aerora-bg rounded-2xl p-6 border border-aerora-border text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-aerora-blueLight text-aerora-blue flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-aerora-ink mb-1">Make Your Choice</h3>
                  <p className="text-xs font-medium text-aerora-muted leading-relaxed">
                    Read the customer situation carefully and select the response that best reflects airline safety, empathy, and service standards.
                  </p>
                </div>
                {scenario.keySkills?.length > 0 && (
                  <div className="pt-2 border-t border-aerora-border/60 text-left">
                    <p className="text-[10px] font-extrabold text-aerora-muted uppercase tracking-wider mb-2">Evaluated Competencies:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {scenario.keySkills.map((s) => (
                        <span key={s} className="text-xs font-bold px-2.5 py-1 bg-white border border-aerora-border rounded-full text-aerora-ink shadow-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Result Status Banner */}
                <div className={`rounded-2xl p-5 border-2 shadow-sm ${
                  isCorrect ? 'bg-emerald-50/90 border-emerald-300' : 'bg-rose-50/90 border-rose-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}>
                      {isCorrect ? '✓' : '✕'}
                    </div>
                    <div>
                      <p className={`text-xs font-extrabold uppercase tracking-wider ${
                        isCorrect ? 'text-emerald-800' : 'text-rose-800'
                      }`}>
                        {isCorrect ? 'Excellent Decision!' : 'Standard Airline Action'}
                      </p>
                      <p className={`text-xs font-bold ${
                        isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        Option {scenario.bestAnswer} is the gold standard response.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why It Works Best */}
                <div className="bg-white rounded-2xl p-5 border-2 border-aerora-border shadow-xs">
                  <p className="text-xs font-extrabold text-aerora-blue uppercase tracking-wider mb-1.5">Why Option {scenario.bestAnswer} Works Best:</p>
                  <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{scenario.explanation}</p>
                </div>

                {/* Key Competencies */}
                {scenario.keySkills?.length > 0 && (
                  <div className="bg-aerora-bg rounded-2xl p-4 border border-aerora-border/60">
                    <p className="text-xs font-extrabold text-aerora-muted uppercase tracking-wider mb-2">Key Competencies Tested:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {scenario.keySkills.map((s) => (
                        <span key={s} className="text-xs font-bold px-3 py-1 bg-white border border-aerora-border rounded-full text-aerora-ink shadow-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow Up Question */}
                {scenario.followUp && (
                  <div className="bg-white rounded-2xl p-4 border-2 border-aerora-border">
                    <button
                      onClick={() => setShowFollowUp(!showFollowUp)}
                      className="w-full flex items-center justify-between text-xs font-extrabold text-aerora-blue hover:underline"
                    >
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4" />
                        {showFollowUp ? 'Hide Interviewer Follow-Up' : 'Interviewer Follow-Up Question 💬'}
                      </span>
                      <span className="text-aerora-muted">{showFollowUp ? '▲' : '▼'}</span>
                    </button>
                    {showFollowUp && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 pt-3 border-t border-aerora-border">
                        <p className="text-xs font-extrabold text-aerora-ink mb-1">Interviewer Ask:</p>
                        <p className="text-sm font-semibold text-aerora-muted italic mb-3">"{scenario.followUp}"</p>
                        <p className="text-xs font-extrabold text-aerora-green uppercase tracking-wider mb-1">Model Answer:</p>
                        <p className="text-sm font-semibold text-aerora-ink">{scenario.followUpAnswer}</p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Next Scenario Button */}
                {onNext && (
                  <button
                    onClick={onNext}
                    className="w-full bg-aerora-blue text-white py-4 rounded-2xl text-base font-bold tracking-wide hover:bg-aerora-blue/90 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Next Scenario</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Scenarios() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useProgress();

  useEffect(() => {
    async function loadScenarios() {
      setLoading(true);
      const serverScenarios = await api.getScenarios();
      if (serverScenarios) setScenarios(serverScenarios);
      setLoading(false);
    }
    loadScenarios();
  }, []);

  const filteredScenarios = activeCategory ? scenarios.filter((s) => s.category === activeCategory) : scenarios;
  const selectedIdx = filteredScenarios.findIndex((s) => s.id === selectedScenario?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header only when no scenario is selected */}
      {!selectedScenario && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Practice</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Situational Judgment</h1>
          <p className="text-aerora-muted text-base font-medium max-w-xl">
            Practice handling real cabin crew situations with instant feedback and best-practice explanations.
          </p>
        </motion.div>
      )}

      {selectedScenario ? (
        <AnimatePresence mode="wait">
          <ScenarioDetail
            key={selectedScenario.id}
            scenario={selectedScenario}
            onBack={() => setSelectedScenario(null)}
            onNext={selectedIdx < filteredScenarios.length - 1 ? () => {
              setSelectedScenario(filteredScenarios[selectedIdx + 1]);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } : null}
          />
        </AnimatePresence>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="space-y-1.5">
              <button
                onClick={() => { setActiveCategory(null); setSelectedScenario(null); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                  !activeCategory ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:text-aerora-ink hover:bg-aerora-bg'
                }`}
              >
                <span>All Scenarios</span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${!activeCategory ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'}`}>{scenarios.length}</span>
              </button>
              {scenarioCategories.map((cat) => {
                const count = scenarios.filter((s) => s.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setSelectedScenario(null); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                      activeCategory === cat.id ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:text-aerora-ink hover:bg-aerora-bg'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 bg-white rounded-2xl p-5 border border-aerora-border shadow-sm">
              <p className="text-xs font-bold text-aerora-muted mb-1 uppercase tracking-wider">Completed Scenarios</p>
              <div className="text-3xl font-extrabold text-aerora-blue font-heading">{state.scenariosCompleted}</div>
            </div>
          </aside>

          {/* Scenario List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider">
                {filteredScenarios.length} scenarios {activeCategory ? `in ${scenarioCategories.find(c => c.id === activeCategory)?.label}` : ''}
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                <AviationLoader message="Loading cabin crew situational judgment scenarios..." size="sm" />
                <CardSkeleton count={5} />
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredScenarios.map((scenario) => {
                  const userResp = (state.scenarioResponses || []).find((r) => r.scenarioId === scenario.id);
                  const isDone = (state.completedScenarios || []).includes(scenario.id) || !!userResp;
                  const isCorrectAnswer = userResp?.isCorrect === true || (userResp?.selectedOption && userResp.selectedOption === scenario.bestAnswer);

                  return (
                    <motion.div
                      key={scenario.id}
                      onClick={() => {
                        setSelectedScenario(scenario);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group bg-white rounded-2xl border-2 border-aerora-border p-5 hover:border-aerora-blue hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide border ${
                            scenario.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            scenario.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>{scenario.difficulty}</span>
                          <span className="text-xs font-bold text-aerora-muted">{scenarioCategories.find(c => c.id === scenario.category)?.label || 'General'}</span>
                          {isDone && (
                            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                              isCorrectAnswer ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isCorrectAnswer ? '✓ Completed (Correct)' : '✓ Practiced'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-aerora-ink group-hover:text-aerora-blue transition-colors font-heading mb-1">{scenario.title}</h3>
                        <p className="text-sm font-semibold text-aerora-muted line-clamp-2 leading-relaxed">{scenario.situation}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-aerora-muted group-hover:text-aerora-blue group-hover:translate-x-1 transition-all flex-shrink-0" />
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
