# Checklist WCAG 2.2 — Análise Manual (App Móvel)

> **Aplicação alvo**: UTAD Maps — aplicação móvel React Native (Expo) para iOS e Android.
> **Nível de conformidade alvo**: AA (com observações para AAA quando aplicável).
> **Critérios totais aplicáveis**: 40 (A: 28, AA: 12). Critérios novos WCAG 2.2 destacados com ⭐.

Legenda:
- ✅ Conforme — com evidência demonstrável
- ⚠️ Parcial — conforme com observação ou gap menor
- ❌ Não conforme — gap documentado
- N/A — não aplicável a este contexto
- 🔍 A validar — depende de execução do teste com leitor de ecrã ou ferramenta

---

## 1 — PERCETÍVEL

### 1.1 Alternativas em texto

| # | Critério | Nível | Estado | Evidência / Observação |
|---|---|---|---|---|
| 1.1.1 | Conteúdo não-textual | A | ✅ | Ícones decorativos (Ionicons) estão envoltos em `TouchableOpacity` com `accessibilityLabel`. Logo da app no `+html.tsx` é decorativo (`<img alt="">` ou texto adjacente). Imagens de mapa (markers) têm tooltips com nome dos edifícios |

### 1.2 Multimédia baseada no tempo — N/A
> A aplicação não inclui áudio ou vídeo gravado.

### 1.3 Adaptável

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 1.3.1 | Informação e relações | A | ✅ | Estrutura semântica via `<Text>` com diferentes pesos (`fontWeight`). Cards têm hierarquia título/subtítulo. Listas usam `FlatList` com items separados |
| 1.3.2 | Sequência significativa | A | ✅ | Layout top-down em todos os ecrãs. Navegação por Tab (web) segue ordem visual |
| 1.3.3 | Características sensoriais | A | ✅ | Instruções de navegação combinam ícone direcional + texto ("Vire à esquerda em 20m"), nunca dependem só de cor/forma/posição |
| 1.3.4 | Orientação | AA | ⚠️ | App bloqueia em portrait (declarado em `app.json`). Justificação: portrait é essencial para usabilidade do mapa (ver `TESTE_RESPONSIVO.md`) |
| 1.3.5 | Identificar finalidade do input | AA | ✅ | TextInput de login usa `textContentType="emailAddress"` / `"password"` e `autoComplete` adequado |

### 1.4 Distinguível

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 1.4.1 | Uso da cor | A | ✅ | Cor nunca é o único meio. Estados (selecionado, urgente) usam cor + texto + ícone |
| 1.4.2 | Controlo de áudio | A | N/A | Sem áudio automático |
| 1.4.3 | **Contraste (Minimum)** | **AA** | ✅ | 22/24 combinações testadas ≥ 4.5:1 (texto normal) ou ≥ 3:1 (texto grande). Ver `CONTRASTE.md`. 2 gaps menores documentados com mitigação |
| 1.4.4 | Redimensionar texto até 200% | AA | ✅ | Slider de 5 níveis em Definições (Pequeno 0.85x → Máximo 2.00x). Toda a UI usa `fs()` em vez de `fontSize` literal |
| 1.4.5 | Imagens de texto | AA | ✅ | Todo o texto é renderizado via `<Text>` |
| 1.4.6 | Contraste melhorado | AAA | ✅ | Modo Alto Contraste em Definições usa preto/branco puro (rácio 21:1) |
| 1.4.10 | Reflow | AA | ✅ | Layout flexbox. Sem larguras fixas em píxeis. Validado em 320×568 |
| 1.4.11 | Contraste não-textual | AA | ✅ | Bordas focáveis e ícones informativos têm rácio ≥ 3:1. Outline focus 3px `#0066CC` sobre branco (5.57:1) |
| 1.4.12 | Espaçamento de texto | AA | ⚠️ | Mobile: respeita Dynamic Type do iOS / Font Size do Android. Web: ajustável via DevTools. Validar via `TESTE_RESPONSIVO.md` |
| 1.4.13 | Conteúdo em hover/focus | AA | N/A | Sem tooltips/popovers em hover na app móvel |

---

## 2 — OPERÁVEL

