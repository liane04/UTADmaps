# Análise Heurística de Nielsen

**Responsável**: Pedro Braz
**Data**: 20 e 21 de maio de 2026
**Aplicação avaliada**: UTAD Maps (https://utadmaps.b-host.me e build móvel via Expo Go)

---

## 1. Metodologia

A avaliação heurística é uma técnica de inspeção de interface conduzida por peritos, em que cada avaliador percorre o sistema procurando incumprimentos das **10 heurísticas de usabilidade de Jakob Nielsen**. Para cada problema identificado é atribuído um nível de severidade na escala 0–4 proposta pelo próprio Nielsen:

| Valor | Nível | Descrição |
|---|---|---|
| **0** | Sem problema | Não existe problema de usabilidade |
| **1** | Problema cosmético | Pequeno problema visual ou estético; correção opcional |
| **2** | Problema menor | Problema com baixo impacto na utilização |
| **3** | Problema maior | Problema importante; deve ser corrigido com prioridade |
| **4** | Catástrofe de usabilidade | Problema crítico que impede ou compromete seriamente a utilização |

Foram convidados **três peritos externos à equipa de desenvolvimento**, conforme indicação da grelha do professor:

| # | Perito | Formação | Data da avaliação |
|---|---|---|---|
| **P1** | Maria Costa | 3.º ano Eng. Informática, UTAD | 20 maio 2026 |
| **P2** | João Pereira | Mestrado Design Multimédia, UTAD | 20 maio 2026 |
| **P3** | Ana Marques | Licenciada Eng. Informática (UTAD) · UX designer freelancer | 21 maio 2026 |

Cada perito realizou a avaliação **individualmente** durante aproximadamente 45 minutos, percorrendo todos os ecrãs principais do UTAD Maps no telemóvel via Expo Go e na versão web.

---

## 2. Grelha do Perito P1 — Maria Costa

> **Foco da avaliação**: aspectos técnicos (consistência, prevenção de erros, padrões de interação).

| Nº | Heurística | Critério de Avaliação | Problemas Identificados | Severidade | Observações / Recomendações |
|---|---|---|---|:---:|---|
| 1 | Visibilidade do estado do sistema | O sistema fornece feedback claro e imediato? | Pesquisa de salas pode demorar 2–3 s sem indicador de carregamento visível | **2** | Adicionar *spinner* ou animação durante o fetch ao backend |
| 2 | Correspondência entre o sistema e o mundo real | A linguagem e os conceitos são familiares? | Sem problemas relevantes detectados | **0** | Os termos usados (Mapa, Pesquisa, Horário) são imediatos |
| 3 | Controlo e liberdade do utilizador | Existem opções de cancelar, voltar atrás ou desfazer? | Botão "Iniciar sessão" no Perfil deixa de responder após um logout prévio (bug confirmado) | **3** | Necessária correção urgente — utilizador fica preso no modo convidado sem ação |
| 4 | Consistência e padrões | A interface mantém convenções consistentes? | Sem problemas relevantes detectados | **0** | Boa coerência entre cards, ícones e estados |
| 5 | Prevenção de erros | O sistema evita erros antes que ocorram? | Sem problemas relevantes detectados | **0** | — |
| 6 | Reconhecimento em vez de memorização | Os elementos e opções estão visíveis e reconhecíveis? | Sem problemas relevantes detectados | **0** | Filtros visíveis em pílulas, ícones recordáveis |
| 7 | Flexibilidade e eficiência de uso | Existem atalhos ou formas eficientes para utilizadores experientes? | Sem problemas relevantes detectados | **0** | Histórico de pesquisas e favoritos funcionam como atalhos |
| 8 | Design estético e minimalista | A interface evita informação desnecessária? | Sem problemas relevantes detectados | **0** | Cartões com informação focada |
| 9 | Ajudar utilizadores a reconhecer e recuperar de erros | As mensagens de erro são claras e úteis? | Quando o serviço OSRM falha o cálculo da rota, a mensagem é genérica ("Servidor de rotas não respondeu") sem indicação do que o utilizador pode fazer | **2** | Sugerir alternativas (tentar de novo, mudar modo a pé/carro, ver rota directa) |
| 10 | Ajuda e documentação | Existe ajuda acessível e compreensível? | Sem problemas relevantes detectados | **0** | Existe ecrã de Suporte e Ajuda no perfil |

**Soma de severidade**: 7 · **Heurísticas com problema** (severidade ≥ 1): 3 em 10 · **Catastrófico (4)**: 0

---

## 3. Grelha do Perito P2 — João Pereira

> **Foco da avaliação**: aspectos visuais, hierarquia, feedback e estética.

| Nº | Heurística | Critério de Avaliação | Problemas Identificados | Severidade | Observações / Recomendações |
|---|---|---|---|:---:|---|
| 1 | Visibilidade do estado do sistema | O sistema fornece feedback claro e imediato? | Sem problemas relevantes detectados | **0** | — |
| 2 | Correspondência entre o sistema e o mundo real | A linguagem e os conceitos são familiares? | Sem problemas relevantes detectados | **0** | — |
| 3 | Controlo e liberdade do utilizador | Existem opções de cancelar, voltar atrás ou desfazer? | Sem problemas relevantes detectados | **0** | Botão "Voltar" presente em todos os ecrãs secundários |
| 4 | Consistência e padrões | A interface mantém convenções consistentes? | Pequena inconsistência: alguns cards usam raio de cantos de 12 px e outros de 16 px | **1** | Uniformizar o raio em todos os cards do sistema de design |
| 5 | Prevenção de erros | O sistema evita erros antes que ocorram? | Sem problemas relevantes detectados | **0** | — |
| 6 | Reconhecimento em vez de memorização | Os elementos e opções estão visíveis e reconhecíveis? | Os marcadores no mapa usam várias cores e formas sem legenda explícita visível | **2** | Adicionar uma legenda recolhível no canto inferior esquerdo |
| 7 | Flexibilidade e eficiência de uso | Existem atalhos ou formas eficientes para utilizadores experientes? | Sem problemas relevantes detectados | **0** | — |
| 8 | Design estético e minimalista | A interface evita informação desnecessária? | No mapa principal os 25 markers de edifícios podem sobrepor-se visualmente com zoom inicial baixo | **1** | Implementar *clustering* de markers para zooms inferiores |
| 9 | Ajudar utilizadores a reconhecer e recuperar de erros | As mensagens de erro são claras e úteis? | Sem problemas relevantes detectados | **0** | — |
| 10 | Ajuda e documentação | Existe ajuda acessível e compreensível? | A secção Suporte e Ajuda contém apenas seis FAQs gerais. Faltam *tooltips* contextuais nas Definições de Acessibilidade | **1** | Adicionar microtexto explicativo junto a "Rotas Acessíveis" e "Leitor de Ecrã" |

**Soma de severidade**: 5 · **Heurísticas com problema** (severidade ≥ 1): 4 em 10 · **Catastrófico (4)**: 0

---

## 4. Grelha do Perito P3 — Ana Marques

> **Foco da avaliação**: aspectos cognitivos, fluxos, carga mental e reconhecimento.

| Nº | Heurística | Critério de Avaliação | Problemas Identificados | Severidade | Observações / Recomendações |
|---|---|---|---|:---:|---|
| 1 | Visibilidade do estado do sistema | O sistema fornece feedback claro e imediato? | Durante a navegação outdoor, quando a rota é recalculada por desvio do utilizador, não há indicação explícita de "Rota recalculada" | **2** | Adicionar uma notificação flutuante temporária |
| 2 | Correspondência entre o sistema e o mundo real | A linguagem e os conceitos são familiares? | Os códigos de edifícios (ECT-Polo I, ECVA-Polo II) podem ser pouco intuitivos para um utilizador novo, especialmente Erasmus | **2** | Acompanhar os códigos com o nome descritivo entre parênteses na listagem |
| 3 | Controlo e liberdade do utilizador | Existem opções de cancelar, voltar atrás ou desfazer? | Sem problemas relevantes detectados | **0** | — |
| 4 | Consistência e padrões | A interface mantém convenções consistentes? | Sem problemas relevantes detectados | **0** | — |
| 5 | Prevenção de erros | O sistema evita erros antes que ocorram? | Após "Terminar sessão", o horário académico do utilizador anterior permanece visível na tab Horário (preocupação de privacidade) | **4** | Catastrófico em contexto multi-utilizador (telemóvel partilhado). Limpar storage no logout |
| 6 | Reconhecimento em vez de memorização | Os elementos e opções estão visíveis e reconhecíveis? | Sem problemas relevantes detectados | **0** | — |
| 7 | Flexibilidade e eficiência de uso | Existem atalhos ou formas eficientes para utilizadores experientes? | Não há atalho directo no ecrã principal para "navegar para a próxima aula" — exige passar pelo Perfil ou pelo Horário | **2** | Adicionar um cartão "Próxima aula" colapsável no topo do Mapa quando o utilizador tem horário importado |
| 8 | Design estético e minimalista | A interface evita informação desnecessária? | Sem problemas relevantes detectados | **0** | — |
| 9 | Ajudar utilizadores a reconhecer e recuperar de erros | As mensagens de erro são claras e úteis? | A mensagem que aparece quando o utilizador está a >30 km do campus ("Estás a 40 km do destino. Aproxima-te do campus") é correcta mas pouco amigável | **2** | Reformular para um tom mais empático e sugerir "ver mapa do campus sem rota" |
| 10 | Ajuda e documentação | Existe ajuda acessível e compreensível? | O tutorial de onboarding tem apenas 3 slides curtos. Para utilizadores Erasmus sem familiaridade com a UTAD, podia ser mais informativo | **2** | Acrescentar um quarto slide com glossário ECT, ECVA, ECHS |

**Soma de severidade**: 14 · **Heurísticas com problema** (severidade ≥ 1): 6 em 10 · **Catastrófico (4)**: 1 (H5)

---

## 5. Compilação dos resultados

A Tabela seguinte cruza as três grelhas e calcula a média de severidade por heurística.

### Tabela compilada — Severidade por heurística e perito

| Nº | Heurística | P1 (Maria) | P2 (João) | P3 (Ana) | **Média** | **Máxima** |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 1 | Visibilidade do estado do sistema | 2 | 0 | 2 | **1,33** | 2 |
| 2 | Correspondência com o mundo real | 0 | 0 | 2 | **0,67** | 2 |
| 3 | Controlo e liberdade do utilizador | 3 | 0 | 0 | **1,00** | 3 |
| 4 | Consistência e padrões | 0 | 1 | 0 | **0,33** | 1 |
| 5 | Prevenção de erros | 0 | 0 | 4 | **1,33** | **4** |
| 6 | Reconhecimento em vez de memorização | 0 | 2 | 0 | **0,67** | 2 |
| 7 | Flexibilidade e eficiência | 0 | 0 | 2 | **0,67** | 2 |
| 8 | Design estético e minimalista | 0 | 1 | 0 | **0,33** | 1 |
| 9 | Ajudar a reconhecer e recuperar erros | 2 | 0 | 2 | **1,33** | 2 |
| 10 | Ajuda e documentação | 0 | 1 | 2 | **1,00** | 2 |
| | **Soma** | **7** | **5** | **14** | **8,67** | — |

### Heurísticas ordenadas por gravidade (média decrescente)

1. **H5 — Prevenção de erros** (média 1,33) — continua a ser uma das mais críticas, com **catástrofe** de usabilidade em P3 (horário académico persiste em cache local após logout, com implicações sérias de privacidade) e severidade máxima de 4.
2. **H1 — Visibilidade do estado** (média 1,33) — lacunas em feedback de carregamento da pesquisa (P1) e recálculo de rota (P3).
3. **H9 — Ajudar a reconhecer e recuperar erros** (média 1,33) — mensagens de erro genéricas quando o serviço OSRM falha (P1) ou quando a distância ao campus é elevada (P3).
4. **H3 — Controlo e liberdade** (média 1,00) — bug maior do botão "Iniciar sessão" no Perfil após logout (P1).
5. **H10 — Ajuda e documentação** (média 1,00) — onboarding curto para utilizadores estrangeiros (P3) e falta de tooltips nas Definições (P2).
6. **H2 — Correspondência com o mundo real** (média 0,67) — códigos de edifícios pouco intuitivos (P3).
7. **H6 — Reconhecimento** (média 0,67) — marcadores do mapa sem legenda visível (P2).
8. **H7 — Flexibilidade e eficiência** (média 0,67) — falta atalho "próxima aula" no ecrã principal (P3).
9. **H4 — Consistência** (média 0,33) — inconsistência menor de cantos arredondados de cards (P2).
10. **H8 — Estética e minimalismo** (média 0,33) — sobreposição visual de marcadores de edifícios (P2).

### Distribuição global da severidade

| Categoria | N.º de problemas |
|---|---:|
| Catastróficos (sev 4) | **1** |
| Maiores (sev 3) | **1** |
| Menores (sev 2) | **8** |
| Cosméticos (sev 1) | **3** |
| **Total de problemas identificados** | **13** |

> Em termos de Nielsen (1994), apenas problemas de severidade ≥ 2 são prioritários para correcção. **10 problemas** entram nessa categoria no conjunto das grelhas dos peritos.

---

## 6. Conclusões da avaliação heurística

A análise heurística por três peritos independentes identificou **13 problemas** reais de usabilidade ao longo das 10 heurísticas de Nielsen, dos quais **um catastrófico**, **um maior**, **oito menores** e **três cosméticos** (excluindo os relatos identificados e validados como falsos positivos). Nenhuma heurística apresenta problemas em todas as três avaliações independentes, mas **cinco heurísticas** (H1, H5, H9, H3 e H10) registam problemas de severidade significativa (≥ 2) em pelo menos um perito, sendo as áreas de intervenção prioritárias.

O **problema mais grave** detectado é a persistência do horário académico após o utilizador terminar sessão (H5, sev 4 em P3), com implicações imediatas de privacidade que afectam o **critério WCAG 3.3.4 Error Prevention** documentado na Fase 2 e que se cruza com o **bug B-02** previamente identificado.

O segundo problema mais grave é o **bug B-01**, em que o botão "Iniciar sessão" no ecrã de Perfil deixa de responder após um *logout* prévio, situação que prende o utilizador em modo convidado e exige reiniciar a aplicação (H3, sev 3 em P1).

Os restantes problemas correspondem maioritariamente a melhorias de feedback (H1), mensagens de erro mais informativas (H9) e enriquecimento do onboarding e da documentação contextual (H10). A análise é compatível com os achados das ferramentas automáticas e da análise manual da Fase 2, reforçando a robustez do conjunto da avaliação.

A síntese cruzada destes problemas com os identificados pelas restantes técnicas (Shneiderman e User Tests) está documentada em `PROBLEMAS_DETECTADOS.md`, e as propostas de melhoria em `MELHORIAS_PROPOSTAS.md`.

---

## 7. Notas de Revisão e Correções (Pedro Braz)

Durante a revisão deste documento, foram identificadas e corrigidas as seguintes inconsistências aritméticas que constavam no rascunho inicial:

1. **Correção de problemas de severidade 2 (menores)**: O rascunho indicava a existência de 7 problemas de severidade 2, mas a contagem direta nas tabelas dos peritos P1, P2 e P3 revelou 8 problemas menores.
2. **Correção da soma total**: Com a contagem correta dos problemas menores, o total de problemas reais identificados na avaliação heurística foi atualizado para **13 problemas** (após a remoção dos falsos positivos).
3. **Correção dos problemas prioritários**: O número de problemas com severidade $\ge$ 2 (prioritários para correção) foi atualizado para **10 problemas**.
4. **Ajuste na Tabela Compilada (Soma/Média)**: Na tabela do capítulo 5, na linha "Soma", o valor total foi corrigido para **`8,67`**, que é a média correta da soma das severidades reais dividida pelos 3 peritos ($26 / 3 = 8,67$).
5. **Identificação de Falsos Positivos nos Relatos**: Após validação técnica no código-fonte e testes práticos efetuados pelo utilizador, confirmou-se que três dos pontos relatados são falsos positivos (ou já se encontram devidamente implementados no build atual):
   - **P1.5 (Confirmação ao terminar sessão)**: O perito indicou que a ação de logout não pedia confirmação. Contudo, o ficheiro [perfil.tsx](file:///c:/Users/Utilizador/source/repos/UTADmaps/app/(tabs)/perfil.tsx#L180-L196) já inclui diálogos nativos de confirmação (`window.confirm` na web e `Alert.alert` no mobile). O problema real desta heurística mantém-se exclusivamente na persistência do horário em cache local (que é reportado em P3).
   - **P2.1 (Acessibilidade nas pílulas de tamanho de texto)**: O perito reportou que as pílulas de tamanho de texto não indicavam o estado selecionado aos leitores de ecrã. No entanto, o ficheiro [definicoes.tsx](file:///c:/Users/Utilizador/source/repos/UTADmaps/app/definicoes.tsx#L73-L80) já possui `accessibilityState={{ selected: ativo }}` nas pílulas. O problema real de acessibilidade limita-se aos chips de filtro de categoria de pesquisa e seleção de idioma.
   - **P-16 / T8 (Desalinhamento da posição de partida no Piso 1 do Sector E em Android)**: O relatório de usabilidade mencionava que, em dispositivos Android, a câmara e o ponto de partida inicial da rota (seta) eram renderizados fora das paredes do edifício num fundo vazio. Em testes diretos efetuados no telemóvel Android do utilizador, este erro **não se verifica**: a planta carrega no enquadramento correto e a rota (seta) parte de forma precisa a partir das escadas (o ponto físico de entrada correto do piso) até à sala selecionada, sem necessidade de reposicionamento manual.
6. **Esclarecimento sobre Erros no QR Code (Android / Expo Go)**: Alguns testes e de tentativas de emparelhamento por QR Code no Android resultaram em erros de ligação (ex.: "Something went wrong" ou timeouts de rede). Esclarece-se que este **não é um bug ou erro do código da aplicação** (sendo assim um "erro falso"). Trata-se de uma limitação comum de infraestrutura decorrente do isolamento de pontos de acesso (AP Isolation) ativo em redes universitárias/institucionais (como a rede `eduroam` na UTAD), que bloqueia a comunicação direta de rede local (LAN) entre o computador que executa o servidor Expo e o telemóvel Android. Para contornar esta questão e testar com sucesso, deve iniciar-se a aplicação em modo de túnel através do comando:
   ```bash
   npx expo start --tunnel
   ```
   Esta flag cria uma ligação segura redirecionada (via ngrok), permitindo que o dispositivo móvel descarregue o bundle da aplicação independentemente do isolamento de rede local.

Estas correções foram também refletidas de forma idêntica na secção correspondente do relatório geral (`AVALIACAO_USABILIDADE.md`).
