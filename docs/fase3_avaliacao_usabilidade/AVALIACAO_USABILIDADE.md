# 3.7 — Avaliação de Usabilidade

> Texto destinado à **secção 3.7 do relatório** do Desafio 3, Fase 3. Pode ser colado directamente no Word, com formatação Título 3 para os subtítulos e tabelas convertidas via Inserir → Tabela → Converter Texto em Tabela.

---

## 3.7.1 — Enquadramento e metodologia

A avaliação de usabilidade descrita nesta secção corresponde à Fase 3 do Desafio 3. O enunciado da unidade curricular permite escolher entre três técnicas: **Heurísticas de Nielsen**, **Regras de Ouro de Shneiderman** e **Testes com Utilizadores**. Optou-se por **aplicar as três técnicas em simultâneo** num desenho convergente, coerente com a abordagem mista adoptada na Fase 2 (auto + manual) e justificável pela observação de que cada técnica capta tipos distintos de problemas: a inspecção heurística cobre rigor sistemático, as regras de Shneiderman complementam com princípios de previsibilidade e controlo, e os testes com utilizadores captam problemas que apenas a interacção real revela.

A avaliação compreendeu **três peritos externos à equipa de desenvolvimento** (conforme indicação da grelha do professor para a heurística de Nielsen), **uma análise estruturada das oito regras de Shneiderman** verificada contra o código-fonte e contra o *build* em execução no Expo Go, e **cinco sessões de testes com utilizadores reais** recrutados na comunidade académica da UTAD, abrangendo **treze tarefas** representativas. A dimensão reduzida da amostra (N = 5) é a única limitação metodológica conhecida e está documentada em 3.7.7.

Para evitar ambiguidade entre os dois grupos de avaliadores, adoptou-se a convenção de denominar **A-P1, A-P2, A-P3** os três peritos da Avaliação Heurística e **P1, P2, P3, P4, P5** os cinco participantes dos Testes com Utilizadores; ambos os grupos são anónimos e distintos.

A Tabela 15 sintetiza as três vertentes da avaliação.

### Tabela 15 — Técnicas e amostras de avaliação aplicadas

| # | Técnica                       | Amostra                              | Output principal                                                                  |
| - | ----------------------------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| A | Heurísticas de Nielsen        | 3 peritos externos (A-P1, A-P2, A-P3) | 3 grelhas individuais + síntese com média de severidade por heurística            |
| B | Regras de Ouro de Shneiderman | Análise estruturada + verificação    | Tabela de conformidade pelas 8 regras                                             |
| C | Testes com Utilizadores       | 5 participantes (UTAD, P1–P5)        | 5 sessões × 13 tarefas com tabela, *checklist* e questionário Likert pós-teste    |

---

## 3.7.2 — Avaliação Heurística de Nielsen

A avaliação heurística foi realizada por três peritos externos à equipa de desenvolvimento, com perfis complementares: Maria Costa (3.º ano de Engenharia Informática da UTAD), João Pereira (Mestrado em Design Multimédia da UTAD) e Ana Marques (licenciada em Engenharia Informática pela UTAD, actualmente *UI/UX designer freelancer*). Cada perito utilizou a grelha de 10 heurísticas de Jakob Nielsen disponibilizada pelo professor, com escala de severidade 0–4, e realizou a avaliação **individualmente** durante aproximadamente 45 minutos percorrendo todos os ecrãs principais do UTAD Maps via Expo Go.

A Tabela 16 apresenta a compilação das três grelhas com a média de severidade por heurística.

### Tabela 16 — Compilação das três grelhas de avaliação heurística

| Nº  | Heurística                             | A-P1 (Maria) | A-P2 (João) | A-P3 (Ana)   | Média         | Máxima      |
| --- | -------------------------------------- | :----------: | :---------: | :----------: | :-----------: | :---------: |
| 1   | Visibilidade do estado do sistema      | 2            | 0           | 2            | **1,33**      | 2           |
| 2   | Correspondência com o mundo real       | 0            | 0           | 2            | 0,67          | 2           |
| 3   | Controlo e liberdade do utilizador     | 3            | 0           | 0            | 1,00          | 3           |
| 4   | Consistência e padrões                 | 0            | 1           | 0            | 0,33          | 1           |
| 5   | Prevenção de erros                     | 0            | 0           | 4            | **1,33**      | **4**       |
| 6   | Reconhecimento em vez de memorização   | 0            | 2           | 0            | 0,67          | 2           |
| 7   | Flexibilidade e eficiência             | 0            | 0           | 2            | 0,67          | 2           |
| 8   | Design estético e minimalista          | 0            | 1           | 0            | 0,33          | 1           |
| 9   | Ajudar a reconhecer e recuperar erros  | 2            | 0           | 2            | **1,33**      | 2           |
| 10  | Ajuda e documentação                   | 0            | 1           | 2            | 1,00          | 2           |
|     | **Soma**                               | **7**        | **5**       | **14**       | **8,67**      | —           |

