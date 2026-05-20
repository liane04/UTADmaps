# 3.7 — Avaliação de Usabilidade

> Texto destinado à **secção 3.7 do relatório** do Desafio 3, Fase 3. Pode ser colado directamente no Word, com formatação Título 3 para os subtítulos e tabelas convertidas via Inserir → Tabela → Converter Texto em Tabela.

---

## 3.7.1 — Enquadramento e metodologia

A avaliação de usabilidade descrita nesta secção corresponde à Fase 3 do Desafio 3. O enunciado da unidade curricular permite escolher entre três técnicas: **Heurísticas de Nielsen**, **Regras de Ouro de Shneiderman** e **Testes com Utilizadores**. Optou-se por **aplicar as três técnicas em simultâneo** num desenho convergente, coerente com a abordagem mista adoptada na Fase 2 (auto + manual) e justificável pela observação de que cada técnica capta tipos distintos de problemas: a inspecção heurística cobre rigor sistemático, as regras de Shneiderman complementam com princípios de previsibilidade e controlo, e os testes com utilizadores captam problemas que apenas a interacção real revela.

A avaliação compreendeu **três peritos externos à equipa de desenvolvimento** (conforme indicação da grelha do professor para a heurística de Nielsen), **uma análise estruturada das oito regras de Shneiderman**, e **cinco sessões de testes** com os elementos da equipa. A utilização da equipa como amostra dos *user tests* é uma limitação metodológica conhecida que se documenta explicitamente em 3.7.4: o conhecimento prévio do produto tende a subestimar tempos de execução e a sobrestimar taxas de sucesso, pelo que os resultados absolutos devem ser interpretados com cautela e o valor extraído destes testes é principalmente **relativo** (comparações entre tarefas, identificação de pontos críticos consensuais).

A Tabela 15 sintetiza as três vertentes da avaliação.

### Tabela 15 — Técnicas e amostras de avaliação aplicadas

| # | Técnica                      | Amostra                  | Output principal                                                          |
| - | ----------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| A | Heurísticas de Nielsen       | 3 peritos externos       | 3 grelhas individuais + síntese com média de severidade por heurística |
| B | Regras de Ouro de Shneiderman | Análise estruturada     | Tabela de conformidade pelas 8 regras                                     |
| C | Testes com Utilizadores       | 5 participantes (equipa) | 5 sessões com tabela de tarefas,*checklist* e questionário Likert     |

---

## 3.7.2 — Avaliação Heurística de Nielsen

A avaliação heurística foi realizada por três peritos externos à equipa de desenvolvimento, com perfis complementares: Maria Costa (3.º ano de Engenharia Informática da UTAD), João Pereira (Mestrado em Design Multimédia da UTAD) e Ana Marques (licenciada em Engenharia Informática pela UTAD, actualmente *UI/UX designer freelancer*). Cada perito utilizou a grelha de 10 heurísticas de Jakob Nielsen disponibilizada pelo professor, com escala de severidade 0–4, e realizou a avaliação **individualmente** durante aproximadamente 45 minutos percorrendo todos os ecrãs principais do UTAD Maps via Expo Go.

A Tabela 16 apresenta a compilação das três grelhas com a média de severidade por heurística.

### Tabela 16 — Compilação das três grelhas de avaliação heurística

| Nº | Heurística                            |  P1 (Maria)  | P2 (João) |   P3 (Ana)   |     Média     |   Máxima   |
| --- | -------------------------------------- | :----------: | :---------: | :----------: | :-------------: | :---------: |
| 1   | Visibilidade do estado do sistema      |      2      |      1      |      2      | **1,67** |      2      |
| 2   | Correspondência com o mundo real      |      0      |      0      |      2      |      0,67      |      2      |
| 3   | Controlo e liberdade do utilizador     |      3      |      0      |      0      |      1,00      |      3      |
| 4   | Consistência e padrões               |      0      |      1      |      0      |      0,33      |      1      |
| 5   | Prevenção de erros                   |      3      |      0      |      4      | **2,33** | **4** |
| 6   | Reconhecimento em vez de memorização |      0      |      2      |      0      |      0,67      |      2      |
| 7   | Flexibilidade e eficiência            |      0      |      0      |      2      |      0,67      |      2      |
| 8   | Design estético e minimalista         |      0      |      1      |      0      |      0,33      |      1      |
| 9   | Ajudar a reconhecer e recuperar erros  |      2      |      0      |      2      |      1,33      |      2      |
| 10  | Ajuda e documentação                 |      0      |      1      |      2      |      1,00      |      2      |
|     | **Soma**                         | **10** | **6** | **14** | **10,00** |     —     |

