# Prompt — Implementação do Mapa Outdoor (UTADmaps)

## Objetivo

Substituir o placeholder estático (fake `View` com retângulos) nos ecrãs de mapa por um **mapa real** usando `react-native-maps`, centrado no **Polo 1 da UTAD** em Vila Real, Portugal. Apenas o Polo 1 estará funcional nesta fase do protótipo. Todos os dados (edifícios, rotas) são hardcoded.

---

## Stack existente

- Expo SDK 54, React Native 0.81, TypeScript
- `expo-router` v5 (tab + stack navigation)
- Contextos: `useSettings()` (cores/tema/fontSize) e `useLanguage()` (tr/t)
- Ficheiros a modificar:
  - `app/(tabs)/index.tsx` — tab "Mapa" (vista geral do campus)
  - `app/navigacao-outdoor.tsx` — ecrã de navegação outdoor com rota

---

## Passo 1 — Instalar dependências

```bash
npx expo install react-native-maps
```

Para Android, adicionar ao `app.json` dentro de `"android"`:
```json
"config": {
  "googleMaps": {
    "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
  }
}
```
> Nota: em desenvolvimento com Expo Go, o mapa funciona sem API key. A key só é necessária para builds de produção Android. Adicionar a entrada em `app.json` mas deixar o valor `"YOUR_GOOGLE_MAPS_API_KEY"` como placeholder.

---

## Passo 2 — Criar ficheiro de dados do Polo 1

Criar o ficheiro `constants/polo1Data.ts` com os edifícios e rota hardcoded do Polo 1 da UTAD (Vila Real). Usar estas coordenadas GPS aproximadas:

```typescript
// constants/polo1Data.ts

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

// Rota hardcoded: da entrada principal até ao Bloco A (para navigacao-outdoor)
export const OUTDOOR_ROUTE = [
  { latitude: 41.2975, longitude: -7.7412 }, // Reitoria (origem)
  { latitude: 41.2972, longitude: -7.7405 },
  { latitude: 41.2968, longitude: -7.7398 },
  { latitude: 41.2966, longitude: -7.7390 },
  { latitude: 41.2965, longitude: -7.7383 }, // Bloco A (destino)
];

export const OUTDOOR_ROUTE_START = POLO1_BUILDINGS.find(b => b.id === 'reitoria')!;
export const OUTDOOR_ROUTE_END = POLO1_BUILDINGS.find(b => b.id === 'blocoA')!;
```

---

## Passo 3 — Atualizar `app/(tabs)/index.tsx` (tab "Mapa")

Substituir a `View` placeholder do mapa por um `MapView` real. Manter todo o UI sobreposto (search bar, zoom controls). Preservar o uso de `useSettings()` e `useLanguage()`.

Estrutura esperada:
```tsx
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { POLO1_CENTER, POLO1_BUILDINGS } from '../../constants/polo1Data';

// Substituir o bloco <View style={styles.mapBackground}> por:
<MapView
  style={StyleSheet.absoluteFillObject}
  provider={PROVIDER_DEFAULT}
  initialRegion={POLO1_CENTER}
  showsUserLocation={false}
  showsMyLocationButton={false}
  showsCompass={false}
  showsScale={false}
  rotateEnabled={false}
  pitchEnabled={false}
>
  {POLO1_BUILDINGS.map(building => (
    <Marker
      key={building.id}
      coordinate={building.coordinate}
      title={lang === 'pt' ? building.name.pt : building.name.en}
      pinColor="#007AFF"
    />
  ))}
</MapView>
```

O idioma actual pode ser obtido via `useLanguage()` (verificar o contexto para o campo correcto — provavelmente `lang` ou `language`).

Manter todos os outros elementos UI (`searchContainer`, `controlsContainer`, zoom buttons, locate button) exatamente como estão — apenas o fundo do mapa muda.

---

## Passo 4 — Atualizar `app/navigacao-outdoor.tsx`

Substituir toda a `View style={styles.mapBackground}` (com os fake roads, buildings, routeLine, routeDot) por um `MapView` real com uma `Polyline` da rota hardcoded e dois `Marker` (origem e destino).

Estrutura esperada:
```tsx
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { POLO1_CENTER, OUTDOOR_ROUTE, OUTDOOR_ROUTE_START, OUTDOOR_ROUTE_END } from '../constants/polo1Data';

// Região inicial com padding para mostrar a rota completa
const ROUTE_REGION = {
  latitude: 41.2970,
  longitude: -7.7398,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};

// Substituir o bloco <View style={styles.mapBackground}> por:
<MapView
  style={StyleSheet.absoluteFillObject}
  provider={PROVIDER_DEFAULT}
  initialRegion={ROUTE_REGION}
  showsUserLocation={false}
  showsMyLocationButton={false}
  showsCompass={false}
  rotateEnabled={false}
  pitchEnabled={false}
>
  {/* Marcador de origem */}
  <Marker
    coordinate={OUTDOOR_ROUTE_START.coordinate}
    title={tr(OUTDOOR_ROUTE_START.name.pt, OUTDOOR_ROUTE_START.name.en)}
    pinColor="#34C759"
  />
  {/* Marcador de destino */}
  <Marker
    coordinate={OUTDOOR_ROUTE_END.coordinate}
    title={tr(OUTDOOR_ROUTE_END.name.pt, OUTDOOR_ROUTE_END.name.en)}
    pinColor="#007AFF"
  />
  {/* Linha de rota */}
  <Polyline
    coordinates={OUTDOOR_ROUTE}
    strokeColor="#007AFF"
    strokeWidth={4}
    lineDashPattern={[10, 5]}
  />
</MapView>
```

Manter todo o restante UI intacto: header com botão back, bottom panel com distância/tempo, mode toggle pills (A pé / Carro), botão "Terminar".

Remover os estilos que já não são necessários: `road`, `building`, `targetBuilding`, `buildingText`, `routeLine`, `routeDot`, `targetDot`.

---

## Passo 5 — Verificação final

1. Correr `npx expo start` e confirmar que o mapa carrega corretamente em ambos os ecrãs.
2. Verificar que os markers aparecem sobre os edifícios certos.
3. Verificar que a polyline da rota é visível no ecrã `navigacao-outdoor`.
4. Confirmar que o tema escuro/claro (`useSettings`) não quebra o layout (o MapView tem fundo próprio).
5. Confirmar que o header, bottom panel e todos os controlos sobrepostos continuam funcionais.
6. Não deve haver erros TypeScript — verificar imports e tipos de `react-native-maps`.

---

## Notas importantes

- **Não criar ficheiros de mapa para outros Polos** — apenas Polo 1 está funcional nesta fase.
- **Não adicionar lógica de routing real** — a rota é sempre a hardcoded em `OUTDOOR_ROUTE`.
- **Não adicionar localização GPS do utilizador** — `showsUserLocation={false}` em ambos os mapas.
- **Preservar toda a lógica de contexto** (`useSettings`, `useLanguage`) — apenas substituir o componente visual do mapa.
- Se `react-native-maps` tiver um erro de tipo com `lineDashPattern`, usar `lineDashPattern={[10, 5] as any}` temporariamente.
- As coordenadas hardcoded são aproximadas — podem precisar de ajuste fino quando testadas no dispositivo.
