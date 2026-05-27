// Gera UTAD_Maps_Apresentacao.pptx
// Correr: NODE_PATH=<global node_modules> node gen-pptx.js
//
// Identidade visual baseada na paleta da aplicação (iOS-minimalista):
//   Fundo:    branco puro (#FFFFFF)
//   Texto:    preto (#000000)
//   Subtexto: cinza médio (#6C6C72)
//   Primário: azul UTAD/escola (#2563EB) — também usado para markers de escola na app
//   Acento:   laranja (#EA580C) — usado para servicos e para destacar números-chave
//   Sucesso:  verde (#16A34A) — desporto na app, aqui para indicadores positivos
//   Aviso:    amarelo dourado (#FFD166) — usado discretamente
const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const COLOR = {
  BG:        'FFFFFF',
  CARD:      'F8F9FB',  // ligeiramente off-white para "cards"
  TEXT:      '000000',
  SUBTEXT:   '6C6C72',
  BORDER:    'E5E5EA',
  PRIMARY:   '2563EB',  // azul UTAD
  PRIMARY_D: '1E40AF',  // azul escuro para títulos
  ACCENT:    'EA580C',  // laranja
  SUCCESS:   '16A34A',
  WARNING:   'FFD166',
  PURPLE:    '7C3AED',
};

const FONT = 'Calibri';

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 inch (16:9)
pres.author = 'UTAD Maps Team';
pres.company = 'UTAD — Engenharia Informática';
pres.title = 'UTAD Maps — Apresentação Fase 3';

// ─── MASTER SLIDE: barra inferior sutil + número de slide ────────────────────
pres.defineSlideMaster({
  title: 'BASE',
  background: { color: COLOR.BG },
  objects: [
    // linha fina inferior azul
    { rect: { x: 0, y: 7.40, w: 13.333, h: 0.10, fill: { color: COLOR.PRIMARY } } },
    // pé de página discreto
    { text: {
        text: 'UTAD Maps · IPC 2025-2026',
        options: { x: 0.4, y: 7.10, w: 6, h: 0.25, fontFace: FONT, fontSize: 9, color: COLOR.SUBTEXT, align: 'left' }
    }},
    { text: {
        text: 'utadmaps.b-host.me',
        options: { x: 7, y: 7.10, w: 5.9, h: 0.25, fontFace: FONT, fontSize: 9, color: COLOR.SUBTEXT, align: 'right' }
    }},
  ],
  slideNumber: { x: 12.7, y: 7.15, w: 0.5, h: 0.25, fontFace: FONT, fontSize: 9, color: COLOR.SUBTEXT },
});

// ───────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — CAPA
// ───────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide({ masterName: 'BASE' });
  // remover slide number e pé de página da capa (sobrescrever)
  s.background = { color: COLOR.BG };

  // bloco azul à esquerda
  s.addShape('rect', { x: 0, y: 0, w: 0.4, h: 7.5, fill: { color: COLOR.PRIMARY } });

  // Título grande
  s.addText('UTAD Maps', {
    x: 1.5, y: 2.4, w: 11, h: 1.5,
    fontFace: FONT, fontSize: 80, bold: true, color: COLOR.TEXT, align: 'left',
  });
  // Subtítulo
  s.addText('Navegação inteligente para o campus', {
    x: 1.5, y: 3.6, w: 11, h: 0.6,
    fontFace: FONT, fontSize: 28, color: COLOR.SUBTEXT, align: 'left',
  });

  // Pin marker decorativo (círculo)
  s.addShape('ellipse', {
    x: 12.0, y: 0.6, w: 0.7, h: 0.7,
    fill: { color: COLOR.PRIMARY }, line: { color: COLOR.PRIMARY },
  });
  s.addText('UM', {
    x: 12.0, y: 0.6, w: 0.7, h: 0.7,
    fontFace: FONT, fontSize: 20, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle',
  });

  // URL em destaque
  s.addText('utadmaps.b-host.me', {
    x: 1.5, y: 4.5, w: 11, h: 0.5,
    fontFace: FONT, fontSize: 22, color: COLOR.PRIMARY, italic: true, align: 'left',
  });

  // separador discreto
  s.addShape('rect', { x: 1.5, y: 5.4, w: 3, h: 0.04, fill: { color: COLOR.BORDER } });

  // nomes
  s.addText('Filipe Silva  ·  Liane Duarte  ·  Bruno Alves  ·  Pedro Braz  ·  Diogo Queiroz', {
    x: 1.5, y: 5.6, w: 11, h: 0.4,
    fontFace: FONT, fontSize: 16, color: COLOR.TEXT, align: 'left',
  });
  s.addText('Interação Pessoa-Computador  ·  Licenciatura em Engenharia Informática  ·  2025-2026', {
    x: 1.5, y: 6.1, w: 11, h: 0.4,
    fontFace: FONT, fontSize: 14, color: COLOR.SUBTEXT, align: 'left',
  });
}

