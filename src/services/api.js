// Frontend REST API Client — Connecting to Render Express Backend

const RENDER_BACKEND_URL = 'https://aviation-practice-backend.onrender.com/api';
const LOCAL_BACKEND_URL = 'http://localhost:5001/api';

const isLocalHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE_URL = isLocalHost ? LOCAL_BACKEND_URL : RENDER_BACKEND_URL;

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // Fallback gracefully to local dataset
    return null;
  }
}

export const api = {
  // Health
  async getHealth() {
    return await fetchJson('/health');
  },

  // Questions
  async getQuestions(category = null, search = '') {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const data = await fetchJson(`/questions?${params.toString()}`);
    return data?.questions || null;
  },

  async generateAiQuestion(airline = 'Emirates') {
    const data = await fetchJson('/ai/question-generate', {
      method: 'POST',
      body: JSON.stringify({ airline }),
    });
    return data?.question || null;
  },

  // Vocabulary
  async getVocabulary(category = null) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const data = await fetchJson(`/vocabulary?${params.toString()}`);
    return data?.vocabulary || null;
  },

  async getDailyWord() {
    const data = await fetchJson('/vocabulary/daily');
    return data?.dailyWord || null;
  },

  async fetchWordImages(word) {
    try {
      const query = encodeURIComponent(`${word} aviation`);
      const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${query}&gsrlimit=6&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=600&format=json&origin=*`;
      const res = await fetch(wikiUrl);
      if (res.ok) {
        const data = await res.json();
        const pages = data?.query?.pages || {};
        const images = Object.values(pages)
          .map((p) => p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url)
          .filter((u) => u && !u.includes('.pdf') && !u.includes('.tif') && !u.includes('.ogg') && !u.includes('.ogv') && !u.includes('.svg.png'));
        if (images.length > 0) return images;
      }
      const backendData = await fetchJson(`/vocabulary/images?word=${encodeURIComponent(word)}`);
      return backendData?.images || [];
    } catch (err) {
      return [];
    }
  },

  // Scenarios
  async getScenarios(category = null) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const data = await fetchJson(`/scenarios?${params.toString()}`);
    return data?.scenarios || null;
  },

  async submitScenarioAnswer(scenarioId, selectedOption) {
    const data = await fetchJson(`/scenarios/${scenarioId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ selectedOption }),
    });
    return data || null;
  },

  // Exercises
  async getExercises(category = null) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const data = await fetchJson(`/exercises?${params.toString()}`);
    return data?.exercises || null;
  },

  // Knowledge
  async getKnowledge(category = null) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const data = await fetchJson(`/knowledge?${params.toString()}`);
    return data?.topics || null;
  },

  // Progress State
  async getProgress() {
    const data = await fetchJson('/progress');
    return data?.progress || null;
  },

  async resetProgress() {
    const data = await fetchJson('/progress/reset', { method: 'POST' });
    return data?.progress || null;
  },

  async toggleTask(taskId) {
    const data = await fetchJson('/progress/task', {
      method: 'POST',
      body: JSON.stringify({ taskId }),
    });
    return data?.progress || null;
  },

  async saveWord(wordId) {
    const data = await fetchJson('/progress/word', {
      method: 'POST',
      body: JSON.stringify({ wordId }),
    });
    return data?.progress || null;
  },

  async completeQuestion(questionId, answer, starAnswer) {
    const data = await fetchJson('/progress/question', {
      method: 'POST',
      body: JSON.stringify({ questionId, answer, starAnswer }),
    });
    return data?.progress || null;
  },

  async completeScenario(scenarioId) {
    const data = await fetchJson('/progress/scenario', {
      method: 'POST',
      body: JSON.stringify({ scenarioId }),
    });
    return data?.progress || null;
  },

  async saveScenarioResponse(scenarioId, selectedOption, isCorrect) {
    const data = await fetchJson('/progress/scenario', {
      method: 'POST',
      body: JSON.stringify({ scenarioId, selectedOption, isCorrect }),
    });
    return data?.progress || null;
  },

  async completeSimulatorSession(session) {
    const data = await fetchJson('/progress/simulator', {
      method: 'POST',
      body: JSON.stringify({ session }),
    });
    return data?.progress || null;
  },

  // AI Evaluation
  async evaluateResponse(question, answer) {
    const data = await fetchJson('/ai/evaluate', {
      method: 'POST',
      body: JSON.stringify({ question, answer }),
    });
    return data?.evaluation || null;
  },
};
