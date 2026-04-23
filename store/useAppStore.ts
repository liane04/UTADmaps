import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

export interface AccessibilityState {
  highContrast: boolean;
  accessibleRoutes: boolean;
  textSize: 'small' | 'medium' | 'large';
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;

  // i18n
  language: 'pt' | 'en';
  setLanguage: (lang: 'pt' | 'en') => void;

  // Accessibility
  accessibility: AccessibilityState;
  updateAccessibility: (settings: Partial<AccessibilityState>) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),

      // i18n
      language: 'pt',
      setLanguage: (language) => set({ language }),

      // Accessibility
      accessibility: {
        highContrast: false,
        accessibleRoutes: false,
        textSize: 'medium',
      },
      updateAccessibility: (settings) =>
        set((state) => ({
          accessibility: { ...state.accessibility, ...settings },
        })),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'utadmaps-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
