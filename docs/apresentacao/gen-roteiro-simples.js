// Gera Roteiro_Simplificado.docx — apenas falas, formato decorável.
// Correr: node gen-roteiro-simples.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, BorderStyle, HeadingLevel, PageBreak, PageNumber,
} = require('docx');

const FONT = 'Calibri';
const BLUE = '1F3A6B';
const GREY = '6E6E6E';

function speakerHeader(num, name, time, slideTitle) {
  return [
    new Paragraph({
      spacing: { before: 240, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 6 } },
      children: [new TextRun({ text: `ORADOR ${num} — ${name}`, font: FONT, bold: true, size: 36, color: BLUE })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: `${time}  ·  ${slideTitle}`, font: FONT, size: 22, color: GREY, italics: true }),
      ],
    }),
  ];
}

function fala(text) {
  // Texto a falar em fonte grande e espaçamento amplo para fácil leitura
  return new Paragraph({
    spacing: { before: 120, after: 180, line: 360 },
    children: [new TextRun({ text, font: FONT, size: 28 })],
  });
}

function nota(text) {
  // Nota cenária (entre parêntesis em itálico)
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: `(${text})`, font: FONT, size: 22, italics: true, color: GREY })],
  });
}

function tempo(label) {
  // Marca de tempo dentro de um bloco longo
  return new Paragraph({
    spacing: { before: 100, after: 40 },
    children: [new TextRun({ text: label, font: FONT, bold: true, size: 22, color: BLUE })],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [new TextRun({ text: 'UTAD Maps — Falas da Apresentação (10 min)', font: FONT, size: 18, color: GREY })],
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
        children: [new TextRun({ text: 'Falas da Apresentação', font: FONT, bold: true, size: 56, color: BLUE })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'UTAD Maps — Versão para decorar', font: FONT, size: 28, color: GREY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: '10 minutos · 5 oradores · IPC 2025-2026', font: FONT, size: 22, italics: true })],
      }),

      // Distribuição rápida
      new Paragraph({
        spacing: { before: 200, after: 120 },
        children: [new TextRun({ text: 'Ordem dos oradores', font: FONT, bold: true, size: 28, color: BLUE })],
      }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '1.  Filipe       — Abertura          (1:30)', font: 'Consolas', size: 22 })] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '2.  Bruno        — Solução + Demo    (3:30)', font: 'Consolas', size: 22 })] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '3.  Liane        — Acessibilidade    (1:30)', font: 'Consolas', size: 22 })] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '4.  Pedro        — Nielsen + Shnei.  (1:30)', font: 'Consolas', size: 22 })] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '5.  Diogo        — User Tests        (1:30)', font: 'Consolas', size: 22 })] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '6.  Filipe       — Fecho              (0:30)', font: 'Consolas', size: 22 })] }),

      new Paragraph({
        spacing: { before: 240, after: 60 },
        children: [new TextRun({ text: 'Dicas rápidas:', font: FONT, bold: true, size: 22 })],
      }),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: '· Cada orador lê do seu telemóvel/iPad — não é preciso decorar palavra-a-palavra, mas conhecer bem o conteúdo.', font: FONT, size: 22 })] }),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: '· Quem fala NÃO toca no portátil — o Pedro avança os slides.', font: FONT, size: 22 })] }),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: '· Falar olhando para os 3 docentes (alternar), não para o ecrã.', font: FONT, size: 22 })] }),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: '· O vídeo da demo (slide 5) é o único momento em que ninguém fala — deixar correr.', font: FONT, size: 22 })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── ORADOR 1 (parte 1) — Abertura ─────────────────────────────
      ...speakerHeader('1 (Filipe)', 'Abertura', '1 min 30 seg', 'Slide 2 — Problema + 4 personas'),

      fala('Boa tarde. Somos a equipa do UTAD Maps.'),
      fala('Antes de mostrar o que fizemos, queria que pensassem num cenário simples: imaginem um aluno de primeiro ano à procura da sala G0.08 no ECT-Polo I. Abre o telemóvel, mete no Google Maps, e o Google Maps leva-o até à porta do edifício — e depois desiste.'),
      fala('Para quatro perfis distintos de utilizadores, esta lacuna é uma barreira real: caloiros, estudantes Erasmus, pessoas com baixa visão e estudantes com mobilidade reduzida. Não existe hoje no campus uma solução digital que entre com o utilizador no edifício e o leve até à sala.'),
      fala('Foi para resolver este problema concreto que construímos o UTAD Maps. O Bruno vai mostrar.'),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── ORADOR 2 — Solução + Mapeamento + Demo ─────────────────────
      ...speakerHeader('2 (Bruno)', 'Solução · Mapeamento · Demo', '3 min 30 seg total', 'Slides 3, 4, 5'),

      tempo('▶ Slide 3 — Solução em 1 ecrã  (30 seg)'),
      fala('O UTAD Maps é uma aplicação mobile-first multi-plataforma — funciona em iOS, Android e Web a partir de um único link, sem instalação.'),
      fala('Combina quatro funcionalidades-chave: navegação exterior entre edifícios com rotas reais via OSRM, navegação interior 3D dentro dos edifícios, importação automática do horário académico do Inforestudante, e suporte de acessibilidade com cinco níveis de texto até 200 por cento e modo de alto contraste.'),

      tempo('▶ Slide 4 — Como mapeámos  (30 seg)'),
      fala('O mapa interior não foi inventado. Partimos das plantas de emergência oficiais afixadas em cada piso do ECT — o referencial mais fiável que existe no edifício.'),
      fala('Importámo-las para o Blender à escala um para cem e modelámos manualmente cada parede como collider e cada sala como um plano de chão navegável. Resultado: 62 salas e 162 paredes do Polo I, exportadas em GLB e renderizadas em tempo real no telemóvel. É daí que vem a precisão da navegação que vão ver agora.'),

      tempo('▶ Slide 5 — Demo gravada  (2 min 30 seg)'),
      nota('O vídeo começa. Falar por cima, sincronizando com o que aparece no ecrã.'),

      tempo('[0 — 40 s] Pesquisa de sala'),
      fala('Vou começar por pesquisar uma sala. Imaginem que tenho aula na G0.08.'),
      fala('O sistema reconhece a sala, identifica o piso, e abre directamente a planta 3D do piso 0 do ECT, com a sala destacada e o caminho desde a entrada do edifício.'),

      tempo('[40 — 80 s] Horário + próxima aula'),
      fala('Este horário foi importado automaticamente do Inforestudante, sem exportar ficheiros, usando a chave privada de sincronização do calendário do utilizador. Cada aula é clicável — tocar leva-me directamente para a sala correspondente.'),

      tempo('[80 — 120 s] Acessibilidade'),
      fala('Para utilizadores com baixa visão, temos cinco níveis de tamanho do texto até 200 por cento, e modo de alto contraste com rácio 21 para 1. Notem o feedback imediato — cada alteração mostra uma confirmação textual, e o leitor de ecrã anuncia a transição.'),

      tempo('[120 — 150 s] Bilingue + transição'),
      fala('E tudo está disponível em português e inglês. Passo a palavra à Liane, que vai explicar como garantimos que esta aplicação cumpre os padrões internacionais de acessibilidade.'),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── ORADOR 3 (Liane) — Acessibilidade ──────────────────────────
      ...speakerHeader('3 (Liane)', 'Fase 2 — Acessibilidade WCAG 2.2 AA', '1 min 30 seg', 'Slide 6'),

      fala('Para a acessibilidade adoptámos uma metodologia mista, conforme indicado pelos docentes.'),
      fala('Combinámos quatro ferramentas automáticas — Lighthouse, axe-core, pa11y e a T.A.W. — com quatro análises manuais, incluindo teste real com o leitor de ecrã VoiceOver num iPhone.'),
      fala('Os resultados estão no ecrã: 100 em 100 no Lighthouse, 29 dos 34 critérios WCAG 2.2 nível AA totalmente conformes — o que corresponde a 85 por cento de conformidade plena — e identificámos no processo nove correcções concretas que foram aplicadas durante a própria Fase 2.'),
      fala('A lição metodológica é importante: as ferramentas automáticas só detectam 30 a 40 por cento dos problemas reais. O bug B-05, que afectava utilizadores com texto a 200 por cento, só foi descoberto pelo nosso teste manual de responsividade — nenhuma das quatro ferramentas o apanhou.'),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── ORADOR 4 (Pedro) — Nielsen + Shneiderman ───────────────────
      ...speakerHeader('4 (Pedro)', 'Fase 3 — Nielsen + Shneiderman', '1 min 30 seg', 'Slide 7'),

      fala('Na Fase 3 aplicámos em paralelo as três técnicas de avaliação previstas no enunciado: heurísticas de Nielsen, regras de Shneiderman e testes com utilizadores.'),
      fala('Os três peritos externos da heurística de Nielsen identificaram 13 problemas reais, dos quais um catastrófico.'),
      fala('As oito regras de Shneiderman foram verificadas linha a linha contra o código-fonte e contra a aplicação em execução — abandonámos toda a afirmação que não correspondesse ao build real.'),
      fala('As duas técnicas convergiram no mesmo problema crítico: após o logout, o horário académico do utilizador anterior permanecia visível no telemóvel. Uma falha de privacidade séria — e foi essa convergência que nos deu confiança de que o problema era real, não opinião isolada.'),
      fala('O Diogo vai mostrar como os utilizadores reais confirmaram empiricamente este cenário.'),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── ORADOR 5 (Diogo) — User Tests ──────────────────────────────
      ...speakerHeader('5 (Diogo)', 'Fase 3 — User Tests + Plano de melhorias', '1 min 30 seg', 'Slide 8'),

      fala('Conduzimos cinco sessões de teste com utilizadores reais recrutados na comunidade académica da UTAD, abrangendo treze tarefas representativas: autenticação, importação de horário, navegação outdoor e indoor, configurações de acessibilidade, logout.'),
      fala('Os resultados globais são positivos: 96,9 por cento de taxa de sucesso pleno em 65 tentativas, 4,6 em 5 na facilidade média, e 4,6 no Likert do questionário pós-teste.'),
      fala('Mas o resultado mais importante está aqui:'),
      nota('Apontar para a citação no slide.'),
      fala('O Participante 2, na tarefa de logout, abriu o telemóvel e viu o horário do utilizador anterior. A privacidade que tínhamos previsto pelas inspecções foi confirmada empiricamente pelos utilizadores reais — esta é a justificação concreta para combinar técnicas: a inspecção prevê, o teste confirma.'),
      fala('Identificámos 17 problemas distintos no total. Propomos 6 melhorias prioritárias — todas triviais — que num dia de trabalho elevam a aplicação dos 96,9 para 100 por cento de taxa de sucesso na próxima iteração.'),
      fala('E aliás, já implementámos uma delas: a legenda das cores dos marcadores no mapa, identificada por um dos peritos. Está visível no canto inferior esquerdo do mapa principal, recolhível para não poluir. Isto demonstra que o ciclo avaliação → correcção da nossa metodologia funciona na prática.'),

      new Paragraph({ children: [new PageBreak()] }),

      // ─── ORADOR 1 (parte 2) — Fecho ─────────────────────────────────
      ...speakerHeader('1 (Filipe)', 'Fecho', '30 seg', 'Slide 9 — Obrigado + QR'),

      fala('Em resumo: criámos uma aplicação mobile-first, acessível desde a primeira linha de código, com navegação indoor 3D baseada em plantas reais, e validada por três técnicas convergentes de avaliação. Está disponível online em utadmaps.b-host.me.'),
      fala('Obrigado pela atenção — estamos disponíveis para perguntas.'),

      new Paragraph({ children: [new PageBreak()] }),

      // Respostas a perguntas
      new Paragraph({
        spacing: { before: 200, after: 120 },
        children: [new TextRun({ text: 'Respostas rápidas para o Q&A', font: FONT, bold: true, size: 32, color: BLUE })],
      }),
      nota('Estas perguntas estão FORA dos 10 minutos. Resposta curta, depois calar.'),

      new Paragraph({
        spacing: { before: 200, after: 60 },
        children: [new TextRun({ text: 'P: Como recrutaram os 5 utilizadores externos?', font: FONT, bold: true, size: 22 })],
      }),
      fala('Estudantes da UTAD recrutados na comunidade académica, sem contacto prévio com a aplicação. A diversidade de plataforma — iOS e Android — e de dispositivos foi garantida pelos próprios participantes.'),

      new Paragraph({
        spacing: { before: 200, after: 60 },
        children: [new TextRun({ text: 'P: Como mediram o tempo das tarefas?', font: FONT, bold: true, size: 22 })],
      }),
      fala('Cronómetro do telemóvel, com registo manual pelo moderador. O protocolo está descrito no anexo dos documentos da Fase 3.'),

      new Paragraph({
        spacing: { before: 200, after: 60 },
        children: [new TextRun({ text: 'P: Por que não fizeram localização real indoor (BLE/WiFi)?', font: FONT, bold: true, size: 22 })],
      }),
      fala('Por três razões: custo estimado de 600 a 1500 euros em hardware BLE, necessidade de autorização da UTAD para instalar os emissores no edifício, e o iOS desde a versão 13 não dá acesso à API de WiFi scanning sem entitlement empresarial. Ficou documentado como trabalho futuro.'),

      new Paragraph({
        spacing: { before: 200, after: 60 },
        children: [new TextRun({ text: 'P: O Inforestudante autorizou a integração?', font: FONT, bold: true, size: 22 })],
      }),
      fala('Não há scraping nem credenciais. O aluno copia a chave privada do próprio portal — a UTAD disponibiliza essa chave publicamente por design, para sincronização de calendário no mesmo formato iCal que usa o Google Calendar ou o Outlook.'),

      new Paragraph({
        spacing: { before: 200, after: 60 },
        children: [new TextRun({ text: 'P: Qual o maior aprendizado do projecto?', font: FONT, bold: true, size: 22 })],
      }),
      fala('A combinação de inspecção com testes empíricos. A inspecção previu o problema de privacidade B-02; os testes com utilizadores confirmaram-no de forma irrefutável. Sozinhas, nenhuma das técnicas teria sido suficiente — a inspecção poderia ser descartada como preocupação teórica, e o teste sem o contexto da inspecção poderia parecer caso isolado.'),
    ],
  }],
});

const outPath = path.join(__dirname, 'Roteiro_Simplificado.docx');
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log('OK ->', outPath);
});
