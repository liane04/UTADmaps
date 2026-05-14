// Helpers de navegação — decide entre indoor 3D, outdoor→indoor, ou planta 2D legacy
import {
  POLO1_BUILDINGS,
  extrairCodigoSala,
  getIndoorIdForSala,
} from '../constants/polo1Data';
import { haversine, type Coord } from './geo';

type NavRoute = {
  pathname: string;
  params: Record<string, string>;
};

/** Distância (metros) acima da qual abrimos outdoor primeiro em vez de indoor direto. */
const PROXIMIDADE_INDOOR_M = 30;

/**
 * Rota a usar para navegar até uma sala.
 *
 * Decide entre 3 caminhos:
 *
 * 1. **Indoor 3D directo** — quando o utilizador está dentro/perto do edifício
 *    (≤ 30m da entrada) ou não passamos a posição GPS. Ex: estás dentro do
 *    ECT-Polo I e clicas numa aula → abre indoor 3D.
 *
 * 2. **Outdoor → Indoor** — quando passamos `userLocation` e ele está a > 30m
 *    do edifício. Abre `/navigacao-outdoor` para guiar até à porta; o param
 *    `indoorDestino` propaga a sala alvo para que o botão "Entrar no edifício"
 *    abra o indoor 3D já no piso/sala certos.
 *
 * 3. **Fallback legacy** — para salas que não pertencem a nenhum edifício
 *    com indoor 3D. Abre `/navigacao-indoor` (planta 2D antiga).
 *
 * @example
 *   // Estás longe do campus → outdoor primeiro
 *   router.push(rotaIndoorParaSala('F0.01', 'IPC', { userLocation: gpsCoord }));
 *
 *   // Sem GPS ou estás dentro → indoor directo
 *   router.push(rotaIndoorParaSala('F0.01'));
 */
export function rotaIndoorParaSala(
  salaCode: string | null | undefined,
  salaNome?: string | null,
  opts?: {
    userLocation?: Coord | null;
    /** Forçar outdoor mesmo se está perto (ex: para revisar trajeto). */
    forceOutdoor?: boolean;
  },
): NavRoute {
  const codigo = extrairCodigoSala(salaCode);
  const indoorId = getIndoorIdForSala(codigo);

  if (indoorId) {
    const building = POLO1_BUILDINGS.find((b) => b.id === indoorId);
    const destinoEdificio = building?.entrada ?? building?.coordinate;

    // Decide se deve fazer outdoor→indoor ou indoor directo
    let abrirOutdoorPrimeiro = false;
    if (building && destinoEdificio && opts?.userLocation) {
      const dist = haversine(opts.userLocation, destinoEdificio);
      abrirOutdoorPrimeiro = opts.forceOutdoor || dist > PROXIMIDADE_INDOOR_M;
    } else if (opts?.forceOutdoor) {
      abrirOutdoorPrimeiro = true;
    }

    if (abrirOutdoorPrimeiro && building && destinoEdificio) {
      return {
        pathname: '/navigacao-outdoor',
        params: {
          destLat: String(destinoEdificio.latitude),
          destLng: String(destinoEdificio.longitude),
          destName: building.name.pt,
          // Sala alvo no indoor — propagada para o botão "Entrar no edifício"
          indoorDestino: codigo,
        },
      };
    }

    // Indoor directo
    return {
      pathname: '/indoor-3d',
      params: {
        buildingId: indoorId,
        buildingName: building?.name.pt ?? 'ECT - Polo I',
        floors: JSON.stringify((building?.floors ?? []).map((f) => f.level).slice(0, 3) || [0, 1, 2]),
        destino: codigo,
      },
    };
  }

  // Fallback: planta 2D legacy
  return {
    pathname: '/navigacao-indoor',
    params: {
      destino: codigo,
      destinoNome: salaNome ?? codigo,
    },
  };
}
