import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import { saveUserProgress, loadUserProgress } from '@/lib/firebaseClient';
import { Language } from '@/lib/i18n';

// Debounce helper for cloud sync
let syncTimeout: ReturnType<typeof setTimeout> | null = null;
const SYNC_DELAY_MS = 1000; // 1 second debounce

// Phase types
export type PhaseId = 'priming' | 'encoding' | 'reference' | 'retrieval' | 'interleaving' | 'overlearning';

// Progress tracking per category
export interface CategoryProgress {
  categoryId: string;
  primingCompleted: boolean;
  encodingCount: number; // Number of items with mnemonics
  retrievalAccuracy: number; // 0-100
  lastPracticed: string | null; // ISO date
}

// User's personal mnemonic for an item
export interface UserMnemonic {
  number: number;
  mnemonic: string;
  createdAt: string;
}

// Quiz result tracking
export interface QuizResult {
  timestamp: string;
  phase: PhaseId;
  categoryId: string | null; // null = mixed
  totalQuestions: number;
  correctAnswers: number;
  timeSpentMs: number;
}

// Speed drill record
export interface SpeedRecord {
  timestamp: string;
  count: number;
  timeMs: number;
  mode: 'sprint' | 'rapid-fire' | 'full-table';
}

interface AppState {
  // Auth state
  user: User | null;
  authLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;

  // Current phase navigation
  currentPhase: PhaseId;
  setCurrentPhase: (phase: PhaseId) => void;

  // Category progress
  categoryProgress: Record<string, CategoryProgress>;
  updateCategoryProgress: (categoryId: string, updates: Partial<CategoryProgress>) => void;
  markPrimingComplete: (categoryId: string) => void;

  // User mnemonics
  userMnemonics: Record<number, UserMnemonic>;
  setMnemonic: (number: number, mnemonic: string) => void;
  getMnemonic: (number: number) => string | null;

  // Quiz/retrieval state
  currentQuizCategory: string | null;
  setQuizCategory: (categoryId: string | null) => void;
  quizHistory: QuizResult[];
  addQuizResult: (result: Omit<QuizResult, 'timestamp'>) => void;

  // Speed records
  speedRecords: SpeedRecord[];
  addSpeedRecord: (record: Omit<SpeedRecord, 'timestamp'>) => void;
  getBestSpeed: (mode: SpeedRecord['mode']) => SpeedRecord | null;

  // Streak tracking
  currentStreak: number;
  longestStreak: number;
  updateStreak: (correct: boolean) => void;
  resetStreak: () => void;

  // Settings
  showEmoji: boolean;
  toggleShowEmoji: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Cloud sync
  syncToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;

  // Reset all progress
  resetProgress: () => void;
}

