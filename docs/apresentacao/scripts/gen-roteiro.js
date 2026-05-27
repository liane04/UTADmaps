// Gera o Roteiro_Apresentacao.docx
// Correr: node gen-roteiro.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, HeadingLevel, PageBreak, PageNumber,
} = require('docx');

const FONT = 'Calibri';
const BLUE = '1F3A6B';   // azul UTAD escuro
const GREY = '6E6E6E';
const LIGHT = 'F2F2F2';

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 100 },
    ...opts,
    children: [new TextRun({ text, font: FONT, size: 22, ...opts.run })],
  });
}

function h(text, level = HeadingLevel.HEADING_1, color = BLUE) {
  return new Paragraph({
    heading: level,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, font: FONT, bold: true, size: level === HeadingLevel.HEADING_1 ? 32 : 26, color })],
  });
}

function quote(text) {
  // Bloco de fala destacado — fundo cinzento claro + indentação
  return new Paragraph({
    indent: { left: 360 },
    spacing: { before: 80, after: 100 },
    shading: { type: ShadingType.CLEAR, fill: LIGHT, color: 'auto' },
    children: [new TextRun({ text, font: FONT, size: 22, italics: true })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: FONT, size: 22 })],
  });
}

function bold(text) {
  return new TextRun({ text, font: FONT, size: 22, bold: true });
}

function plain(text) {
  return new TextRun({ text, font: FONT, size: 22 });
}

// Tabela de distribuição
const border = { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };

function row(cells, header = false) {
  return new TableRow({
    children: cells.map((txt, i) => new TableCell({
      borders,
      width: { size: i === 0 ? 1100 : (i === 1 ? 3200 : (i === 2 ? 2200 : 2860)), type: WidthType.DXA },
      shading: header ? { type: ShadingType.CLEAR, fill: BLUE, color: 'auto' } : undefined,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        children: [new TextRun({
          text: txt, font: FONT, size: 20,
          bold: header,
          color: header ? 'FFFFFF' : '000000',
        })],
      })],
    })),
  });
}

const distrTable = new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [1100, 3200, 2200, 2860],
  rows: [
    row(['#', 'Bloco', 'Orador', 'Tempo'], true),
    row(['1', 'Abertura (problema + personas)', 'Orador 1', '1:30 (cumul. 1:30)']),
    row(['2', 'Solução em 1 ecrã', 'Orador 2', '0:30 (cumul. 2:00)']),
    row(['3', 'Como mapeámos o ECT-Polo I', 'Orador 2', '0:30 (cumul. 2:30)']),
    row(['4', 'Demo gravada (vídeo)', 'Orador 2', '2:30 (cumul. 5:00)']),
    row(['5', 'Acessibilidade WCAG 2.2', 'Orador 3', '1:30 (cumul. 6:30)']),
    row(['6', 'Nielsen + Shneiderman', 'Orador 4', '1:30 (cumul. 8:00)']),
    row(['7', 'User Tests + Plano', 'Orador 5', '1:30 (cumul. 9:30)']),
    row(['8', 'Fecho + obrigado', 'Orador 1', '0:30 (cumul. 10:00)']),
  ],
});

