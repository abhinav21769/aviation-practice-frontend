import { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../services/api';

const STORAGE_KEY = 'aerora_progress';

const initialState = {
  userName: 'Nishtha',
  questionsAnswered: 0,
  wordsLearned: 0,
  scenariosCompleted: 0,
  mockInterviews: 0,
  daysActive: 1,
  overallProgress: 0,
  currentStreak: 0,
  lastActiveDate: new Date().toDateString(),
  currentDay: 1,
  todayTasks: [
    { id: 't1', label: 'Learn 5 aviation terms', completed: false },
    { id: 't2', label: 'Practice 3 interview questions', completed: false },
    { id: 't3', label: 'Complete 5 situational scenarios', completed: false },
    { id: 't4', label: 'Practice one English response', completed: false },
  ],
  todayFocus: 'Personal Introduction & Customer Service Excellence',
  todayEstimatedMinutes: 20,
  savedWords: [],
  completedQuestions: [],
  questionResponses: [],
  completedScenarios: [],
  scenarioResponses: [],
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  categoryProgress: {
    interview: 0,
    vocabulary: 0,
    english: 0,
    scenarios: 0,
    knowledge: 0,
    simulator: 0,
  },
  simulatorSessions: [],
};

function progressReducer(state, action) {
  switch (action.type) {
    case 'RESET_PROGRESS': {
      localStorage.removeItem(STORAGE_KEY);
      return { ...initialState };
    }
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
      const { questionId, answer, starAnswer } = typeof action.payload === 'object' ? action.payload : { questionId: action.questionId };
      api.completeQuestion(questionId, answer, starAnswer);
      
      const responses = state.questionResponses || [];
      const existingIdx = responses.findIndex((r) => r.questionId === questionId);
      let updatedResponses = [...responses];
      if (existingIdx >= 0) {
        updatedResponses[existingIdx] = {
          ...updatedResponses[existingIdx],
          answer: answer !== undefined ? answer : updatedResponses[existingIdx].answer,
          starAnswer: starAnswer !== undefined ? starAnswer : updatedResponses[existingIdx].starAnswer,
          answeredAt: new Date(),
        };
      } else if (answer || starAnswer) {
        updatedResponses.push({ questionId, answer: answer || '', starAnswer: starAnswer || null, answeredAt: new Date() });
      }

      const isNew = !state.completedQuestions.includes(questionId);
      return {
        ...state,
        questionResponses: updatedResponses,
        completedQuestions: isNew ? [...state.completedQuestions, questionId] : state.completedQuestions,
        questionsAnswered: isNew ? state.questionsAnswered + 1 : state.questionsAnswered,
        categoryProgress: {
          ...state.categoryProgress,
          interview: isNew ? Math.min(100, state.categoryProgress.interview + 2) : state.categoryProgress.interview,
        },
      };
    }
    case 'COMPLETE_SCENARIO':
    case 'RECORD_SCENARIO_ANSWER': {
      const payload = action.payload || action;
      const { scenarioId, selectedOption, isCorrect } = payload;
      const responses = state.scenarioResponses || [];
      const existingIndex = responses.findIndex((r) => r.scenarioId === scenarioId);
      let updatedResponses = [...responses];
      if (existingIndex >= 0) {
        updatedResponses[existingIndex] = {
          scenarioId,
          selectedOption,
          isCorrect: Boolean(isCorrect),
          answeredAt: new Date(),
        };
      } else {
        updatedResponses.push({
          scenarioId,
          selectedOption,
          isCorrect: Boolean(isCorrect),
          answeredAt: new Date(),
        });
      }

      const isNew = !state.completedScenarios.includes(scenarioId);
      return {
        ...state,
        scenarioResponses: updatedResponses,
        completedScenarios: isNew ? [...state.completedScenarios, scenarioId] : state.completedScenarios,
        scenariosCompleted: isNew ? state.scenariosCompleted + 1 : state.scenariosCompleted,
        categoryProgress: {
          ...state.categoryProgress,
          scenarios: isNew ? Math.min(100, state.categoryProgress.scenarios + 2) : state.categoryProgress.scenarios,
        },
      };
    }
    case 'LEARN_WORD': {
      const wordId = action.wordId;
      const isNew = wordId && !(state.savedWords || []).includes(wordId);
      if (wordId && isNew) {
        api.saveWord(wordId);
      }
      const updatedSaved = isNew ? [...(state.savedWords || []), wordId] : (state.savedWords || []);
      return {
        ...state,
        savedWords: updatedSaved,
        wordsLearned: isNew ? state.wordsLearned + 1 : state.wordsLearned,
        categoryProgress: {
          ...state.categoryProgress,
          vocabulary: Math.min(100, Math.round((updatedSaved.length / 102) * 100)),
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
    } catch {
      // ignore
    }
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
