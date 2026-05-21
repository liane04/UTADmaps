# Avaliação pelas Regras de Ouro de Shneiderman

**Responsável**: Liane Duarte
**Data**: 21 de maio de 2026
**Aplicação avaliada**: UTAD Maps v1.0

---

## 1. Enquadramento

Ben Shneiderman propõe um conjunto de **oito regras de ouro de design de interfaces** publicadas no clássico *Designing the User Interface* e disponibilizadas online em <https://www.cs.umd.edu/users/ben/goldenrules.html>. Estas regras complementam as heurísticas de Nielsen com uma abordagem mais focada na coerência do sistema, na previsibilidade da interação e na capacidade do utilizador manter o controlo do diálogo com a aplicação.

A presente avaliação aplica as oito regras ao UTAD Maps. A análise inicial tomou como referência o estado consolidado no final da Fase 2; foi posteriormente verificada contra o *build* actual da aplicação, conforme descrito na secção 5. O objectivo é identificar pontos de conformidade e oportunidades de melhoria que possam não ter sido capturados pelas heurísticas de Nielsen ou pelos testes com utilizadores.

---

## 2. As 8 regras

Para cada regra é apresentado: (i) o critério da regra; (ii) o estado da conformidade no UTAD Maps; (iii) evidência concreta; (iv) recomendação, se aplicável.

### Tabela síntese

| Nº | Regra | Estado | Severidade dos *gaps* |
|:---:|---|:---:|:---:|
| 1 | Esforçar-se pela consistência | ✅ Conforme | — |
| 2 | Procurar a usabilidade universal | ✅ Conforme | — |
| 3 | Dar feedback informativo | ⚠️ Parcialmente conforme | 2 (menor) |
| 4 | Projectar diálogos que indiquem o fim de uma acção | ⚠️ Parcialmente conforme | 2 (menor) |
| 5 | Prevenir erros | ⚠️ Parcialmente conforme | 4 (catastrófico) |
| 6 | Permitir a fácil reversão de acções | ✅ Conforme | — |
| 7 | Manter os utilizadores no controlo | ✅ Conforme | — |
| 8 | Reduzir a carga de memória de curta duração | ✅ Conforme | — |

**Síntese**: 5 das 8 regras são integralmente cumpridas e 3 são **parcialmente** cumpridas, com dois *gaps* menores (regras 3 e 4) e um *gap* catastrófico (regra 5) documentados.

---

## 3. Análise detalhada

### Regra 1 — Esforçar-se pela consistência ✅

**Critério**: a interface deve usar terminologia, ícones, cores, comportamentos e fluxos consistentes em todas as situações análogas.

**Estado no UTAD Maps**: integralmente cumprida. A aplicação utiliza um sistema de design centralizado em `contexts/SettingsContext.tsx` com paletas para modo claro, escuro, alto contraste claro e alto contraste escuro. Os ícones Ionicons são usados de forma coerente (mapa para o separador Mapa, lupa para pesquisa, relógio para horário, coração para favoritos, pessoa para perfil). A barra de navegação inferior mantém os mesmos cinco itens em todos os ecrãs principais. Os cartões de resultado seguem a mesma estrutura visual em pesquisa, favoritos e histórico.

**Evidência**: tradução bilingue PT/EN centralizada em `LanguageContext.tsx` (dicionário de 52 chaves, complementado por chamadas `tr()` inline ao longo da aplicação), quatro paletas de cor unificadas (claro, escuro e os respectivos modos de alto contraste), biblioteca única de ícones, componentes reutilizados (Modal, TouchableOpacity com `accessibilityRole` consistente).

### Regra 2 — Procurar a usabilidade universal ✅

**Critério**: reconhecer as necessidades de utilizadores diversos (novatos, peritos, estrangeiros, com deficiência) e adaptar o conteúdo facilitando a transformação.

**Estado no UTAD Maps**: integralmente cumprida. A aplicação foi explicitamente concebida para servir vários perfis:

