# Revisão Crítica — RelatórioIPC.pdf (88 páginas)

> Análise exaustiva do relatório efectuada após leitura integral. Identifica erros que devem ser corrigidos antes da submissão, melhorias de qualidade e observações sobre estilo, repetições e coerência. Cada item indica **onde está** e **como corrigir**.

**Data da revisão**: 15 de maio de 2026
**Ficheiro analisado**: `RelatórioIPC.pdf` (88 páginas, 7,9 MB)

---

## Sumário executivo

| Categoria | Quantidade | Prioridade |
|---|---:|---|
| 🚨 Erros críticos (corrigir antes de submeter) | **9** | Alta |
| ⚠️ Erros de média gravidade | 8 | Média |
| ✏️ Sugestões de melhoria editorial | 12 | Baixa |
| 🔍 Repetições e redundâncias | 5 | Baixa |
| 🌐 Anglicismos a rever | 7 | Baixa |
| ✅ Pontos fortes a destacar | 6 | — |

**Veredicto geral**: o relatório está **academicamente sólido e bem estruturado**, com excelente fundamentação no Estado de Arte e na Análise de Acessibilidade. Tem alguns erros pontuais de numeração, formatação e duplicações que comprometem a apresentação. **Nada de fundo problemático** — só limpeza editorial.

---

# 🚨 ERROS CRÍTICOS (corrigir antes de submeter)

## C1. Numeração 1.2 duplicada no índice e no corpo

**Onde**: índice (página 3) e secção 1 (página 4)

A primeira subsecção da Introdução está numerada como "**1.2 - Contextualização**", quando deveria ser **1.1**. Existem assim duas subsecções **1.2** consecutivas:

- "1.2 - Contextualização" (errada, deveria ser 1.1)
- "1.2 - Descrição da Aplicação" (correcta)

**Como corrigir**: no Word, alterar o título "1.2 - Contextualização" para "**1.1 - Contextualização**" e atualizar o índice com F9.

---

## C2. Numeração 3.5.2 duplicada

**Onde**: índice (página 3) e capítulo 3.5

Existem duas subsecções "**3.5.2**":

- "3.5.2 - Implementação dos mockups da interface gráfica" (correcta)
- "3.5.2 - Implementação do protótipo final" (deveria ser **3.5.3**)

**Como corrigir**: alterar o segundo título para "**3.5.3 - Implementação do protótipo final**" e atualizar índice.

---

## C3. Falta entrada "5 - Referências Bibliográficas" no índice

**Onde**: índice (página 3)

O índice salta de "**4 - Conclusão**" para "**6 - Nome do curso e turma**". A secção "5 - Referências Bibliográficas" existe no relatório (página 86) mas não aparece no índice.

**Como corrigir**: garantir que o título "5 - Referências Bibliográficas" usa o mesmo estilo de cabeçalho dos restantes (Título 1) e atualizar o índice automático com F9.

---

## C4. Numeração de figuras duplicada (22 e 23)

**Onde**: capítulo 3.5.3 (Implementação do protótipo final)

Há duas **Figura 22** e duas **Figura 23**:

- Figura 22 = "Primeiro Acesso do Protótipo" + Figura 22 = "Pesquisas do Protótipo"
- Figura 23 = "Primeiro Acesso em Inglês" + Figura 23 = "Favoritos do Protótipo"

**Como corrigir**: clicar em cada *caption* de figura duplicada, usar **Inserir → Legenda** do Word para garantir numeração automática. Alternativamente, eliminar manualmente e renumerar 28 e 29 (atualmente "saltadas").

---

## C5. Salto na numeração de figuras (faltam 28 e 29)

**Onde**: entre as figuras 27 e 30

A numeração das figuras salta de **Figura 27** (Indoor ECT polo 1 piso 2) directamente para **Figura 30** (Horário sem importação). Em conjunto com o C4, sugere que as figuras duplicadas 22 e 23 deveriam ter sido 28 e 29.

**Como corrigir**: renumerar as duas pares de figuras duplicadas (C4) como 28 e 29, ou usar legendas automáticas do Word que recalculam tudo.

---

## C6. Erro ortográfico "Defenições" na Figura 11

**Onde**: Figura 11 — Wireframe das Definições (página 39)

A legenda diz "**Figura 11 - Wireframe das Defenições**" — ortografia incorreta. O título correto é "**Definições**".

**Como corrigir**: editar a legenda da figura. Como é uma imagem com texto incorporado, pode ser apenas o *caption* externo que precisa de correção (verificar se o erro também está dentro da imagem do wireframe).