Foram identificados, no conjunto das três grelhas, **13 problemas reais** (após a remoção dos falsos positivos) distribuídos em quatro categorias de severidade: um problema **catastrófico** (sev 4), um problema **maior** (sev 3), **oito problemas menores** (sev 2) e **três cosméticos** (sev 1). O problema mais grave detectado é a persistência do horário académico após o utilizador terminar sessão (heurística 5, sev 4 na grelha de A-P3), com implicações de privacidade em contexto multi-utilizador (telemóveis partilhados). O segundo mais grave é o *bug* funcional do botão "Iniciar sessão" no ecrã de Perfil, que deixa de responder após um *logout* prévio (heurística 3, sev 3 em A-P1), aprisionando o utilizador em modo convidado.

As heurísticas com maior média de severidade são a **H1 — Visibilidade do estado do sistema**, **H5 — Prevenção de erros** e **H9 — Ajudar a reconhecer e recuperar de erros** (todas com média **1,33**). As heurísticas 4 (Consistência) e 8 (Estética e minimalismo) registaram apenas problemas cosméticos, indicando que o sistema de design da aplicação é robusto e coerente.

---

## 3.7.3 — Avaliação pelas Regras de Ouro de Shneiderman

As oito regras de ouro propostas por Ben Shneiderman foram aplicadas como **inspecção estruturada** ao UTAD Maps com o objectivo de identificar problemas que possam não ter sido capturados pela inspecção heurística — em particular nas dimensões de feedback informativo, fim de acção, prevenção de erros e controlo do utilizador. A análise foi conduzida em dois passos: redacção inicial a partir da documentação do produto e, em seguida, **verificação directa contra o código-fonte e contra a aplicação em execução no Expo Go**, eliminando afirmações que não correspondiam ao *build* actual. A Tabela 17 resume o estado de conformidade por regra.

### Tabela 17 — Avaliação pelas 8 regras de ouro de Shneiderman

| Nº  | Regra                                                 | Conformidade          | Severidade do *gap*  |
| :-: | ----------------------------------------------------- | :-------------------: | :------------------: |
|  1  | Esforçar-se pela consistência                         | Conforme              | —                    |
|  2  | Procurar a usabilidade universal                      | Conforme              | —                    |
|  3  | Dar feedback informativo                              | Parcialmente conforme | 2 (menor)            |
|  4  | Projectar diálogos que indiquem o fim de uma acção    | Parcialmente conforme | 2 (menor)            |
|  5  | Prevenir erros                                        | Parcialmente conforme | 4 (catastrófico)     |
|  6  | Permitir a fácil reversão de acções                   | Conforme              | —                    |
|  7  | Manter os utilizadores no controlo                    | Conforme              | —                    |
|  8  | Reduzir a carga de memória de curta duração           | Conforme              | —                    |

Cinco das oito regras são **integralmente cumpridas** (consistência, usabilidade universal, reversão, controlo e redução da carga de memória) e três são **parcialmente cumpridas** com *gaps* identificados (feedback informativo, fim de acção e prevenção de erros). A regra mais problemática é a **regra 5 (Prevenir erros)**, cujo *gap* coincide directamente com o problema catastrófico identificado pela heurística de Nielsen: a persistência indevida do horário no `AsyncStorage` após o utilizador terminar sessão. Esta sobreposição entre as duas técnicas reforça a urgência da correção deste ponto.

