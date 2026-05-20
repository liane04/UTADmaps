# Problemas Detectados — Síntese Cruzada das 3 Técnicas

**Responsável**: Diogo Queiroz
**Data**: 21 de maio de 2026
**Aplicação avaliada**: UTAD Maps v1.0

---

## 1. Metodologia da síntese

A presente síntese cruza os problemas identificados pelas três técnicas de avaliação aplicadas na Fase 3:

- **AH** — Avaliação Heurística de Nielsen (3 peritos, 10 heurísticas, severidade 0–4)
- **SH** — Regras de Ouro de Shneiderman (8 regras)
- **UT** — Testes com Utilizadores (5 participantes, 5 tarefas, checklist, questionário Likert)

Cada problema é caracterizado por: ID, descrição, técnica(s) onde foi detectado, heurística ou regra correspondente, severidade agregada, frequência (quantas técnicas o detectaram), e referência cruzada com a Fase 2 quando aplicável.

A **convergência entre técnicas** é o critério mais forte de prioridade: um problema detectado em **duas ou três** técnicas independentes tem maior confiança e deve ser corrigido prioritariamente.

---

## 2. Tabela síntese de problemas

A tabela está ordenada por **severidade agregada** decrescente.

| ID | Descrição | AH | SH | UT | Heurística / Regra | Severidade | Ref. Fase 2 |
|---|---|:---:|:---:|:---:|---|:---:|:---:|
| **P-01** | Horário académico permanece visível após "Terminar sessão" (problema de privacidade) | ✅ P1, P3 | ✅ Regra 5 | — | H5 / Regra 5 | **4 — Catastrófico** | B-02 |
| **P-02** | Botão "Iniciar sessão" no Perfil deixa de responder após um logout prévio | ✅ P1 | — | ✅ U2 Bruno | H3 | **3 — Maior** | B-01 |
| **P-03** | "Terminar sessão" sem diálogo de confirmação | ✅ P1 | ✅ Regra 5 | — | H5 / Regra 5 | **3 — Maior** | — |
| **P-04** | Falta de feedback informativo em acções de definições (toggles, sliders) | ✅ P2 (parcial) | ✅ Regra 3 | ✅ U1 Liane, U3 Pedro, U2 Bruno | H1 / Regra 3 | **2 — Menor** | — |
| **P-05** | Tarefa T5 (Importar horário) com tempo médio elevado (~102 s) e dois erros frequentes | — | — | ✅ U1, U2, U3 | — | **2 — Menor** | — |
| **P-06** | Marcadores no mapa principal podem ser visualmente densos a zoom inicial baixo | ✅ P2 | — | — | H8 | **1 — Cosmético** | — |
| **P-07** | Botão de favoritar (♡) na pesquisa tem hitbox pequena | — | — | ✅ U1, U2 | — | **2 — Menor** | Gap G-04 |
| **P-08** | Códigos de edifícios (ECT-Polo I, ECVA-Polo II) pouco intuitivos para utilizadores Erasmus | ✅ P3 | — | — | H2 | **2 — Menor** | — |
| **P-09** | Ausência de atalho directo no Mapa para "próxima aula" | ✅ P3 | — | — | H7 | **2 — Menor** | — |
| **P-10** | Pesquisa de salas pode demorar 2–3 s sem indicador de carregamento | ✅ P1 | — | ✅ U1 Liane | H1 / Regra 3 | **2 — Menor** | — |
| **P-11** | Mensagens de erro genéricas (rota OSRM, distância elevada) | ✅ P1, P3 | — | — | H9 | **2 — Menor** | — |
| **P-12** | Chegada ao destino sem notificação explícita | — | ✅ Regra 4 | — | Regra 4 | **2 — Menor** | — |
| **P-13** | Recálculo de rota durante navegação sem aviso visual | ✅ P3 | ✅ Regra 3 | — | H1 / Regra 3 | **2 — Menor** | Gap G-05 |
| **P-14** | Onboarding curto sem glossário de códigos para estrangeiros | ✅ P3 | — | — | H10 | **2 — Menor** | — |
| **P-15** | Pills/chips de seleção sem `accessibilityState="selected"` | ✅ P2 | — | — | H1 | **1 — Cosmético** | Gaps G-01 a G-03 |
| **P-16** | Falta legenda explícita das cores dos marcadores no mapa | ✅ P2 | — | — | H6 | **2 — Menor** | — |
| **P-17** | Pequena inconsistência no raio de cantos arredondados entre cards | ✅ P2 | — | — | H4 | **1 — Cosmético** | — |
| **P-18** | Affordance pouco evidente do cartão de aula como elemento clicável | — | — | ✅ U1 Liane | — | **1 — Cosmético** | — |
| **P-19** | Confusão entre indoor 2D (planta) e indoor 3D (modelo) sem dica visual prévia | — | — | ✅ U1 Liane | — | **1 — Cosmético** | — |
| **P-20** | Dificuldade em encontrar a chave de sincronização no portal Inforestudante | — | — | ✅ U2, U3 | — | **2 — Menor** | — |

