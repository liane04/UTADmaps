const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.utadmaps.b-host.me';

async function get<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function del(path: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
}

export const api = {
  // Edifícios
  getBuildings: () => get('/api/buildings'),
  getBuildingFloors: (id: string) => get(`/api/buildings/${id}/floors`),

  // Pesquisa
  searchRooms: (q: string, type?: string) =>
    get(`/api/rooms/search?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ''}`),

  // Auth
  login: (email: string, password: string) =>
    post('/api/auth/login', { email, password }),
  register: (email: string, password: string) =>
    post('/api/auth/register', { email, password }),

  // Horário
  getSchedule: (userId: string, token: string) =>
    get(`/api/schedule/${userId}`, token),

  // Favoritos
  getFavorites: (userId: string, token: string) =>
    get(`/api/favorites/${userId}`, token),
  addFavorite: (roomId: string, token: string) =>
    post('/api/favorites', { room_id: roomId }, token),
  removeFavorite: (id: string, token: string) =>
    del(`/api/favorites/${id}`, token),
};
