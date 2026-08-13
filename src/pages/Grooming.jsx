import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, ChevronDown } from 'lucide-react';

const sections = [
  {
    id: 'appearance',
    title: 'Appearance & Grooming',
    icon: '👗',
    items: [
      'Hair is neat, clean, and professionally styled — pulled back if long',
      'Nails are clean and trimmed; conservative nail color if painted',
      'Minimal, tasteful accessories — small earrings, simple watch',
      'Makeup is polished and professional; natural tones work best',
      'Shoes are clean, polished, and comfortable with low/medium heel',
      'Clothing is well-fitted, pressed, and formal — suit or business attire',
      'No visible tattoos (in line with standard airline regulations)',
      'Perfume/cologne is subtle — never overpowering in enclosed spaces',
    ],
  },
  {
    id: 'body_language',
    title: 'Body Language & Posture',
    icon: '🧍',
    items: [
      'Maintain warm, confident eye contact with interviewers',
      'Smile genuinely — a natural, welcoming smile builds rapport',
      'Sit upright with relaxed, open posture — feet flat on floor',
      'Avoid crossing arms — uncrossed arms signal openness',
      'Use subtle, natural hand gestures when speaking',
      'Walk with confidence — shoulders relaxed and head held high',
      'Nod to signal active listening during interviewer questions',
      'Avoid fidgeting — keep hands loosely folded in lap',
    ],
  },
  {
    id: 'etiquette',
    title: 'Interview Etiquette',
    icon: '🤝',
    items: [
      'Arrive 10–15 minutes early — never rush or arrive late',
      'Greet receptionists and staff with warmth — every interaction counts',
      'Knock before entering the interview room and wait for invitation',
      'Introduce yourself clearly and offer a firm handshake if extended',
      'Wait to be invited before sitting down',
      'Ensure phone is powered off or silenced before entering',
      'Thank each interviewer by name when concluding the interview',
      'Send a brief, polite thank-you email within 24 hours',
    ],
  },
  {
    id: 'communication',
    title: 'Communication & Tone',
    icon: '💬',
    items: [
      'Speak clearly at a steady, calm pace — do not rush',
      'Use professional aviation & customer service vocabulary',
      'Structure answers with clear Situation, Action, and Result',
      'Listen fully before formulating your response',
      'Pause briefly to gather your thoughts — pauses show composure',
      'Project warmth and genuine enthusiasm for serving passengers',
      'Always speak respectfully about past employers and colleagues',
    ],
  },
];

function ChecklistSection({ section }) {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState([]);

  const toggle = (item) => {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const pct = Math.round((checked.length / section.items.length) * 100);

  return (
    <div className="bg-white border-2 border-aerora-border rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-aerora-bg/40 transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <span className="text-3xl">{section.icon}</span>
          <div className="text-left">
            <h3 className="text-lg font-extrabold text-aerora-ink font-heading">{section.title}</h3>
            <p className="text-xs font-bold text-aerora-muted">{checked.length} of {section.items.length} items checked</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-2 bg-aerora-bg rounded-full overflow-hidden border border-aerora-border/40">
            <div className="h-full bg-aerora-blue rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-aerora-muted" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-2.5 border-t-2 border-aerora-border pt-4">
              {section.items.map((item) => {
                const isChecked = checked.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className="w-full flex items-start gap-3.5 text-left hover:bg-aerora-bg/60 p-2.5 rounded-xl transition-colors group"
                  >
                    {isChecked
                      ? <CheckSquare className="w-5.5 h-5.5 text-aerora-blue flex-shrink-0 mt-0.5" />
                      : <Square className="w-5.5 h-5.5 text-aerora-border group-hover:text-aerora-blue flex-shrink-0 mt-0.5" />
                    }
                    <span className={`text-sm font-semibold leading-relaxed ${isChecked ? 'text-aerora-muted line-through' : 'text-aerora-ink'}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Grooming() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Presentation</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Look & Feel Interview Ready</h1>
        <p className="text-aerora-muted text-base font-medium mb-6 max-w-xl leading-relaxed">
          First impressions in a cabin crew interview happen within seconds. Use these checklists to ensure you feel polished and confident.
        </p>
        <div className="bg-aerora-blueLight rounded-2xl p-5 mb-8 border-2 border-blue-200">
          <p className="text-sm font-bold text-aerora-ink leading-relaxed">
            <strong className="text-aerora-blue font-extrabold">Airline Tip:</strong> Airlines value warmth, authenticity, and natural composure above rigid perfection.
          </p>
        </div>
      </motion.div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <ChecklistSection section={section} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