---

## 3. Análise por convergência

### 3.1 Problemas detectados em duas ou três técnicas (alta confiança)

São os problemas com maior validade metodológica porque foram identificados independentemente por avaliadores e técnicas distintas.

| ID | Problema | Convergência |
|---|---|---|
| **P-01** | Horário persiste após logout | **AH + SH** (3 técnicas com falha — UT não testou logout) |
| **P-02** | Botão "Iniciar sessão" não responde | **AH + UT** |
| **P-03** | Logout sem confirmação | **AH + SH** |
| **P-04** | Feedback insuficiente em definições | **AH + SH + UT** ⭐ |
| **P-10** | Pesquisa lenta sem indicador | **AH + UT** |
| **P-13** | Recálculo de rota sem aviso | **AH + SH** |

**Observação**: o problema **P-04 (feedback insuficiente)** é o único detectado pelas três técnicas em simultâneo, o que o torna o **problema mais robustamente identificado** desta avaliação.

### 3.2 Distribuição global por severidade

| Severidade | N.º problemas |
|---|---:|
| 4 — Catastrófico | **1** |
| 3 — Maior | **2** |
| 2 — Menor | **12** |
| 1 — Cosmético | **5** |
| **Total** | **20** |

### 3.3 Distribuição por técnica

| Técnica | N.º problemas únicos identificados | N.º partilhados com outras técnicas |
|---|---:|---:|
| Avaliação Heurística (AH) | 14 problemas distintos | 6 também noutras técnicas |
| Regras de Shneiderman (SH) | 5 problemas distintos | 4 também noutras técnicas |
| User Tests (UT) | 8 problemas distintos | 3 também noutras técnicas |

> A Avaliação Heurística com três peritos foi a técnica que mais problemas identificou em termos absolutos, o que é consistente com a literatura (Nielsen, 1994). Os User Tests acrescentaram problemas qualitativos relacionados com **affordances** e **expectativas dos utilizadores** que a inspecção heurística não captou. As Regras de Shneiderman serviram principalmente como validação cruzada (4 dos seus 5 problemas identificados também aparecem nas outras técnicas; P-12 é o único exclusivo desta técnica).

---

## 4. Problemas que cruzam com a Fase 2

Cinco problemas desta Fase 3 cruzam directamente com bugs ou *gaps* identificados na Fase 2, reforçando que a avaliação manual de usabilidade detecta problemas que as ferramentas automáticas não captam, e mostrando que tais problemas são **reais e persistentes**.

| ID Fase 3 | Bug/Gap Fase 2 | Estado em Fase 2 | Estado em Fase 3 |
|---|---|---|---|
| P-01 | B-02 (privacidade horário) | Documentado, não resolvido | **Confirmado catastrófico** |
| P-02 | B-01 (botão login) | Documentado, não resolvido | **Confirmado por user test** |
| P-07 | G-04 (favoritar sem hitSlop) | Documentado | **Confirmado por 2 user tests** |
| P-13 | G-05 (sem `accessibilityLiveRegion`) | Documentado | Confirmado por perito |
| P-15 | G-01 a G-03 (chips sem state) | Documentado | Confirmado por perito |

---

## 5. Conclusões da síntese

A combinação das três técnicas de avaliação de usabilidade identificou **20 problemas distintos** no UTAD Maps, dos quais **15 são prioritários para correcção** (severidade ≥ 2). O problema mais grave é **P-01** (catastrófico, privacidade) seguido de **P-02** e **P-03** (maiores, ambos relacionados com gestão de sessão).

A convergência entre técnicas é elevada: **30 % dos problemas (6 em 20) foram detectados por mais do que uma técnica**, com destaque para o problema **P-04 (feedback insuficiente)** que aparece nas três. Esta convergência valida metodologicamente a combinação adoptada e indica que estes seis problemas devem ser prioritários para qualquer iteração subsequente do produto.

O cruzamento com a Fase 2 mostra que **cinco problemas** documentados como bugs ou *gaps* de acessibilidade foram **revalidados** pelas técnicas de usabilidade, reforçando a sua urgência. Em particular, os **bugs B-01 e B-02** são agora problemas confirmados em múltiplas técnicas e devem ser corrigidos antes de qualquer entrega futura.

O plano priorizado de correcção encontra-se em `MELHORIAS_PROPOSTAS.md`.