- **Estudantes novos**: tutorial de onboarding de três slides e modo convidado para exploração sem login; a selecção de idioma PT/EN está disponível no ecrã de início de sessão
- **Estudantes Erasmus**: interface bilingue PT/EN em toda a aplicação
- **Estudantes peritos**: histórico de pesquisas e favoritos como atalhos
- **Utilizadores com deficiência visual**: cinco níveis de tamanho de texto (até 200 %), modo Alto Contraste com rácio 21:1, compatibilidade com VoiceOver e TalkBack
- **Utilizadores com mobilidade reduzida**: opção "Rotas Acessíveis" nas Definições — o algoritmo de navegação indoor suporta evitar escadas, embora a ligação do toggle ao cálculo de rota esteja ainda por concluir

**Evidência**: documentada exaustivamente na secção 3.6 do relatório (Fase 2) com conformidade WCAG 2.2 nível AA em 29 de 34 critérios aplicáveis (85 %).

### Regra 3 — Dar feedback informativo ⚠️

**Critério**: para cada acção do utilizador, deve existir resposta do sistema. Para acções frequentes e menores a resposta pode ser modesta; para acções importantes a resposta deve ser mais substancial.

**Estado no UTAD Maps**: parcialmente cumprida. A aplicação oferece feedback em vários pontos (botões com `activeOpacity`, *spinners* de loading na pesquisa, mensagens de Alert em operações como login e importação de horário), mas faltam pontos importantes:

**Gap 1** — quando o utilizador activa o **modo Alto Contraste** ou altera o **tamanho do texto**, a aplicação aplica imediatamente a alteração mas não exibe uma confirmação textual nem uma animação que sublinhe a transição. Para utilizador com baixa visão é importante saber que "a definição foi guardada".

**Gap 2** — quando a **rota é recalculada** durante a navegação outdoor por desvio do utilizador, não há notificação. O utilizador vê a linha mudar mas pode não perceber porquê.

**Severidade**: 2 (menor) · **Recomendação**: adicionar pequenos *toasts* informativos nas duas situações.

### Regra 4 — Projectar diálogos que indiquem o fim de uma acção ⚠️

**Critério**: as sequências de acções devem ter início, meio e fim claros, com mensagem de conclusão informativa.

**Estado no UTAD Maps**: parcialmente cumprida. A maioria das acções tem fim claro (botão Voltar nos ecrãs secundários, retorno automático ao mapa após terminar navegação), mas existem dois pontos em que a conclusão da acção não é suficientemente clara:

**Gap 1** — a importação do horário, quando bem-sucedida, fecha o modal **sem qualquer mensagem de conclusão**. O utilizador deduz que correu bem porque o horário aparece preenchido, mas falta uma confirmação explícita (só existe mensagem em caso de erro).

**Gap 2** — na navegação outdoor, a chegada ao destino é sinalizada **apenas pela instrução "Chegou ao destino"** apresentada no mesmo cartão de navegação que as restantes indicações do percurso. Falta um aviso destacado de chegada — *pop-up*, som ou vibração — que torne o fim do percurso inequívoco, sobretudo para quem não esteja a olhar para o ecrã.

**Severidade**: 2 (menor) · **Recomendação**: exibir uma mensagem de conclusão após a importação do horário; e destacar a chegada ao destino com um aviso dedicado (*pop-up*, som ou vibração) em vez de apenas alterar a instrução no cabeçalho — quando o destino tem interior, esse aviso pode encaminhar o utilizador para o botão "Entrar no edifício" já existente.

### Regra 5 — Prevenir erros ⚠️

**Critério**: o design deve, sempre que possível, prevenir o utilizador de cometer erros graves. Se um erro acontecer, deve oferecer recuperação simples.

