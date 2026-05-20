# Avaliação pelas Regras de Ouro de Shneiderman

**Responsável**: Liane Duarte
**Data**: 21 de maio de 2026
**Aplicação avaliada**: UTAD Maps v1.0

---

## 1. Enquadramento

Ben Shneiderman propõe um conjunto de **oito regras de ouro de design de interfaces** publicadas no clássico *Designing the User Interface* e disponibilizadas online em <https://www.cs.umd.edu/users/ben/goldenrules.html>. Estas regras complementam as heurísticas de Nielsen com uma abordagem mais focada na coerência do sistema, na previsibilidade da interação e na capacidade do utilizador manter o controlo do diálogo com a aplicação.

A presente avaliação aplica as oito regras ao UTAD Maps no estado correspondente ao final da Fase 2 (após as nove correções de acessibilidade aplicadas), com o objectivo de identificar pontos de conformidade e oportunidades de melhoria que possam não ter sido capturados pelas heurísticas de Nielsen ou pelos testes com utilizadores.

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
| 5 | Prevenir erros | ⚠️ Parcialmente conforme | 3 (maior) |
| 6 | Permitir a fácil reversão de acções | ✅ Conforme | — |
| 7 | Manter os utilizadores no controlo | ✅ Conforme | — |
| 8 | Reduzir a carga de memória de curta duração | ✅ Conforme | — |

**Síntese**: 5 das 8 regras são integralmente cumpridas e 3 são **parcialmente** cumpridas com *gaps* menores ou maiores documentados.

---

## 3. Análise detalhada

### Regra 1 — Esforçar-se pela consistência ✅

**Critério**: a interface deve usar terminologia, ícones, cores, comportamentos e fluxos consistentes em todas as situações análogas.

**Estado no UTAD Maps**: integralmente cumprida. A aplicação utiliza um sistema de design centralizado em `contexts/SettingsContext.tsx` com paletas para modo claro, escuro, alto contraste claro e alto contraste escuro. Os ícones Ionicons são usados de forma coerente (a casa para mapa, lupa para pesquisa, relógio para horário, coração para favoritos, pessoa para perfil). A barra de navegação inferior mantém os mesmos cinco itens em todos os ecrãs. Os cartões de resultado seguem a mesma estrutura visual em pesquisa, favoritos e histórico.

**Evidência**: 125 chaves de tradução PT/EN em `LanguageContext.tsx`, paleta unificada com cinco temas, biblioteca única de ícones, componentes reutilizados (Modal, TouchableOpacity com `accessibilityRole` consistente).

### Regra 2 — Procurar a usabilidade universal ✅

**Critério**: reconhecer as necessidades de utilizadores diversos (novatos, peritos, estrangeiros, com deficiência) e adaptar o conteúdo facilitando a transformação.

**Estado no UTAD Maps**: integralmente cumprida. A aplicação foi explicitamente concebida para servir vários perfis:

- **Estudantes novos**: tutorial de onboarding com seleção de idioma e modo convidado para exploração sem login
- **Estudantes Erasmus**: interface bilingue PT/EN com 125 chaves traduzidas
- **Estudantes peritos**: histórico de pesquisas e favoritos como atalhos
- **Utilizadores com deficiência visual**: cinco níveis de tamanho de texto (até 200 %), modo Alto Contraste com rácio 21:1, compatibilidade com VoiceOver e TalkBack
- **Utilizadores com mobilidade reduzida**: opção "Rotas Acessíveis" que evita escadas na navegação indoor

**Evidência**: documentada exaustivamente na secção 3.6 do relatório (Fase 2) com conformidade WCAG 2.2 nível AA em 29 de 34 critérios aplicáveis (85 %).

### Regra 3 — Dar feedback informativo ⚠️

**Critério**: para cada acção do utilizador, deve existir resposta do sistema. Para acções frequentes e menores a resposta pode ser modesta; para acções importantes a resposta deve ser mais substancial.

**Estado no UTAD Maps**: parcialmente cumprida. A aplicação oferece feedback em vários pontos (botões com `activeOpacity`, *spinners* de loading na pesquisa, mensagens de Alert em operações como login e importação de horário), mas faltam pontos importantes:

**Gap 1** — quando o utilizador activa o **modo Alto Contraste** ou altera o **tamanho do texto**, a aplicação aplica imediatamente a alteração mas não exibe uma confirmação textual nem uma animação que sublinhe a transição. Para utilizador com baixa visão é importante saber que "a definição foi guardada".

**Gap 2** — quando a **rota é recalculada** durante a navegação outdoor por desvio do utilizador, não há notificação. O utilizador vê a linha mudar mas pode não perceber porquê.

**Severidade**: 2 (menor) · **Recomendação**: adicionar pequenos *toasts* informativos nas duas situações.

### Regra 4 — Projectar diálogos que indiquem o fim de uma acção ⚠️

**Critério**: as sequências de acções devem ter início, meio e fim claros, com mensagem de conclusão informativa.

**Estado no UTAD Maps**: parcialmente cumprida. A maioria das acções tem fim claro (botão Voltar nos ecrãs secundários, mensagem "Importação concluída" após sincronização do horário, retorno automático ao mapa após terminar navegação), mas:

