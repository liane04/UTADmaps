// Helpers geográficos partilhados (Haversine, formatação de distância)

export type Coord = { latitude: number; longitude: number };

/** Distância em metros entre dois pontos GPS (fórmula de Haversine). */
export function haversine(a: Coord, b: Coord): number {
  const R = 6371000; // raio da Terra em metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** Formata distância em metros para "75 m" ou "1.2 km". */
export function formatDistance(m: number | null | undefined): string {
  if (m == null || !Number.isFinite(m)) return '';
  if (m < 50) return `${Math.round(m / 5) * 5} m`;
  if (m < 1000) return `${Math.round(m / 10) * 10} m`;
  return `${(m / 1000).toFixed(1)} km`;
}