---

## C7. Tabela 7 e Tabela 10 — valor "2004.1.2" em vez de "4.1.2"

**Onde**: Tabela 7 (Lighthouse audits) e Tabela 10 (Cobertura atributos)

O Word auto-formatou os critérios WCAG transformando "4.1.2" em "2004.1.2" (interpretou como data):

- **Tabela 7**, linha "Nomes acessíveis (button-name, label)" → "2004.1.2" deveria ser "4.1.2"
- **Tabela 10**, linha "Switch com role e state" → "2004.1.2" deveria ser "4.1.2"

**Como corrigir**: editar cada célula, escrever "4.1.2", e **antes de premir Enter** clicar com botão direito → Formatar células → Categoria: Texto. Ou pré-escrever um apóstrofe `'4.1.2` que o Word não converte.

---

## C8. Falta ponto final no último parágrafo da 3.6.5

**Onde**: fim da subsecção 3.6.5 (Conformidade WCAG 2.2: síntese)

O parágrafo termina com "...remediação tardia" — falta o **ponto final**.

**Como corrigir**: acrescentar "**.**" no fim → "...remediação tardia**.**"

---

## C9. Emails com espaço a separar @ de "alunos.utad.pt"

**Onde**: secção 8 - Emails de cada elemento do grupo (página 88)

Quatro dos cinco emails têm um espaço a meio:

- `al82239@alunos.utad.pt` (CORRECTO)
- `al79012@ alunos.utad.pt` (espaço a mais)
- `al80990@ alunos.utad.pt` (espaço a mais)
- `al81311@ alunos.utad.pt` (espaço a mais)
- `al82626@ alunos.utad.pt` (espaço a mais)

**Como corrigir**: editar cada linha e remover o espaço. Garantir que o Word não auto-formata o email como hiperligação com espaço (clicar e usar `Ctrl+Z` se isso acontecer).

---

# ⚠️ ERROS DE MÉDIA GRAVIDADE

## M1. Layout estragado da Figura 21 + título 3.5.2/3.5.3

**Onde**: página 49 (transição do mockup de Favoritos para a implementação final)

O título "3.5.2 - Implementação do protótipo final" está visualmente quebrado pela Figura 21 que se sobrepõe a ele. Lê-se "3.5.2 - do protótipo … Implementação final" partido pela imagem.

**Como corrigir**: clicar na Figura 21 → propriedades → texto a partir de **"Quebrar texto: Em linha com o texto"** ou inserir uma quebra de página antes do título.

---

## M2. Texto sobreposto entre Outdoor/Navegação na Figura 17

**Onde**: página 44 (Mockup do Outdoor)

A palavra "Navegação Outdoor" aparece partida em duas linhas com má disposição visual ("Navegação" à esquerda e "Outdoor" à direita, com espaço enorme no meio devido à justificação).

**Como corrigir**: ativar hifenização (já recomendado) ou desativar justificação naquele parágrafo específico.

---

## M3. "será desenvolvida" no Fator Diferenciador (futuro errado)

**Onde**: 2.1.3, ponto 5 (página 13 do PDF)

> "A UTAD Maps **será** desenvolvida em conformidade com as Diretrizes de Acessibilidade para Conteúdo Web (WCAG 2.2)..."

A aplicação **já está desenvolvida**, portanto deveria ser:

> "A UTAD Maps **foi** desenvolvida em conformidade..."

**Como corrigir**: substituir "será" por "foi" naquele parágrafo. Verificar se há outros usos do futuro a descrever decisões já tomadas.

---

## M4. Parágrafo B.2 ainda com caminho de ficheiro longo

**Onde**: subsecção B.2 da 3.6.4 (página 76 aprox.)

O parágrafo termina com `docs/fase2_verificacao_acessibilidade/scripts/contrast.js.A Tabela 11...` — caminho com espaços enormes (justificação + impossibilidade de hifenizar URL). Note também o "**.A**" sem espaço entre o ponto e "A Tabela 11".

**Como corrigir**: substituir o final do parágrafo por algo como:

> "...sRGB. Um script Node.js reproduzível encontra-se nos documentos anexos do projeto. A Tabela 11 apresenta as combinações principais."

---

## M5. Inconsistência: "multiplataforma" vs "foco mobile"

**Onde**: Resumo (página 2) vs. 3.6.1 (página 62)

- **Resumo**: "uma aplicação **multiplataforma (web, Android e iOS)** com abordagem *mobile-first*..."
- **3.6.1**: "O foco da avaliação é a **versão mobile** da aplicação. A versão web ... constitui apenas um subproduto técnico do framework Expo..."