Os *gaps* nas regras 3 e 4 são menores. Na regra 3, identificou-se que as alterações em definições de acessibilidade (Alto Contraste, tamanho do texto) são aplicadas imediatamente mas sem confirmação textual ou animação que sublinhe a transição, e o recálculo de rota durante a navegação outdoor não é anunciado ao utilizador. Na regra 4, a importação de horário bem-sucedida fecha o modal sem mensagem de conclusão (existe apenas em caso de erro) e a chegada ao destino é apenas indicada na barra de instruções da navegação, sem aviso destacado (*pop-up*, som ou vibração).

A verificação prática invalidou algumas afirmações do rascunho inicial — em particular, confirmou-se que o ecrã de Perfil **já pede confirmação ao terminar sessão** (`Alert.alert` em mobile e `window.confirm` em web), funcionalidade introduzida no commit `084d515` de 3 de maio. O único *gap* da regra 5 é, assim, a persistência indevida do horário no `AsyncStorage`.

---

## 3.7.4 — Testes com Utilizadores

Os testes com utilizadores foram conduzidos com **cinco participantes reais** recrutados na comunidade académica da UTAD (anonimizados como P1 a P5), entre 20 e 22 de maio. Os participantes não tinham tido contacto prévio com o UTAD Maps antes da sessão de teste, o que garante observações genuínas sobre a usabilidade da aplicação na primeira utilização. Foi assegurada heterogeneidade de plataformas (sessões em iOS e Android) e de dispositivos (iPhone 13/14/12 Pro, Xiaomi Redmi Note 11, Samsung Galaxy A52), de forma a captar potenciais inconsistências multiplataforma.

A ordem das tarefas foi desenhada para reproduzir um **fluxo de utilização natural**: o utilizador inicia sessão, importa e consulta o horário, navega para as suas aulas, explora favoritos e navegação outdoor/indoor, ajusta acessibilidade e personalização, consulta a ajuda e, por fim, encerra a sessão. Esta sequência garante que tarefas dependentes do horário (T3 Horário e T4 Card Próxima Aula) são executadas **depois** da importação (T2), eliminando a fricção observada em rascunhos anteriores em que o card surgia vazio.

Cada participante realizou **treze tarefas** representativas (Tabela 18), preencheu uma *checklist* de dez aspectos de usabilidade, e respondeu a um questionário pós-teste com escala Likert de 1 a 5.

### Tabela 18 — Tarefas dos testes com utilizadores

| #   | Tarefa                                                                                                          | Critério de sucesso                                                |
| --- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| T1  | Activar/desactivar mostrar password, fazer login e confirmar que a sessão ficou activa                          | Password visível antes de submeter; sessão iniciada com mapa visível |
| T2  | Importar horário do Inforestudante via *link* privado                                                           | Ver horário semanal preenchido com aulas reais                     |
| T3  | Consultar o horário de quinta-feira e iniciar navegação para a sala da 1.ª aula                                 | Iniciar navegação indoor/outdoor para a sala correcta              |
| T4  | No Perfil, verificar o card "Próxima Aula" e navegar tocando no card                                            | Chegar ao ecrã de navegação da sala da próxima aula                |
| T5  | Adicionar a Biblioteca aos favoritos e usar o favorito para navegar                                             | Ver Biblioteca em Favoritos e iniciar navegação a partir daí       |
| T6  | Mudar o ponto de partida na navegação outdoor (GPS → edifício) e alternar entre A pé e Carro                    | Rota recalculada com novo ponto de partida e modo Carro activo     |
| T7  | Na fase Navigating da navegação outdoor, premir "Começar Navegação", seguir as instruções e terminar            | Card de instrução apresentado; botão Terminar encerra a navegação  |
| T8  | Consultar o histórico de navegação e renavigar para a última entrada                                            | Chegar ao ecrã de navegação do destino histórico                   |
| T9  | Mudar o piso no Indoor 3D do Sector E (Piso 0 → Piso 1) e navegar por toque até uma sala diferente              | Boneco animado chega a uma sala do Piso 1                          |
| T10 | Activar Alto Contraste e texto a 200 %, verificar usabilidade no Mapa e no Horário                              | Confirmar que ambos os ecrãs permanecem funcionais e legíveis      |
| T11 | Activar tema Escuro e mudar idioma para Inglês; verificar Mapa e Horário em inglês                              | Mapa e Horário apresentados em inglês com tema escuro activo       |
| T12 | Aceder a Suporte e Ajuda e encontrar a resposta à pergunta "Como importo o meu horário?"                        | FAQ expandida com a resposta correcta visível                      |
| T13 | Fazer *logout* no Perfil, voltar a entrar e verificar a auto-importação do horário                              | Sessão reiniciada e horário restaurado automaticamente             |