**Estado no UTAD Maps**: parcialmente cumprida. A aplicação tem várias salvaguardas: campos de email com `keyboardType="email-address"`, *autoComplete* e *placeholders* explícitos; e um **diálogo de confirmação antes de "Terminar sessão"** (`Alert.alert` com opções *Cancelar* / *Terminar* em dispositivo móvel e `window.confirm` na versão web). Existe, contudo, **um problema grave** que se enquadra nesta regra:

**Problema** (severidade 4 — catastrófico em contexto multi-utilizador) — após "Terminar sessão", **o horário académico do utilizador anterior permanece visível** na tab Horário. O horário é guardado no `AsyncStorage` sob a chave `utadmaps_schedule_v2` (gravada em `app/(tabs)/horario.tsx`); a função `logout()` (em `store/useAppStore.ts`) limpa o utilizador, o *token* e os favoritos, mas **nunca remove essa chave**. Em telemóvel partilhado (laboratórios, biblioteca) o utilizador seguinte vê informação privada do anterior — e o próprio botão de logout chega a anunciar, na sua dica de acessibilidade, que "remove o horário sincronizado", comportamento que o código não cumpre. Identificado como bug **B-02** na Fase 2 e como problema crítico em P3 (Ana Marques) na avaliação heurística.

**Severidade do *gap***: 4 (catastrófico) · **Recomendação**: remover a chave `utadmaps_schedule_v2` do `AsyncStorage` ao terminar sessão — acrescentando essa limpeza à função `logout()` (`store/useAppStore.ts`) ou ao `handleLogout` (`app/(tabs)/perfil.tsx`).

### Regra 6 — Permitir a fácil reversão de acções ✅

**Critério**: as acções devem ser reversíveis sempre que possível, reduzindo a ansiedade do utilizador e encorajando a exploração.

**Estado no UTAD Maps**: cumprida. As principais operações são reversíveis:

- **Favoritar/desfavoritar** é instantâneo e reversível com um toque
- **Iniciar navegação** pode ser cancelado com botão "Terminar"
- **Importar horário** sobrescreve o anterior (operação idempotente)
- **Alterar idioma, tema ou tamanho de texto** é reversível com um toque
- **Modais** podem ser fechados sem confirmar — o de importação de horário com botão "Cancelar" explícito, o selector de ponto de partida tocando fora da área

A única operação não trivialmente reversível é o **logout**, mas esse é o comportamento esperado (não se "desfaz" um logout, faz-se novo login).

### Regra 7 — Manter os utilizadores no controlo ✅

**Critério**: utilizadores experientes desejam ser os iniciadores das acções e não os receptores; o sistema deve responder ao utilizador, não o contrário.

**Estado no UTAD Maps**: cumprida. A aplicação evita comportamentos invasivos:

- **Sem notificações push** — a aplicação não envia notificações não solicitadas
- **Sem redirecionamentos automáticos** entre ecrãs (excepto após login bem-sucedido, que é esperado)
- **Sem animações longas obrigatórias** — o utilizador pode tocar para acelerar transições
- **Onboarding saltável** — botão "Saltar" (ou "Saltar tutorial") presente em todos os três *slides*
- **Modo convidado** disponível sem autenticação, através do botão "Saltar e explorar" no ecrã de início de sessão
- **Mapa não invasivo** — o mapa principal não persegue continuamente a posição GPS; mostra uma vista estável controlada pelo utilizador. Na navegação outdoor existe um botão de recentrar manual

### Regra 8 — Reduzir a carga de memória de curta duração ✅

**Critério**: a interface deve manter elementos visíveis e permitir reconhecer em vez de recordar.

**Estado no UTAD Maps**: cumprida. A aplicação aplica este princípio em vários pontos:

- **Pesquisas recentes** no ecrã de Pesquisa — lista de atalhos para locais comuns (Biblioteca, ECT, Reitoria, Cantina) que evita reescrever pesquisas frequentes
- **Favoritos persistentes** acessíveis numa tab dedicada
- **Filtros visíveis em todo o momento** (chips Todos/Edifícios/Salas/Serviços)
- **Próxima aula visível no Perfil** sem necessidade de o utilizador recordar o horário
- **Tab-bar inferior persistente** elimina necessidade de memorizar como voltar
- **Texto descritivo nos toggles** (e.g. "Evitar escadas" abaixo de "Rotas Acessíveis", "Cores preto/branco para máxima legibilidade" abaixo de "Alto Contraste")

