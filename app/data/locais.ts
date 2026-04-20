export type Categoria = 'edificio' | 'sala' | 'servico';

export type Local = {
  id: string;
  categoria: Categoria;
  nome: string;
  subtitulo: string;
  edificio: string;
  piso: string;
  distancia: number;
};

// Dados espelhados de assets/data/locais.csv (CSV é a fonte de referência humana;
// este módulo é o que a app consome em runtime).
export const LOCAIS: Local[] = [
  { id: 'e1', categoria: 'edificio', nome: 'Biblioteca', subtitulo: 'Edifício Central', edificio: 'Biblioteca', piso: '', distancia: 90 },
  { id: 'e2', categoria: 'edificio', nome: 'Cantina', subtitulo: 'Edifício Central', edificio: 'Cantina', piso: '', distancia: 100 },
  { id: 'e3', categoria: 'edificio', nome: 'Reitoria', subtitulo: 'Edifício Reitoria', edificio: 'Reitoria', piso: '', distancia: 280 },
  { id: 'e4', categoria: 'edificio', nome: 'Bloco A', subtitulo: 'Edifício de Aulas', edificio: 'Bloco A', piso: '', distancia: 120 },
  { id: 'e5', categoria: 'edificio', nome: 'Bloco B', subtitulo: 'Edifício de Aulas', edificio: 'Bloco B', piso: '', distancia: 240 },
  { id: 'e6', categoria: 'edificio', nome: 'Bloco C', subtitulo: 'Edifício de Aulas', edificio: 'Bloco C', piso: '', distancia: 300 },
  { id: 'e7', categoria: 'edificio', nome: 'Engenharias I', subtitulo: 'Edifício Engenharias I', edificio: 'Engenharias I', piso: '', distancia: 410 },
  { id: 'e8', categoria: 'edificio', nome: 'Geociências', subtitulo: 'Edifício Geociências', edificio: 'Geociências', piso: '', distancia: 360 },
  { id: 'e9', categoria: 'edificio', nome: 'Pavilhão Desportivo', subtitulo: 'Desporto e Lazer', edificio: 'Pavilhão', piso: '', distancia: 520 },
  { id: 'e10', categoria: 'edificio', nome: 'Complexo Pedagógico', subtitulo: 'Edifício CP', edificio: 'Complexo Pedagógico', piso: '', distancia: 470 },
  { id: 's1', categoria: 'sala', nome: 'Sala 2.1', subtitulo: 'Piso 2 - Bloco A', edificio: 'Bloco A', piso: '2', distancia: 120 },
  { id: 's2', categoria: 'sala', nome: 'Sala 2.10', subtitulo: 'Piso 2 - Bloco A', edificio: 'Bloco A', piso: '2', distancia: 125 },
  { id: 's3', categoria: 'sala', nome: 'Sala 1.5', subtitulo: 'Piso 1 - Bloco B', edificio: 'Bloco B', piso: '1', distancia: 240 },
  { id: 's4', categoria: 'sala', nome: 'Sala 0.3', subtitulo: 'Piso 0 - Bloco C', edificio: 'Bloco C', piso: '0', distancia: 300 },
  { id: 's5', categoria: 'sala', nome: 'Lab. Informática 3', subtitulo: 'Piso 1 - Engenharias I', edificio: 'Engenharias I', piso: '1', distancia: 410 },
  { id: 's6', categoria: 'sala', nome: 'Anfiteatro 1', subtitulo: 'Piso 0 - Geociências', edificio: 'Geociências', piso: '0', distancia: 360 },
  { id: 's7', categoria: 'sala', nome: 'Auditório', subtitulo: 'Piso 0 - Reitoria', edificio: 'Reitoria', piso: '0', distancia: 280 },
  { id: 's8', categoria: 'sala', nome: 'Sala 3.2', subtitulo: 'Piso 3 - Bloco A', edificio: 'Bloco A', piso: '3', distancia: 135 },
  { id: 's9', categoria: 'sala', nome: 'Lab. Química', subtitulo: 'Piso 1 - Geociências', edificio: 'Geociências', piso: '1', distancia: 365 },
  { id: 's10', categoria: 'sala', nome: 'Sala 0.1', subtitulo: 'Piso 0 - Complexo Pedagógico', edificio: 'Complexo Pedagógico', piso: '0', distancia: 470 },
  { id: 'sv1', categoria: 'servico', nome: 'Secretaria', subtitulo: 'Reitoria - Piso 0', edificio: 'Reitoria', piso: '0', distancia: 280 },
  { id: 'sv2', categoria: 'servico', nome: 'Tesouraria', subtitulo: 'Reitoria - Piso 0', edificio: 'Reitoria', piso: '0', distancia: 280 },
  { id: 'sv3', categoria: 'servico', nome: 'Centro Médico', subtitulo: 'Edifício Apoio - Piso 0', edificio: 'Edifício Apoio', piso: '0', distancia: 350 },
  { id: 'sv4', categoria: 'servico', nome: 'SASUTAD', subtitulo: 'Edifício Apoio - Piso 1', edificio: 'Edifício Apoio', piso: '1', distancia: 360 },
  { id: 'sv5', categoria: 'servico', nome: 'Reprografia', subtitulo: 'Bloco B - Piso 0', edificio: 'Bloco B', piso: '0', distancia: 240 },
  { id: 'sv6', categoria: 'servico', nome: 'Bar Central', subtitulo: 'Cantina - Piso 0', edificio: 'Cantina', piso: '0', distancia: 100 },
  { id: 'sv7', categoria: 'servico', nome: 'Posto CTT', subtitulo: 'Cantina - Piso 0', edificio: 'Cantina', piso: '0', distancia: 100 },
  { id: 'sv8', categoria: 'servico', nome: 'Banco', subtitulo: 'Cantina - Piso 0', edificio: 'Cantina', piso: '0', distancia: 100 },
  { id: 'sv9', categoria: 'servico', nome: 'Livraria', subtitulo: 'Biblioteca - Piso 0', edificio: 'Biblioteca', piso: '0', distancia: 90 },
  { id: 'sv10', categoria: 'servico', nome: 'Núcleo de Estudantes', subtitulo: 'Bloco A - Piso 1', edificio: 'Bloco A', piso: '1', distancia: 130 },
];
