import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface FavoriteItem {
  id: string;
  nome: string;
  subtitulo: string;
  categoria: 'edificio' | 'sala' | 'servico';
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

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // Favoritos (por utilizador)
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null, favorites: [] }),

      // i18n
      language: 'pt',
      setLanguage: (language) => set({ language }),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // Favoritos
      favorites: [],
      addFavorite: (item) =>
        set((state) => ({
          favorites: state.favorites.some((f) => f.id === item.id)
            ? state.favorites
            : [...state.favorites, item],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    {
      name: 'utadmaps-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