**Gap** — na navegação outdoor, quando o utilizador chega ao destino, a aplicação **não emite** notificação explícita de chegada. O utilizador percebe pela proximidade visual no mapa mas falta confirmação clara.

**Severidade**: 2 (menor) · **Recomendação**: implementar evento "Chegada ao destino" quando a distância à coordenada destino for inferior a 15 m, com pop-up "Chegou ao destino — toque para iniciar navegação interior" se o edifício tiver indoor.

### Regra 5 — Prevenir erros ⚠️

**Critério**: o design deve, sempre que possível, prevenir o utilizador de cometer erros graves. Se um erro acontecer, deve oferecer recuperação simples.

**Estado no UTAD Maps**: parcialmente cumprida. A aplicação tem várias salvaguardas (campos de email com `keyboardType="email-address"`, *autoComplete*, *placeholders* explícitos, modal de confirmação para acções destrutivas em favoritos via swipe-to-remove). Mas existem **dois problemas graves** detectados nas restantes técnicas e que se enquadram nesta regra:

**Problema 1** (severidade 3 — maior) — a acção "**Terminar sessão**" no perfil **não pede confirmação**. Um toque acidental encerra a sessão sem aviso, perdendo o estado de navegação activo.

**Problema 2** (severidade 4 — catastrófico em contexto multi-utilizador) — após "Terminar sessão", **o horário académico do utilizador anterior permanece visível** na tab Horário. Em telemóvel partilhado (laboratórios, biblioteca) o utilizador seguinte vê informação privada do anterior. Identificado como bug **B-02** na Fase 2 e como problema crítico em P3 (Ana Marques) na avaliação heurística.

**Severidade global**: 3 (maior) · **Recomendação**: (i) adicionar Alert de confirmação antes do logout; (ii) limpar `AsyncStorage` no logout (chave `utadmaps_horario` e similares).

### Regra 6 — Permitir a fácil reversão de acções ✅

**Critério**: as acções devem ser reversíveis sempre que possível, reduzindo a ansiedade do utilizador e encorajando a exploração.

**Estado no UTAD Maps**: cumprida. As principais operações são reversíveis:

- **Favoritar/desfavoritar** é instantâneo e reversível com um toque
- **Iniciar navegação** pode ser cancelado com botão "Terminar"
- **Importar horário** sobrescreve o anterior (operação idempotente)
- **Alterar idioma, tema ou tamanho de texto** é reversível com um toque
- **Modal de pesquisa de origem** tem botão "Cancelar" explícito

A única operação não trivialmente reversível é o **logout**, mas esse é o comportamento esperado (não se "desfaz" um logout, faz-se novo login).

### Regra 7 — Manter os utilizadores no controlo ✅

**Critério**: utilizadores experientes desejam ser os iniciadores das acções e não os receptores; o sistema deve responder ao utilizador, não o contrário.

**Estado no UTAD Maps**: cumprida. A aplicação evita comportamentos invasivos:

- **Sem notificações push** intrusivas (apenas opcionais para alertas de aula)
- **Sem redirecionamentos automáticos** entre ecrãs (excepto após login bem-sucedido, que é esperado)
- **Sem animações longas obrigatórias** — o utilizador pode tocar para acelerar transições
- **Onboarding saltável** com botão "Saltar e explorar"
- **Modo convidado** disponível sem autenticação
- **Mapa controlado pelo utilizador** com botão de recentrar manual em vez de seguir a posição GPS continuamente (excepto durante navegação activa)

### Regra 8 — Reduzir a carga de memória de curta duração ✅

**Critério**: a interface deve manter elementos visíveis e permitir reconhecer em vez de recordar.

**Estado no UTAD Maps**: cumprida. A aplicação aplica este princípio em vários pontos:

- **Histórico de pesquisas** visível no ecrã de Pesquisa
- **Favoritos persistentes** acessíveis numa tab dedicada
- **Filtros visíveis em todo o momento** (chips Todos/Edifícios/Salas/Serviços)
- **Próxima aula visível no Perfil** sem necessidade de o utilizador recordar o horário
- **Tab-bar inferior persistente** elimina necessidade de memorizar como voltar
- **Texto descritivo nos toggles** (e.g. "Evitar escadas" abaixo de "Rotas Acessíveis", "Cores preto/branco para máxima legibilidade" abaixo de "Alto Contraste")

---

## 4. Conclusões

A aplicação UTAD Maps cumpre **5 das 8 regras de ouro de Shneiderman integralmente** e as **3 restantes parcialmente**, com dois *gaps* menores (regras 3 e 4) relacionados com feedback informativo e indicação de fim de acção, e um *gap* maior (regra 5 — prevenção de erros) que coincide directamente com o bug **B-02** (persistência do horário após logout) identificado na Fase 2 e confirmado pelos peritos heurísticos.

A regra mais problemática é portanto a **regra 5 (Prevenir erros)**, com dois problemas concretos a corrigir antes de qualquer iteração subsequente do produto: o logout sem confirmação e a persistência indevida do horário académico no `AsyncStorage` após terminar sessão.

As recomendações desta análise são consolidadas em `MELHORIAS_PROPOSTAS.md`, juntamente com os achados das restantes duas técnicas (Nielsen e User Tests).
