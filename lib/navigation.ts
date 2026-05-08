// Helpers de navegação — decide entre indoor 3D (ECT-Polo I) e planta 2D legacy
import { getIndoorIdForSala } from '../constants/polo1Data';

type NavRoute = {
  pathname: string;
  params: Record<string, string>;
};

/**
 * Rota a usar para navegar até uma sala.
 *
 * - Se a sala existe num edifício com indoor 3D (hoje só ECT-Polo I, salas
 *   com prefixo E/F/G/I + BAR + SECRETARIA), usa `/indoor-3d` com
 *   buildingId='sectorE' e a sala como `destino`.
 * - Caso contrário, fallback para `/navigacao-indoor` (planta 2D legacy).
 *
 * @example
 *   router.push(rotaIndoorParaSala('F0.01'));
 *   // → /indoor-3d?buildingId=sectorE&buildingName=ECT - Polo I&floors=[0,1,2]&destino=F0.01
 */
export function rotaIndoorParaSala(
  salaCode: string | null | undefined,
  salaNome?: string | null,
): NavRoute {
  const codigo = (salaCode ?? '').trim();
  const indoorId = getIndoorIdForSala(codigo);
  if (indoorId) {
    return {
      pathname: '/indoor-3d',
      params: {
        buildingId: indoorId,
        buildingName: 'ECT - Polo I',
        floors: JSON.stringify([0, 1, 2]),
        destino: codigo,
      },
    };
  }
  return {
    pathname: '/navigacao-indoor',
    params: {
      destino: codigo,
      destinoNome: salaNome ?? codigo,
    },
  };
}
