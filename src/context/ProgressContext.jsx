import { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../services/api';

const STORAGE_KEY = 'aerora_progress';

const initialState = {
  userName: 'Nishtha',
  questionsAnswered: 47,
  wordsLearned: 126,
  scenariosCompleted: 23,
  mockInterviews: 8,
  daysActive: 5,
  overallProgress: 68,
  currentStreak: 7,
  lastActiveDate: new Date().toDateString(),
  currentDay: 12,
  todayTasks: [
    { id: 't1', label: 'Learn 5 aviation terms', completed: true },
    { id: 't2', label: 'Practice 3 interview questions', completed: false },
    { id: 't3', label: 'Complete 5 situational scenarios', completed: false },
    { id: 't4', label: 'Practice one English response', completed: true },
  ],
  todayFocus: 'Handling Difficult Passengers & Emergency Escalation',
  todayEstimatedMinutes: 25,
  savedWords: [],
  completedQuestions: [],
  completedScenarios: [],
  weeklyProgress: [20, 35, 15, 40, 25, 10, 30],
  categoryProgress: {
    interview: 72,
    vocabulary: 58,
    english: 45,
    scenarios: 63,
    knowledge: 40,
    simulator: 55,
  },
  simulatorSessions: [],
};

function progressReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_TASK': {
      const updatedTasks = state.todayTasks.map((t) =>
        t.id === action.taskId ? { ...t, completed: !t.completed } : t
      );
      api.toggleTask(action.taskId);
      return { ...state, todayTasks: updatedTasks };
    }
    case 'SAVE_WORD': {
      const alreadySaved = state.savedWords.includes(action.wordId);
      api.saveWord(action.wordId);
      return {
        ...state,
        savedWords: alreadySaved
          ? state.savedWords.filter((w) => w !== action.wordId)
          : [...state.savedWords, action.wordId],
      };
    }
    case 'COMPLETE_QUESTION': {
      if (state.completedQuestions.includes(action.questionId)) return state;
      api.completeQuestion(action.questionId);
      return {
        ...state,
        completedQuestions: [...state.completedQuestions, action.questionId],
        questionsAnswered: state.questionsAnswered + 1,
        categoryProgress: {
          ...state.categoryProgress,
          interview: Math.min(100, state.categoryProgress.interview + 2),
        },
      };
    }
    case 'COMPLETE_SCENARIO': {
      if (state.completedScenarios.includes(action.scenarioId)) return state;
      api.completeScenario(action.scenarioId);
      return {
        ...state,
        completedScenarios: [...state.completedScenarios, action.scenarioId],
        scenariosCompleted: state.scenariosCompleted + 1,
        categoryProgress: {
          ...state.categoryProgress,
          scenarios: Math.min(100, state.categoryProgress.scenarios + 2),
        },
      };
    }
    case 'LEARN_WORD': {
      return {
        ...state,
        wordsLearned: state.wordsLearned + 1,
        categoryProgress: {
          ...state.categoryProgress,
          vocabulary: Math.min(100, state.categoryProgress.vocabulary + 1),
        },
      };
    }
    case 'COMPLETE_SIMULATOR_SESSION': {
      api.completeSimulatorSession(action.session);
      return {
        ...state,
        mockInterviews: state.mockInterviews + 1,
        simulatorSessions: [...state.simulatorSessions, action.session],
        categoryProgress: {
          ...state.categoryProgress,
          simulator: Math.min(100, state.categoryProgress.simulator + 5),
        },
      };
    }
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(progressReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...init, ...JSON.parse(saved) } : init;
    } catch {
      return init;
    }
  });

  // Sync with Express backend API on mount
  useEffect(() => {
    async function loadBackendProgress() {
      const serverProgress = await api.getProgress();
      if (serverProgress) {
        dispatch({ type: 'LOAD_STATE', payload: serverProgress });
      }
    }
    loadBackendProgress();
  }, []);

  // Persist local backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const todayCompleted = state.todayTasks.filter((t) => t.completed).length;
  const todayTotal = state.todayTasks.length;

  return (
    <ProgressContext.Provider value={{ state, dispatch, todayCompleted, todayTotal }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
