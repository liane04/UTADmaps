// A* simples sobre o grafo de navegação indoor.
// Cada nó tem (x,y) em coordenadas do "mundo" da planta; pesos = distância euclidiana.

export type No = {
  id: string;
  x: number;
  y: number;
  tipo?: string;
  local?: string;
  rotulo?: string;
};

export type Aresta = [string, string];

export type Grafo = {
  nos: No[];
  arestas: Aresta[];
};

const dist = (a: No, b: No) => Math.hypot(a.x - b.x, a.y - b.y);

export function aStar(grafo: Grafo, inicioId: string, fimId: string): No[] | null {
  const nosPorId = new Map<string, No>(grafo.nos.map((n) => [n.id, n]));
  const vizinhos = new Map<string, string[]>();
  for (const n of grafo.nos) vizinhos.set(n.id, []);
  for (const [a, b] of grafo.arestas) {
    vizinhos.get(a)?.push(b);
    vizinhos.get(b)?.push(a);
  }

  const inicio = nosPorId.get(inicioId);
  const fim = nosPorId.get(fimId);
  if (!inicio || !fim) return null;

  const veioDe = new Map<string, string>();
  const gScore = new Map<string, number>([[inicioId, 0]]);
  const fScore = new Map<string, number>([[inicioId, dist(inicio, fim)]]);
  const abertos = new Set<string>([inicioId]);

  while (abertos.size > 0) {
    let atualId: string | null = null;
    let menorF = Infinity;
    for (const id of abertos) {
      const f = fScore.get(id) ?? Infinity;
      if (f < menorF) {
        menorF = f;
        atualId = id;
      }
    }
    if (!atualId) break;

    if (atualId === fimId) {
      const caminho: No[] = [];
      let cur: string | undefined = fimId;
      while (cur) {
        caminho.unshift(nosPorId.get(cur)!);
        cur = veioDe.get(cur);
      }
      return caminho;
    }

    abertos.delete(atualId);
    const atual = nosPorId.get(atualId)!;
    for (const vizinhoId of vizinhos.get(atualId) ?? []) {
      const vizinho = nosPorId.get(vizinhoId)!;
      const tentativaG = (gScore.get(atualId) ?? Infinity) + dist(atual, vizinho);
      if (tentativaG < (gScore.get(vizinhoId) ?? Infinity)) {
        veioDe.set(vizinhoId, atualId);
        gScore.set(vizinhoId, tentativaG);
        fScore.set(vizinhoId, tentativaG + dist(vizinho, fim));
        abertos.add(vizinhoId);
      }
    }
  }

  return null;
}

// Comprimento total do caminho (em unidades do mundo).
export function comprimentoCaminho(caminho: No[]): number {
  let total = 0;
  for (let i = 1; i < caminho.length; i++) total += dist(caminho[i - 1], caminho[i]);
  return total;
}
