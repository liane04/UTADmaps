import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { api } from '../services/api';

export interface FavoriteItem {
  id: string;
  nome: string;
  subtitulo: string;
  categoria: 'edificio' | 'sala' | 'servico';
  lat?: number | null;
  lon?: number | null;
  codigo?: string | null;
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

  // Favoritos (cache local; sincroniza com backend quando há token)
  favorites: FavoriteItem[];
  syncFavoritesFromAPI: () => Promise<void>;
  addFavorite: (item: FavoriteItem) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
        // dispara sync em background; ignora erros
        get().syncFavoritesFromAPI().catch(() => {});
      },
      logout: () => set({ user: null, token: null, favorites: [] }),

      // i18n
      language: 'pt',
      setLanguage: (language) => set({ language }),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // Favoritos
      favorites: [],
      syncFavoritesFromAPI: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const remote = await api.getUserFavorites();
          const mapped: FavoriteItem[] = remote.map(r => ({
            id: r.item_id,
            nome: r.nome,
            subtitulo: r.subtitulo ?? '',
            categoria: (r.categoria as FavoriteItem['categoria']) ?? 'edificio',
            lat: r.lat,
            lon: r.lon,
            codigo: r.codigo,
          }));
          set({ favorites: mapped });
        } catch {
          // mantém cache local
        }
      },
      addFavorite: async (item) => {
        // optimistic update
        set((state) => ({
          favorites: state.favorites.some((f) => f.id === item.id)
            ? state.favorites
            : [item, ...state.favorites],
        }));
        const { token } = get();
        if (!token) return;
        try {
          await api.addUserFavorite({
            item_id: item.id,
            nome: item.nome,
            subtitulo: item.subtitulo,
            categoria: item.categoria,
            lat: item.lat,
            lon: item.lon,
            codigo: item.codigo,
          });
        } catch {
          // rollback em caso de falha
          set((state) => ({
            favorites: state.favorites.filter((f) => f.id !== item.id),
          }));
        }
      },
      removeFavorite: async (id) => {
        const previous = get().favorites;
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
        const { token } = get();
        if (!token) return;
        try {
          await api.removeUserFavorite(id);
        } catch {
          // rollback
          set({ favorites: previous });
        }
      },
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    {
      name: 'utadmaps-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