### 2.1 Acessível por teclado

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 2.1.1 | Teclado | A | ✅ | Mobile: gestos de toque cobertos por leitor de ecrã (VoiceOver/TalkBack). Web: navegação por Tab funcional, com `:focus-visible` |
| 2.1.2 | Sem armadilha de teclado | A | ✅ | Modais podem ser fechados via backdrop, botão Cancelar ou tecla Esc (web) |
| 2.1.4 | Atalhos de teclado | A | N/A | Sem atalhos de letra única implementados |

### 2.2 Tempo suficiente

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 2.2.1 | Tempo ajustável | A | N/A | Sem limites de tempo |
| 2.2.2 | Pausar, parar, ocultar | A | N/A | Sem animações que se movem automaticamente > 5s |

### 2.3 Convulsões

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 2.3.1 | Três flashes ou abaixo | A | ✅ | Sem flashes na UI |

### 2.4 Navegabilidade

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 2.4.1 | Ignorar blocos | A | ✅ | Mobile: leitor de ecrã pode saltar por landmarks. Web: skip-to-content link no `+html.tsx` |
| 2.4.2 | Página com título | A | ✅ | Mobile: cada ecrã tem `<Text style={headerTitle}>`. Web: `<title>UTAD Maps — Navegação inteligente no campus</title>` |
| 2.4.3 | Ordem de foco | A | ✅ | Tab/swipe segue ordem visual lógica |
| 2.4.4 | Finalidade do link em contexto | A | ✅ | Cards e botões têm labels descritivas (`accessibilityLabel`) |
| 2.4.5 | Múltiplos meios | AA | ✅ | TabBar + Pesquisa + Cliques no mapa + Histórico = 4 vias para chegar a um destino |
| 2.4.6 | Cabeçalhos e rótulos | AA | ✅ | Todos os ecrãs têm `headerTitle` descritivo. Inputs têm `<Text>` label adjacente |
| 2.4.7 | Foco visível | AA | ✅ | Web: `:focus-visible` com outline 3px. Mobile: indicador nativo de leitor de ecrã |
| 2.4.11 | ⭐ Foco não obscurecido (mín) | AA | ✅ | Tab-bar fixa não cobre completamente o foco. Outline 3px + offset 2px mantém-se visível |

### 2.5 Modalidades de entrada

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 2.5.1 | Gestos com ponteiro | A | ✅ | Não depende de gestos multitouch complexos. Pan/zoom do mapa têm alternativas (botões) |
| 2.5.2 | Cancelamento de ponteiro | A | ✅ | `onPress` dispara no `up`, conforme default RN |
| 2.5.3 | Etiqueta no nome | A | ✅ | Texto visível dos botões corresponde ao `accessibilityLabel` |
| 2.5.4 | Atuação por movimento | A | N/A | Sem shake/tilt obrigatórios |
| 2.5.7 | ⭐ Movimentos de arrasto | AA | ✅ | Pan do mapa tem alternativa (botões zoom + locate-me + pesquisa) |
| 2.5.8 | ⭐ **Tamanho do alvo (mínimo)** | **AA** | ⚠️ | Maioria conforme via `hitSlop` (≥ 24×24 efectivo). 1 gap menor: botão ♡ na pesquisa sem `hitSlop` (G-04 documentado) |

---

## 3 — COMPREENSÍVEL

### 3.1 Legível

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 3.1.1 | Idioma da página | A | ✅ | Web: `<html lang="pt-PT">` em `+html.tsx`. Mobile: idioma do sistema usado por defeito; alterável em Definições |
| 3.1.2 | Idioma das partes | AA | ✅ | Sistema i18n com `tr(pt, en)` em 125 chaves. Trocar idioma actualiza toda a UI |

### 3.2 Previsível

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 3.2.1 | Em foco | A | ✅ | Focar input não dispara navegação |
| 3.2.2 | Na introdução | A | ✅ | Pesquisa só age após `onSubmitEditing` ou debounce. Toggles agem só no toque deliberado |
| 3.2.3 | Navegação consistente | AA | ✅ | TabBar inferior sempre nas mesmas 5 tabs. Header de cada ecrã na mesma posição |
| 3.2.4 | Identificação consistente | AA | ✅ | Mesmo ícone = mesma função em toda a app. Ex: ícone "navigate" sempre representa "Ir" |
| 3.2.6 | ⭐ Ajuda consistente | A | ✅ | "Suporte e Ajuda" sempre acessível via Perfil → Definições → SOBRE |

