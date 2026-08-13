import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, ChevronRight, Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';
import { interviewQuestions } from '../data/interviewQuestions';
import { api } from '../services/api';
import { useProgress } from '../context/ProgressContext';

const SIMULATOR_QUESTIONS = interviewQuestions.slice(0, 10);

function MetricBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-bold text-aerora-ink">{label}</span>
        <span className="text-xs font-extrabold text-aerora-blue">{value}%</span>
      </div>
      <div className="h-2.5 bg-aerora-bg rounded-full overflow-hidden border border-aerora-border/40">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${value >= 80 ? 'bg-aerora-green' : value >= 60 ? 'bg-aerora-blue' : 'bg-aerora-amber'}`}
        />
      </div>
    </div>
  );
}

function FeedbackPanel({ feedback, onNext, isLast }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border-2 border-aerora-border shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-aerora-blueLight flex items-center justify-center flex-shrink-0 border border-blue-100">
          <span className="text-2xl font-extrabold text-aerora-blue font-heading">{feedback.overallScore}%</span>
        </div>
        <div>
          <p className="text-base font-extrabold text-aerora-ink font-heading">AI Backend Evaluation Score</p>
          <p className="text-xs font-bold text-aerora-muted">
            {feedback.overallScore >= 80 ? '🌟 Exceptional cabin-crew quality answer!' : feedback.overallScore >= 65 ? '👍 Good progress. Solid core structure.' : '💡 Practice more with the STAR framework.'}
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-aerora-border space-y-3.5 shadow-sm">
        <p className="text-xs font-extrabold text-aerora-blue uppercase tracking-wider mb-2">5-Point Metric Breakdown</p>
        <MetricBar label="Communication" value={feedback.scores.communication} />
        <MetricBar label="Confidence" value={feedback.scores.confidence} />
        <MetricBar label="Grammar & Fluency" value={feedback.scores.grammar} />
        <MetricBar label="Structure (STAR)" value={feedback.scores.structure} />
        <MetricBar label="Professionalism" value={feedback.scores.professionalism} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-aerora-greenLight rounded-2xl p-4 border border-aerora-green/30">
          <p className="text-[11px] font-extrabold text-aerora-green uppercase tracking-wider mb-2">Key Strengths</p>
          <ul className="space-y-1.5">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-xs font-semibold text-aerora-ink flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-aerora-green flex-shrink-0 mt-0.5" /> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-aerora-amberLight rounded-2xl p-4 border border-aerora-amber/30">
          <p className="text-[11px] font-extrabold text-aerora-amber uppercase tracking-wider mb-2">Areas for Improvement</p>
          <ul className="space-y-1.5">
            {feedback.improvements.map((s, i) => (
              <li key={i} className="text-xs font-semibold text-aerora-ink flex items-start gap-1.5">
                <ChevronRight className="w-4 h-4 text-aerora-amber flex-shrink-0 mt-0.5" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-l-4 border-aerora-blue bg-aerora-blueLight/70 rounded-r-2xl p-5 border border-blue-100">
        <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-1.5">Stronger Model Response</p>
        <p className="text-sm font-semibold text-aerora-ink leading-relaxed italic">"{feedback.strongerVersion}"</p>
      </div>

      {feedback.tip && (
        <div className="flex items-start gap-2.5 bg-white rounded-xl p-4 border border-aerora-border shadow-sm">
          <Sparkles className="w-4 h-4 text-aerora-blue flex-shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-aerora-muted leading-relaxed"><strong className="text-aerora-ink">Pro Tip:</strong> {feedback.tip}</p>
        </div>
      )}

      <button onClick={onNext} className="w-full bg-aerora-blue text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-colors shadow-md">
        {isLast ? 'View Full Interview Summary' : 'Next Question →'}
      </button>
    </motion.div>
  );
}

function SimulatorSession({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [allScores, setAllScores] = useState([]);

  const question = SIMULATOR_QUESTIONS[currentIdx];
  const isLast = currentIdx === SIMULATOR_QUESTIONS.length - 1;

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Try Chrome or Edge.');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    setListening(true);
    recognition.onresult = (e) => {
      setAnswer((a) => a + ' ' + e.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const result = await api.evaluateResponse(question.question, answer);
    setFeedback(result);
    setAllScores([...allScores, result.overallScore]);
    setLoading(false);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (isLast) {
      onComplete(allScores);
      return;
    }
    setCurrentIdx(currentIdx + 1);
    setAnswer('');
    setSubmitted(false);
    setFeedback(null);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-2xl border border-aerora-border shadow-sm">
        <div className="flex-1 flex gap-1.5">
          {SIMULATOR_QUESTIONS.map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${
              i < currentIdx ? 'bg-aerora-blue' : i === currentIdx ? 'bg-aerora-blue/40 animate-pulse' : 'bg-aerora-border'
            }`} />
          ))}
        </div>
        <span className="text-xs font-extrabold text-aerora-blue font-mono">{currentIdx + 1}/{SIMULATOR_QUESTIONS.length}</span>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key={`q-${currentIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white p-6 rounded-2xl border-2 border-aerora-border shadow-sm mb-6">
              <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-2">Question {currentIdx + 1}</p>
              <h2 className="text-2xl font-extrabold text-aerora-ink leading-snug font-heading">
                "{question.question}"
              </h2>
            </div>

            <div className="mb-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border-2 border-aerora-border rounded-2xl p-4 text-sm font-semibold text-aerora-ink bg-white resize-none h-36 focus:outline-none focus:border-aerora-blue transition-colors"
                placeholder="Type your response or tap the microphone to speak..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || loading}
                className="flex-1 bg-aerora-blue text-white py-3.5 rounded-xl text-sm font-bold tracking-wide disabled:opacity-40 hover:bg-aerora-blue/90 transition-colors shadow-sm"
              >
                {loading ? 'Evaluating via Express Backend...' : 'Submit Answer for AI Scoring'}
              </button>
              <button
                onClick={toggleMic}
                className={`p-3.5 rounded-xl border-2 transition-colors ${
                  listening ? 'border-rose-400 bg-rose-50 text-rose-600 animate-pulse' : 'border-aerora-border text-aerora-muted hover:border-aerora-blue hover:text-aerora-blue'
                }`}
              >
                {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        ) : feedback ? (
          <motion.div key={`f-${currentIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FeedbackPanel feedback={feedback} onNext={handleNext} isLast={isLast} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ResultsSummary({ scores, onRestart }) {
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto text-center bg-white p-8 rounded-3xl border-2 border-aerora-border shadow-md">
      <div className="w-24 h-24 rounded-full bg-aerora-blueLight border-2 border-blue-100 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl font-extrabold text-aerora-blue font-heading">{avg}%</span>
      </div>
      <h2 className="text-3xl font-extrabold text-aerora-ink mb-2 font-heading">Mock Interview Completed</h2>
      <p className="text-aerora-muted text-sm font-medium mb-8">
        Answered <strong className="text-aerora-ink">{scores.length} questions</strong>. Overall REST API score: <strong className="text-aerora-blue">{avg}%</strong>.
      </p>
      <button onClick={onRestart} className="w-full flex items-center justify-center gap-2 bg-aerora-blue text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-colors shadow-md">
        <RotateCcw className="w-4 h-4" /> Start New Practice Session
      </button>
    </motion.div>
  );
}

export default function Practice() {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [scores, setScores] = useState([]);
  const { dispatch } = useProgress();

  const handleComplete = (sessionScores) => {
    setScores(sessionScores);
    setCompleted(true);
    dispatch({ type: 'COMPLETE_SIMULATOR_SESSION', session: { scores: sessionScores, date: new Date().toISOString() } });
  };

  const handleRestart = () => {
    setStarted(false);
    setCompleted(false);
    setScores([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {!started && !completed && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Interview Simulator</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-aerora-ink mb-3 font-heading">
            Your Interview <span className="text-aerora-blue">Starts Now.</span>
          </h1>
          <p className="text-aerora-muted text-base font-medium mb-10 max-w-md leading-relaxed">
            Answer 10 real questions and get scored live via Express REST API.
          </p>

          <div className="flex gap-3">
            <button onClick={() => setStarted(true)} className="inline-flex items-center gap-2.5 bg-aerora-blue text-white px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-all shadow-md hover:shadow-lg">
              <Mic className="w-4.5 h-4.5" /> Begin Mock Interview Session
            </button>
          </div>
        </motion.div>
      )}

      {started && !completed && <SimulatorSession onComplete={handleComplete} />}
      {completed && <ResultsSummary scores={scores} onRestart={handleRestart} />}
    </div>
  );
}
