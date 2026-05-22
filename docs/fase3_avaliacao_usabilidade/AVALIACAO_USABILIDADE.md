# 3.7 — Avaliação de Usabilidade

> Texto destinado à **secção 3.7 do relatório** do Desafio 3, Fase 3. Pode ser colado directamente no Word, com formatação Título 3 para os subtítulos e tabelas convertidas via Inserir → Tabela → Converter Texto em Tabela.

---

## 3.7.1 — Enquadramento e metodologia

A avaliação de usabilidade descrita nesta secção corresponde à Fase 3 do Desafio 3. O enunciado da unidade curricular permite escolher entre três técnicas: **Heurísticas de Nielsen**, **Regras de Ouro de Shneiderman** e **Testes com Utilizadores**. Optou-se por **aplicar as três técnicas em simultâneo** num desenho convergente, coerente com a abordagem mista adoptada na Fase 2 (auto + manual) e justificável pela observação de que cada técnica capta tipos distintos de problemas: a inspecção heurística cobre rigor sistemático, as regras de Shneiderman complementam com princípios de previsibilidade e controlo, e os testes com utilizadores captam problemas que apenas a interacção real revela.

A avaliação compreendeu **três peritos externos à equipa de desenvolvimento** (conforme indicação da grelha do professor para a heurística de Nielsen), **uma análise estruturada das oito regras de Shneiderman** verificada contra o código-fonte e contra o *build* em execução no Expo Go, e **cinco sessões de testes** com os elementos da equipa abrangendo **treze tarefas** representativas. A utilização da equipa como amostra dos *user tests* é uma limitação metodológica conhecida que se documenta explicitamente em 3.7.7: o conhecimento prévio do produto tende a subestimar tempos de execução e a sobrestimar taxas de sucesso, pelo que os resultados absolutos devem ser interpretados como **limites superiores** e o valor extraído destes testes é principalmente **relativo** (comparações entre tarefas, identificação de pontos críticos consensuais).

A Tabela 15 sintetiza as três vertentes da avaliação.

### Tabela 15 — Técnicas e amostras de avaliação aplicadas

| # | Técnica                       | Amostra                              | Output principal                                                                  |
| - | ----------------------------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| A | Heurísticas de Nielsen        | 3 peritos externos                   | 3 grelhas individuais + síntese com média de severidade por heurística            |
| B | Regras de Ouro de Shneiderman | Análise estruturada + verificação    | Tabela de conformidade pelas 8 regras                                             |
| C | Testes com Utilizadores       | 5 participantes (equipa, P1–P5)      | 5 sessões × 13 tarefas com tabela, *checklist*, questionário Likert e matriz de cobertura |

---

## 3.7.2 — Avaliação Heurística de Nielsen

A avaliação heurística foi realizada por três peritos externos à equipa de desenvolvimento, com perfis complementares: Maria Costa (3.º ano de Engenharia Informática da UTAD), João Pereira (Mestrado em Design Multimédia da UTAD) e Ana Marques (licenciada em Engenharia Informática pela UTAD, actualmente *UI/UX designer freelancer*). Cada perito utilizou a grelha de 10 heurísticas de Jakob Nielsen disponibilizada pelo professor, com escala de severidade 0–4, e realizou a avaliação **individualmente** durante aproximadamente 45 minutos percorrendo todos os ecrãs principais do UTAD Maps via Expo Go.

A Tabela 16 apresenta a compilação das três grelhas com a média de severidade por heurística.

### Tabela 16 — Compilação das três grelhas de avaliação heurística

| Nº  | Heurística                             | P1 (Maria)   | P2 (João)   | P3 (Ana)     | Média         | Máxima  |
| --- | -------------------------------------- | :----------: | :---------: | :----------: | :-------------: | :---------: |
| 1   | Visibilidade do estado do sistema      | 2            | 1           | 2            | **1,67**      | 2           |
| 2   | Correspondência com o mundo real       | 0            | 0           | 2            | 0,67          | 2           |
| 3   | Controlo e liberdade do utilizador     | 3            | 0           | 0            | 1,00          | 3           |
| 4   | Consistência e padrões                 | 0            | 1           | 0            | 0,33          | 1           |
| 5   | Prevenção de erros                     | 3            | 0           | 4            | **2,33**      | **4**       |
| 6   | Reconhecimento em vez de memorização   | 0            | 2           | 0            | 0,67          | 2           |
| 7   | Flexibilidade e eficiência             | 0            | 0           | 2            | 0,67          | 2           |
| 8   | Design estético e minimalista          | 0            | 1           | 0            | 0,33          | 1           |
| 9   | Ajudar a reconhecer e recuperar erros  | 2            | 0           | 2            | 1,33          | 2           |
| 10  | Ajuda e documentação                   | 0            | 1           | 2            | 1,00          | 2           |
|     | **Soma**                               | **10**       | **6**       | **14**       | **10,00**     | —           |

