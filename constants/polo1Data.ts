export type Room = {
  code: string;
};

export type Floor = {
  level: number;
  rooms: Room[];
};

export type Building = {
  id: string;
  name: { pt: string; en: string };
  coordinate: { latitude: number; longitude: number };
  color: string;
  floors: Floor[];
  hasIndoor?: boolean;
};

// Coordenadas reais (OpenStreetMap) — Polo I da UTAD, Vila Real
// Centro: ponto médio entre ECVA, ECT, Biblioteca e Reitoria
export const POLO1_CENTER = {
  latitude: 41.2868,
  longitude: -7.7402,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

export const POLO1_BUILDINGS: Building[] = [
  {
    // Setor F → Escola de Ciências Agrárias e Veterinárias (ECVA) - Polo I
    id: 'sectorF',
    name: { pt: 'Setor F (ECVA)', en: 'Sector F (ECVA)' },
    coordinate: { latitude: 41.2881439, longitude: -7.7411733 },
    color: '#BCCEE0',
    floors: [
      {
        level: 0,
        rooms: [
          { code: 'BAR' },
          { code: 'F0.01' },
          { code: 'F0.02' },
          { code: 'F0.05' },
          { code: 'F0.06' },
          { code: 'F0.07' },
          { code: 'F0.08' },
          { code: 'F0.10' },
          { code: 'F0.12' },
          { code: 'F0.14' },
          { code: 'F0.16' },
          { code: 'F0.18' },
          { code: 'F0.19' },
        ],
      },
      {
        level: 1,
        rooms: [
          { code: 'SECRETARIA' },
          { code: 'F1.17' },
          { code: 'F1.18' },
          { code: 'F1.19' },
          { code: 'F1.20' },
          { code: 'F1.21' },
          { code: 'F1.22' },
          { code: 'F1.24' },
        ],
      },
      {
        level: 2,
        rooms: [
          { code: 'F2.01' },
          { code: 'F2.02' },
          { code: 'F2.06' },
          { code: 'F2.10A' },
          { code: 'F2.12' },
          { code: 'F2.13' },
          { code: 'F2.15' },
          { code: 'F2.16' },
          { code: 'F2.17' },
          { code: 'F2.18' },
          { code: 'F2.19' },
          { code: 'F2.20A' },
          { code: 'F2.22' },
        ],
      },
    ],
  },
  {
    // Setor E → Escola de Ciências e Tecnologias (ECT) - Polo I
    id: 'sectorE',
    name: { pt: 'Setor E (ECT)', en: 'Sector E (ECT)' },
    coordinate: { latitude: 41.2869343, longitude: -7.7405878 },
    color: '#B4D2D4',
    hasIndoor: true,
    floors: [
      {
        level: 0,
        rooms: [
          { code: 'E0.01' },
          { code: 'E0.02' },
          { code: 'E0.03' },
        ],
      },
      {
        level: 1,
        rooms: [
          { code: 'E1.01' },
          { code: 'E1.02' },
          { code: 'E1.06' },
          { code: 'E1.08' },
          { code: 'E1.11' },
          { code: 'E1.12' },
          { code: 'E1.15' },
          { code: 'E1.16' },
        ],
      },
      {
        level: 2,
        rooms: [
          { code: 'E2.01' },
          { code: 'E2.02' },
          { code: 'E2.04' },
          { code: 'E2.10' },
          { code: 'E2.11' },
          { code: 'E2.13' },
          { code: 'E2.14' },
          { code: 'E2.15' },
        ],
      },
    ],
  },
  {
    // Setor G → Biblioteca Central
    id: 'sectorG',
    name: { pt: 'Setor G (Biblioteca)', en: 'Sector G (Library)' },
    coordinate: { latitude: 41.2858222, longitude: -7.7405422 },
    color: '#BCD8C1',
    floors: [
      {
        level: 0,
        rooms: [
          { code: 'G0.01' },
          { code: 'G0.03' },
          { code: 'G0.04B' },
          { code: 'G0.08' },
          { code: 'G0.12' },
          { code: 'G0.14' },
        ],
      },
    ],
  },
  {
    // Setor I → Reitoria
    id: 'sectorI',
    name: { pt: 'Setor I (Reitoria)', en: 'Sector I (Rectory)' },
    coordinate: { latitude: 41.286264, longitude: -7.7386259 },
    color: '#CCD8CA',
    floors: [
      {
        level: 0,
        rooms: [{ code: 'I0.06' }],
      },
    ],
  },
];

// Rota outdoor: Setor E (ECT) -> Setor F (ECVA), aprox. 130m a pé pelo caminho central
export const OUTDOOR_ROUTE = [
  { latitude: 41.2869343, longitude: -7.7405878 }, // Setor E - ECT (origem)
  { latitude: 41.2873, longitude: -7.7407 },
  { latitude: 41.2877, longitude: -7.7409 },
  { latitude: 41.2881439, longitude: -7.7411733 }, // Setor F - ECVA (destino)
];

export const OUTDOOR_ROUTE_START = POLO1_BUILDINGS.find(b => b.id === 'sectorE')!;
export const OUTDOOR_ROUTE_END = POLO1_BUILDINGS.find(b => b.id === 'sectorF')!;