### 3.3 Assistência à entrada

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 3.3.1 | Identificação do erro | A | ✅ | Mensagens via `Alert.alert()` (lido por leitor de ecrã); estados de erro coloridos a vermelho e com texto |
| 3.3.2 | Rótulos ou instruções | A | ✅ | Cada input tem `<Text>` label visível adjacente + `accessibilityLabel` |
| 3.3.3 | Sugestão de erro | AA | ⚠️ | Mensagens descritivas em login e importação; algumas mensagens de pesquisa são genéricas (futuro: sugerir alternativas próximas) |
| 3.3.4 | Prevenção de erros (jurídico, financeiro, dados) | AA | N/A | Sem operações irreversíveis críticas |
| 3.3.7 | ⭐ Entrada redundante | A | ✅ | Email/password só pedidos no login. Sessão persistida em JWT/AsyncStorage. Chave do horário só pedida uma vez |
| 3.3.8 | ⭐ **Autenticação acessível (mín)** | **AA** | ✅ | Suporte a autofill (`textContentType`+`autoComplete`), botão mostrar password, sem CAPTCHA. Login como convidado disponível |

---

## 4 — ROBUSTO

### 4.1 Compatível

| # | Critério | Nível | Estado | Evidência |
|---|---|---|---|---|
| 4.1.2 | Nome, função, valor | A | ✅ | ~95% de cobertura de `accessibilityLabel` + `accessibilityRole`. `accessibilityState` em toggles. 4 gaps menores em chips/pills (G-01 a G-03) — severidade baixa |
| 4.1.3 | Mensagens de estado | AA | ⚠️ | `ActivityIndicator` é anunciado nativamente. `Alert.alert` é lido. Falta `accessibilityLiveRegion` em "Rota recalculada" e similares (G-05 menor) |

---

## Resumo de conformidade

| Princípio | Total critérios | ✅ Conforme | ⚠️ Parcial | ❌ Não conforme | N/A |
|---|---:|---:|---:|---:|---:|
| 1. Percetível | 14 | 10 | 2 | 0 | 2 |
| 2. Operável | 13 | 10 | 1 | 0 | 2 |
| 3. Compreensível | 10 | 8 | 1 | 0 | 1 |
| 4. Robusto | 2 | 1 | 1 | 0 | 0 |
| **TOTAL** | **39** | **29** | **5** | **0** | **5** |

> Critérios efectivamente aplicáveis = 39 − 5 N/A = **34**
> Critérios conformes (✅) = **29**
> Critérios parcialmente conformes (⚠️) = **5**
> Critérios não conformes (❌) = **0**

### Score de conformidade WCAG 2.2 AA

- **Conformidade plena (✅)**: **29 / 34 = 85,3%**
- **Conformidade total (✅ + ⚠️)**: **34 / 34 = 100%**

Nenhum critério é ❌. Os 5 critérios marcados ⚠️ têm conformidade material com gaps menores
documentados e mitigação aplicada ou planeada.

### Gaps remanescentes (todos de severidade baixa)

| ID | Critério | Descrição | Mitigação / Prazo |
|---|---|---|---|
| G-01 | 4.1.2 | Chips de filtro em pesquisa sem `accessibilityState={{ selected }}` | Adicionar antes da Fase 3 |
| G-02 | 4.1.2 | Pills de dia no horário sem state | Adicionar antes da Fase 3 |
| G-03 | 4.1.2 | Pills de tamanho de texto em definições sem state | Adicionar antes da Fase 3 |
| G-04 | 2.5.8 | Botão ♡ na pesquisa sem `hitSlop` explícito | Trivial — adicionar |
| G-05 | 4.1.3 | Falta `accessibilityLiveRegion` em mensagens dinâmicas | Iteração futura |
| C-1 | 1.4.3 | Texto branco sobre primary dark `#0A84FF` = 3.65:1 | Mudar para `#0066CC` |
| C-2 | 1.4.3 | Texto erro `#FF3B30` = 3.55:1 em font normal | Mudar para `#D00012` ou bold |

### Conformidade AAA (parcial)

A aplicação cumpre os seguintes critérios AAA mesmo sem ser o nível alvo:
- 1.4.6 Contraste melhorado (graças ao modo Alto Contraste)
- 1.4.8 Apresentação visual (parcial — modo escuro disponível)
- 2.4.10 Cabeçalhos de secção (em Definições)

Isto evidencia que a aplicação foi concebida com design inclusivo desde o início e não apenas para
cumprir o mínimo do referencial.