// Slide section helper
function slide(num, title, who, time, slideContent, falas) {
  return [
    h(`SLIDE ${num} — ${title}`, HeadingLevel.HEADING_2),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        bold('Orador: '), plain(who),
        bold('   Tempo: '), plain(time),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [bold('Conteúdo visual do slide:')],
    }),
    ...slideContent,
    new Paragraph({
      spacing: { before: 120, after: 60 },
      children: [bold('Falas verbatim:')],
    }),
    ...falas.map(quote),
  ];
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: FONT, color: BLUE },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: FONT, color: BLUE },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [new TextRun({ text: 'UTAD Maps — Roteiro de Apresentação', font: FONT, size: 18, color: GREY })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Página ', font: FONT, size: 18, color: GREY }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: GREY }),
          ],
        })],
      }),
    },
    children: [
      // Capa
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 720, after: 280 },
        children: [new TextRun({ text: 'UTAD Maps', font: FONT, bold: true, size: 56, color: BLUE })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: 'Roteiro de Apresentação — Fase 3 / IPC 2025-2026', font: FONT, size: 28, color: GREY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'Duração: 10 minutos · 5 oradores · 9 slides', font: FONT, size: 22, italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 720 },
        children: [new TextRun({ text: 'Filipe Silva  ·  Liane Duarte  ·  Bruno Alves  ·  Pedro Braz  ·  Diogo Queiroz', font: FONT, size: 20, color: GREY })],
      }),

      // Visão geral
      h('Visão geral'),
      p('Esta apresentação corresponde à Componente AP (15%) do Modo 1 de avaliação do Desafio 3 da unidade curricular de Interação Pessoa-Computador. Apresentamos o UTAD Maps, uma aplicação mobile-first para navegação inteligente no campus da UTAD, com integração de horário académico, navegação indoor 3D e desenho inclusivo.'),
      p('O fluxo da apresentação está desenhado para 10 minutos exatos com cinco oradores. A demo é apresentada em vídeo gravado (não ao vivo) para eliminar o risco de falha de WiFi ou de comportamento inesperado da aplicação em ambiente desconhecido.'),

      h('Distribuição por orador'),
      distrTable,

      new Paragraph({ spacing: { before: 200 }, children: [bold('Sugestão de atribuição: ')] }),
      bullet('Orador 1 — Filipe (boa abertura/fecho institucional; trabalhou nos user tests)'),
      bullet('Orador 2 — Bruno (dev principal; natural na demo técnica + mapeamento)'),
      bullet('Orador 3 — Liane (verificação prática de Shneiderman e acessibilidade)'),
      bullet('Orador 4 — Pedro (responsável pela avaliação heurística de Nielsen)'),
      bullet('Orador 5 — Diogo (síntese cruzada e plano de melhorias)'),

      new Paragraph({ children: [new PageBreak()] }),

      // Slides
      h('Roteiro detalhado por slide'),

      ...slide('1', 'Capa', '— (visível durante a abertura)', '—',
        [
          bullet('Título grande: UTAD Maps'),
          bullet('Subtítulo: Navegação inteligente para o campus'),
          bullet('URL em destaque: utadmaps.b-host.me'),
          bullet('Nomes dos 5 elementos · IPC 2025/2026 · Logo UTAD'),
        ],
        ['(Sem falas — apenas visível enquanto o Orador 1 começa.)'],
      ),

      ...slide('2', 'O problema + 4 personas', 'Orador 1', '1:30',
        [
          bullet('Frase grande em destaque: "O Google Maps acaba à porta do edifício."'),
          bullet('4 ícones em linha: 1.º ano · Erasmus · Baixa visão · Mobilidade reduzida'),
          bullet('Uma linha curta por persona explicando a necessidade'),
        ],
        [
          'Boa tarde. Somos a equipa do UTAD Maps. Antes de mostrar o que fizemos, queria que pensassem num cenário simples: imaginem um aluno de primeiro ano à procura da sala G0.08 no ECT-Polo I. Abre o telemóvel, mete no Google Maps, e o Google Maps leva-o até à porta do edifício — e depois desiste.',
          'Para quatro perfis distintos de utilizadores, esta lacuna é uma barreira real: caloiros, estudantes Erasmus, pessoas com baixa visão e estudantes com mobilidade reduzida. Não existe hoje no campus uma solução digital que entre com o utilizador no edifício e o leve até à sala.',
          'Foi para resolver este problema concreto que construímos o UTAD Maps. O [Orador 2] vai mostrar.',
        ],
      ),

      ...slide('3', 'A solução em 1 ecrã', 'Orador 2 (parte 1)', '0:30',
        [
          bullet('Screenshot grande do mapa principal da aplicação'),
          bullet('4 callouts em volta: Outdoor com rota OSRM · Indoor 3D · Auto-import Inforestudante · 5 níveis de texto + alto contraste'),
          bullet('Tag inferior: "Web · iOS · Android — sem instalação"'),
        ],
        [
          'O UTAD Maps é uma aplicação mobile-first multi-plataforma — funciona em iOS, Android e Web a partir de um único link, sem instalação. Combina quatro funcionalidades-chave: navegação exterior entre edifícios com rotas reais via OSRM, navegação interior 3D dentro dos edifícios, importação automática do horário académico do Inforestudante, e suporte de acessibilidade com cinco níveis de texto até 200% e modo de alto contraste.',
        ],
      ),

      ...slide('4', 'Como mapeámos o ECT-Polo I', 'Orador 2 (parte 2)', '0:30',
        [
          bullet('Lado esquerdo: imagem de planta de emergência oficial'),
          bullet('Seta grande no meio'),
          bullet('Lado direito: screenshot do indoor 3D da aplicação'),
          bullet('Rodapé: "Blender · escala 1:100 · 62 salas · 162 paredes · GLB exportado"'),
        ],
        [
          'O mapa interior não foi inventado. Partimos das plantas de emergência oficiais afixadas em cada piso do ECT — o referencial mais fiável que existe no edifício. Importámo-las para o Blender à escala 1:100 e modelámos manualmente cada parede como collider e cada sala como um plano de chão navegável. Resultado: 62 salas e 162 paredes do Polo I, exportadas em GLB e renderizadas em tempo real no telemóvel. É daí que vem a precisão da navegação que vão ver de seguida.',
        ],
      ),

      ...slide('5', 'Demo (vídeo gravado)', 'Orador 2 (parte 3)', '2:30',
        [
          bullet('Vídeo gravado de 2:30 em ecrã cheio — sem dependência de WiFi'),
          bullet('Rodapé pequeno: "Demonstração · utadmaps.b-host.me"'),
          bullet('Pré-condição: vídeo testado antes da apresentação no portátil ligado ao projector'),
        ],
        [
          '[0:00–0:40] Vou começar por pesquisar uma sala. Imaginem que tenho aula na G0.08. O sistema reconhece a sala, identifica o piso, e abre directamente a planta 3D do piso 0 do ECT, com a sala destacada e o caminho desde a entrada do edifício.',
          '[0:40–1:20] Aqui temos o horário importado automaticamente do Inforestudante, sem exportar ficheiros, usando a chave privada de sincronização do calendário. Cada aula é clicável — tocar numa aula leva-me directamente para a sala correspondente.',
          '[1:20–2:00] Para utilizadores com baixa visão, temos cinco níveis de tamanho do texto até 200% e modo de alto contraste com rácio 21:1. Notem o feedback imediato — cada alteração mostra uma confirmação textual, e o leitor de ecrã anuncia a transição.',
          '[2:00–2:30] E tudo está disponível em português e inglês. Passo a palavra ao [Orador 3], que vai explicar como garantimos que esta aplicação cumpre os padrões internacionais de acessibilidade.',
        ],
      ),

      ...slide('6', 'Fase 2 — Acessibilidade WCAG 2.2 AA', 'Orador 3', '1:30',
        [
          bullet('3 números enormes no topo: 100/100 Lighthouse · 29/34 critérios WCAG · 9 correções'),
          bullet('Duas colunas em baixo: Automáticas (Lighthouse · axe-core · pa11y · T.A.W.) | Manuais (atributos RN · contraste · VoiceOver · responsividade)'),
        ],
        [
          'Para a acessibilidade adotámos uma metodologia mista, conforme indicado pelos docentes. Combinámos quatro ferramentas automáticas — Lighthouse, axe-core, pa11y e T.A.W. — com quatro análises manuais, incluindo teste real com o leitor de ecrã VoiceOver num iPhone.',
          'Os resultados estão no ecrã: 100% no Lighthouse, 29 dos 34 critérios WCAG 2.2 nível AA totalmente conformes — o que corresponde a 85% de conformidade plena — e identificámos no processo nove correções concretas que foram aplicadas durante a própria Fase 2.',
          'A lição metodológica é importante: as ferramentas automáticas só detectam 30 a 40% dos problemas reais. O bug B-05, que afetava utilizadores com texto a 200%, só foi descoberto pelo nosso teste manual de responsividade — nenhuma das quatro ferramentas o apanhou.',
        ],
      ),

      ...slide('7', 'Fase 3 — 3 técnicas em paralelo', 'Orador 4', '1:30',
        [
          bullet('Diagrama de Venn de 3 círculos: Nielsen (3 peritos · 13 problemas) | Shneiderman (8 regras · verificação contra código) | User Tests (5 × 13 tarefas)'),
          bullet('No centro do diagrama: "P-01 — privacidade detectada pelas 3 técnicas"'),
        ],
        [
          'Na Fase 3 aplicámos em paralelo as três técnicas de avaliação previstas no enunciado: heurísticas de Nielsen, regras de Shneiderman e testes com utilizadores.',
          'Os três peritos externos da heurística de Nielsen identificaram 13 problemas reais, dos quais um catastrófico. As oito regras de Shneiderman foram verificadas linha a linha contra o código-fonte e contra a aplicação em execução — abandonámos toda a afirmação que não correspondesse ao build real.',
          'As duas técnicas convergiram no mesmo problema crítico: após o logout, o horário académico do utilizador anterior permanecia visível no telemóvel. Uma falha de privacidade séria — e foi essa convergência que nos deu confiança de que o problema era real, não opinião isolada.',
          'O [Orador 5] vai mostrar como os utilizadores reais confirmaram empiricamente este cenário.',
        ],
      ),

      ...slide('8', 'User Tests + Plano de melhorias', 'Orador 5', '1:30',
        [
          bullet('Bloco superior — 3 números enormes: 96,9% taxa de sucesso · 4,6/5 facilidade · 4,6/5 Likert'),
          bullet('Citação destacada: "O meu horário já estava exposto mesmo sem conta" — P2, tarefa T13'),
          bullet('Bloco inferior — tabela compacta: 6 melhorias prioritárias = 1 dia de trabalho → 100% de sucesso'),
        ],
        [
          'Conduzimos cinco sessões de teste com utilizadores reais recrutados na comunidade académica da UTAD, abrangendo treze tarefas representativas: autenticação, importação de horário, navegação outdoor e indoor, configurações de acessibilidade, logout.',
          'Os resultados globais são positivos: 96,9% de taxa de sucesso pleno em 65 tentativas, 4,6 em 5 na facilidade média e 4,6 no Likert do questionário pós-teste. Mas o resultado mais importante está aqui.',
          '(Apontar para a citação.)',
          'O Participante 2, na tarefa de logout, abriu o telemóvel e viu o horário do utilizador anterior. A privacidade que tínhamos previsto pelas inspeções foi confirmada empiricamente pelos utilizadores reais — esta é a justificação concreta para combinar técnicas: a inspeção prevê, o teste confirma.',
          'Identificámos 17 problemas distintos no total. Propomos 6 melhorias prioritárias — todas triviais — que num dia de trabalho elevam a aplicação dos 96,9% para 100% de taxa de sucesso na próxima iteração.',
        ],
      ),

      ...slide('9', 'Obrigado + QR', 'Orador 1', '0:30',
        [
          bullet('QR code GRANDE para utadmaps.b-host.me (testar antes!)'),
          bullet('5 nomes em baixo + logo UTAD'),
        ],
        [
          'Em resumo: criámos uma aplicação mobile-first, acessível desde a primeira linha de código, com navegação indoor 3D baseada em plantas reais, e validada por três técnicas convergentes de avaliação. Está disponível online em utadmaps.b-host.me.',
          'Obrigado pela atenção — estamos disponíveis para perguntas.',
        ],
      ),

      new Paragraph({ children: [new PageBreak()] }),

      h('Coreografia e dicas para o dia'),
      bullet('Quem clica os slides: Orador 4 (fixo) — quem fala não toca no portátil.'),
      bullet('Vídeo da demo: testar no portátil + projector antes de começar. Volume baixo / em silêncio (não tem áudio).'),
      bullet('Cronómetro discreto: Orador 5 vigia o tempo e sinaliza subtilmente se algum bloco passar do previsto.'),
      bullet('Olhar para os 3 docentes: alternar entre João Barroso, Francisco Godinho, Tânia Rocha — não fixar no portátil.'),

      h('Preparação antes da apresentação'),
      bullet('Cada orador leva o seu bloco impresso ou aberto no iPad/telemóvel.'),
      bullet('Ensaiar uma vez do princípio ao fim com cronómetro. Se passar de 10:30, cortar 5 s de cada bloco.'),
      bullet('Confirmar que o vídeo da demo está no portátil (ficheiro local) e não a precisar de rede.'),
      bullet('Validar que o ecrã projector mostra a apresentação na cor correcta (logo UTAD legível).'),

      h('Perguntas prováveis no Q&A (não conta para os 10 min)'),
      new Paragraph({ spacing: { before: 100 }, children: [bold('"Como recrutaram os 5 utilizadores externos?"')] }),
      quote('Estudantes da UTAD recrutados na comunidade académica, sem contacto prévio com a aplicação. Diversidade de plataforma (iOS + Android) e dispositivos garantida pelos próprios participantes.'),

      new Paragraph({ spacing: { before: 100 }, children: [bold('"Como mediram o tempo das tarefas?"')] }),
      quote('Cronómetro do telemóvel; registo manual pelo moderador. Protocolo descrito no anexo USER_TESTS dos documentos da Fase 3.'),

      new Paragraph({ spacing: { before: 100 }, children: [bold('"Por que não fizeram localização real indoor (BLE/WiFi)?"')] }),
      quote('Custo estimado de 600–1500€ em hardware, restrições de instalação no edifício UTAD, e iOS 13+ não dá acesso à API de WiFi scanning sem entitlement enterprise. Documentado como trabalho futuro.'),

      new Paragraph({ spacing: { before: 100 }, children: [bold('"O Inforestudante autorizou a integração?"')] }),
      quote('Não há scraping nem credenciais. O aluno copia a chave privada do próprio portal — a UTAD disponibiliza essa chave publicamente por design para sincronização de calendário (mesmo formato iCal usado por Google Calendar, Outlook, etc.).'),

      new Paragraph({ spacing: { before: 100 }, children: [bold('"Qual o maior aprendizado do projecto?"')] }),
      quote('A combinação de inspeção + testes empíricos. A inspeção previu o B-02 (privacidade do horário); os testes com utilizadores confirmaram-no de forma irrefutável (citação do P2 no slide 8). Sozinhas, nenhuma das técnicas teria sido suficiente — a inspeção poderia ser descartada como "preocupação teórica", o teste sem o contexto da inspeção poderia parecer caso isolado.'),
    ],
  }],
});

const outPath = path.join(__dirname, '..', 'Roteiro_Apresentacao.docx');
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log('OK ->', outPath);
});