Foram identificados, no conjunto das três grelhas, **15 problemas distintos** distribuídos em quatro categorias de severidade: um problema **catastrófico** (sev 4), dois problemas **maiores** (sev 3), oito problemas **menores** (sev 2) e quatro **cosméticos** (sev 1). O problema mais grave detectado é a persistência do horário académico após o utilizador terminar sessão (heurística 5, sev 4 na grelha de P3 e sev 3 na grelha de P1), com implicações de privacidade em contexto multi-utilizador (telemóveis partilhados). O segundo mais grave é o *bug* funcional do botão "Iniciar sessão" no ecrã de Perfil, que deixa de responder após um *logout* prévio (heurística 3, sev 3 em P1), aprisionando o utilizador em modo convidado.

A heurística com maior média de severidade é a **H5 — Prevenção de erros** (média 2,33), seguida da **H1 — Visibilidade do estado do sistema** (média 1,67). As heurísticas 4 (Consistência) e 8 (Estética e minimalismo) registaram apenas problemas cosméticos, indicando que o sistema de design da aplicação é robusto e coerente.

---

## 3.7.3 — Avaliação pelas Regras de Ouro de Shneiderman

As oito regras de ouro propostas por Ben Shneiderman foram aplicadas como **inspecção estruturada** ao UTAD Maps com o objectivo de identificar problemas que possam não ter sido capturados pela inspecção heurística — em particular nas dimensões de feedback informativo, fim de acção, prevenção de erros e controlo do utilizador. A Tabela 17 resume o estado de conformidade por regra.

### Tabela 17 — Avaliação pelas 8 regras de ouro de Shneiderman

| Nº | Regra                                                 |     Conformidade     | Severidade do*gap* |
| :-: | ----------------------------------------------------- | :-------------------: | :------------------: |
|  1  | Esforçar-se pela consistência                       |       Conforme       |          —          |
|  2  | Procurar a usabilidade universal                      |       Conforme       |          —          |
|  3  | Dar feedback informativo                              | Parcialmente conforme |      2 (menor)      |
|  4  | Projectar diálogos que indiquem o fim de uma acção | Parcialmente conforme |      2 (menor)      |
|  5  | Prevenir erros                                        | Parcialmente conforme |      3 (maior)      |
|  6  | Permitir a fácil reversão de acções               |       Conforme       |          —          |
|  7  | Manter os utilizadores no controlo                    |       Conforme       |          —          |
|  8  | Reduzir a carga de memória de curta duração        |       Conforme       |          —          |

Cinco das oito regras são **integralmente cumpridas** (consistência, usabilidade universal, reversão, controlo e redução da carga de memória) e três são **parcialmente cumpridas** com *gaps* identificados (feedback informativo, fim de acção e prevenção de erros). A regra mais problemática é a **regra 5 (Prevenir erros)**, cujos *gaps* coincidem directamente com os problemas catastrófico e maior identificados pela heurística de Nielsen: o *logout* sem confirmação e a persistência indevida do horário no `AsyncStorage`. Esta sobreposição entre as duas técnicas reforça a urgência da correção destes pontos.

Os *gaps* nas regras 3 e 4 são menores e referem-se a oportunidades de melhoria em feedback nas alterações de definições e em notificação explícita de chegada ao destino durante a navegação outdoor.

---

## 3.7.4 — Testes com Utilizadores

Os testes com utilizadores foram conduzidos com os cinco elementos da equipa do projeto, conforme as restrições temporais da Fase 3 (20 a 22 de maio). Esta amostra introduz um enviesamento por familiaridade com o produto, que é assumido explicitamente: os resultados absolutos de tempo e taxa de sucesso devem ser interpretados como **limites superiores** (utilizadores externos terão muito provavelmente desempenho inferior), e o valor metodológico extrai-se principalmente das **comparações relativas** entre tarefas, dos **comentários qualitativos** e dos pontos críticos que mesmo conhecedores do produto enfrentam.

Cada participante realizou **cinco tarefas** representativas (Tabela 18), preencheu uma *checklist* de dez aspectos de usabilidade, e respondeu a um questionário pós-teste com escala Likert de 1 a 5.

### Tabela 18 — Tarefas dos testes com utilizadores

