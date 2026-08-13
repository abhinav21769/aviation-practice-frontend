import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Mic2, BookOpen, Globe, BookMarked,
  CheckCircle2, Circle, Flame, Clock, Star, Target, Brain, Heart, Sparkles
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

const categories = [
  { to: '/interview-prep', num: '01', label: 'Interview Prep', desc: 'HR, personal, airline & behavioral questions', icon: BookOpen, color: 'blue' },
  { to: '/aviation-english', num: '02', label: 'Aviation English', desc: '100+ essential cabin crew vocabulary terms', icon: Globe, color: 'teal' },
  { to: '/english-communication', num: '03', label: 'English & Communication', desc: 'Transform informal speech into cabin-crew quality language', icon: Brain, color: 'violet' },
  { to: '/scenarios', num: '04', label: 'Situational Judgment', desc: '50 realistic in-flight customer service scenarios', icon: BookMarked, color: 'amber' },
  { to: '/knowledge', num: '05', label: 'Cabin Crew Knowledge', desc: 'Aircraft anatomy, safety procedures & flight operations', icon: Star, color: 'emerald' },
  { to: '/practice', num: '06', label: 'Interview Simulator', desc: 'AI-powered mock interview with instant scoring & feedback', icon: Mic2, color: 'rose' },
];

