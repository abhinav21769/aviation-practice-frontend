import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { knowledgeTopics as fallbackTopics, knowledgeCategories } from '../data/knowledgeTopics';
import { api } from '../services/api';

function TopicDetail({ topic, onBack }) {
  return (
    <motion.div key={topic.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-2xl">
      <button onClick={onBack} className="text-xs font-bold text-aerora-blue hover:underline mb-6 block">← Back to all topics</button>

      <div className="text-5xl mb-4">{topic.icon}</div>
      <div className="mb-2">
        <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider">{knowledgeCategories.find(c => c.id === topic.category)?.label}</p>
      </div>
      <h2 className="text-3xl font-extrabold text-aerora-ink mb-1 font-heading">{topic.title}</h2>
      <p className="text-aerora-muted text-sm font-semibold mb-6">{topic.subtitle}</p>

      <div className="bg-white rounded-2xl p-6 mb-8 border-2 border-aerora-border shadow-sm">
        <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{topic.summary}</p>
      </div>

      <div className="space-y-6 mb-8">
        {topic.sections.map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <h3 className="text-lg font-extrabold text-aerora-ink mb-2 font-heading">{section.heading}</h3>
            <p className="text-sm font-medium text-aerora-muted leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-aerora-blueLight rounded-2xl p-5 border border-blue-100 mb-6">
        <p className="text-[11px] font-extrabold text-aerora-blue uppercase tracking-wider mb-2">Why Interviewers Ask This</p>
        <p className="text-sm font-semibold text-aerora-ink leading-relaxed">{topic.interviewRelevance}</p>
      </div>

      <div>
        <p className="text-[11px] font-extrabold text-aerora-muted uppercase tracking-wider mb-3">Key Aviation Facts</p>
        <div className="space-y-2.5">
          {topic.keyFacts.map((fact, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm font-semibold text-aerora-ink bg-white p-3 rounded-xl border border-aerora-border">
              <span className="text-aerora-blue font-bold flex-shrink-0">→</span>
              {fact}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Knowledge() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState(fallbackTopics);

  useEffect(() => {
    async function loadKnowledge() {
      const serverTopics = await api.getKnowledge();
      if (serverTopics) setTopics(serverTopics);
    }
    loadKnowledge();
  }, []);

  const filteredTopics = activeCategory ? topics.filter((t) => t.category === activeCategory) : topics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-aerora-blue uppercase mb-2">Knowledge Hub</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-aerora-ink mb-2 font-heading">Cabin Crew Knowledge</h1>
        <p className="text-aerora-muted text-base font-medium mb-8 max-w-xl">Essential aircraft, safety, and operational knowledge served via Express REST API.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <button
            onClick={() => { setActiveCategory(null); setSelectedTopic(null); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold mb-1.5 transition-colors ${
              !activeCategory ? 'bg-aerora-blue text-white shadow-sm' : 'text-aerora-muted hover:bg-aerora-bg'
            }`}
          >
            <span>All Knowledge Topics</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${!activeCategory ? 'bg-white/20 text-white' : 'bg-aerora-border/60 text-aerora-ink'}`}>{topics.length}</span>
          </button>
          {knowledgeCategories.map((cat) => {
            const count = topics.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSelectedTopic(null); }}
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

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedTopic ? (
              <TopicDetail key="detail" topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredTopics.map((topic, i) => (
                    <motion.button
                      key={topic.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedTopic(topic)}
                      className="flex items-start gap-4 bg-white border-2 border-aerora-border rounded-2xl p-5 text-left hover:border-aerora-blue hover:shadow-md transition-all group"
                    >
                      <div className="text-4xl flex-shrink-0">{topic.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-extrabold text-aerora-blue uppercase tracking-wider mb-1">
                          {knowledgeCategories.find(c => c.id === topic.category)?.label}
                        </p>
                        <p className="text-base font-extrabold text-aerora-ink group-hover:text-aerora-blue transition-colors mb-1 font-heading">{topic.title}</p>
                        <p className="text-xs font-semibold text-aerora-muted">{topic.subtitle}</p>
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
