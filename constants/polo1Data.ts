export type Room = {
  code: string;
};

export type Floor = {
  level: number;
  rooms: Room[];
};

export type BuildingTipo = 'escola' | 'servico' | 'lab' | 'desporto' | 'outro';

export type Building = {
  id: string;
  name: { pt: string; en: string };
  tipo: BuildingTipo;
  coordinate: { latitude: number; longitude: number };
  floors: Floor[];
};

// Centro do campus UTAD, Vila Real — enquadra Polo I + Polo II
export const POLO1_CENTER = {
  latitude: 41.2868,
  longitude: -7.7405,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

// Cores e símbolos por tipo (acessibilidade WCAG: contraste + glyph, não só cor)
export const TIPO_COR: Record<BuildingTipo, string> = {
  escola:   '#2563EB', // azul forte
  servico:  '#EA580C', // laranja
  lab:      '#7C3AED', // roxo
  desporto: '#16A34A', // verde escuro (distinto do verde do mapa)
  outro:    '#475569', // cinza-azulado
};

export const TIPO_SIMBOLO: Record<BuildingTipo, string> = {
  escola:   'E',
  servico:  'S',
  lab:      'L',
  desporto: 'D',
  outro:    '·',
};

export const TIPO_LABEL_PT: Record<BuildingTipo, string> = {
  escola:   'Escola',
  servico:  'Serviço',
  lab:      'Laboratório',
  desporto: 'Desporto',
  outro:    'Outro',
};

export const TIPO_LABEL_EN: Record<BuildingTipo, string> = {
  escola:   'School',
  servico:  'Service',
  lab:      'Laboratory',
  desporto: 'Sports',
  outro:    'Other',
};

// Coordenadas dos edifícios obtidas do OpenStreetMap (Overpass API).
// Nomenclatura segue o mapa oficial UTAD (mapa-campus-simplificado-3D.pdf).
export const POLO1_BUILDINGS: Building[] = [
  // === Polo I — escolas (com salas conhecidas) ===
  {
    id: 'ecav1',
    name: { pt: 'ECAV – Polo I', en: 'ECAV – Campus I' },
    tipo: 'escola',
    coordinate: { latitude: 41.288144, longitude: -7.741173 },
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
    tipo: 'escola',
    coordinate: { latitude: 41.286934, longitude: -7.740588 },
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
    tipo: 'servico',
    coordinate: { latitude: 41.285822, longitude: -7.740542 },
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
    tipo: 'outro',
    coordinate: { latitude: 41.286264, longitude: -7.738626 },
    floors: [
      {
        level: 0,
        rooms: [{ code: 'I0.06' }],
      },
    ],
  },

  // === Polo I — outros edifícios académicos ===
  {
    id: 'ecva1',
    name: { pt: 'ECVA – Polo I', en: 'ECVA – Campus I' },
    tipo: 'escola',
    coordinate: { latitude: 41.286109, longitude: -7.739345 },
    floors: [],
  },
  {
    id: 'echs1',
    name: { pt: 'ECHS – Polo I', en: 'ECHS – Campus I' },
    tipo: 'escola',
    coordinate: { latitude: 41.281620, longitude: -7.745260 },
    floors: [],
  },

  // === Polo I — laboratórios e edifícios de apoio ===
  {
    id: 'eno',
    name: { pt: 'Edifício de Enologia', en: 'Oenology Building' },
    tipo: 'lab',
    coordinate: { latitude: 41.286113, longitude: -7.738237 },
    floors: [],
  },
  {
    id: 'lab',
    name: { pt: 'Complexo Laboratorial', en: 'Laboratory Complex' },
    tipo: 'lab',
    coordinate: { latitude: 41.287550, longitude: -7.738097 },
    floors: [],
  },
  {
    id: 'hect1',
    name: { pt: 'Hangar ECT – Polo I', en: 'ECT Hangar – Campus I' },
    tipo: 'lab',
    coordinate: { latitude: 41.286942, longitude: -7.741533 },
    floors: [],
  },
  {
    id: 'kit',
    name: { pt: 'Kitchen Lab', en: 'Kitchen Lab' },
    tipo: 'lab',
    coordinate: { latitude: 41.287400, longitude: -7.739700 },
    floors: [],
  },
  {
    id: 'jb',
    name: { pt: 'Herbário / Jardim Botânico', en: 'Herbarium / Botanical Garden' },
    tipo: 'outro',
    coordinate: { latitude: 41.287200, longitude: -7.741400 },
    floors: [],
  },

  // === Polo I — serviços ===
  {
    id: 'uc',
    name: { pt: 'University Center (AAUTAD)', en: 'University Center (AAUTAD)' },
    tipo: 'servico',
    coordinate: { latitude: 41.288435, longitude: -7.739048 },
    floors: [],
  },
  {
    id: 'eaa',
    name: { pt: 'Edifício de Apoio aos Alunos', en: 'Student Support Building' },
    tipo: 'servico',
    coordinate: { latitude: 41.288100, longitude: -7.739450 },
    floors: [],
  },
  {
    id: 'esc',
    name: { pt: 'Edifício de Serviços Comuns', en: 'Common Services Building' },
    tipo: 'servico',
    coordinate: { latitude: 41.287868, longitude: -7.739188 },
    floors: [],
  },
  {
    id: 'hv',
    name: { pt: 'Hospital Veterinário', en: 'Veterinary Hospital' },
    tipo: 'servico',
    coordinate: { latitude: 41.289576, longitude: -7.739880 },
    floors: [],
  },
  {
    id: 'port',
    name: { pt: 'Portaria', en: 'Main Gate' },
    tipo: 'servico',
    coordinate: { latitude: 41.289683, longitude: -7.737329 },
    floors: [],
  },
  {
    id: 'cantina',
    name: { pt: 'Cantina de Prados / Restaurante Panorâmico', en: 'Cantina / Panoramic Restaurant' },
    tipo: 'servico',
    coordinate: { latitude: 41.289699, longitude: -7.736478 },
    floors: [],
  },

  // === Polo II — escolas ===
  {
    id: 'ect2',
    name: { pt: 'ECT – Polo II', en: 'ECT – Campus II' },
    tipo: 'escola',
    coordinate: { latitude: 41.285771, longitude: -7.743627 },
    floors: [],
  },
  {
    id: 'ecav2',
    name: { pt: 'ECAV – Polo II', en: 'ECAV – Campus II' },
    tipo: 'escola',
    coordinate: { latitude: 41.285382, longitude: -7.743822 },
    floors: [],
  },
  {
    id: 'echs2',
    name: { pt: 'ECHS – Polo II', en: 'ECHS – Campus II' },
    tipo: 'escola',
    coordinate: { latitude: 41.285204, longitude: -7.744535 },
    floors: [],
  },
  {
    id: 'ecva2',
    name: { pt: 'ECVA – Polo II / Complexo Desportivo', en: 'ECVA – Campus II / Sports Complex' },
    tipo: 'escola',
    coordinate: { latitude: 41.282700, longitude: -7.743800 },
    floors: [],
  },
  {
    id: 'ess',
    name: { pt: 'Escola Superior de Saúde', en: 'School of Health' },
    tipo: 'escola',
    coordinate: { latitude: 41.282500, longitude: -7.743400 },
    floors: [],
  },

  // === Polo II — laboratórios e desporto ===
  {
    id: 'hecav2',
    name: { pt: 'Hangar ECAV – Polo II', en: 'ECAV Hangar – Campus II' },
    tipo: 'lab',
    coordinate: { latitude: 41.284575, longitude: -7.744239 },
    floors: [],
  },
  {
    id: 'nave',
    name: { pt: 'Nave de Desportos', en: 'Sports Hall' },
    tipo: 'desporto',
    coordinate: { latitude: 41.283125, longitude: -7.744929 },
    floors: [],
  },
];

// Rota outdoor de exemplo
export const OUTDOOR_ROUTE = [
  { latitude: 41.286934, longitude: -7.740588 }, // ECT-Polo I
  { latitude: 41.287400, longitude: -7.740700 },
  { latitude: 41.287800, longitude: -7.740900 },
  { latitude: 41.288144, longitude: -7.741173 }, // ECAV-Polo I
];

export const OUTDOOR_ROUTE_START = POLO1_BUILDINGS.find(b => b.id === 'ect1')!;
export const OUTDOOR_ROUTE_END = POLO1_BUILDINGS.find(b => b.id === 'ecav1')!;