| #  | Tarefa                                                                              | Critério de sucesso                                            |
| -- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| T1 | Encontrar e navegar para a sala G0.08 a partir do mapa principal                    | Chegar ao ecrã indoor da sala G0.08 com rota traçada          |
| T2 | Consultar o horário de quinta-feira e iniciar navegação para a sala da 1.ª aula | Iniciar navegação outdoor para a sala correcta                |
| T3 | Adicionar a Biblioteca aos favoritos e usar o favorito para navegar                 | Ver Biblioteca em Favoritos e iniciar navegação a partir daí |
| T4 | Activar Alto Contraste e texto a 200 %, verificar usabilidade no Mapa e no Horário | Confirmar que ambos os ecrãs permanecem funcionais e legíveis |
| T5 | Importar horário do Inforestudante via*link* privado                             | Ver horário semanal preenchido com aulas reais                 |

### Tabela 19 — Compilação dos resultados das 5 sessões

| Métrica                      | Valor agregado                                                               |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Taxa de sucesso global        | **92 %** (23 tarefas concluídas com sucesso, 2 parciais em 25 totais) |
| Tempo médio por tarefa       | 58 s (variação de 28 s em T1 a 102 s em T5)                                |
| Facilidade média             | **4,4 / 5**                                                            |
| Erros médios por tarefa      | 0,5 (máximo em T4 com 1,0 e em T5 com 0,8)                                  |
| Pontuação Likert pós-teste | **4,68 / 5**                                                           |

A *checklist* de dez aspectos de usabilidade indicou três pontos a melhorar com convergência em mais do que um participante: **feedback do sistema** (3 participantes), **tamanho dos botões/interações** (2 participantes, especificamente o ícone de favoritar) e **tempo de carregamento** da pesquisa (1 participante). Todos os restantes aspectos foram avaliados como adequados por 5 ou 4 dos 5 participantes.

A tarefa T5 (Importar horário) foi a mais demorada e a que mais erros gerou (tempo médio 102 s, 0,8 erros por sessão), maioritariamente devido a (i) dificuldade em encontrar a chave de sincronização no portal Inforestudante e (ii) mensagem de erro pouco específica quando o utilizador cola apenas a chave alfanumérica em vez do *link* completo. A tarefa T4 (Acessibilidade) também registou erros — sobretudo a falta de feedback visual ao activar o Alto Contraste e a interação com a TabBar a 200 %.

---

## 3.7.5 — Síntese cruzada e problemas detectados

A combinação das três técnicas identificou **20 problemas distintos** no UTAD Maps. A Tabela 20 apresenta os problemas com convergência em pelo menos duas das três técnicas, indicando os mais bem fundamentados.

### Tabela 20 — Problemas identificados por mais do que uma técnica

| ID   | Problema                                                                 | AH | SH | UT |    Severidade    |
| ---- | ------------------------------------------------------------------------ | :-: | :-: | :-: | :---------------: |
| P-01 | Horário académico permanece visível após "Terminar sessão"          | ✓ | ✓ | — | 4 (Catastrófico) |
| P-02 | Botão "Iniciar sessão" no Perfil não responde após*logout* prévio | ✓ | — | ✓ |     3 (Maior)     |
| P-03 | "Terminar sessão" sem diálogo de confirmação                         | ✓ | ✓ | — |     3 (Maior)     |
| P-04 | Falta de feedback informativo em acções de Definições                | ✓ | ✓ | ✓ |     2 (Menor)     |
| P-10 | Pesquisa de salas pode demorar 2–3 s sem indicador                      | ✓ | — | ✓ |     2 (Menor)     |
| P-13 | Recálculo de rota durante navegação sem aviso visual                  | ✓ | ✓ | — |     2 (Menor)     |

O problema **P-04** foi o único identificado pelas três técnicas em simultâneo, o que o torna o problema **mais robustamente fundamentado** desta avaliação. Os problemas **P-01, P-02 e P-03** convergem em duas técnicas e dizem respeito a comportamentos da gestão de sessão (logout, perfil, persistência de dados) que constituem a área **mais crítica** a corrigir.

Cinco dos 20 problemas cruzam com *bugs* e *gaps* documentados na Fase 2 (`BUGS_DETETADOS.md`), nomeadamente os *bugs* B-01 (botão "Iniciar sessão"), B-02 (persistência do horário), e os *gaps* G-01 a G-05. A revalidação destes itens por três técnicas independentes reforça a urgência da sua correção.

---

## 3.7.6 — Plano de melhorias propostas

Com base nos 20 problemas identificados, propõe-se um plano de **20 melhorias** organizadas em três *sprints* sequenciais e classificadas numa matriz de **Impacto × Esforço**. O **Quadrante I** (Impacto Alto × Esforço Baixo) reúne **oito melhorias** consideradas de prioridade máxima e estimadamente concluíveis em **um dia de trabalho**, resolvendo todos os problemas catastróficos e maiores. A Tabela 21 resume estas oito melhorias.

