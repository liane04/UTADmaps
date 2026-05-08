// A* indoor para o ecrã `navigacao-indoor.tsx` (planta 2D).
//
// O indoor 3D (`indoor-3d.tsx`) usa um pathfinding próprio dentro do WebView
// — este ficheiro continua a servir a versão 2D legada.
//
// O default export existe para o expo-router (todos os ficheiros em `app/`
// devem exportar um componente React).

export type No = {
  id: string;
  x: number;
  y: number;
  tipo?: string;
  rotulo?: string;
  /** Quando true, o A* evita este nó se a flag rotasAcessiveis estiver activa. */
  escada?: boolean;
  local?: string;
};

export type Aresta = [string, string];

export type Grafo = {
  nos: No[];
  arestas: Aresta[];
};

function distancia(a: No, b: No): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function comprimentoCaminho(caminho: No[]): number {
  let total = 0;
  for (let i = 0; i < caminho.length - 1; i++) {
    total += distancia(caminho[i], caminho[i + 1]);
  }
  return total;
}

/**
 * A* clássico sobre o grafo. Devolve a sequência de nós da origem ao destino,
 * ou null se não houver caminho.
 *
 * @param evitarEscadas Quando true, ignora nós com tipo === 'escada' ou
 *   escada === true (excepto se forem origem/destino).
 */
export function aStar(
  grafo: Grafo,
  origemId: string,
  destinoId: string,
  evitarEscadas = false,
): No[] | null {
  const nosPorId = new Map<string, No>();
  for (const n of grafo.nos) nosPorId.set(n.id, n);

  const origem = nosPorId.get(origemId);
  const destino = nosPorId.get(destinoId);
  if (!origem || !destino) return null;

  // Lista de adjacência
  const adj = new Map<string, string[]>();
  for (const n of grafo.nos) adj.set(n.id, []);
  for (const [a, b] of grafo.arestas) {
    adj.get(a)?.push(b);
    adj.get(b)?.push(a); // grafo não-orientado
  }

  const isEscada = (n: No) =>
    n.id !== origemId &&
    n.id !== destinoId &&
    (n.escada === true || n.tipo === 'escada' || n.tipo === 'escadas');

  // Open set + custos
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, string>();
  gScore.set(origemId, 0);
  fScore.set(origemId, distancia(origem, destino));

  const open = new Set<string>([origemId]);

  while (open.size > 0) {
    // Nó com menor fScore
    let atualId: string | null = null;
    let melhorF = Infinity;
    for (const id of open) {
      const f = fScore.get(id) ?? Infinity;
      if (f < melhorF) {
        melhorF = f;
        atualId = id;
      }
    }
    if (!atualId) break;
    if (atualId === destinoId) {
      // Reconstrói caminho
      const caminho: No[] = [];
      let cursor: string | undefined = destinoId;
      while (cursor) {
        const n = nosPorId.get(cursor);
        if (!n) break;
        caminho.unshift(n);
        cursor = cameFrom.get(cursor);
      }
      return caminho;
    }
    open.delete(atualId);
    const atual = nosPorId.get(atualId)!;
    const vizinhos = adj.get(atualId) ?? [];
    for (const vizId of vizinhos) {
      const viz = nosPorId.get(vizId);
      if (!viz) continue;
      if (evitarEscadas && isEscada(viz)) continue;
      const tentativa = (gScore.get(atualId) ?? Infinity) + distancia(atual, viz);
      if (tentativa < (gScore.get(vizId) ?? Infinity)) {
        cameFrom.set(vizId, atualId);
        gScore.set(vizId, tentativa);
        fScore.set(vizId, tentativa + distancia(viz, destino));
        open.add(vizId);
      }
    }
  }
  return null;
}

export default function PathfindingUnused() {
  return null;
}