const colorMap = {
  blue: { bg: 'bg-aerora-blueLight', text: 'text-aerora-blue', barBg: 'bg-aerora-blue', num: 'text-aerora-blue/40' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', barBg: 'bg-teal-600', num: 'text-teal-300' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', barBg: 'bg-violet-600', num: 'text-violet-300' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', barBg: 'bg-amber-600', num: 'text-amber-300' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', barBg: 'bg-emerald-600', num: 'text-emerald-300' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', barBg: 'bg-rose-600', num: 'text-rose-300' },
};

const categoryProgressKeys = {
  '/interview-prep': 'interview',
  '/aviation-english': 'vocabulary',
  '/english-communication': 'english',
  '/scenarios': 'scenarios',
  '/knowledge': 'knowledge',
  '/practice': 'simulator',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function DailyChallenge() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [done, setDone] = useState(false);
  const [answer, setAnswer] = useState('');

  const start = () => {
    setStarted(true);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); setDone(true); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-aerora-border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-aerora-blue" />
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-aerora-blue uppercase">Nishtha's 60-Sec Challenge</p>
      </div>
      <p className="text-xs font-semibold text-aerora-muted mb-2">Answer out loud in 60 seconds:</p>
      <p className="text-sm font-bold text-aerora-ink mb-4 leading-relaxed">
        "What does excellent customer service mean to you?"
      </p>
      {!started && !done && (
        <button onClick={start} className="w-full text-xs font-extrabold text-aerora-blue border border-aerora-blue/40 rounded-xl py-2.5 hover:bg-aerora-blueLight transition-colors tracking-wide">
          Start 60-Sec Challenge ⏱️
        </button>
      )}
      {started && !done && (
        <div>
          <div className="text-center text-3xl font-mono font-bold text-aerora-blue mb-3">
            0:{timeLeft.toString().padStart(2, '0')}
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type or speak your thoughts, Nishtha..."
            className="w-full text-xs font-medium border border-aerora-border rounded-xl p-3 resize-none h-20 focus:outline-none focus:border-aerora-blue bg-aerora-bg"
          />
        </div>
      )}
      {done && (
        <Link to="/practice" className="block text-center text-xs font-bold text-aerora-blue hover:underline">
          Review & Evaluate Answer →
        </Link>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { state, dispatch, todayCompleted, todayTotal } = useProgress();
  const todayPct = Math.round((todayCompleted / todayTotal) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero Header Personalized for Nishtha */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 bg-gradient-to-r from-aerora-blueLight via-white to-amber-50/40 p-8 sm:p-10 rounded-3xl border-2 border-blue-100/80 shadow-sm relative overflow-hidden"
      >
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aerora-blue text-white text-xs font-extrabold tracking-wide uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Specially Created For Nishtha
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-aerora-ink leading-[1.1] mb-4 tracking-tight font-heading">
            Welcome, Nishtha. ✨<br />
            <span className="text-aerora-blue font-extrabold">Your wings are waiting.</span>
          </h1>
          <p className="text-aerora-muted text-base sm:text-lg font-medium leading-relaxed mb-8">
            This personal cabin crew companion is built for your interview success. Practice real airline questions, master aviation English, and walk into your interview with total confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/practice"
              className="inline-flex items-center gap-2.5 bg-aerora-blue text-white px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-all shadow-md hover:shadow-lg">
              Start Practice Session <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link to="/grooming"
              className="inline-flex items-center gap-2.5 border-2 border-aerora-border text-aerora-ink px-7 py-3.5 rounded-xl text-sm font-bold hover:border-aerora-blue/40 hover:bg-white transition-all">
              Look Interview Ready ✨
            </Link>
          </div>
        </div>
        <div className="absolute top-6 right-6 opacity-10 hidden md:block">
          <Heart className="w-64 h-64 text-aerora-blue" />
        </div>
      </motion.section>

      {/* Motivational Card for Nishtha */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 bg-amber-50 border-2 border-amber-200/80 rounded-2xl p-5 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-700 font-extrabold text-lg flex-shrink-0">
            ✈️
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">
              Nishtha, you are more prepared than you think!
            </p>
            <p className="text-xs font-semibold text-amber-700">
              Consistency is key. 15 minutes of practice every day builds unstoppable confidence.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Today's Prep Plan for Nishtha */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border-2 border-aerora-border p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-aerora-blue uppercase mb-1">Nishtha's Daily Plan</p>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-aerora-ink font-heading">Day {state.currentDay} Prep</h2>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-aerora-muted border border-aerora-border rounded-full px-3 py-1">
                  <Clock className="w-3.5 h-3.5 text-aerora-blue" /> <strong className="text-aerora-ink">{state.todayEstimatedMinutes} min</strong>
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-aerora-blue font-heading">
                {todayCompleted}<span className="text-aerora-muted text-xl font-bold">/{todayTotal}</span>
              </div>
              <p className="text-xs font-bold text-aerora-muted uppercase tracking-wider">Completed</p>
            </div>
          </div>

          <div className="mb-4 bg-aerora-bg/70 p-3.5 rounded-xl border border-aerora-border/60">
            <p className="text-[10px] font-bold text-aerora-muted uppercase tracking-wider mb-0.5 font-heading">Today's Key Focus</p>
            <p className="text-sm font-bold text-aerora-ink">{state.todayFocus}</p>
          </div>

          <div className="space-y-2.5 mb-6">
            {state.todayTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => dispatch({ type: 'TOGGLE_TASK', taskId: task.id })}
                className="w-full flex items-center gap-3.5 text-left hover:bg-aerora-bg/60 p-2.5 rounded-xl transition-colors group"
              >
                {task.completed
                  ? <CheckCircle2 className="w-5.5 h-5.5 text-aerora-green flex-shrink-0" />
                  : <Circle className="w-5.5 h-5.5 text-aerora-border group-hover:text-aerora-blue flex-shrink-0" />
                }
                <span className={`text-sm font-semibold ${task.completed ? 'line-through text-aerora-muted/70' : 'text-aerora-ink'}`}>
                  {task.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-aerora-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${todayPct}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="h-full bg-aerora-blue rounded-full"
              />
            </div>
            <span className="text-xs font-bold text-aerora-blue">{todayPct}%</span>
          </div>
        </motion.div>

        {/* Streak + Quick Stats + Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          {/* Streak */}
          <div className="bg-white rounded-2xl border-2 border-aerora-border p-5 shadow-sm">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-11 h-11 bg-amber-50 border border-amber-200/60 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-500 fill-amber-400" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-aerora-ink font-heading leading-none mb-1">
                  {state.currentStreak} <span className="text-sm font-bold text-aerora-muted">Days</span>
                </div>
                <p className="text-xs font-bold text-amber-700">Nishtha's Prep Streak 🔥</p>
              </div>
            </div>
            <div className="flex gap-1.5 mt-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${i < state.currentStreak ? 'bg-amber-400' : 'bg-aerora-border'}`} />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border-2 border-aerora-border p-5 shadow-sm">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-aerora-blue uppercase mb-4">Nishtha's Progress</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: state.questionsAnswered, label: 'Questions' },
                { val: state.wordsLearned, label: 'Aviation Terms' },
                { val: state.scenariosCompleted, label: 'Scenarios' },
                { val: state.mockInterviews, label: 'Mock Sessions' },
              ].map(({ val, label }) => (
                <div key={label} className="bg-aerora-bg/60 p-3 rounded-xl border border-aerora-border/40">
                  <div className="text-2xl font-extrabold text-aerora-ink font-heading">{val}</div>
                  <div className="text-xs font-bold text-aerora-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <DailyChallenge />
        </motion.div>
      </div>

      {/* Preparation Categories */}
      <section>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-6">Preparation Modules</p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {categories.map((cat) => {
            const c = colorMap[cat.color];
            const progressKey = categoryProgressKeys[cat.to];
            const progress = progressKey ? (state.categoryProgress[progressKey] || 0) : 0;
            return (
              <motion.div key={cat.to} variants={itemVariants}>
                <Link
                  to={cat.to}
                  className="group block bg-white rounded-2xl border-2 border-aerora-border p-6 hover:border-aerora-blue hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center border border-black/5`}>
                      <cat.icon className={`w-5.5 h-5.5 ${c.text}`} />
                    </div>
                    <span className={`text-3xl font-extrabold ${c.num} font-heading`}>{cat.num}</span>
                  </div>
                  <h3 className="text-base font-bold text-aerora-ink mb-1.5 group-hover:text-aerora-blue transition-colors font-heading">
                    {cat.label}
                  </h3>
                  <p className="text-xs font-medium text-aerora-muted leading-relaxed mb-5">{cat.desc}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-aerora-bg rounded-full overflow-hidden">
                      <div
                        className={`h-full ${c.barBg} rounded-full transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-aerora-ink">{progress}%</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