### Tabela 21 — Melhorias de prioridade máxima (Sprint 1)

| #    | Melhoria                                                                                     | Resolve            | Esforço |
| ---- | -------------------------------------------------------------------------------------------- | ------------------ | -------- |
| M-01 | Limpar `AsyncStorage` no logout (chaves do horário, favoritos, próxima aula, histórico) | P-01 catastrófico | Trivial  |
| M-02 | Diálogo de confirmação antes de "Terminar sessão"                                        | P-03 maior         | Trivial  |
| M-03 | Corrigir o*handler* do botão "Iniciar sessão" no Perfil                                  | P-02 maior         | Pequeno  |
| M-04 | `hitSlop` de 10 px no botão de favoritar na pesquisa                                      | P-07 menor         | Trivial  |
| M-05 | `accessibilityState={{ selected }}` em chips e *pills* de selecção                     | P-15 cosmético    | Pequeno  |
| M-06 | *Toast* de confirmação em alterações de Definições                                   | P-04 menor         | Pequeno  |
| M-07 | `accessibilityLiveRegion="polite"` na barra de navegação outdoor                         | P-13 menor         | Pequeno  |
| M-08 | `ActivityIndicator` durante a pesquisa de salas no backend                                 | P-10 menor         | Trivial  |

Os restantes 12 problemas são abordados num Sprint 2 (melhorias de fluxo, 2 dias) e num Sprint 3 (polimento, 1 dia) detalhados em `MELHORIAS_PROPOSTAS.md`.

A implementação do Sprint 1 eleva a estimativa da taxa de sucesso nos *user tests* de **92 % para 97–98 %**, elimina o problema de privacidade catastrófico (P-01), e cumpre integralmente as regras 3, 4 e 5 de Shneiderman, deixando a aplicação pronta para uso em produção pela comunidade académica da UTAD.

---

## 3.7.7 — Limitações da avaliação

A presente avaliação apresenta três limitações metodológicas que se documentam explicitamente para garantir a transparência e o rigor do estudo:

1. **Amostra dos *user tests***: os cinco participantes são os elementos da equipa de desenvolvimento, situação que enviesa os resultados absolutos por familiaridade prévia com o produto. Os resultados de tempo e taxa de sucesso devem ser interpretados como **estimativas optimistas** comparativamente a utilizadores externos. Esta limitação é consequência do constrangimento temporal de execução da Fase 3 (20 a 22 de maio).
2. **Número de peritos heurísticos**: foram convidados três peritos, no limite inferior da recomendação de Nielsen (3 a 5). O acréscimo de mais peritos permitiria identificar problemas adicionais menores não capturados.
3. **Cobertura temporal**: a avaliação foi conduzida em dois dias úteis, sem possibilidade de iterar correcções entre rondas de avaliação. Numa iteração subsequente do produto, recomenda-se repetir as três técnicas após implementação das melhorias do Sprint 1 para verificar empiricamente os ganhos previstos.

Apesar destas limitações, a convergência entre três técnicas independentes, o cruzamento com os achados da Fase 2, e a identificação de **20 problemas distintos** com plano de correção priorizado fornecem uma base sólida para a próxima iteração da aplicação. As três limitações enunciadas serão abordadas em trabalho futuro com utilizadores externos não familiarizados com a aplicação e com avaliação por número maior de peritos.

---

## 3.7.8 — Conclusão da avaliação

A avaliação de usabilidade do UTAD Maps combinou as três técnicas previstas no enunciado da Fase 3 (Heurísticas de Nielsen, Regras de Ouro de Shneiderman e Testes com Utilizadores), aplicadas de forma convergente e independente. A convergência metodológica é elevada — **30 % dos problemas (6 em 20) foram identificados por mais do que uma técnica** —, validando a robustez do desenho misto adoptado.

A aplicação apresenta **bons indicadores globais de usabilidade**: 92 % de taxa de sucesso nos *user tests*, 4,4/5 de facilidade média, 4,68/5 de pontuação Likert global, e cumprimento integral de cinco das oito regras de Shneiderman. As principais áreas a melhorar concentram-se na **gestão de sessão** (logout sem confirmação, persistência indevida do horário e *bug* do botão "Iniciar sessão") e no **feedback informativo** em acções de Definições.

O plano de melhorias propõe **20 acções concretas**, das quais oito de prioridade máxima e exequibilidade trivial, suficientes para elevar significativamente a usabilidade do produto antes de uma eventual iteração subsequente. Em particular, a correção do problema P-01 (privacidade — horário persiste após logout) é a mais urgente do conjunto e pode ser resolvida com poucas linhas de código no *handler* de *logout*, eliminando o único problema catastrófico identificado em toda a avaliação.