A primeira frase vende como produto multiplataforma; a segunda diz claramente que a web é só "subproduto técnico". Não é contradição absoluta, mas o leitor pode ficar confuso sobre a posição efetiva.

**Como corrigir** (opcional): ajustar o resumo para clarificar que o foco é mobile e que a web é um caso particular técnico:

> "...uma aplicação móvel multiplataforma com abordagem *mobile-first*, executável em iOS e Android e adicionalmente acessível por navegador web..."

---

## M6. Wireframes usam "Bloco A/B" vs. mockups usam "ECT-Polo I"

**Onde**: subsecções 3.5.1 (wireframes) e 3.5.2 (mockups/protótipo)

Os wireframes apresentam ecrãs com salas em "Bloco A" e "Bloco B" (nomes abstractos). A app real e os mockups usam "ECT-Polo I", "ECVA-Polo I", "Biblioteca Central", etc. (nomes UTAD reais).

**Não é um erro técnico**: é normal os wireframes serem mais genéricos. Mas o leitor pode estranhar a diferença entre wireframe e protótipo final.

**Como corrigir** (opcional): adicionar uma frase no início da 3.5.1:

> "Os wireframes apresentam nomes de edifícios genéricos ('Bloco A', 'Bloco B') como *placeholders*; nos mockups e no protótipo final são substituídos pelos nomes reais dos edifícios da UTAD."

---

## M7. Texto "Domínios de email" inconsistente

**Onde**: 3.2 Mapa Mental → Gestão do Utilizador (página 23)

> "O *login institucional UTAD* permite autenticação com email institucional (@utad.eu, @alunos.utad.eu, @alunos.utad.pt)..."

São listados **três domínios** mas a equipa usa apenas `@alunos.utad.pt`. Os outros dois (`@utad.eu` e `@alunos.utad.eu`) podem ser domínios reais da UTAD para funcionários/professores, mas vale a pena confirmar se o sistema de login aceita os três.

**Como corrigir**: confirmar com a equipa quais os domínios efectivamente suportados pelo sistema. Se só forem aceitos `@alunos.utad.pt` e `@utad.eu`, remover o `@alunos.utad.eu`.

---

## M8. Página 81 — espaço em branco grande antes da 3.7

**Onde**: página 81 (fim da 3.6.6, antes da 3.7)

A subsecção 3.6.6 termina e há um grande espaço em branco antes de "**3.7 - Avaliação de Usabilidade**" (que está vazia). É um *page break* propositado, mas o título "3.7" sozinho numa página sem conteúdo parece estranho.

**Como corrigir** (opcional): se a 3.7 não vai ter conteúdo na Fase 2, pode-se acrescentar um parágrafo curto a indicar que será preenchida na Fase 3:

> "A avaliação de usabilidade do UTAD Maps será realizada e documentada na Fase 3 do desafio, conforme calendarização da unidade curricular."

---

# 🌐 ANGLICISMOS A REVER

A maioria dos anglicismos no relatório são **termos técnicos aceites** na área (e justificadamente em itálico). Listo apenas os que poderiam ser portuguesados sem perda de precisão:

| Anglicismo no relatório | Alternativa pt-PT | Onde |
|---|---|---|
| "**tabuletas físicas**" | "placas físicas" ou "sinalética em papel" | 1.1 Contextualização |
| "**stack de styling**" | "camada de estilos" | 3.6.3 (T.A.W. avisos) |
| "**link privado**" | "ligação privada" ou "ligação de sincronização" | Resumo, 2.1.3, 3.2 |
| "**Cloud gerido**" | "alojado em serviço *cloud*" | Tabela 4 (Supabase) |
| "**push effect / pull effect**" (em parênteses) | "efeito de impulso/tração" (manter o original entre parênteses) | 2.1.3 |
| "**tabela**" repetido junto a "**Tabela**" | Verificar concordância | várias |