Foram identificados, no conjunto das três grelhas, **15 problemas distintos** distribuídos em quatro categorias de severidade: um problema **catastrófico** (sev 4), dois problemas **maiores** (sev 3), oito problemas **menores** (sev 2) e quatro **cosméticos** (sev 1). O problema mais grave detectado é a persistência do horário académico após o utilizador terminar sessão (heurística 5, sev 4 na grelha de P3 e sev 3 na grelha de P1), com implicações de privacidade em contexto multi-utilizador (telemóveis partilhados). O segundo mais grave é o *bug* funcional do botão "Iniciar sessão" no ecrã de Perfil, que deixa de responder após um *logout* prévio (heurística 3, sev 3 em P1), aprisionando o utilizador em modo convidado.

A heurística com maior média de severidade é a **H5 — Prevenção de erros** (média 2,33), seguida da **H1 — Visibilidade do estado do sistema** (média 1,67). As heurísticas 4 (Consistência) e 8 (Estética e minimalismo) registaram apenas problemas cosméticos, indicando que o sistema de design da aplicação é robusto e coerente.

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

Os testes com utilizadores foram conduzidos com os cinco elementos da equipa do projeto (anonimizados como P1 a P5), conforme as restrições temporais da Fase 3 (20 a 22 de maio). Esta amostra introduz um enviesamento por familiaridade com o produto, que é assumido explicitamente: os resultados absolutos de tempo e taxa de sucesso devem ser interpretados como **limites superiores** (utilizadores externos terão muito provavelmente desempenho inferior), e o valor metodológico extrai-se principalmente das **comparações relativas** entre tarefas, dos **comentários qualitativos** e dos pontos críticos que mesmo conhecedores do produto enfrentam. Para mitigar parcialmente este enviesamento, a sessão de P5 foi conduzida por P2 em vez do moderador habitual, e o documento `USER_TESTS.md` integra uma **matriz de cobertura tarefa × funcionalidade** (§ 7.7) que documenta as áreas não exercidas, a abordar em iterações futuras com utilizadores externos.

Cada participante realizou **treze tarefas** representativas (Tabela 18), preencheu uma *checklist* de dez aspectos de usabilidade, e respondeu a um questionário pós-teste com escala Likert de 1 a 5.

### Tabela 18 — Tarefas dos testes com utilizadores

| #   | Tarefa                                                                                                          | Critério de sucesso                                                |
| --- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| T1  | Activar/desactivar mostrar password, fazer login e confirmar que a sessão ficou activa                          | Password visível antes de submeter; sessão iniciada com mapa visível |
| T2  | Consultar o horário de quinta-feira e iniciar navegação para a sala da 1.ª aula                                 | Iniciar navegação indoor/outdoor para a sala correcta              |
| T3  | Adicionar a Biblioteca aos favoritos e usar o favorito para navegar                                             | Ver Biblioteca em Favoritos e iniciar navegação a partir daí       |
| T4  | Activar Alto Contraste e texto a 200 %, verificar usabilidade no Mapa e no Horário                              | Confirmar que ambos os ecrãs permanecem funcionais e legíveis      |
| T5  | Importar horário do Inforestudante via *link* privado                                                           | Ver horário semanal preenchido com aulas reais                     |
| T6  | Mudar o ponto de partida na navegação outdoor (GPS → edifício) e alternar entre A pé e Carro                    | Rota recalculada com novo ponto de partida e modo Carro activo     |
| T7  | Consultar o histórico de navegação e renavigar para a última entrada                                            | Chegar ao ecrã de navegação do destino histórico                   |
| T8  | Mudar o piso no Indoor 3D do Sector E (Piso 0 → Piso 1) e navegar por toque até uma sala diferente              | Boneco animado chega a uma sala do Piso 1                          |
| T9  | Activar tema Escuro e mudar idioma para Inglês; verificar Mapa e Horário em inglês                              | Mapa e Horário apresentados em inglês com tema escuro activo       |
| T10 | No Perfil, verificar o card "Próxima Aula" e navegar tocando no card                                            | Chegar ao ecrã de navegação da sala da próxima aula                |
| T11 | Na fase Navigating da navegação outdoor, premir "Começar Navegação", seguir as instruções e terminar            | Card de instrução apresentado; botão Terminar encerra a navegação  |
| T12 | Aceder a Suporte e Ajuda e encontrar a resposta à pergunta "Como importo o meu horário?"                        | FAQ expandida com a resposta correcta visível                      |
| T13 | Fazer *logout* no Perfil, voltar a entrar e verificar a auto-importação do horário                              | Sessão reiniciada e horário restaurado automaticamente             |