const initialCategoryProgress: Record<string, CategoryProgress> = {
  places: { categoryId: 'places', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
  people: { categoryId: 'people', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
  construction: { categoryId: 'construction', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
  instruments: { categoryId: 'instruments', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
  sports: { categoryId: 'sports', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
  body: { categoryId: 'body', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
  vehicles: { categoryId: 'vehicles', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
  weather: { categoryId: 'weather', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
  clothing: { categoryId: 'clothing', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
  celebrations: { categoryId: 'celebrations', primingCompleted: false, encodingCount: 0, retrievalAccuracy: 0, lastPracticed: null },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      authLoading: true,
      setUser: (user) => set({ user }),
      setAuthLoading: (loading) => set({ authLoading: loading }),

      // Current phase
      currentPhase: 'priming',
      setCurrentPhase: (phase) => {
        set({ currentPhase: phase });
        get().syncToCloud();
      },

      // Category progress
      categoryProgress: initialCategoryProgress,
      updateCategoryProgress: (categoryId, updates) => {
        set((state) => ({
          categoryProgress: {
            ...state.categoryProgress,
            [categoryId]: {
              ...state.categoryProgress[categoryId],
              ...updates,
              lastPracticed: new Date().toISOString(),
            },
          },
        }));
        // Auto-sync to cloud after update
        get().syncToCloud();
      },
      markPrimingComplete: (categoryId) => {
        set((state) => ({
          categoryProgress: {
            ...state.categoryProgress,
            [categoryId]: {
              ...state.categoryProgress[categoryId],
              primingCompleted: true,
            },
          },
        }));
        get().syncToCloud();
      },

      // User mnemonics
      userMnemonics: {},
      setMnemonic: (number, mnemonic) => {
        set((state) => ({
          userMnemonics: {
            ...state.userMnemonics,
            [number]: {
              number,
              mnemonic,
              createdAt: new Date().toISOString(),
            },
          },
        }));
        get().syncToCloud();
      },
      getMnemonic: (number) => get().userMnemonics[number]?.mnemonic ?? null,

      // Quiz state
      currentQuizCategory: null,
      setQuizCategory: (categoryId) => set({ currentQuizCategory: categoryId }),
      quizHistory: [],
      addQuizResult: (result) => {
        set((state) => ({
          quizHistory: [
            ...state.quizHistory,
            { ...result, timestamp: new Date().toISOString() },
          ],
        }));
        get().syncToCloud();
      },

      // Speed records
      speedRecords: [],
      addSpeedRecord: (record) => {
        set((state) => ({
          speedRecords: [
            ...state.speedRecords,
            { ...record, timestamp: new Date().toISOString() },
          ],
        }));
        get().syncToCloud();
      },
      getBestSpeed: (mode) => {
        const records = get().speedRecords.filter((r) => r.mode === mode);
        if (records.length === 0) return null;
        return records.reduce((best, current) =>
          current.count / current.timeMs > best.count / best.timeMs ? current : best
        );
      },

      // Streak
      currentStreak: 0,
      longestStreak: 0,
      updateStreak: (correct) => {
        set((state) => {
          if (correct) {
            const newStreak = state.currentStreak + 1;
            return {
              currentStreak: newStreak,
              longestStreak: Math.max(state.longestStreak, newStreak),
            };
          }
          return { currentStreak: 0 };
        });
        get().syncToCloud();
      },
      resetStreak: () => set({ currentStreak: 0 }),

      // Settings
      showEmoji: true,
      toggleShowEmoji: () => {
        set((state) => ({ showEmoji: !state.showEmoji }));
        get().syncToCloud();
      },
      language: 'fr',
      setLanguage: (lang) => set({ language: lang }),

      // Cloud sync with debounce to avoid excessive writes
      syncToCloud: async () => {
        const { user } = get();
        if (!user) return;

        // Clear any pending sync
        if (syncTimeout) {
          clearTimeout(syncTimeout);
        }

        // Debounce: wait before syncing to batch rapid changes
        syncTimeout = setTimeout(async () => {
          const state = get();
          await saveUserProgress(user.uid, {
            categoryProgress: state.categoryProgress,
            userMnemonics: state.userMnemonics,
            quizHistory: state.quizHistory,
            speedRecords: state.speedRecords,
            currentStreak: state.currentStreak,
            longestStreak: state.longestStreak,
            showEmoji: state.showEmoji,
            currentPhase: state.currentPhase,
          });
        }, SYNC_DELAY_MS);
      },

      loadFromCloud: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const data = await loadUserProgress(user.uid);
          if (data) {
            set({
              categoryProgress: data.categoryProgress || initialCategoryProgress,
              userMnemonics: data.userMnemonics || {},
              quizHistory: (data.quizHistory || []) as QuizResult[],
              speedRecords: (data.speedRecords || []) as SpeedRecord[],
              currentStreak: data.currentStreak || 0,
              longestStreak: data.longestStreak || 0,
              showEmoji: data.showEmoji ?? true,
              currentPhase: (data.currentPhase as PhaseId) || 'priming',
            });
          }
        } catch (error) {
          console.error('Failed to load from cloud:', error);
        }
      },

      // Reset
      resetProgress: () => {
        set({
          categoryProgress: initialCategoryProgress,
          userMnemonics: {},
          quizHistory: [],
          speedRecords: [],
          currentStreak: 0,
          longestStreak: 0,
        });
        get().syncToCloud();
      },
    }),
    {
      name: 'memonize-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        categoryProgress: state.categoryProgress,
        userMnemonics: state.userMnemonics,
        quizHistory: state.quizHistory,
        speedRecords: state.speedRecords,
        longestStreak: state.longestStreak,
        showEmoji: state.showEmoji,
        language: state.language,
      }),
    }
  )
);