---

## 4. Conclusões

A aplicação UTAD Maps cumpre **5 das 8 regras de ouro de Shneiderman integralmente** e as **3 restantes parcialmente**, com dois *gaps* menores (regras 3 e 4) relacionados com feedback informativo e indicação de fim de acção, e um *gap* catastrófico (regra 5 — prevenção de erros) que coincide directamente com o bug **B-02** (persistência do horário após logout) identificado na Fase 2 e confirmado pelos peritos heurísticos.

A regra mais problemática é portanto a **regra 5 (Prevenir erros)**, com um problema concreto a corrigir antes de qualquer iteração subsequente do produto: a persistência indevida do horário académico no `AsyncStorage` após terminar sessão.

As recomendações desta análise são consolidadas em `MELHORIAS_PROPOSTAS.md`, juntamente com os achados das restantes duas técnicas (Nielsen e User Tests).

---

## 5. Nota de Revisão — Verificação contra a Implementação (Liane Duarte)

Concluída a redacção das secções 1 a 4, a responsável por este documento realizou uma **revisão de verificação** em dois passos: (i) confronto de cada afirmação do documento com o **código-fonte** da aplicação (ficheiros em `contexts/`, `store/` e `app/`); e (ii) **teste prático da aplicação em execução**, num *build* aberto no Expo Go, exercendo directamente as funcionalidades descritas.

Esta verificação detectou que a análise inicial — redigida sem confronto directo com o *build* actual — continha afirmações que não correspondiam ao produto real. **As correcções resultantes foram aplicadas às secções 2 a 4 deste documento**; a presente secção 5 regista o que foi verificado e o que foi alterado.

### 5.1 Correcções aplicadas — discrepâncias relevantes

**D1 — Regra 5: o logout pede confirmação.**
A versão inicial descrevia, como "Problema 1" da Regra 5 (severidade 3), que "Terminar sessão" não pedia confirmação. O ficheiro `app/(tabs)/perfil.tsx` (função `handleLogout`) mostra o contrário: existe um diálogo de confirmação — `Alert.alert` com opções *Cancelar* / *Terminar* em dispositivo móvel e `window.confirm` na versão web. O histórico Git confirma que foi introduzido no commit `084d515` (3 de maio de 2026), em data anterior à Fase 2. **Correcção aplicada:** o "Problema 1" foi removido da Regra 5 e a confirmação de logout passou a constar como salvaguarda existente. A Regra 5 mantém-se "Parcialmente conforme", agora com um único *gap* (o Problema).

**D2 — Regra 5: não existe *swipe-to-remove* com confirmação nos favoritos.**
A versão inicial citava um "modal de confirmação para acções destrutivas em favoritos via *swipe-to-remove*". O ficheiro `app/(tabs)/favoritos.tsx` mostra que a remoção é feita com um único toque no ícone ♡, de forma imediata, sem gesto de *swipe* e sem modal. **Correcção aplicada:** esta evidência foi removida da Regra 5.

**D3 — Regra 4: não existe mensagem "Importação concluída".**
A versão inicial citava essa mensagem como prova de sinalização de fim de acção. O ficheiro `app/(tabs)/horario.tsx` mostra que uma importação bem-sucedida fecha o modal sem qualquer mensagem (só existe mensagem em caso de erro). **Correcção aplicada:** a Regra 4 passou a registar a ausência dessa mensagem como um *gap* adicional (Gap 1), o que reforça — em vez de enfraquecer — o veredicto de conformidade parcial.