A documentação detalhada de cada técnica, das grelhas individuais de peritos e participantes, da síntese cruzada de problemas e do plano de melhorias encontra-se nos documentos anexos da Fase 3.

---

## Nota de Revisão — Correcções pendentes antes da integração no relatório ( liane )

> **Aviso:** esta secção é uma nota de trabalho interna da equipa. **Não deve ser copiada para o relatório.** Ao transpor o texto para o Word, incluir apenas as secções 3.7.1 a 3.7.8.

Na sequência da revisão de verificação do documento `REGRAS_SHNEIDERMAN.md`, as afirmações desta avaliação foram confrontadas com o código-fonte e com a aplicação em execução (Expo Go). Essa verificação invalidou um dos problemas centrais deste texto. **O documento deve ser corrigido antes de ser integrado no relatório.**

### O problema P-03 é inválido

O problema **P-03 — "'Terminar sessão' sem diálogo de confirmação"** não corresponde à aplicação. O ecrã de Perfil (`app/(tabs)/perfil.tsx`, função `handleLogout`) **pede confirmação** ao terminar sessão — `Alert.alert` com opções *Cancelar* / *Terminar* em dispositivo móvel e `window.confirm` na versão web. O histórico Git mostra que essa confirmação existe desde o commit `084d515` (3 de maio de 2026). A discrepância foi ainda confirmada num teste prático no Expo Go. O P-03 deve, portanto, ser removido.

> O problema catastrófico **P-01** (o horário permanece visível após o logout) **mantém-se válido** — é um problema real e confirmado.

### Locais a corrigir neste documento

1. **3.7.3** — retirar "o *logout* sem confirmação e" da frase sobre os *gaps* da regra 5; o único *gap* catastrófico da regra 5 passa a ser a persistência do horário.
2. **3.7.3, Tabela 17** — regra 5: severidade do *gap* de **"3 (maior)" → "4 (catastrófico)"** (para coincidir com o `REGRAS_SHNEIDERMAN.md` já corrigido).
3. **3.7.5, Tabela 20** — eliminar a linha **P-03**.
4. **3.7.5** — "P-01, P-02 e P-03 convergem" → "P-01 e P-02 convergem".
5. **3.7.6, Tabela 21** — eliminar a melhoria **M-02**.
6. **3.7.8** — retirar "logout sem confirmação" da enumeração da gestão de sessão.

### Números a recalcular (efeito cascata)

| Está (e onde)                                                           | Passa a                                                    |
| ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| "20 problemas distintos" (3.7.5, 3.7.6, 3.7.7)                           | **19**                                               |
| "plano de 20 melhorias" e "oito melhorias de prioridade máxima" (3.7.6) | **19 melhorias** e **7 de prioridade máxima** |
| "Cinco dos 20 problemas cruzam com a Fase 2" (3.7.5)                     | "Cinco dos**19**..."                                 |
| "30 % dos problemas (6 em 20)" de convergência (3.7.8)                  | **≈ 26 % (5 em 19)**                                |
| "20 acções concretas" (3.7.8)                                          | **19**                                               |

A contagem da secção **3.7.2** ("15 problemas... dois maiores") reflecte as grelhas dos peritos e deve ser acertada de forma coerente com a decisão da equipa quanto ao `HEURISTICAS_NIELSEN.md` (ver nota final).

### Ponto adicional a verificar — P-10

O **P-10** ("pesquisa de salas sem indicador de carregamento") e a melhoria **M-08** assumem que a pesquisa não tem indicador. Na realidade, o `app/(tabs)/pesquisa.tsx` **tem** um `ActivityIndicator` ("A pesquisar..."), embora só apareça na primeira pesquisa e não ao refinar resultados já existentes. Recomenda-se rever a redacção de P-10 e M-08.

### Sobre os documentos das outras técnicas

O P-03 tem origem na grelha do perito P1 no `HEURISTICAS_NIELSEN.md`. As grelhas dos peritos e os registos das sessões de utilizadores **não devem ser reescritos** — são avaliações independentes. A discrepância deve ser assinalada nesses documentos com uma nota de revisão (à semelhança da secção 5 do `REGRAS_SHNEIDERMAN.md`), sem alterar as grelhas em si.

*Nota resultante da revisão de verificação conduzida sobre o `REGRAS_SHNEIDERMAN.md` — ver secção 5 desse documento.*
