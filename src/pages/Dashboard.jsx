import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Mic2, BookOpen, Globe, BookMarked,
  CheckCircle2, Circle, Flame, Clock, Star, Target, Brain, Heart, Sparkles,
  Award, Zap, Coffee, Moon, Sun, Calendar, Plane, Compass, Shield, Smile
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

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

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

function LoveNote({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="relative bg-gradient-to-br from-rose-50 via-white to-amber-50/50 border-2 border-rose-100/80 rounded-2xl p-6 mb-8"
    >
      <div className="absolute top-4 right-4 opacity-20">
        <Heart className="w-16 h-16 text-rose-300" />
      </div>
      <div className="relative z-10 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-400" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-rose-600 uppercase mb-1">A note for you</p>
          <p className="text-sm font-medium text-aerora-ink leading-relaxed">{children}</p>
        </div>
      </div>
    </motion.div>
  );
}

function CountdownCard({ label, date, icon: Icon, color }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculate = () => {
      const target = new Date(date).getTime();
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) return setTimeLeft('Today!');
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setTimeLeft(`${days}d ${hours}h`);
    };
    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className={`bg-white rounded-2xl border-2 border-${color}-100/80 p-5 shadow-sm text-center`}>
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-${color}-50 border border-${color}-200/60 flex items-center justify-center">
        <Icon className="w-6 h-6 text-${color}-600" />
      </div>
      <p className="text-[11px] font-extrabold tracking-[0.16em] text-${color}-600 uppercase mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-aerora-ink font-heading">{timeLeft}</p>
    </div>
  );
}

