export type Categoria = 'edificio' | 'sala' | 'servico';

export type Local = {
  id: string;
  categoria: Categoria;
  nome: string;
  nomeEn: string;
  subtitulo: string;
  subtituloEn: string;
  edificio: string;
  piso: string;
  distancia: number;
};

export const LOCAIS: Local[] = [
  { id: 'e1', categoria: 'edificio', nome: 'Biblioteca', nomeEn: 'Library', subtitulo: 'Edifício Central', subtituloEn: 'Central Building', edificio: 'Biblioteca', piso: '', distancia: 90 },
  { id: 'e2', categoria: 'edificio', nome: 'Cantina', nomeEn: 'Canteen', subtitulo: 'Edifício Central', subtituloEn: 'Central Building', edificio: 'Cantina', piso: '', distancia: 100 },
  { id: 'e3', categoria: 'edificio', nome: 'Reitoria', nomeEn: 'Rectory', subtitulo: 'Edifício Reitoria', subtituloEn: 'Rectory Building', edificio: 'Reitoria', piso: '', distancia: 280 },
  { id: 'e4', categoria: 'edificio', nome: 'Bloco A', nomeEn: 'Block A', subtitulo: 'Edifício de Aulas', subtituloEn: 'Teaching Building', edificio: 'Bloco A', piso: '', distancia: 120 },
  { id: 'e5', categoria: 'edificio', nome: 'Bloco B', nomeEn: 'Block B', subtitulo: 'Edifício de Aulas', subtituloEn: 'Teaching Building', edificio: 'Bloco B', piso: '', distancia: 240 },
  { id: 'e6', categoria: 'edificio', nome: 'Bloco C', nomeEn: 'Block C', subtitulo: 'Edifício de Aulas', subtituloEn: 'Teaching Building', edificio: 'Bloco C', piso: '', distancia: 300 },
  { id: 'e7', categoria: 'edificio', nome: 'Engenharias I', nomeEn: 'Engineering I', subtitulo: 'Edifício Engenharias I', subtituloEn: 'Engineering Building I', edificio: 'Engenharias I', piso: '', distancia: 410 },
  { id: 'e8', categoria: 'edificio', nome: 'Geociências', nomeEn: 'Geosciences', subtitulo: 'Edifício Geociências', subtituloEn: 'Geosciences Building', edificio: 'Geociências', piso: '', distancia: 360 },
  { id: 'e9', categoria: 'edificio', nome: 'Pavilhão Desportivo', nomeEn: 'Sports Pavilion', subtitulo: 'Desporto e Lazer', subtituloEn: 'Sports & Leisure', edificio: 'Pavilhão', piso: '', distancia: 520 },
  { id: 'e10', categoria: 'edificio', nome: 'Complexo Pedagógico', nomeEn: 'Pedagogical Complex', subtitulo: 'Edifício CP', subtituloEn: 'CP Building', edificio: 'Complexo Pedagógico', piso: '', distancia: 470 },
  { id: 's1', categoria: 'sala', nome: 'Sala 2.1', nomeEn: 'Room 2.1', subtitulo: 'Piso 2 - Bloco A', subtituloEn: 'Floor 2 - Block A', edificio: 'Bloco A', piso: '2', distancia: 120 },
  { id: 's2', categoria: 'sala', nome: 'Sala 2.10', nomeEn: 'Room 2.10', subtitulo: 'Piso 2 - Bloco A', subtituloEn: 'Floor 2 - Block A', edificio: 'Bloco A', piso: '2', distancia: 125 },
  { id: 's3', categoria: 'sala', nome: 'Sala 1.5', nomeEn: 'Room 1.5', subtitulo: 'Piso 1 - Bloco B', subtituloEn: 'Floor 1 - Block B', edificio: 'Bloco B', piso: '1', distancia: 240 },
  { id: 's4', categoria: 'sala', nome: 'Sala 0.3', nomeEn: 'Room 0.3', subtitulo: 'Piso 0 - Bloco C', subtituloEn: 'Floor 0 - Block C', edificio: 'Bloco C', piso: '0', distancia: 300 },
  { id: 's5', categoria: 'sala', nome: 'Lab. Informática 3', nomeEn: 'Computer Lab 3', subtitulo: 'Piso 1 - Engenharias I', subtituloEn: 'Floor 1 - Engineering I', edificio: 'Engenharias I', piso: '1', distancia: 410 },
  { id: 's6', categoria: 'sala', nome: 'Anfiteatro 1', nomeEn: 'Amphitheater 1', subtitulo: 'Piso 0 - Geociências', subtituloEn: 'Floor 0 - Geosciences', edificio: 'Geociências', piso: '0', distancia: 360 },
  { id: 's7', categoria: 'sala', nome: 'Auditório', nomeEn: 'Auditorium', subtitulo: 'Piso 0 - Reitoria', subtituloEn: 'Floor 0 - Rectory', edificio: 'Reitoria', piso: '0', distancia: 280 },
  { id: 's8', categoria: 'sala', nome: 'Sala 3.2', nomeEn: 'Room 3.2', subtitulo: 'Piso 3 - Bloco A', subtituloEn: 'Floor 3 - Block A', edificio: 'Bloco A', piso: '3', distancia: 135 },
  { id: 's9', categoria: 'sala', nome: 'Lab. Química', nomeEn: 'Chemistry Lab', subtitulo: 'Piso 1 - Geociências', subtituloEn: 'Floor 1 - Geosciences', edificio: 'Geociências', piso: '1', distancia: 365 },
  { id: 's10', categoria: 'sala', nome: 'Sala 0.1', nomeEn: 'Room 0.1', subtitulo: 'Piso 0 - Complexo Pedagógico', subtituloEn: 'Floor 0 - Pedagogical Complex', edificio: 'Complexo Pedagógico', piso: '0', distancia: 470 },
  { id: 'sv1', categoria: 'servico', nome: 'Secretaria', nomeEn: 'Secretariat', subtitulo: 'Reitoria - Piso 0', subtituloEn: 'Rectory - Floor 0', edificio: 'Reitoria', piso: '0', distancia: 280 },
  { id: 'sv2', categoria: 'servico', nome: 'Tesouraria', nomeEn: 'Treasury', subtitulo: 'Reitoria - Piso 0', subtituloEn: 'Rectory - Floor 0', edificio: 'Reitoria', piso: '0', distancia: 280 },
  { id: 'sv3', categoria: 'servico', nome: 'Centro Médico', nomeEn: 'Medical Centre', subtitulo: 'Edifício Apoio - Piso 0', subtituloEn: 'Support Building - Floor 0', edificio: 'Edifício Apoio', piso: '0', distancia: 350 },
  { id: 'sv4', categoria: 'servico', nome: 'SASUTAD', nomeEn: 'SASUTAD', subtitulo: 'Edifício Apoio - Piso 1', subtituloEn: 'Support Building - Floor 1', edificio: 'Edifício Apoio', piso: '1', distancia: 360 },
  { id: 'sv5', categoria: 'servico', nome: 'Reprografia', nomeEn: 'Print Shop', subtitulo: 'Bloco B - Piso 0', subtituloEn: 'Block B - Floor 0', edificio: 'Bloco B', piso: '0', distancia: 240 },
  { id: 'sv6', categoria: 'servico', nome: 'Bar Central', nomeEn: 'Central Bar', subtitulo: 'Cantina - Piso 0', subtituloEn: 'Canteen - Floor 0', edificio: 'Cantina', piso: '0', distancia: 100 },
  { id: 'sv7', categoria: 'servico', nome: 'Posto CTT', nomeEn: 'Post Office', subtitulo: 'Cantina - Piso 0', subtituloEn: 'Canteen - Floor 0', edificio: 'Cantina', piso: '0', distancia: 100 },
  { id: 'sv8', categoria: 'servico', nome: 'Banco', nomeEn: 'Bank', subtitulo: 'Cantina - Piso 0', subtituloEn: 'Canteen - Floor 0', edificio: 'Cantina', piso: '0', distancia: 100 },
  { id: 'sv9', categoria: 'servico', nome: 'Livraria', nomeEn: 'Bookstore', subtitulo: 'Biblioteca - Piso 0', subtituloEn: 'Library - Floor 0', edificio: 'Biblioteca', piso: '0', distancia: 90 },
  { id: 'sv10', categoria: 'servico', nome: 'Núcleo de Estudantes', nomeEn: 'Student Union', subtitulo: 'Bloco A - Piso 1', subtituloEn: 'Block A - Floor 1', edificio: 'Bloco A', piso: '1', distancia: 130 },
];

// Expo-router requires a default export in every file inside app/
export default {};
