export const POLO1_CENTER = {
  latitude: 41.2968,
  longitude: -7.7393,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

export const POLO1_BUILDINGS = [
  {
    id: 'reitoria',
    name: { pt: 'Reitoria', en: 'Rectory' },
    coordinate: { latitude: 41.2975, longitude: -7.7412 },
    color: '#D1D1D6',
  },
  {
    id: 'biblioteca',
    name: { pt: 'Biblioteca', en: 'Library' },
    coordinate: { latitude: 41.2971, longitude: -7.7398 },
    color: '#BCCEE0',
  },
  {
    id: 'blocoA',
    name: { pt: 'Bloco A', en: 'Block A' },
    coordinate: { latitude: 41.2965, longitude: -7.7383 },
    color: '#B4D2D4',
  },
  {
    id: 'blocoB',
    name: { pt: 'Bloco B', en: 'Block B' },
    coordinate: { latitude: 41.2960, longitude: -7.7392 },
    color: '#BCD8C1',
  },
  {
    id: 'cantina',
    name: { pt: 'Cantina', en: 'Canteen' },
    coordinate: { latitude: 41.2956, longitude: -7.7402 },
    color: '#CCD8CA',
  },
  {
    id: 'ect',
    name: { pt: 'ECT', en: 'ECT' },
    coordinate: { latitude: 41.2963, longitude: -7.7374 },
    color: '#D4C8BE',
  },
  {
    id: 'ecva',
    name: { pt: 'ECVA', en: 'ECVA' },
    coordinate: { latitude: 41.2978, longitude: -7.7388 },
    color: '#C8D4BE',
  },
  {
    id: 'gimnodesportivo',
    name: { pt: 'Gimnodesportivo', en: 'Sports Hall' },
    coordinate: { latitude: 41.2948, longitude: -7.7388 },
    color: '#D4D4BE',
  },
];

export const OUTDOOR_ROUTE = [
  { latitude: 41.2975, longitude: -7.7412 },
  { latitude: 41.2972, longitude: -7.7405 },
  { latitude: 41.2968, longitude: -7.7398 },
  { latitude: 41.2966, longitude: -7.7390 },
  { latitude: 41.2965, longitude: -7.7383 },
];

export const OUTDOOR_ROUTE_START = POLO1_BUILDINGS.find(b => b.id === 'reitoria')!;
export const OUTDOOR_ROUTE_END = POLO1_BUILDINGS.find(b => b.id === 'blocoA')!;