**Termos a manter em inglês com itálico** (boas práticas técnicas): *wireframes*, *mockups*, *mobile-first*, *swipe*, *toggle*, *audio cues*, *build*, *wayfinding*, *fingerprinting*, *Wi-Fi positioning*, *backend*/*frontend*, *Pub/Sub*, *cache*, *DOM*, *hidratação*, *sans-serif*, *drop shadows*.

---

# 🔍 REPETIÇÕES E REDUNDÂNCIAS

## R1. "abordagem mobile-first" em demasia

**Onde**: Resumo, 1.2 Descrição da Aplicação, 2.1.3, 2.2 Apresentação de Conceitos, Conclusão.

Aparece pelo menos **6 vezes** em diferentes secções. Em duas delas (2.2 e conclusão) pode-se substituir por sinónimos:

- "concepção orientada ao telemóvel"
- "design primeiro para o ecrã móvel"
- "abordagem com priorização do telemóvel"

## R2. "design inclusivo" repetido

**Onde**: 2.1.3 ponto 5, 3.5.2 (mockups intro), 3.6.5 fim, Conclusão.

Aparece 5–6 vezes. Variar com:

- "concepção inclusiva"
- "design centrado na acessibilidade"
- "arquitectura inclusiva"

## R3. Sobreposição entre 3.5.1 (Wireframes) e 3.5.2 (Mockups)

**Onde**: subsecções 3.5.1 e 3.5.2

Ambas descrevem os mesmos nove ecrãs (Onboarding, Mapa, Pesquisa, Indoor, Outdoor, Perfil, Favoritos, Definições, Horário) com explicações parecidas das funcionalidades. É natural num relatório académico (mostra evolução), mas pode-se cortar as descrições funcionais nos mockups e focar **apenas nas decisões visuais novas** (paleta, sombras, tipografia).

**Como corrigir** (opcional, esforço médio): nos mockups, reduzir as descrições funcionais (já dadas nos wireframes) e focar nos elementos novos: cores, sombras, tipografia, geometria, *glassmorphism*, etc.

## R4. "comunidade académica" repetida

**Onde**: Resumo, 1.1 Contextualização, 2.1.1, Conclusão.

Aceitável porque é o público-alvo, mas variar com "comunidade universitária", "estudantes e docentes da UTAD" alivia.

## R5. Tahir & Krogstie, 2023 — citado 4 vezes muito próximas

**Onde**: 2.1.1 Justificação do Problema (duas vezes), 2.1.2 Google/Apple Maps (uma vez) e 2.1.2 MazeMap (uma vez).

Em texto académico é admissível. Como alternativa, podem usar-se variantes:

- 1ª ocorrência: citação completa "(Tahir & Krogstie, 2023)"
- 2ª-4ª ocorrências: "(ibid.)" se permitido pelo estilo de citação, ou variar a estrutura da frase para não exigir nova citação imediatamente.

---

# ✏️ SUGESTÕES DE MELHORIA EDITORIAL

## S1. Hifenização automática

Ativar **Esquema → Hifenização → Automática** no Word elimina ~80% dos buracos brancos nos parágrafos justificados (já se nota em vários sítios).

## S2. Numeração de figuras automática

Em vez de escrever manualmente "Figura 22", usar **Inserir → Legenda → Etiqueta: Figura** que numera tudo automaticamente. Resolve C4 e C5 de uma vez.

## S3. Glossário inicial (opcional)

Considerar acrescentar um pequeno **glossário** no início (página 4, antes da Introdução) com:

- WCAG 2.2, AA, AAA
- iCal, Pub/Sub, RPC
- *mobile-first*, *wayfinding*, IPS
- Expo, React Native, Three.js

Ajuda professores não-IPC a entenderem a terminologia.

## S4. Tabela 5 (ferramentas) — coluna "Cobertura" com texto fluido

A coluna "Cobertura" da Tabela 5 mistura frases curtas com longas. Uniformizar para frases similares (≤ 12 palavras cada).

## S5. Captions das figuras 22-37 — adicionar contexto

Algumas captions são muito curtas (ex: "Figura 26 - Indoor do ECT polo 1 piso 0 do Protótipo"). Pode-se enriquecer:

> "Figura 26 — Vista 2D do indoor do edifício ECT-Polo I, piso 0, no protótipo final, com destaque visual para a sala G0.08."

## S6. Conclusão muito curta

A conclusão (página 83-85) tem apenas três parágrafos curtos. Sugiro alargar com:

- **Síntese dos resultados**: o que efectivamente foi entregue
- **Lições aprendidas**: o que correu bem, o que se faria diferente
- **Impacto esperado**: público-alvo, valor para a UTAD

Não é estritamente necessário (a conclusão actual cumpre o mínimo), mas valoriza.

## S7. Acrescentar UML/diagrama de arquitectura

Na 3.5.3 "Implementação do protótipo final" há a tabela 4 (Stack tecnológica). Acrescentar **um diagrama de arquitectura** (caixas: Frontend ↔ Backend ↔ Supabase) é muito valorizado.

## S8. Tabela de Requisitos — adicionar coluna "Prioridade"

As Tabelas 2 e 3 (Requisitos Funcionais e Não Funcionais) só têm ID + Descrição. Acrescentar uma coluna "Prioridade" (Alta/Média/Baixa) ajuda a triagem.

## S9. Datas nas referências

Algumas referências têm anos não publicados ainda (Vasiou 2026, Tang 2025). Verificar se são *preprints* ou se há erros.

## S10. Hyperlinks azuis nos emails

Os emails finais aparecem como hiperligações azuis. Para um relatório académico, mais comum desativar a formatação de link e deixar apenas texto preto.

## S11. Cabeçalhos consistentes

Verificar se todos os títulos da mesma hierarquia usam o **mesmo estilo** (Título 1, Título 2, Título 3). Se algum estiver com formatação directa (negrito sem estilo), o índice automático não o apanha.

## S12. Rodapé com paginação

Se ainda não tiver, acrescentar paginação no rodapé (Inserir → Número de Página). Facilita referenciar páginas em discussões.

---

# ✅ PONTOS FORTES DO RELATÓRIO

Para contrabalançar, é importante notar o que está **muito bom**:

1. **Fundamentação académica sólida** — 21 referências bibliográficas relevantes, citadas de forma adequada ao longo de toda a 2.1.
2. **Persona "Antoine Dubois" bem caracterizada** — jornada do utilizador com cenário, expectativas, emoções, pontos críticos e oportunidades. Boa qualidade para projecto académico.
3. **Mapa mental claro** (Figura 1) — funcionalidades organizadas em 8 categorias coerentes.
4. **Tabela 1 (comparação com soluções)** — comparativo claro com Google Maps, Apple Maps, MazeMap, AR/Beacons e Apps Universitárias.
5. **Secção 3.6 (Avaliação de Acessibilidade)** — combinação de 4 ferramentas automáticas + 4 análises manuais, **9 correcções aplicadas**, score WCAG 2.2 AA bem fundamentado. **É o capítulo mais forte do relatório.**
6. **Stack tecnológica documentada** — Tabela 4 com tecnologia, camada e justificação.

---

# 📋 CHECKLIST DE CORREÇÕES PRÉ-SUBMISSÃO

Por ordem de prioridade, antes de gerar o PDF final:

## Críticas (10 min de trabalho)
- [ ] **C1** Renumerar primeira subsecção da Introdução de "1.2" para "1.1"
- [ ] **C2** Renumerar segunda "3.5.2" para "3.5.3"
- [ ] **C3** Garantir que "5 - Referências Bibliográficas" aparece no índice (verificar estilo do título)
- [ ] **C4** Renumerar figuras duplicadas 22 e 23 para 28 e 29
- [ ] **C5** Confirmar que as figuras estão em sequência sem saltos
- [ ] **C6** Corrigir "Defenições" para "Definições" na legenda da Figura 11
- [ ] **C7** Tabelas 7 e 10: substituir "2004.1.2" por "4.1.2"
- [ ] **C8** Adicionar ponto final no fim da 3.6.5
- [ ] **C9** Remover espaços nos emails al79012, al80990, al81311, al82626

## Médias (15 min)
- [ ] **M1** Corrigir layout da Figura 21 sobre o título 3.5.3
- [ ] **M2** Ajustar quebras de linha em "Navegação Outdoor" (Figura 17)
- [ ] **M3** Trocar "será desenvolvida" por "foi desenvolvida" no 2.1.3 ponto 5
- [ ] **M4** Substituir o caminho longo do `contrast.js` por descrição curta

## Finais (5 min)
- [ ] Ativar hifenização automática
- [ ] `Ctrl+H` substituir `  ` (duplo espaço) por ` ` até 0 ocorrências
- [ ] Atualizar índice automático (F9)
- [ ] Gerar PDF
- [ ] Submeter NONIO

**Tempo total estimado**: ~30 minutos de correções.

---

# 🎯 Conclusão da revisão

O relatório está em **muito boa forma** para entrega. Os erros encontrados são todos de natureza **editorial** (numeração, formatação, pequenas inconsistências), não de fundo. A estrutura argumentativa é sólida, a investigação está bem fundamentada e a secção de Avaliação de Acessibilidade (3.6) — a peça principal da Fase 2 — está exemplar.

Com as **9 correcções críticas** aplicadas (~10 minutos), o relatório fica completamente pronto para submissão e em condições de obter avaliação muito positiva.

---

*Documento gerado em 15 maio 2026 pelo processo de revisão sistemática das 88 páginas do RelatórioIPC.pdf. Para questões sobre pontos específicos desta revisão, contactar o autor da análise.*