// Helper para títulos de slide (canto superior esquerdo, com underline azul)
function addSlideTitle(s, title, subtitle) {
  s.addText(title, {
    x: 0.6, y: 0.4, w: 12, h: 0.65,
    fontFace: FONT, fontSize: 32, bold: true, color: COLOR.TEXT, align: 'left',
  });
  s.addShape('rect', { x: 0.6, y: 1.05, w: 0.6, h: 0.06, fill: { color: COLOR.PRIMARY } });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.6, y: 1.18, w: 12, h: 0.4,
      fontFace: FONT, fontSize: 16, color: COLOR.SUBTEXT, align: 'left',
    });
  }
}

// Helper card (rectângulo arredondado)
function addCard(s, x, y, w, h, fillColor = COLOR.CARD) {
  s.addShape('roundRect', {
    x, y, w, h,
    fill: { color: fillColor },
    line: { color: COLOR.BORDER, width: 1 },
    rectRadius: 0.15,
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — O PROBLEMA + 4 PERSONAS
// ───────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide({ masterName: 'BASE' });
  addSlideTitle(s, 'O problema', 'A navegação no campus acaba à porta do edifício');

  // Frase grande em destaque
  s.addText('"O Google Maps acaba à porta do edifício."', {
    x: 1, y: 2.2, w: 11.3, h: 1,
    fontFace: FONT, fontSize: 36, italic: true, color: COLOR.PRIMARY, align: 'center',
  });

  // 4 personas em cards
  const personas = [
    { emoji: '🎓', label: 'Caloiros', sub: 'Não conhecem os edifícios' },
    { emoji: '🌍', label: 'Erasmus', sub: 'Língua e códigos novos' },
    { emoji: '👁️', label: 'Baixa visão', sub: 'Precisam de leitor + contraste' },
    { emoji: '♿', label: 'Mobilidade reduzida', sub: 'Evitar escadas' },
  ];
  const cardW = 2.6;
  const cardH = 2.4;
  const gap = 0.3;
  const totalW = personas.length * cardW + (personas.length - 1) * gap;
  const startX = (13.333 - totalW) / 2;
  personas.forEach((p, i) => {
    const x = startX + i * (cardW + gap);
    const y = 4.0;
    addCard(s, x, y, cardW, cardH);
    s.addText(p.emoji, {
      x, y: y + 0.2, w: cardW, h: 0.9,
      fontFace: 'Segoe UI Emoji', fontSize: 48, align: 'center',
    });
    s.addText(p.label, {
      x, y: y + 1.2, w: cardW, h: 0.45,
      fontFace: FONT, fontSize: 18, bold: true, color: COLOR.TEXT, align: 'center',
    });
    s.addText(p.sub, {
      x: x + 0.15, y: y + 1.7, w: cardW - 0.3, h: 0.6,
      fontFace: FONT, fontSize: 12, color: COLOR.SUBTEXT, align: 'center',
    });
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — A SOLUÇÃO EM 1 ECRÃ
// ───────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide({ masterName: 'BASE' });
  addSlideTitle(s, 'A solução', 'Mobile-first · iOS · Android · Web — sem instalação');

  // Placeholder "telemóvel" à esquerda — silhueta com mapa
  const phoneX = 1.2, phoneY = 1.9, phoneW = 3.2, phoneH = 5.0;
  // moldura
  s.addShape('roundRect', { x: phoneX, y: phoneY, w: phoneW, h: phoneH, fill: { color: '1F2937' }, line: { color: '1F2937' }, rectRadius: 0.3 });
  // ecrã
  s.addShape('roundRect', { x: phoneX + 0.18, y: phoneY + 0.45, w: phoneW - 0.36, h: phoneH - 0.85, fill: { color: 'F2F2F7' }, line: { color: 'F2F2F7' }, rectRadius: 0.15 });
  // barra de pesquisa simulada
  s.addShape('roundRect', { x: phoneX + 0.35, y: phoneY + 0.75, w: phoneW - 0.7, h: 0.4, fill: { color: 'FFFFFF' }, line: { color: 'E5E5EA' }, rectRadius: 0.1 });
  s.addText('Pesquisar edifício, sala…', { x: phoneX + 0.5, y: phoneY + 0.75, w: phoneW - 0.9, h: 0.4, fontFace: FONT, fontSize: 9, color: COLOR.SUBTEXT, valign: 'middle' });
  // markers (3 círculos)
  [[0.6, 2.2, COLOR.PRIMARY], [1.6, 2.9, COLOR.ACCENT], [1.0, 3.6, COLOR.PURPLE]].forEach(([dx, dy, c]) => {
    s.addShape('ellipse', { x: phoneX + dx, y: phoneY + dy, w: 0.4, h: 0.4, fill: { color: c }, line: { color: c } });
  });

  // 4 funcionalidades à direita em cards
  const features = [
    { title: 'Outdoor', sub: 'Rotas reais via OSRM', color: COLOR.PRIMARY },
    { title: 'Indoor 3D', sub: 'Plantas reais em GLB', color: COLOR.PURPLE },
    { title: 'Horário', sub: 'Auto-import Inforestudante', color: COLOR.ACCENT },
    { title: 'Acessibilidade', sub: '5 níveis de texto + Alto Contraste', color: COLOR.SUCCESS },
  ];
  const fX = 5.2, fY = 1.9, fW = 7.5, fH = 1.05, fGap = 0.15;
  features.forEach((f, i) => {
    const y = fY + i * (fH + fGap);
    addCard(s, fX, y, fW, fH);
    // barra colorida lateral
    s.addShape('rect', { x: fX, y, w: 0.12, h: fH, fill: { color: f.color }, line: { color: f.color } });
    s.addText(f.title, {
      x: fX + 0.3, y: y + 0.18, w: fW - 0.4, h: 0.45,
      fontFace: FONT, fontSize: 20, bold: true, color: COLOR.TEXT, align: 'left',
    });
    s.addText(f.sub, {
      x: fX + 0.3, y: y + 0.6, w: fW - 0.4, h: 0.35,
      fontFace: FONT, fontSize: 13, color: COLOR.SUBTEXT, align: 'left',
    });
  });

  // Stack tag em baixo
  s.addText('React Native · Expo · TypeScript · Three.js · Supabase', {
    x: 5.2, y: 6.95, w: 7.5, h: 0.3,
    fontFace: FONT, fontSize: 11, italic: true, color: COLOR.SUBTEXT, align: 'left',
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — COMO MAPEÁMOS O ECT-POLO I
// ───────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide({ masterName: 'BASE' });
  addSlideTitle(s, 'Como mapeámos o ECT — Polo I', 'Plantas oficiais → Blender 1:100 → GLB navegável');

  // 3 cards: planta de emergência → seta → indoor 3D
  const boxW = 4.0, boxH = 4.0, boxY = 2.2;
  const arrowW = 0.8;
  const totalRowW = boxW * 2 + arrowW + 0.4;
  const xLeft = (13.333 - totalRowW) / 2;
  const xArrow = xLeft + boxW + 0.2;
  const xRight = xArrow + arrowW + 0.2;

  // Card 1 — Planta de emergência (placeholder)
  addCard(s, xLeft, boxY, boxW, boxH);
  s.addText('📋', {
    x: xLeft, y: boxY + 0.6, w: boxW, h: 1.5,
    fontFace: 'Segoe UI Emoji', fontSize: 80, align: 'center',
  });
  s.addText('Planta de emergência', {
    x: xLeft, y: boxY + 2.4, w: boxW, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: COLOR.TEXT, align: 'center',
  });
  s.addText('Afixada em cada piso', {
    x: xLeft, y: boxY + 2.85, w: boxW, h: 0.3,
    fontFace: FONT, fontSize: 13, color: COLOR.SUBTEXT, align: 'center',
  });
  s.addText('Referencial mais fiável do edifício', {
    x: xLeft, y: boxY + 3.2, w: boxW, h: 0.4,
    fontFace: FONT, fontSize: 12, italic: true, color: COLOR.SUBTEXT, align: 'center',
  });

  // Seta no meio
  s.addShape('rightTriangle', {
    x: xArrow, y: boxY + boxH/2 - 0.3, w: arrowW, h: 0.6,
    fill: { color: COLOR.PRIMARY }, line: { color: COLOR.PRIMARY },
    rotate: 0,
  });
  // Não há "arrow" simples — vamos usar um rectangulo + chevron
  // Workaround simples: texto unicode
  s.addText('➔', {
    x: xArrow - 0.1, y: boxY + boxH/2 - 0.5, w: arrowW + 0.2, h: 1,
    fontFace: 'Segoe UI Symbol', fontSize: 64, bold: true, color: COLOR.PRIMARY, align: 'center', valign: 'middle',
  });
  s.addText('Blender', {
    x: xArrow - 0.1, y: boxY + boxH/2 + 0.4, w: arrowW + 0.2, h: 0.3,
    fontFace: FONT, fontSize: 11, color: COLOR.SUBTEXT, align: 'center',
  });

  // Card 2 — Indoor 3D (placeholder)
  addCard(s, xRight, boxY, boxW, boxH);
  s.addText('🏛️', {
    x: xRight, y: boxY + 0.6, w: boxW, h: 1.5,
    fontFace: 'Segoe UI Emoji', fontSize: 80, align: 'center',
  });
  s.addText('Indoor 3D navegável', {
    x: xRight, y: boxY + 2.4, w: boxW, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: COLOR.TEXT, align: 'center',
  });
  s.addText('Three.js + GLB em tempo real', {
    x: xRight, y: boxY + 2.85, w: boxW, h: 0.3,
    fontFace: FONT, fontSize: 13, color: COLOR.SUBTEXT, align: 'center',
  });
  s.addText('62 salas · 162 paredes (col_*)', {
    x: xRight, y: boxY + 3.2, w: boxW, h: 0.4,
    fontFace: FONT, fontSize: 12, italic: true, color: COLOR.SUBTEXT, align: 'center',
  });

  // Tag em baixo
  s.addText('Escala 1:100 · 4 sectores (E · F · G · I) · A* com binary-heap em < 100 ms', {
    x: 0.6, y: 6.6, w: 12, h: 0.4,
    fontFace: FONT, fontSize: 14, italic: true, color: COLOR.SUBTEXT, align: 'center',
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — DEMO (PLACEHOLDER PARA O VÍDEO)
// ───────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide({ masterName: 'BASE' });
  addSlideTitle(s, 'Demonstração', 'Pesquisa → Indoor 3D → Horário → Acessibilidade');

  // Caixa grande com play icon — placeholder para inserir o vídeo
  const videoX = 1.5, videoY = 1.8, videoW = 10.3, videoH = 4.8;
  s.addShape('roundRect', {
    x: videoX, y: videoY, w: videoW, h: videoH,
    fill: { color: '1F2937' }, line: { color: '1F2937' },
    rectRadius: 0.15,
  });
  // play triangle
  s.addText('▶', {
    x: videoX, y: videoY + videoH/2 - 0.8, w: videoW, h: 1.6,
    fontFace: 'Segoe UI Symbol', fontSize: 96, color: 'FFFFFF', align: 'center', valign: 'middle',
  });
  // texto sobre o placeholder
  s.addText('Inserir aqui o vídeo da demo (2:30)', {
    x: videoX, y: videoY + videoH - 0.8, w: videoW, h: 0.4,
    fontFace: FONT, fontSize: 14, color: 'FFFFFF', align: 'center',
  });

  s.addText('PowerPoint → Inserir → Vídeo → A partir deste dispositivo', {
    x: 0.6, y: 6.85, w: 12, h: 0.3,
    fontFace: FONT, fontSize: 11, italic: true, color: COLOR.SUBTEXT, align: 'center',
  });
}

// Helper bignumber
function addBigNumber(s, x, y, w, label, value, color) {
  addCard(s, x, y, w, 1.7);
  s.addText(value, {
    x, y: y + 0.15, w, h: 0.95,
    fontFace: FONT, fontSize: 52, bold: true, color, align: 'center',
  });
  s.addText(label, {
    x, y: y + 1.1, w, h: 0.5,
    fontFace: FONT, fontSize: 13, color: COLOR.SUBTEXT, align: 'center',
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// SLIDE 6 — ACESSIBILIDADE
// ───────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide({ masterName: 'BASE' });
  addSlideTitle(s, 'Fase 2 — Acessibilidade WCAG 2.2 AA', 'Metodologia mista: automática (web) + manual (mobile)');

  // 3 números grandes
  addBigNumber(s, 1.0, 1.8, 3.5, 'Lighthouse score', '100/100', COLOR.SUCCESS);
  addBigNumber(s, 4.9, 1.8, 3.5, 'Critérios WCAG 2.2 AA', '29/34', COLOR.PRIMARY);
  addBigNumber(s, 8.8, 1.8, 3.5, 'Correções aplicadas', '9', COLOR.ACCENT);

  // 2 colunas
  const colY = 3.9, colH = 3.0;
  // Auto
  addCard(s, 1.0, colY, 5.7, colH);
  s.addText('Automáticas', {
    x: 1.2, y: colY + 0.15, w: 5.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: COLOR.PRIMARY, align: 'left',
  });
  s.addText('utadmaps.b-host.me (web)', {
    x: 1.2, y: colY + 0.55, w: 5.4, h: 0.3,
    fontFace: FONT, fontSize: 11, italic: true, color: COLOR.SUBTEXT,
  });
  ['Lighthouse 12.8.2 — score AA', 'axe-core 4.11 — regras WCAG 2.x e 2.2', 'pa11y 9 — axe + HTML CodeSniffer W3C', 'T.A.W. — recomendada pelos docentes'].forEach((t, i) => {
    s.addText('• ' + t, {
      x: 1.2, y: colY + 1.0 + i * 0.4, w: 5.4, h: 0.35,
      fontFace: FONT, fontSize: 12, color: COLOR.TEXT,
    });
  });

  // Manual
  addCard(s, 7.0, colY, 5.7, colH);
  s.addText('Manuais', {
    x: 7.2, y: colY + 0.15, w: 5.4, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: COLOR.ACCENT, align: 'left',
  });
  s.addText('Expo Go em iPhone (versão completa)', {
    x: 7.2, y: colY + 0.55, w: 5.4, h: 0.3,
    fontFace: FONT, fontSize: 11, italic: true, color: COLOR.SUBTEXT,
  });
  ['Atributos React Native — 78 componentes em 12 ficheiros', 'Rácios de contraste — todos AA, alguns AAA', 'VoiceOver em iPhone real — exploratório', 'Reflow nos 5 níveis de texto até 200%'].forEach((t, i) => {
    s.addText('• ' + t, {
      x: 7.2, y: colY + 1.0 + i * 0.4, w: 5.4, h: 0.35,
      fontFace: FONT, fontSize: 12, color: COLOR.TEXT,
    });
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// SLIDE 7 — 3 TÉCNICAS DE AVALIAÇÃO (FASE 3)
// ───────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide({ masterName: 'BASE' });
  addSlideTitle(s, 'Fase 3 — 3 técnicas em paralelo', 'Inspecção + Inspecção + Observação real');

  // 3 círculos parcialmente sobrepostos (Venn estilizado)
  const cx = 6.667, cy = 4.2, r = 1.55;
  // Círculo Nielsen (esquerda)
  s.addShape('ellipse', {
    x: cx - r - 0.8, y: cy - r, w: r * 2, h: r * 2,
    fill: { color: COLOR.PRIMARY, transparency: 70 }, line: { color: COLOR.PRIMARY, width: 2 },
  });
  s.addText('Nielsen', {
    x: cx - r - 1.4, y: cy - r - 0.25, w: 2, h: 0.4,
    fontFace: FONT, fontSize: 16, bold: true, color: COLOR.PRIMARY, align: 'center',
  });
  s.addText('3 peritos\n13 problemas', {
    x: cx - r - 1.4, y: cy - 0.5, w: 1.6, h: 0.9,
    fontFace: FONT, fontSize: 12, color: COLOR.TEXT, align: 'center',
  });

  // Círculo Shneiderman (direita)
  s.addShape('ellipse', {
    x: cx - r + 0.8, y: cy - r, w: r * 2, h: r * 2,
    fill: { color: COLOR.SUCCESS, transparency: 70 }, line: { color: COLOR.SUCCESS, width: 2 },
  });
  s.addText('Shneiderman', {
    x: cx + r - 0.6, y: cy - r - 0.25, w: 2, h: 0.4,
    fontFace: FONT, fontSize: 16, bold: true, color: COLOR.SUCCESS, align: 'center',
  });
  s.addText('8 regras\nvs código', {
    x: cx + r - 0.4, y: cy - 0.5, w: 1.6, h: 0.9,
    fontFace: FONT, fontSize: 12, color: COLOR.TEXT, align: 'center',
  });

  // Círculo User Tests (baixo)
  s.addShape('ellipse', {
    x: cx - r, y: cy - r + 1.4, w: r * 2, h: r * 2,
    fill: { color: COLOR.ACCENT, transparency: 70 }, line: { color: COLOR.ACCENT, width: 2 },
  });
  s.addText('User Tests', {
    x: cx - 1, y: cy + r + 1.2, w: 2, h: 0.4,
    fontFace: FONT, fontSize: 16, bold: true, color: COLOR.ACCENT, align: 'center',
  });
  s.addText('5 × 13 tarefas', {
    x: cx - 1, y: cy + r + 1.6, w: 2, h: 0.3,
    fontFace: FONT, fontSize: 12, color: COLOR.TEXT, align: 'center',
  });

  // Centro — P-01 destacado
  addCard(s, cx - 1.3, cy + 0.2, 2.6, 1.0, 'FFF7E6');
  s.addText('P-01', {
    x: cx - 1.3, y: cy + 0.3, w: 2.6, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: COLOR.ACCENT, align: 'center',
  });
  s.addText('Privacidade do horário', {
    x: cx - 1.3, y: cy + 0.7, w: 2.6, h: 0.4,
    fontFace: FONT, fontSize: 11, color: COLOR.TEXT, align: 'center',
  });

  // Caixa de contexto à esquerda
  s.addText('Convergência valida o método', {
    x: 0.6, y: 6.5, w: 12, h: 0.3,
    fontFace: FONT, fontSize: 14, italic: true, color: COLOR.SUBTEXT, align: 'center',
  });
  s.addText('P-01 detectado pelas 3 técnicas em simultâneo — confirma que o problema é real, não opinião isolada.', {
    x: 0.6, y: 6.8, w: 12, h: 0.3,
    fontFace: FONT, fontSize: 12, color: COLOR.SUBTEXT, align: 'center',
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// SLIDE 8 — USER TESTS + PLANO
// ───────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide({ masterName: 'BASE' });
  addSlideTitle(s, 'User Tests + Plano de melhorias', '5 sessões × 13 tarefas com utilizadores reais');

  // 3 números grandes
  addBigNumber(s, 0.7, 1.7, 3.7, 'Sucesso pleno', '96,9 %', COLOR.SUCCESS);
  addBigNumber(s, 4.8, 1.7, 3.7, 'Facilidade média', '4,6 / 5', COLOR.PRIMARY);
  addBigNumber(s, 8.9, 1.7, 3.7, 'Pontuação Likert', '4,6 / 5', COLOR.PURPLE);

  // Citação destacada
  addCard(s, 0.7, 3.8, 11.9, 1.5, 'FFF7E6');
  s.addShape('rect', { x: 0.7, y: 3.8, w: 0.12, h: 1.5, fill: { color: COLOR.ACCENT }, line: { color: COLOR.ACCENT } });
  s.addText('"O meu horário já estava exposto mesmo sem conta."', {
    x: 1.0, y: 3.95, w: 11.5, h: 0.6,
    fontFace: FONT, fontSize: 22, italic: true, bold: true, color: COLOR.TEXT, align: 'left',
  });
  s.addText('— Participante 2 (P2), tarefa T13 (logout + login)', {
    x: 1.0, y: 4.6, w: 11.5, h: 0.4,
    fontFace: FONT, fontSize: 13, color: COLOR.SUBTEXT, align: 'left',
  });
  s.addText('Confirmação empírica do bug B-02 previsto pelas inspecções.', {
    x: 1.0, y: 4.95, w: 11.5, h: 0.3,
    fontFace: FONT, fontSize: 12, italic: true, color: COLOR.SUBTEXT, align: 'left',
  });

  // 6 melhorias prioritárias
  addCard(s, 0.7, 5.55, 11.9, 1.55);
  s.addText('17 problemas → 6 melhorias prioritárias = 1 dia de trabalho → 100 % de sucesso', {
    x: 1.0, y: 5.7, w: 11.3, h: 0.45,
    fontFace: FONT, fontSize: 16, bold: true, color: COLOR.TEXT, align: 'center',
  });
  s.addText('M-01 limpar storage no logout  ·  M-02 botão login  ·  M-03 accessibilityState  ·  M-04 toast nas definições  ·  M-05 anunciar manobras  ·  M-06 indicador de carregamento', {
    x: 1.0, y: 6.2, w: 11.3, h: 0.7,
    fontFace: FONT, fontSize: 11, color: COLOR.SUBTEXT, align: 'center',
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// SLIDE 9 — OBRIGADO + QR
// ───────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide({ masterName: 'BASE' });
  s.background = { color: COLOR.BG };

  // Bloco azul à esquerda (espelha a capa)
  s.addShape('rect', { x: 12.93, y: 0, w: 0.4, h: 7.5, fill: { color: COLOR.PRIMARY } });

  // Título grande
  s.addText('Obrigado', {
    x: 0.6, y: 1.8, w: 11.5, h: 1.5,
    fontFace: FONT, fontSize: 96, bold: true, color: COLOR.TEXT, align: 'left',
  });
  s.addText('Perguntas?', {
    x: 0.6, y: 3.2, w: 11.5, h: 0.7,
    fontFace: FONT, fontSize: 36, color: COLOR.SUBTEXT, align: 'left',
  });

  // Placeholder QR (caixa preta com texto)
  s.addShape('roundRect', {
    x: 9.0, y: 4.4, w: 2.5, h: 2.5,
    fill: { color: 'FFFFFF' }, line: { color: COLOR.TEXT, width: 2 },
    rectRadius: 0.05,
  });
  // mini "QR pattern" — 9 quadrados em grelha 3x3 nos cantos
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if ((r === 0 && c === 0) || (r === 0 && c === 2) || (r === 2 && c === 0)) {
        s.addShape('rect', { x: 9.15 + c * 1.05, y: 4.55 + r * 1.05, w: 0.4, h: 0.4, fill: { color: COLOR.TEXT }, line: { color: COLOR.TEXT } });
      }
    }
  }
  s.addText('Substituir por\nQR real', {
    x: 9.0, y: 5.45, w: 2.5, h: 0.5,
    fontFace: FONT, fontSize: 11, italic: true, color: COLOR.SUBTEXT, align: 'center',
  });

  // URL + nomes
  s.addText('utadmaps.b-host.me', {
    x: 0.6, y: 4.8, w: 8.0, h: 0.6,
    fontFace: FONT, fontSize: 28, bold: true, color: COLOR.PRIMARY, align: 'left',
  });
  s.addText('Filipe Silva  ·  Liane Duarte  ·  Bruno Alves  ·  Pedro Braz  ·  Diogo Queiroz', {
    x: 0.6, y: 5.6, w: 8.0, h: 0.4,
    fontFace: FONT, fontSize: 14, color: COLOR.TEXT, align: 'left',
  });
  s.addText('Interação Pessoa-Computador  ·  IPC 2025-2026  ·  Universidade de Trás-os-Montes e Alto Douro', {
    x: 0.6, y: 6.05, w: 8.0, h: 0.4,
    fontFace: FONT, fontSize: 11, color: COLOR.SUBTEXT, align: 'left',
  });
}

// ─── SAVE ────────────────────────────────────────────────────────────────────
const outPath = path.join(__dirname, '..', 'UTAD_Maps_Apresentacao.pptx');
pres.writeFile({ fileName: outPath })
  .then(name => console.log('OK ->', name))
  .catch(err => { console.error(err); process.exit(1); });
