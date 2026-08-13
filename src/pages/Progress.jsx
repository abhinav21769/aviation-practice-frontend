import { motion } from 'framer-motion';
import { BookOpen, Globe, BookMarked, Mic2, Star, Brain, Calendar, TrendingUp, Award } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { useProgress } from '../context/ProgressContext';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const categoryIcons = {
  interview: BookOpen,
  vocabulary: Globe,
  english: Brain,
  scenarios: BookMarked,
  knowledge: Star,
  simulator: Mic2,
};

const categoryLabels = {
  interview: 'Interview Prep',
  vocabulary: 'Aviation English',
  english: 'Communication',
  scenarios: 'Scenarios',
  knowledge: 'Knowledge',
  simulator: 'Simulator',
};

export default function Progress() {
  const { state } = useProgress();

  const weeklyData = state.weeklyProgress.map((mins, i) => ({ day: days[i], mins }));
  const radarData = Object.entries(state.categoryProgress).map(([k, v]) => ({
    subject: categoryLabels[k],
    value: v,
    fullMark: 100,
  }));

  const stats = [
    { val: state.questionsAnswered, label: 'Questions Practiced', icon: BookOpen },
    { val: state.wordsLearned, label: 'Words Learned', icon: Globe },
    { val: state.scenariosCompleted, label: 'Scenarios Completed', icon: BookMarked },
    { val: state.mockInterviews, label: 'Mock Interviews', icon: Mic2 },
    { val: state.daysActive, label: 'Days Practiced', icon: Calendar },
    { val: state.currentStreak, label: 'Day Streak', icon: TrendingUp },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Analytics</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink font-heading">Preparation Dashboard</h1>
            <p className="text-aerora-muted text-sm font-medium">Track your skill balance and weekly consistency.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border-2 border-aerora-border shadow-sm">
            <div className="text-4xl font-extrabold text-aerora-blue font-heading leading-none">{state.overallProgress}%</div>
            <div className="text-xs font-bold text-aerora-muted uppercase tracking-wider">Overall<br />Ready Score</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ val, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border-2 border-aerora-border p-5 shadow-sm hover:border-aerora-blue transition-colors"
          >
            <div className="text-3xl font-extrabold text-aerora-ink mb-1 font-heading">{val}</div>
            <div className="text-xs font-bold text-aerora-muted">{label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border-2 border-aerora-border p-6 shadow-sm"
        >
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-aerora-blue uppercase mb-5">
            This Week — Practice Time (Minutes)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barSize={30}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#171717' }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'white', border: '2px solid #E8E3DC', borderRadius: 12, fontSize: 12, fontWeight: 700 }}
                cursor={{ fill: '#EEF2F8' }}
                formatter={(val) => [`${val} min`, 'Practice Time']}
              />
              <Bar dataKey="mins" radius={[8, 8, 0, 0]}>
                {weeklyData.map((entry, i) => (
                  <Cell key={i} fill={entry.mins > 0 ? '#2B4C7E' : '#E8E3DC'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border-2 border-aerora-border p-6 shadow-sm"
        >
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-aerora-blue uppercase mb-5">Skill Balance Radar</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#E8E3DC" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 700, fill: '#171717' }} />
              <Radar name="Progress" dataKey="value" stroke="#2B4C7E" fill="#2B4C7E" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border-2 border-aerora-border p-6 shadow-sm mb-6"
      >
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-aerora-blue uppercase mb-6">Detailed Skill Breakdown</p>
        <div className="space-y-4">
          {Object.entries(state.categoryProgress).map(([key, pct], i) => {
            const Icon = categoryIcons[key];
            return (
              <div key={key} className="flex items-center gap-4">
                <div className="w-9 h-9 bg-aerora-blueLight rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <Icon className="w-4.5 h-4.5 text-aerora-blue" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-bold text-aerora-ink font-heading">{categoryLabels[key]}</span>
                    <span className="text-sm font-extrabold text-aerora-blue">{pct}%</span>
                  </div>
                  <div className="h-2 bg-aerora-bg rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
                      className="h-full bg-aerora-blue rounded-full"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-aerora-blueLight rounded-2xl border-2 border-blue-200 p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-aerora-blue" />
          <p className="text-base font-extrabold text-aerora-blue font-heading">Recommended Focus Areas</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(state.categoryProgress)
            .sort(([, a], [, b]) => a - b)
            .slice(0, 3)
            .map(([key, pct]) => (
              <div key={key} className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-sm font-bold text-aerora-ink mb-0.5">{categoryLabels[key]}</p>
                <p className="text-xs font-bold text-amber-700">{pct}% — Priority Focus</p>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
