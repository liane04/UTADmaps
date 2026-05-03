import { useAppStore } from '../store/useAppStore';
import { Building, Floor, Room, Favorite, Schedule, User, SearchResult } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.utadmaps.b-host.me';

function getAuthHeader(): Record<string, string> {
  const token = useAppStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
}

export const api = {
  // Edifícios
  getBuildings: () => get<Building[]>('/api/buildings'),
  getBuildingFloors: (id: string) => get<Floor[]>(`/api/buildings/${id}/floors`),

  // Pesquisa
  searchRooms: (q: string, type?: string) =>
    get<Room[]>(`/api/rooms/search?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ''}`),
  search: (q: string, type?: string) =>
    get<SearchResult[]>(
      `/api/search?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ''}`,
    ),

  // Auth
  login: (email: string, password: string) =>
    post<{ user: User; token: string }>('/api/auth/login', { email, password }),
  register: (email: string, password: string) =>
    post<{ user: User; token: string }>('/api/auth/register', { email, password }),

  // Horário
  getSchedule: (userId: string) =>
    get<Schedule[]>(`/api/schedule/${userId}`),

  // Favoritos
  getFavorites: (userId: string) =>
    get<Favorite[]>(`/api/favorites/${userId}`),
  addFavorite: (roomId: string) =>
    post<Favorite>('/api/favorites', { room_id: roomId }),
  removeFavorite: (id: string) =>
    del(`/api/favorites/${id}`),
};