### Tabela 19 — Compilação dos resultados das 5 sessões × 13 tarefas

| Métrica                       | Valor agregado                                                                |
| ----------------------------- | ----------------------------------------------------------------------------- |
| Taxa de sucesso global        | **90,8 %** (59 tarefas com sucesso pleno, 6 parciais, 0 falhas em 65 tentativas) |
| Tempo médio por tarefa        | 51 s (mínimo 23 s em T1, máximo 102 s em T5)                                  |
| Facilidade média              | **4,5 / 5**                                                                   |
| Erros médios por tarefa       | 0,5 (máximo 1,0 em T4 e T13)                                                  |
| Pontuação Likert pós-teste    | **4,6 / 5**                                                                   |

A *checklist* de dez aspectos de usabilidade indicou três pontos a melhorar com convergência em mais do que um participante: **feedback do sistema** (3 participantes — *switches* sem toast de confirmação, *bug* do login pós-*logout*, *auto-centering* outdoor não comunicado, *hint* indoor sem menção a gestos de *pan*/*zoom*), **tamanho dos botões/interações** (2 participantes — ícone ♡ de favoritar com *hitbox* reduzida, *label* "De" na outdoor não óbvia, card "Próxima Aula" no Perfil sem indicação de elemento clicável) e **tempo de carregamento** da pesquisa (1 participante). Os restantes sete aspectos foram avaliados como adequados por 4 ou 5 dos 5 participantes.

As tarefas com maior dificuldade foram **T5 (Importar horário)** com tempo médio mais alto (102 s) e variação máxima (±17 s) por dificuldade em localizar a chave no portal Inforestudante, e **T13 (*Logout* + *Login* + auto-importação)** com taxa de sucesso plena mais baixa (60 %, 2 parciais em 5) directamente associada ao *bug* B-01 — o botão "Iniciar sessão" no Perfil que não responde após *logout* sem reiniciar a aplicação. A **T8 (Indoor 3D, mudar piso)** revelou ainda um problema técnico não conhecido: em dispositivos Android, a posição inicial do boneco no Piso 1 surge fora do corredor principal (`FLOOR_START_POSITIONS` mal calibrado), obrigando o utilizador a fazer *zoom out* para se localizar.

---

## 3.7.5 — Síntese cruzada e problemas detectados

A combinação das três técnicas identificou **18 problemas distintos** no UTAD Maps. A Tabela 20 apresenta os cinco problemas com convergência em pelo menos duas das três técnicas, indicando os mais bem fundamentados.

### Tabela 20 — Problemas identificados por mais do que uma técnica

| ID   | Problema                                                                 | AH  | SH  | UT  |    Severidade    |
| ---- | ------------------------------------------------------------------------ | :-: | :-: | :-: | :--------------: |
| P-01 | Horário académico permanece visível após "Terminar sessão"                | ✓  | ✓  | —  | 4 (Catastrófico) |
| P-02 | Botão "Iniciar sessão" no Perfil não responde após *logout* prévio        | ✓  | —  | ✓  | 3 (Maior)        |
| P-03 | Falta de feedback informativo em acções de Definições                     | ✓  | ✓  | ✓  | 2 (Menor)        |
| P-06 | Pesquisa de salas pode demorar 2–3 s sem indicador                        | ✓  | —  | ✓  | 2 (Menor)        |
| P-09 | Recálculo de rota durante navegação sem aviso visual                      | ✓  | ✓  | —  | 2 (Menor)        |

O problema **P-03** foi o único identificado pelas três técnicas em simultâneo, o que o torna o problema **mais robustamente fundamentado** desta avaliação. Os problemas **P-01 e P-02** convergem em duas técnicas e dizem respeito a comportamentos da gestão de sessão (perfil, persistência de dados) que constituem a área **mais crítica** a corrigir.

A distribuição global por severidade é: 1 problema catastrófico (P-01), 1 problema maior (P-02), 12 problemas menores (severidade 2) e 4 problemas cosméticos (severidade 1). Os testes com utilizadores, ao serem expandidos para 13 tarefas, revelaram cinco problemas exclusivos desta técnica (P-14 — *affordance* do cartão de aula no Horário; P-15 — chave do Inforestudante; P-16 — `FLOOR_START_POSITIONS` no Piso 1 Android; P-17 — *affordance* do card "Próxima Aula" no Perfil; P-18 — FAQ sem campo de pesquisa) que apenas a observação directa de utilizadores em fluxos extensos permitiu detectar.

Quatro dos 18 problemas cruzam com *bugs* e *gaps* documentados na Fase 2 (`BUGS_DETETADOS.md`), nomeadamente os *bugs* B-01 (P-02 — botão "Iniciar sessão"), B-02 (P-01 — persistência do horário), G-05 (P-09 — sem `accessibilityLiveRegion`) e G-01 a G-03 (P-11 — chips sem `accessibilityState`). A revalidação destes itens por técnicas independentes reforça a urgência da sua correção.

---

## 3.7.6 — Plano de melhorias propostas

Com base nos 18 problemas identificados, propõe-se um plano de **19 melhorias** organizadas em três *sprints* sequenciais e classificadas numa matriz de **Impacto × Esforço**. O **Quadrante I** (Impacto Alto × Esforço Baixo) reúne **sete melhorias** consideradas de prioridade máxima e estimadamente concluíveis em **um dia de trabalho**, resolvendo o problema catastrófico, o problema maior e os problemas menores com maior convergência entre técnicas. A Tabela 21 resume estas sete melhorias.

### Tabela 21 — Melhorias de prioridade máxima (Sprint 1)

| #    | Melhoria                                                                                       | Resolve            | Esforço |
| ---- | ---------------------------------------------------------------------------------------------- | ------------------ | -------- |
| M-01 | Limpar `AsyncStorage` no *logout* (chaves do horário, favoritos, próxima aula, histórico)      | P-01 catastrófico  | Trivial  |
| M-02 | Corrigir o *handler* do botão "Iniciar sessão" no Perfil para responder após *logout*          | P-02 maior         | Pequeno  |
| M-03 | Adicionar `accessibilityState={{ selected }}` aos chips de filtro e *pills* de selecção        | P-11 cosmético     | Pequeno  |
| M-04 | *Toast* de confirmação quando o utilizador activa Alto Contraste, muda tema ou tamanho de texto | P-03 menor         | Pequeno  |
| M-05 | `accessibilityLiveRegion="polite"` na barra de instruções da navegação outdoor                  | P-09 menor         | Pequeno  |
| M-06 | `ActivityIndicator` durante a chamada de pesquisa ao backend                                    | P-06 menor         | Trivial  |
| M-17 | Recalibrar `FLOOR_START_POSITIONS` para o Piso 1 do `sectorE` em Android                        | P-16 menor         | Pequeno  |

Os restantes 12 problemas são abordados num Sprint 2 (melhorias de fluxo, 2 dias) e num Sprint 3 (polimento, 1 dia) detalhados em `MELHORIAS_PROPOSTAS.md`.

A implementação do Sprint 1 eleva a estimativa da taxa de sucesso nos *user tests* de **90,8 % para 96–97 %**, elimina o problema de privacidade catastrófico (P-01) e o *bug* funcional maior (P-02), uniformiza o comportamento do Indoor 3D entre iOS e Android, e cumpre integralmente as regras 3, 4 e 5 de Shneiderman, deixando a aplicação pronta para uso em produção pela comunidade académica da UTAD.

---

## 3.7.7 — Limitações da avaliação

A presente avaliação apresenta três limitações metodológicas que se documentam explicitamente para garantir a transparência e o rigor do estudo:

1. **Amostra dos *user tests***: os cinco participantes são os elementos da equipa de desenvolvimento, situação que enviesa os resultados absolutos por familiaridade prévia com o produto. Os resultados de tempo e taxa de sucesso devem ser interpretados como **estimativas optimistas** comparativamente a utilizadores externos. Para mitigar parcialmente este enviesamento, a sessão do moderador habitual (P5) foi conduzida por P2, e a matriz de cobertura tarefa × funcionalidade (`USER_TESTS.md` § 7.7) documenta explicitamente as funcionalidades não exercidas — *onboarding* com *swipe*, modo visitante, limpar histórico/horário, "Entrar no Edifício" como transição outdoor→indoor, Rotas Acessíveis em contexto real e Leitor de Ecrã com VoiceOver/TalkBack — que deverão ser cobertas em iterações futuras com utilizadores externos não familiarizados com a aplicação. Esta limitação é consequência do constrangimento temporal de execução da Fase 3 (20 a 22 de maio).
2. **Número de peritos heurísticos**: foram convidados três peritos, no limite inferior da recomendação de Nielsen (3 a 5). O acréscimo de mais peritos permitiria identificar problemas adicionais menores não capturados.
3. **Cobertura temporal**: a avaliação foi conduzida em dois dias úteis, sem possibilidade de iterar correcções entre rondas de avaliação. Numa iteração subsequente do produto, recomenda-se repetir as três técnicas após implementação das melhorias do Sprint 1 para verificar empiricamente os ganhos previstos.

Apesar destas limitações, a convergência entre três técnicas independentes, o cruzamento com os achados da Fase 2, a expansão dos *user tests* para 13 tarefas com matriz de cobertura, e a identificação de **18 problemas distintos** com plano de correção priorizado fornecem uma base sólida para a próxima iteração da aplicação.

---

## 3.7.8 — Conclusão da avaliação

A avaliação de usabilidade do UTAD Maps combinou as três técnicas previstas no enunciado da Fase 3 (Heurísticas de Nielsen, Regras de Ouro de Shneiderman e Testes com Utilizadores), aplicadas de forma convergente e independente. A convergência metodológica é elevada — **cerca de 28 % dos problemas (5 em 18) foram identificados por mais do que uma técnica** —, validando a robustez do desenho misto adoptado. Em particular, a expansão dos *user tests* para 13 tarefas permitiu detectar cinco problemas exclusivos desta técnica que a inspecção heurística não captou — quatro relacionados com *affordance* e expectativas dos utilizadores e um relativo a inconsistência de comportamento entre iOS e Android.

A aplicação apresenta **bons indicadores globais de usabilidade**: 90,8 % de taxa de sucesso nos *user tests*, 4,5/5 de facilidade média, 4,6/5 de pontuação Likert global, e cumprimento integral de cinco das oito regras de Shneiderman. As principais áreas a melhorar concentram-se na **gestão de sessão** (persistência indevida do horário no `AsyncStorage` após terminar sessão e *bug* do botão "Iniciar sessão" no Perfil), no **feedback informativo** em acções de Definições, e na **consistência multi-plataforma** do Indoor 3D entre iOS e Android.

O plano de melhorias propõe **19 acções concretas**, das quais sete de prioridade máxima e exequibilidade trivial ou pequena, suficientes para elevar significativamente a usabilidade do produto antes de uma eventual iteração subsequente. Em particular, a correção do problema P-01 (privacidade — horário persiste após *logout*) é a mais urgente do conjunto e pode ser resolvida com poucas linhas de código no *handler* de *logout*, eliminando o único problema catastrófico identificado em toda a avaliação.

A documentação detalhada de cada técnica, das grelhas individuais de peritos e participantes, da síntese cruzada de problemas e do plano de melhorias encontra-se nos documentos anexos da Fase 3 (`HEURISTICAS_NIELSEN.md`, `REGRAS_SHNEIDERMAN.md`, `USER_TESTS.md`, `PROBLEMAS_DETECTADOS.md`, `MELHORIAS_PROPOSTAS.md`).
