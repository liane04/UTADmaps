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
};

// Centro do campus UTAD, Vila Real — ajustado para enquadrar Polo I + Polo II
export const POLO1_CENTER = {
  latitude: 41.2868,
  longitude: -7.7405,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

// Coordenadas dos edifícios obtidas do OpenStreetMap (Overpass API).
// Nomenclatura segue o mapa oficial UTAD (mapa-campus-simplificado-3D.pdf).
// Os 4 edifícios principais (ECAV-I, ECT-I, Biblioteca, Reitoria) têm
// salas conhecidas via Inforestudante (códigos F, E, G, I).
export const POLO1_BUILDINGS: Building[] = [
  // === Polo I — núcleo académico ===
  {
    id: 'ecav1',
    name: { pt: 'ECAV – Polo I', en: 'ECAV – Campus I' },
    coordinate: { latitude: 41.288144, longitude: -7.741173 },
    color: '#BCCEE0',
    floors: [
      {
        level: 0,
        rooms: [
          { code: 'BAR' },
          { code: 'F0.01' }, { code: 'F0.02' }, { code: 'F0.05' }, { code: 'F0.06' },
          { code: 'F0.07' }, { code: 'F0.08' }, { code: 'F0.10' }, { code: 'F0.12' },
          { code: 'F0.14' }, { code: 'F0.16' }, { code: 'F0.18' }, { code: 'F0.19' },
        ],
      },
      {
        level: 1,
        rooms: [
          { code: 'SECRETARIA' },
          { code: 'F1.17' }, { code: 'F1.18' }, { code: 'F1.19' }, { code: 'F1.20' },
          { code: 'F1.21' }, { code: 'F1.22' }, { code: 'F1.24' },
        ],
      },
      {
        level: 2,
        rooms: [
          { code: 'F2.01' }, { code: 'F2.02' }, { code: 'F2.06' }, { code: 'F2.10A' },
          { code: 'F2.12' }, { code: 'F2.13' }, { code: 'F2.15' }, { code: 'F2.16' },
          { code: 'F2.17' }, { code: 'F2.18' }, { code: 'F2.19' }, { code: 'F2.20A' },
          { code: 'F2.22' },
        ],
      },
    ],
  },
  {
    id: 'ect1',
    name: { pt: 'ECT – Polo I', en: 'ECT – Campus I' },
    coordinate: { latitude: 41.286934, longitude: -7.740588 },
    color: '#B4D2D4',
    floors: [
      {
        level: 1,
        rooms: [
          { code: 'E1.01' }, { code: 'E1.02' }, { code: 'E1.06' }, { code: 'E1.08' },
          { code: 'E1.11' }, { code: 'E1.12' }, { code: 'E1.15' }, { code: 'E1.16' },
        ],
      },
      {
        level: 2,
        rooms: [
          { code: 'E2.01' }, { code: 'E2.02' }, { code: 'E2.04' }, { code: 'E2.10' },
          { code: 'E2.11' }, { code: 'E2.13' }, { code: 'E2.14' }, { code: 'E2.15' },
        ],
      },
    ],
  },
  {
    id: 'bib',
    name: { pt: 'Biblioteca Central', en: 'Central Library' },
    coordinate: { latitude: 41.285822, longitude: -7.740542 },
    color: '#BCD8C1',
    floors: [
      {
        level: 0,
        rooms: [
          { code: 'G0.01' }, { code: 'G0.03' }, { code: 'G0.04B' },
          { code: 'G0.08' }, { code: 'G0.12' }, { code: 'G0.14' },
        ],
      },
    ],
  },
  {
    id: 'rei',
    name: { pt: 'Reitoria', en: 'Rectory' },
    coordinate: { latitude: 41.286264, longitude: -7.738626 },
    color: '#E5C9A8',
    floors: [
      {
        level: 0,
        rooms: [{ code: 'I0.06' }],
      },
    ],
  },

  // === Polo I — outros edifícios académicos / serviços ===
  {
    id: 'ecva1',
    name: { pt: 'ECVA – Polo I', en: 'ECVA – Campus I' },
    coordinate: { latitude: 41.286109, longitude: -7.739345 },
    color: '#D6C0E0',
    floors: [],
  },
  {
    id: 'echs1',
    name: { pt: 'ECHS – Polo I', en: 'ECHS – Campus I' },
    coordinate: { latitude: 41.281620, longitude: -7.745260 },
    color: '#C8E0F0',
    floors: [],
  },
  {
    id: 'eno',
    name: { pt: 'Edifício de Enologia', en: 'Oenology Building' },
    coordinate: { latitude: 41.286113, longitude: -7.738237 },
    color: '#E0B8B0',
    floors: [],
  },
  {
    id: 'lab',
    name: { pt: 'Complexo Laboratorial', en: 'Laboratory Complex' },
    coordinate: { latitude: 41.287550, longitude: -7.738097 },
    color: '#D8D8C0',
    floors: [],
  },
  {
    id: 'hect1',
    name: { pt: 'Hangar ECT – Polo I', en: 'ECT Hangar – Campus I' },
    coordinate: { latitude: 41.286942, longitude: -7.741533 },
    color: '#C0CCD8',
    floors: [],
  },
  {
    id: 'uc',
    name: { pt: 'University Center (AAUTAD)', en: 'University Center (AAUTAD)' },
    coordinate: { latitude: 41.288435, longitude: -7.739048 },
    color: '#E0D0B8',
    floors: [],
  },
  {
    id: 'eaa',
    name: { pt: 'Edifício de Apoio aos Alunos', en: 'Student Support Building' },
    coordinate: { latitude: 41.288100, longitude: -7.739450 },
    color: '#D8E0C0',
    floors: [],
  },
  {
    id: 'esc',
    name: { pt: 'Edifício de Serviços Comuns', en: 'Common Services Building' },
    coordinate: { latitude: 41.287868, longitude: -7.739188 },
    color: '#C8D8C8',
    floors: [],
  },
  {
    id: 'kit',
    name: { pt: 'Kitchen Lab', en: 'Kitchen Lab' },
    coordinate: { latitude: 41.287400, longitude: -7.739700 },
    color: '#F0D8C0',
    floors: [],
  },
  {
    id: 'jb',
    name: { pt: 'Herbário / Jardim Botânico', en: 'Herbarium / Botanical Garden' },
    coordinate: { latitude: 41.287200, longitude: -7.741400 },
    color: '#B8D8B8',
    floors: [],
  },
  {
    id: 'hv',
    name: { pt: 'Hospital Veterinário', en: 'Veterinary Hospital' },
    coordinate: { latitude: 41.289576, longitude: -7.739880 },
    color: '#E8C0C0',
    floors: [],
  },
  {
    id: 'port',
    name: { pt: 'Portaria', en: 'Main Gate' },
    coordinate: { latitude: 41.289683, longitude: -7.737329 },
    color: '#D0D0D0',
    floors: [],
  },
  {
    id: 'cantina',
    name: { pt: 'Cantina de Prados / Restaurante Panorâmico', en: 'Cantina / Panoramic Restaurant' },
    coordinate: { latitude: 41.289699, longitude: -7.736478 },
    color: '#F0D8B0',
    floors: [],
  },

  // === Polo II ===
  {
    id: 'ect2',
    name: { pt: 'ECT – Polo II', en: 'ECT – Campus II' },
    coordinate: { latitude: 41.285771, longitude: -7.743627 },
    color: '#B4D2D4',
    floors: [],
  },
  {
    id: 'ecav2',
    name: { pt: 'ECAV – Polo II', en: 'ECAV – Campus II' },
    coordinate: { latitude: 41.285382, longitude: -7.743822 },
    color: '#BCCEE0',
    floors: [],
  },
  {
    id: 'echs2',
    name: { pt: 'ECHS – Polo II', en: 'ECHS – Campus II' },
    coordinate: { latitude: 41.285204, longitude: -7.744535 },
    color: '#C8E0F0',
    floors: [],
  },
  {
    id: 'hecav2',
    name: { pt: 'Hangar ECAV – Polo II', en: 'ECAV Hangar – Campus II' },
    coordinate: { latitude: 41.284575, longitude: -7.744239 },
    color: '#C0CCD8',
    floors: [],
  },
  {
    id: 'nave',
    name: { pt: 'Nave de Desportos', en: 'Sports Hall' },
    coordinate: { latitude: 41.283125, longitude: -7.744929 },
    color: '#B8E8C8',
    floors: [],
  },
  {
    id: 'ecva2',
    name: { pt: 'ECVA – Polo II / Complexo Desportivo', en: 'ECVA – Campus II / Sports Complex' },
    coordinate: { latitude: 41.282700, longitude: -7.743800 },
    color: '#D6C0E0',
    floors: [],
  },
  {
    id: 'ess',
    name: { pt: 'Escola Superior de Saúde', en: 'School of Health' },
    coordinate: { latitude: 41.282500, longitude: -7.743400 },
    color: '#F0C0D0',
    floors: [],
  },
];

// Rota outdoor de exemplo (mantida para compat. com versão anterior do app)
export const OUTDOOR_ROUTE = [
  { latitude: 41.286934, longitude: -7.740588 }, // ECT-Polo I
  { latitude: 41.287400, longitude: -7.740700 },
  { latitude: 41.287800, longitude: -7.740900 },
  { latitude: 41.288144, longitude: -7.741173 }, // ECAV-Polo I
];

export const OUTDOOR_ROUTE_START = POLO1_BUILDINGS.find(b => b.id === 'ect1')!;
export const OUTDOOR_ROUTE_END = POLO1_BUILDINGS.find(b => b.id === 'ecav1')!;