**D4 — Regra 2: o selector de idioma não está no onboarding.**
A versão inicial referia "onboarding com selecção de idioma". O onboarding (`app/onboarding.tsx`) tem três slides informativos sem selector de idioma; a selecção PT/EN está no ecrã de início de sessão (`app/index.tsx`). **Correcção aplicada:** a Regra 2 passou a localizar correctamente a funcionalidade. O veredicto (conforme) não se altera.

### 5.2 Correcções aplicadas — imprecisões factuais menores

| Ref. | Afirmação inicial | Correcção aplicada |
|---|---|---|
| I1 | "125 chaves de tradução em `LanguageContext.tsx`" | O ficheiro define 52 chaves; as restantes traduções usam chamadas `tr()` inline. O número foi substituído por uma descrição correcta nas Regras 1 e 2. |
| I2 | "paleta unificada com cinco temas" | São 4 paletas (claro, escuro e os respectivos modos de alto contraste). Corrigido na Evidência da Regra 1. |
| I3 | "a casa para mapa" | O separador Mapa usa um ícone de mapa. Corrigido na Regra 1. |
| I4 | "Modal de origem tem botão 'Cancelar' explícito" | O selector de ponto de partida fecha tocando fora da área; o botão "Cancelar" existe no modal de importação de horário. Corrigido na Regra 6. |
| I5 | "botão de recentrar manual" no mapa principal | O botão de recentrar do mapa principal (`app/(tabs)/index.tsx`) está presente mas sem acção associada — um defeito real da aplicação. Só o botão da navegação outdoor funciona. A afirmação foi reformulada na Regra 7. |
| I6 | "Rotas Acessíveis que evita escadas na navegação indoor" (Regra 2) | O toggle "Rotas Acessíveis" existe nas Definições e o algoritmo `aStar` (`app/lib/pathfinding.ts`) suporta evitar escadas, mas o valor do toggle não chega ao cálculo da rota — a funcionalidade não está ligada. Reformulado na Regra 2. |

### 5.3 Verificação prática na aplicação

Para além da leitura do código, a responsável abriu a aplicação em execução (Expo Go) e exerceu directamente as funcionalidades em causa, confirmando *de visu*:

- **Logout:** ao tocar em "Terminar sessão" no Perfil surge efectivamente um diálogo de confirmação — contradizendo a afirmação inicial (D1).
- **Favoritos:** um favorito é removido com um único toque no ícone ♡, sem *swipe* nem modal (D2).
- **Ícone do separador Mapa:** é um ícone de mapa, não de casa (I3).
- **Botão de recentrar do mapa principal:** ao ser tocado não produz qualquer efeito (I5).

Esta verificação prática sustenta as correcções aplicadas. Mantiveram-se válidas, sem alteração, as restantes afirmações centrais da análise — em particular o Problema da Regra 5 (o horário permanece no `AsyncStorage`, na chave `utadmaps_schedule_v2`, após o logout, porque a função `logout()` não a remove), o Gap 1 da Regra 3 e a totalidade da Regra 8.

### 5.4 Impacto da revisão e recomendações

A revisão **não altera o veredicto global** da avaliação (5 regras conformes, 3 parcialmente conformes): nenhuma das discrepâncias muda o estado de conformidade de qualquer regra. O impacto concentra-se na Regra 5, cujo *gap* passou a assentar num único problema real — a persistência do horário — cuja severidade catastrófica (4) passa a ser a severidade do *gap* da regra, actualizada na tabela síntese da secção 2.

Recomenda-se que a equipa aplique a mesma verificação aos restantes documentos da Fase 3: o "logout sem confirmação", aqui invalidado, é também referido como problema **P-03** em `PROBLEMAS_DETECTADOS.md` e como melhoria **M-02** (Sprint 1) em `MELHORIAS_PROPOSTAS.md`, devendo ser corrigido nesses documentos.

Como lição metodológica, esta revisão reforça que qualquer avaliação por inspecção deve ser validada contra o *build* actual da aplicação — idealmente exercendo o produto, e não apenas descrevendo-o.
