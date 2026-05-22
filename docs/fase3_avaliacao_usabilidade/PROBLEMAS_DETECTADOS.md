# Problemas Detectados — Síntese Cruzada das 3 Técnicas

**Responsável**: Diogo Queiroz
**Data**: 21 de maio de 2026
**Aplicação avaliada**: UTAD Maps v1.0

---

## 1. Metodologia da síntese

A presente síntese cruza os problemas identificados pelas três técnicas de avaliação aplicadas na Fase 3:

- **AH** — Avaliação Heurística de Nielsen (3 peritos A-P1–A-P3, 10 heurísticas, severidade 0–4)
- **SH** — Regras de Ouro de Shneiderman (8 regras)
- **UT** — Testes com Utilizadores (5 participantes anonimizados como P1–P5, 13 tarefas T1–T13, checklist, questionário Likert)

> **Nota de notação**: nas colunas AH e SH, **A-P1, A-P2, A-P3** designam os três peritos da Avaliação Heurística; nas colunas UT, **P1–P5** designam os cinco participantes dos Testes com Utilizadores. Ambos os grupos são anónimos e distintos.

Cada problema é caracterizado por: ID, descrição, técnica(s) onde foi detectado, heurística ou regra correspondente, severidade agregada, frequência (quantas técnicas o detectaram), e referência cruzada com a Fase 2 quando aplicável.

A **convergência entre técnicas** é o critério mais forte de prioridade: um problema detectado em **duas ou três** técnicas independentes tem maior confiança e deve ser corrigido prioritariamente.

---

## 2. Tabela síntese de problemas

A tabela está ordenada por **severidade agregada** decrescente.

| ID | Descrição | AH | SH | UT | Heurística / Regra | Severidade | Ref. Fase 2 |
|---|---|:---:|:---:|:---:|---|:---:|:---:|
| **P-01** | Horário académico permanece visível após "Terminar sessão" (problema de privacidade) | ✅ A-P1, A-P3 | ✅ Regra 5 | — | H5 / Regra 5 | **4 — Catastrófico** | B-02 |
| **P-02** | Botão "Iniciar sessão" no Perfil deixa de responder após um logout prévio (bug B-01) | ✅ A-P1, A-P3 | — | ✅ T4 (P2); T13 (P1, P2); P3 atenuado | H3 | **3 — Maior** | B-01 |
| **P-03** | Falta de feedback informativo em acções do sistema: toggles de Definições não confirmam activação; auto-centering da navegação outdoor não comunicado ao utilizador | ✅ A-P2 (parcial) | ✅ Regra 3 | ✅ P1 (T4, T11), P2 (T4), P3 (T4, T11) | H1 / Regra 3 | **2 — Menor** | — |
| **P-04** | Tarefa T5 (Importar horário) com tempo médio elevado (~102 s) e dois tipos de erro frequentes; T10 (card Próxima Aula) requer T5 concluída, criando dependência de ordem | — | — | ✅ P1, P2, P3 (T5); P3 parcial em T10 | — | **2 — Menor** | — |
| **P-05** | Ausência de atalho directo no Mapa para "próxima aula" | ✅ A-P3 | — | — | H7 | **2 — Menor** | — |
| **P-06** | Pesquisa de salas pode demorar 2–3 s sem indicador de carregamento | ✅ A-P1 | — | ✅ P1 (T3) | H1 / Regra 3 | **2 — Menor** | — |
| **P-07** | Mensagens de erro genéricas (rota OSRM, distância elevada, importação de horário) | ✅ A-P1, A-P3 | — | ✅ P2 (T5) | H9 | **2 — Menor** | — |
| **P-08** | Chegada ao destino sem notificação explícita | — | ✅ Regra 4 | — | Regra 4 | **2 — Menor** | — |
| **P-09** | Recálculo de rota durante navegação sem aviso visual | ✅ A-P3 | ✅ Regra 3 | — | H1 / Regra 3 | **2 — Menor** | Gap G-05 |
| **P-10** | Onboarding curto sem glossário de códigos para estrangeiros | ✅ A-P3 | — | — | H10 | **2 — Menor** | — |
| **P-11** | Pills/chips de seleção sem `accessibilityState="selected"` | ✅ A-P2 | — | — | H1 | **1 — Cosmético** | Gaps G-01 a G-03 |
| **P-12** | Falta legenda explícita das cores dos marcadores no mapa | ✅ A-P2 | — | — | H6 | **2 — Menor** | — |
| **P-13** | Pequena inconsistência no raio de cantos arredondados entre cards | ✅ A-P2 | — | — | H4 | **1 — Cosmético** | — |
| **P-14** | Affordance pouco evidente do cartão de aula (timeline do Horário) como elemento clicável | — | — | ✅ P1 (T2) | — | **1 — Cosmético** | — |
| **P-15** | Dificuldade em encontrar a chave de sincronização no portal Inforestudante | — | — | ✅ P2, P3 (T5) | — | **2 — Menor** | — |
| **P-16** | Posição inicial do boneco no Piso 1 do Indoor 3D parece fora do corredor em Android (`FLOOR_START_POSITIONS` mal calibrado) | — | — | ✅ P2 (T8) | — | **2 — Menor** | — |
| **P-17** | Affordance do card "Próxima Aula" no Perfil não indica que é clicável | — | — | ✅ P1 (T10) | — | **1 — Cosmético** | — |
| **P-18** | Suporte/FAQ sem campo de pesquisa — utilizadores percorrem as 6 entradas linearmente | — | — | ✅ P1, P3 (T12) | — | **2 — Menor** | — |
| **P-19** | Acesso a Definições (tema, idioma) não imediatamente óbvio — P3 esperava atalho directo em vez de Perfil → menu → Definições | — | — | ✅ P3 (T9) | H6 | **1 — Cosmético** | — |