function MotivationalCard({ icon: Icon, title, message, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white rounded-2xl border-2 border-${color}-100/80 p-5 shadow-sm`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`w-10 h-10 rounded-xl bg-${color}-50 border border-${color}-200/60 flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5.5 h-5.5 text-${color}-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-${color}-800 mb-1">{title}</p>
          <p className="text-xs font-medium text-aerora-muted leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { state, dispatch, todayCompleted, todayTotal } = useProgress();
  const todayPct = Math.round((todayCompleted / todayTotal) * 100);
  const [showLoveNote, setShowLoveNote] = useState(true);

  const interviewDate = new Date();
  interviewDate.setDate(interviewDate.getDate() + 45); // Example: 45 days from now

  const loveNotes = [
    "You're going to be the most incredible cabin crew member. I believe in you completely.",
    "Every minute you practice is a minute closer to your wings. So proud of your dedication.",
    "Remember: the girl who dreams of flying is already halfway there. Keep going, beautiful.",
    "Your kindness, patience, and grace are exactly what airlines are looking for. Own it.",
    "Nervous? Good. It means it matters. Channel that energy into preparation. I'm here for all of it.",
    "One day soon, you'll make an announcement at 35,000 feet and I'll be the proudest person on the ground."
  ];
  const currentNote = loveNotes[state.currentDay % loveNotes.length];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Romantic Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-aerora-blueLight/50 via-white to-rose-50/50" />
        <div className="absolute inset-0 bg-[url('/icons.svg')] opacity-[0.03] bg-center bg-cover" />
        <div className="relative z-10 p-8 sm:p-12 rounded-3xl border-2 border-blue-100/80">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aerora-blue text-white text-xs font-extrabold tracking-wide uppercase shadow-sm"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                Made with love for Nishtha ♡
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-bold"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-300 animate-heartbeat" />
                Day {state.currentDay} of your journey
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-aerora-ink leading-[1.05] mb-5 tracking-tight font-heading"
            >
              Good morning, beautiful ✨
              <br />
              <span className="text-aerora-blue font-extrabold">Your wings are waiting.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-aerora-muted text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-xl"
            >
              Every practice session, every vocabulary word, every scenario — it's all bringing you closer to that uniform. I'm so proud of how far you've come.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/practice"
                className="inline-flex items-center gap-2.5 bg-aerora-blue text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-aerora-blue/90 transition-all shadow-lg hover:shadow-xl group"
              >
                Start Today's Practice <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/grooming"
                className="inline-flex items-center gap-2.5 border-2 border-aerora-border text-aerora-ink px-8 py-4 rounded-xl text-sm font-bold hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                Look Interview Ready ✨
              </Link>
            </motion.div>
          </div>

          {/* Floating decorative elements */}
          <div className="absolute top-8 right-8 opacity-10 hidden lg:block">
            <Plane className="w-32 h-32 text-aerora-blue rotate-12" />
          </div>
          <div className="absolute bottom-8 left-8 opacity-10 hidden lg:block">
            <Compass className="w-24 h-24 text-amber-400" />
          </div>
        </div>
      </motion.section>

      {/* Love Note / Daily Affirmation */}
      {showLoveNote && (
        <LoveNote>
          {currentNote}
          <button
            onClick={() => setShowLoveNote(false)}
            className="mt-3 text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
          >
            <Heart className="w-3.5 h-3.5" /> Got it, thank you ♡
          </button>
        </LoveNote>
      )}

      {/* Countdown + Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        <CountdownCard
          label="Interview Target"
          date={interviewDate.toISOString().split('T')[0]}
          icon={Calendar}
          color="blue"
        />
        <CountdownCard
          label="Current Streak"
          date={new Date(Date.now() + state.currentStreak * 86400000).toISOString().split('T')[0]}
          icon={Flame}
          color="amber"
        />
        <CountdownCard
          label="Questions Practiced"
          date={new Date(Date.now() + state.questionsAnswered * 86400000).toISOString().split('T')[0]}
          icon={Award}
          color="violet"
        />
        <CountdownCard
          label="Aviation Terms Learned"
          date={new Date(Date.now() + state.wordsLearned * 86400000).toISOString().split('T')[0]}
          icon={Brain}
          color="emerald"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Today's Prep Plan - Main Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border-2 border-aerora-border p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-aerora-blue uppercase mb-1">Today's Flight Plan</p>
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

          <div className="mb-4 bg-gradient-to-r from-aerora-blueLight/50 to-rose-50/50 p-3.5 rounded-xl border border-aerora-border/60">
            <p className="text-[10px] font-bold text-aerora-muted uppercase tracking-wider mb-0.5 font-heading">Today's Key Focus</p>
            <p className="text-sm font-bold text-aerora-ink">{state.todayFocus}</p>
          </div>

          <div className="space-y-2.5 mb-6">
            {state.todayTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => dispatch({ type: 'TOGGLE_TASK', taskId: task.id })}
                className="w-full flex items-center gap-3.5 text-left hover:bg-aerora-bg/60 p-3 rounded-xl transition-colors group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-aerora-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {task.completed
                  ? <CheckCircle2 className="w-5.5 h-5.5 text-aerora-green flex-shrink-0 relative z-10" />
                  : <Circle className="w-5.5 h-5.5 text-aerora-border group-hover:text-aerora-blue flex-shrink-0 relative z-10 transition-colors" />
                }
                <span className={`text-sm font-semibold relative z-10 ${task.completed ? 'line-through text-aerora-muted/70' : 'text-aerora-ink'}`}>
                  {task.label}
                </span>
                {task.completed && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto text-xs font-bold text-aerora-green flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done!
                  </motion.span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-aerora-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${todayPct}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-aerora-blue to-rose-500 rounded-full"
              />
            </div>
            <span className="text-xs font-bold text-aerora-blue">{todayPct}%</span>
          </div>
        </motion.div>

        {/* Sidebar - Streak + Stats + Motivational Cards + Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          {/* Streak Card - Special */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-gradient-to-br from-amber-50 via-white to-rose-50/50 rounded-2xl border-2 border-amber-100/80 p-5 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 opacity-10">
              <Flame className="w-16 h-16 text-amber-300" />
            </div>
            <div className="relative z-10 flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-rose-400 rounded-xl flex items-center justify-center shadow-md">
                <Flame className="w-7 h-7 text-white fill-white" />
              </div>
              <div>
                <div className="text-4xl font-extrabold text-aerora-ink font-heading leading-none mb-1">
                  {state.currentStreak} <span className="text-sm font-bold text-aerora-muted">Days</span>
                </div>
                <p className="text-xs font-bold text-amber-700">Nishtha's Prep Streak 🔥</p>
              </div>
            </div>
            <div className="flex gap-1.5 mt-3 relative z-10">
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, type: 'spring' }}
                  className={`flex-1 h-3 rounded-full ${i < state.currentStreak ? 'bg-gradient-to-r from-amber-400 to-rose-400' : 'bg-aerora-border'}`}
                />
              ))}
            </div>
            {state.currentStreak > 0 && (
              <p className="text-xs font-medium text-amber-700 mt-3 text-center relative z-10">
                {state.currentStreak === 1 ? "Day one! The hardest part is starting — you did it." :
                 state.currentStreak < 7 ? "Building momentum... keep the fire alive!" :
                 state.currentStreak < 30 ? "Two weeks strong! Consistency is your superpower." :
                 "A month of dedication. You're unstoppable now."}
              </p>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-white rounded-2xl border-2 border-aerora-border p-5 shadow-sm"
          >
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-aerora-blue uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Nishtha's Progress
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: state.questionsAnswered, label: 'Questions', icon: Award, color: 'violet' },
                { val: state.wordsLearned, label: 'Aviation Terms', icon: Brain, color: 'emerald' },
                { val: state.scenariosCompleted, label: 'Scenarios', icon: BookMarked, color: 'amber' },
                { val: state.mockInterviews, label: 'Mock Sessions', icon: Mic2, color: 'rose' },
              ].map(({ val, label, icon: Icon, color }) => (
                <div key={label} className="bg-aerora-bg/60 p-3 rounded-xl border border-aerora-border/40 text-center group">
                  <Icon className={`w-5 h-5 mx-auto mb-2 text-${color}-500 group-hover:scale-110 transition-transform`} />
                  <div className="text-2xl font-extrabold text-aerora-ink font-heading">{val}</div>
                  <div className="text-xs font-bold text-aerora-muted">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Motivational Cards - Rotating */}
          <MotivationalCard
            icon={Shield}
            title="Safety First, Always"
            message="Your calm presence in emergencies is what passengers will remember. Trust your training."
            color="blue"
          />
          <MotivationalCard
            icon={Smile}
            title="Your Warmth is Your Strength"
            message="Airlines hire attitude first. Your genuine care for people? That can't be taught."
            color="rose"
          />
          <MotivationalCard
            icon={Zap}
            title="Nerves = You Care"
            message="That flutter before practice? It's proof this matters. Use it. Own it. Fly with it."
            color="amber"
          />

          <DailyChallenge />
        </motion.div>
      </div>

      {/* Preparation Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-6 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Preparation Modules
        </p>
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
            const isComplete = progress >= 100;
            return (
              <motion.div key={cat.to} variants={itemVariants}>
                <Link
                  to={cat.to}
                  className="group block bg-white rounded-2xl border-2 border-aerora-border p-6 hover:border-aerora-blue hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-aerora-blue/5 group-hover:to-transparent transition-all" />
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center border border-black/5 group-hover:scale-105 transition-transform`}>
                      <cat.icon className={`w-5.5 h-5.5 ${c.text}`} />
                    </div>
                    <span className={`text-3xl font-extrabold ${c.num} font-heading`}>{cat.num}</span>
                  </div>
                  <h3 className="text-base font-bold text-aerora-ink mb-1.5 group-hover:text-aerora-blue transition-colors font-heading relative z-10">
                    {cat.label}
                  </h3>
                  <p className="text-xs font-medium text-aerora-muted leading-relaxed mb-5 relative z-10">{cat.desc}</p>
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="flex-1 h-1.5 bg-aerora-bg rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        className={`h-full ${c.barBg} rounded-full`}
                      />
                    </div>
                    <span className={`text-xs font-bold ${isComplete ? 'text-aerora-green' : 'text-aerora-ink'}`}>
                      {isComplete ? '✓ Complete' : `${progress}%`}
                    </span>
                  </div>
                  {isComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 right-4"
                    >
                      <CheckCircle2 className="w-6 h-6 text-aerora-green" />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Closing Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-aerora-bg border border-aerora-border">
          <Heart className="w-5 h-5 text-rose-400 fill-rose-300 animate-heartbeat" />
          <span className="text-sm font-bold text-aerora-ink">
            You've got this, Nishtha. One day at a time. One module at a time. ♡
          </span>
        </div>
      </motion.div>
    </div>
  );
}