### Tabela 19 — Compilação dos resultados das 5 sessões × 13 tarefas

| Métrica                       | Valor agregado                                                                |
| ----------------------------- | ----------------------------------------------------------------------------- |
| Taxa de sucesso global        | **96,9 %** (63 tarefas com sucesso pleno, 2 parciais, 0 falhas em 65 tentativas) |
| Tempo médio por tarefa        | 50 s (mínimo 23 s em T1, máximo 102 s em T2)                                  |
| Facilidade média              | **4,6 / 5**                                                                   |
| Erros médios por tarefa       | 0,4 (máximo 1,0 em T13)                                                       |
| Pontuação Likert pós-teste    | **4,6 / 5**                                                                   |

A *checklist* de dez aspectos de usabilidade indicou três pontos a melhorar com convergência em mais do que um participante: **feedback do sistema** (3 participantes — *switches* sem *toast* de confirmação, *bugs* B-01 e B-02 no ciclo logout/login, *auto-centering* outdoor não comunicado, *hint* indoor sem menção a gestos de *pan*/*zoom*), **facilidade de aprendizagem** (2 participantes — favoritar do mapa, Definições e Suporte/Ajuda pouco evidentes) e **tamanho dos botões/interações** (1 participante — *hitbox* do ♡ favoritar e *affordance* do card Próxima Aula). Os restantes sete aspectos foram avaliados como adequados por 4 ou 5 dos 5 participantes.

As tarefas com maior dificuldade foram **T2 (Importar horário)** com tempo médio mais alto (102 s) e maior variação (±17 s) por dificuldade em localizar a chave/*link* no portal Inforestudante, e **T13 (*Logout* + *Login* + auto-importação)** com taxa de sucesso plena mais baixa (60 %, 2 parciais em 5). A T13 confirmou directamente, pela primeira vez, **dois problemas críticos** que até aqui só tinham sido previstos pelas técnicas de inspecção: o *bug* B-01 (botão "Iniciar sessão" sem resposta após *logout* — observado por P1 e P2 com falha grave, atenuado em P3) e o *bug* B-02 (privacidade — o horário do utilizador permaneceu visível sem sessão activa, observado por P2 que verificou "o meu horário já estava exposto mesmo sem conta"). A **T9 (Indoor 3D, mudar piso)** registou os erros médios mais altos a seguir a T13 (0,8 erros/sessão), motivados pelo *pill* de seletor de piso pouco visível e pela falta de dica sobre os gestos de *pinch*/*zoom* no *hint* do ecrã; a suspeita inicial de desalinhamento de renderização em Android foi, contudo, descartada como falso positivo após validação técnica.

---

## 3.7.5 — Síntese cruzada e problemas detectados

A combinação das três técnicas identificou **17 problemas reais** no UTAD Maps (após exclusão dos falsos positivos). A Tabela 20 apresenta os seis problemas com convergência em pelo menos duas das três técnicas, indicando os mais bem fundamentados.

### Tabela 20 — Problemas identificados por mais do que uma técnica

| ID   | Problema                                                                 | AH  | SH  | UT  |    Severidade    |
| ---- | ------------------------------------------------------------------------ | :-: | :-: | :-: | :--------------: |
| P-01 | Horário académico permanece visível após "Terminar sessão"                | ✓   | ✓   | ✓   | 4 (Catastrófico) |
| P-02 | Botão "Iniciar sessão" no Perfil não responde após *logout* prévio        | ✓   | —   | ✓   | 3 (Maior)        |
| P-03 | Falta de feedback informativo em acções do sistema (Definições + auto-centering outdoor) | —   | ✓   | ✓   | 2 (Menor)        |
| P-06 | Pesquisa de salas pode demorar 2–3 s sem indicador                        | ✓   | —   | ✓   | 2 (Menor)        |
| P-07 | Mensagens de erro genéricas (rota OSRM, distância elevada, importação)    | ✓   | —   | ✓   | 2 (Menor)        |
| P-09 | Recálculo de rota durante navegação sem aviso visual                      | ✓   | ✓   | —   | 2 (Menor)        |

O problema **P-01** (privacidade do horário) foi o único identificado pelas três técnicas em simultâneo na sua forma real, o que o torna o problema **mais robustamente fundamentado** desta avaliação, seguido de perto por **P-03** que também obteve forte convergência prática (SH + UT). Os problemas **P-01 e P-02** dizem respeito a comportamentos da gestão de sessão (perfil, persistência de dados) que constituem a área **mais crítica** a corrigir.

A distribuição global por severidade é: 1 problema catastrófico (P-01), 1 problema maior (P-02), 11 problemas menores (severidade 2) e 4 problemas cosméticos (severidade 1). Os testes com utilizadores, ao serem organizados em 13 tarefas que reproduzem um fluxo natural completo, revelaram **seis problemas exclusivos desta técnica** — P-04 (tempo elevado e erros em T2), P-14 (*affordance* do cartão de aula no Horário), P-15 (chave do Inforestudante), P-16 (*affordance* do card "Próxima Aula" no Perfil), P-17 (FAQ sem campo de pesquisa) e P-18 (acesso a Definições não imediatamente óbvio) — que apenas a observação directa de utilizadores em fluxos extensos permitiu detectar.

Três dos 17 problemas cruzam com *bugs* e *gaps* documentados na Fase 2 (`BUGS_DETETADOS.md`), nomeadamente os *bugs* B-01 (P-02 — botão "Iniciar sessão") e B-02 (P-01 — persistência do horário), e o gap G-05 (P-09 — sem `accessibilityLiveRegion`). A revalidação destes itens por técnicas independentes — e, no caso de B-01 e B-02, a sua **observação empírica em T13** — reforça a urgência da sua correção.

---

## 3.7.6 — Plano de melhorias propostas

Com base nos 17 problemas identificados, propõe-se um plano de **19 melhorias** (incluindo uma proactiva) organizadas em três *sprints* sequenciais e classificadas numa matriz de **Impacto × Esforço**. O **Quadrante I** (Impacto Alto × Esforço Baixo) reúne **seis melhorias** consideradas de prioridade máxima e estimadamente concluíveis em **um dia de trabalho**, resolvendo o problema catastrófico, o problema maior e os problemas menores com maior convergência entre técnicas. A Tabela 21 resume estas seis melhorias.

### Tabela 21 — Melhorias de prioridade máxima (Sprint 1)

| #    | Melhoria                                                                                       | Resolve            | Esforço |
| ---- | ---------------------------------------------------------------------------------------------- | ------------------ | -------- |
| M-01 | Limpar `AsyncStorage` no *logout* (chaves do horário, favoritos, próxima aula, histórico)      | P-01 catastrófico  | Trivial  |
| M-02 | Corrigir o *handler* do botão "Iniciar sessão" no Perfil para responder após *logout*          | P-02 maior         | Pequeno  |
| M-03 | Adicionar `accessibilityState={{ selected }}` aos chips de filtro e idioma                    | Gaps G-01 a G-03   | Pequeno  |
| M-04 | *Toast* de confirmação quando o utilizador activa Alto Contraste, muda tema ou tamanho de texto | P-03 menor         | Pequeno  |
| M-05 | `accessibilityLiveRegion="polite"` na barra de instruções da navegação outdoor                  | P-09 menor         | Pequeno  |
| M-06 | `ActivityIndicator` durante a chamada de pesquisa ao backend                                    | P-06 menor         | Trivial  |

Os restantes 13 itens de melhoria são abordados num Sprint 2 (melhorias de fluxo, 2 dias) e num Sprint 3 (polimento, 1 dia) detalhados em `MELHORIAS_PROPOSTAS.md`.

A implementação do Sprint 1 eleva a estimativa da taxa de sucesso nos *user tests* de **96,9 % para 100 %**, eliminando as duas falhas parciais directamente observadas em T13 (P-01 — *bug* B-02 de privacidade; P-02 — *bug* B-01 do botão de login) e cumprindo integralmente as regras 3, 4 e 5 de Shneiderman. Em particular, a tarefa T13 deverá passar de 60 % para 100 % de sucesso pleno após M-01 e M-02, fechando o ciclo de gestão de sessão.

---

## 3.7.7 — Limitações da avaliação

A presente avaliação apresenta três limitações metodológicas que se documentam explicitamente para garantir a transparência e o rigor do estudo:

1. **Dimensão da amostra dos *user tests***: os cinco participantes representam um grupo reduzido (N = 5). Embora a literatura indique que cinco utilizadores são suficientes para identificar a maioria dos problemas de usabilidade (Nielsen, 2000), o intervalo de confiança das métricas absolutas (taxa de sucesso, tempo médio, pontuação Likert) é alargado, pelo que os resultados devem ser lidos sobretudo enquanto **comparações relativas** entre tarefas e enquanto identificação qualitativa de pontos críticos. Funcionalidades não cobertas pelas 13 tarefas — *onboarding* com *swipe*, modo visitante "Saltar e explorar", limpar histórico, limpar horário, transição outdoor → indoor pelo botão "Entrar no Edifício", Rotas Acessíveis em contexto de navegação real e Leitor de Ecrã com VoiceOver/TalkBack — deverão ser cobertas em iterações futuras com amostra alargada.
2. **Número de peritos heurísticos**: foram convidados três peritos, no limite inferior da recomendação de Nielsen (3 a 5). O acréscimo de mais peritos permitiria identificar problemas adicionais menores não capturados.
3. **Cobertura temporal**: a avaliação foi conduzida em dois dias úteis, sem possibilidade de iterar correcções entre rondas de avaliação. Numa iteração subsequente do produto, recomenda-se repetir as três técnicas após implementação das melhorias do Sprint 1 para verificar empiricamente os ganhos previstos.

Apesar destas limitações, a convergência entre técnicas independentes, o cruzamento com os achados da Fase 2, a expansão dos *user tests* para 13 tarefas com matriz de cobertura, e a identificação de **17 problemas reais** com plano de correção priorizado fornecem uma base sólida para a próxima iteração da aplicação.

---

## 3.7.8 — Conclusão da avaliação

A avaliação de usabilidade do UTAD Maps combinou as três técnicas previstas no enunciado da Fase 3 (Heurísticas de Nielsen, Regras de Ouro de Shneiderman e Testes com Utilizadores), aplicadas de forma convergente e independente. A convergência metodológica é elevada — **cerca de 35 % dos problemas (6 em 17) foram identificados por mais do que uma técnica**, e um deles — **P-01 (privacidade do horário)** — foi detectado pelas **três técnicas em simultâneo** (sendo P-03 validado por duas delas, SH + UT) —, validando a robustez do desenho misto adoptado. Em particular, a organização dos *user tests* em 13 tarefas num fluxo natural permitiu detectar seis problemas exclusivos desta técnica (relacionados com *affordances*, expectativas dos utilizadores e dificuldades pontuais em fluxos extensos) e — sobretudo — **confirmar empiricamente** o cenário de privacidade do horário que até aqui só tinha sido previsto pelas duas inspecções.

A aplicação apresenta **bons indicadores globais de usabilidade**: 96,9 % de taxa de sucesso nos *user tests*, 4,6/5 de facilidade média, 4,6/5 de pontuação Likert global, e cumprimento integral de cinco das oito regras de Shneiderman. As principais áreas a melhorar concentram-se na **gestão de sessão** (persistência indevida do horário no `AsyncStorage` após terminar sessão e *bug* do botão "Iniciar sessão" no Perfil — *bugs* B-02 e B-01 da Fase 2, agora confirmados nos *user tests* em T13) e no **feedback informativo** em acções de Definições e na barra de navegação outdoor.

O plano de melhorias propõe **19 acções concretas**, das quais **seis de prioridade máxima** e exequibilidade trivial ou pequena, suficientes para elevar a aplicação para 100 % de taxa de sucesso na próxima iteração. A correção do problema P-01 (privacidade) é a mais urgente do conjunto e pode ser resolvida com poucas linhas de código no *handler* de *logout*, eliminando o único problema catastrófico identificado em toda a avaliação; a correção do P-02 (botão de *login*) complementa-a para fechar definitivamente o ciclo de *logout*/*login*.

A documentação detalhada de cada técnica, das grelhas individuais de peritos e participantes, da síntese cruzada de problemas e do plano de melhorias encontra-se nos documentos anexos da Fase 3 (`HEURISTICAS_NIELSEN.md`, `REGRAS_SHNEIDERMAN.md`, `USER_TESTS.md`, `PROBLEMAS_DETECTADOS.md`, `MELHORIAS_PROPOSTAS.md`).