---

## 3. Análise por convergência

### 3.1 Problemas detectados em duas ou três técnicas (alta confiança)

São os problemas com maior validade metodológica porque foram identificados independentemente por avaliadores e técnicas distintas.

| ID | Problema | Convergência |
|---|---|---|
| **P-01** | Horário persiste após logout | **AH + SH** (UT testou ciclo logout/login em T13 mas o cenário de privacidade com utilizador diferente não foi coberto) |
| **P-02** | Botão "Iniciar sessão" não responde após logout | **AH + UT** (detectado em T4 por P2; confirmado em T13 por P1 e P2; manifestação atenuada em P3) |
| **P-03** | Feedback insuficiente em acções do sistema | **AH + SH + UT** ⭐ (T4 e T11) |
| **P-06** | Pesquisa lenta sem indicador | **AH + UT** |
| **P-07** | Mensagens de erro genéricas | **AH + UT** |
| **P-09** | Recálculo de rota sem aviso | **AH + SH** |

**Observação**: o problema **P-03 (feedback insuficiente)** é o único detectado pelas três técnicas em simultâneo, confirmado tanto em T4 (switches de Acessibilidade) como em T11 (auto-centering da navegação outdoor não comunicado). É o **problema mais robustamente identificado** desta avaliação.

### 3.2 Distribuição global por severidade

| Severidade | N.º problemas |
|---|---:|
| 4 — Catastrófico | **1** |
| 3 — Maior | **1** |
| 2 — Menor | **12** |
| 1 — Cosmético | **5** |
| **Total** | **19** |

### 3.3 Distribuição por técnica

| Técnica | N.º problemas únicos identificados | N.º partilhados com outras técnicas |
|---|---:|---:|
| Avaliação Heurística (AH) | 11 problemas distintos | 6 também noutras técnicas |
| Regras de Shneiderman (SH) | 4 problemas distintos | 3 também noutras técnicas |
| User Tests (UT) | 10 problemas distintos | 3 também noutras técnicas |

> A Avaliação Heurística com três peritos foi a técnica que mais problemas identificou em termos absolutos, o que é consistente com a literatura (Nielsen, 1994). Os **User Tests com 13 tarefas e 5 participantes** acrescentaram problemas qualitativos relacionados com **affordances**, **dependências de fluxo** e **expectativas dos utilizadores** que a inspecção heurística não captou (P-14, P-15, P-16, P-17, P-18 e P-19 são exclusivos desta técnica). Em particular, as tarefas T9–T13 (adicionadas na segunda expansão) revelaram P-17 (T10), P-18 (T12), a extensão de P-03 ao auto-centering (T11), e P-19 (T9 — discoverability das Definições). As Regras de Shneiderman serviram principalmente como validação cruzada; P-08 é o único exclusivo desta técnica.

---

## 4. Problemas que cruzam com a Fase 2

Quatro problemas desta Fase 3 cruzam directamente com bugs ou *gaps* identificados na Fase 2, reforçando que a avaliação manual de usabilidade detecta problemas que as ferramentas automáticas não captam, e mostrando que tais problemas são **reais e persistentes**.

| ID Fase 3 | Bug/Gap Fase 2 | Estado em Fase 2 | Estado em Fase 3 |
|---|---|---|---|
| P-01 | B-02 (privacidade horário) | Documentado, não resolvido | **Confirmado catastrófico** |
| P-02 | B-01 (botão login) | Documentado, não resolvido | **Confirmado em T4 e T13 — 2 de 5 participantes com falha grave** |
| P-09 | G-05 (sem `accessibilityLiveRegion`) | Documentado | Confirmado por perito |
| P-11 | G-01 a G-03 (chips sem state) | Documentado | Confirmado por perito |

---

## 5. Conclusões da síntese

A combinação das três técnicas de avaliação de usabilidade identificou **19 problemas distintos** no UTAD Maps, dos quais **14 são prioritários para correcção** (severidade ≥ 2). O problema mais grave é **P-01** (catastrófico, privacidade) seguido de **P-02** (maior, gestão de sessão).

A convergência entre técnicas é elevada: **32 % dos problemas (6 em 19) foram detectados por mais do que uma técnica**, com destaque para o problema **P-03 (feedback insuficiente)** que aparece nas três. Esta convergência valida metodologicamente a combinação adoptada e indica que estes seis problemas devem ser prioritários para qualquer iteração subsequente do produto.

Os User Tests com 13 tarefas revelaram **7 problemas exclusivos** (P-14 a P-19 e a extensão de P-03 ao auto-centering), todos invisíveis à inspecção heurística — reforçando o valor da observação de utilizadores reais em fluxos extensos. Em particular, **P-02 ganhou peso adicional**: confirmado inicialmente em T4 (P2 na primeira sessão), foi reconfirmado como bloqueante em T13 por dois participantes (P1 e P2 com sucesso parcial), tornando-se o bug de maior impacto nos testes. **P-19** (discoverability das Definições, T9, P3) é o único problema cosmético exclusivamente detectado nas tarefas T9–T13.

O cruzamento com a Fase 2 mostra que **quatro problemas** documentados como bugs ou *gaps* de acessibilidade foram **revalidados** pelas técnicas de usabilidade. Em particular, o **bug B-01** é agora confirmado em múltiplas tarefas (T4 e T13) e por múltiplos participantes (P1, P2, P3) e deve ser corrigido antes de qualquer entrega futura.

O plano priorizado de correcção encontra-se em `MELHORIAS_PROPOSTAS.md`.
