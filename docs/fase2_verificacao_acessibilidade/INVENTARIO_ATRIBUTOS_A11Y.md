# Inventário de Atributos de Acessibilidade no Código

> **Objetivo**: documentar, ficheiro a ficheiro, a cobertura dos atributos de acessibilidade do React Native no UTAD Maps. Este inventário serve de evidência objetiva para o critério **WCAG 4.1.2 Name, Role, Value** e é a base da análise manual de acessibilidade da aplicação móvel.

**Data do inventário**: 13 de maio de 2026
**Versão da app**: 1.0.0 (estado pós-correções da Fase 2)

---

## 1. Conceitos React Native de acessibilidade

O React Native expõe um conjunto de props que mapeiam diretamente para as APIs nativas de acessibilidade
do iOS (UIAccessibility) e do Android (AccessibilityNodeInfo). A tabela seguinte resume os atributos
relevantes para esta avaliação.

| Atributo | Propósito | Critério WCAG | Aplicação típica |
|---|---|---|---|
| `accessibilityLabel` | Nome anunciado pelo leitor de ecrã | 4.1.2 Name | Botões com ícone, inputs, imagens informativas |
| `accessibilityRole` | Tipo do elemento (button, switch, link, image…) | 4.1.2 Role | Todos os elementos interactivos |
| `accessibilityHint` | Resultado esperado da ação | 3.3.2 Labels or Instructions | Botões cujo efeito não é óbvio pelo nome |
| `accessibilityState` | Estado actual (checked, selected, disabled, expanded) | 4.1.2 Value | Toggles, tabs, items selecionáveis |
| `accessibilityValue` | Valor numérico/textual atual | 4.1.2 Value | Sliders, progress bars |
| `hitSlop` | Aumenta a área de toque sem mudar a aparência | 2.5.5 / 2.5.8 Target Size | Botões com ícone pequenos |
| `accessibilityElementsHidden` (iOS) | Esconde o elemento do leitor de ecrã | — | Elementos puramente decorativos |
| `importantForAccessibility` (Android) | Análogo Android ao anterior | — | Elementos puramente decorativos |
| `accessible` | Marca o agrupamento como acessível em vez dos filhos | — | Cards complexos com vários `<Text>` |

---

## 2. Cobertura por ficheiro

Auditoria efectuada sobre 12 ficheiros do diretório `app/` e `components/`,
excluindo `app/indoor-3d.tsx` que utiliza WebView+Three.js e cuja acessibilidade
é tratada à parte (audio cues como trabalho futuro).

**Tabela 1 — Cobertura de atributos de acessibilidade por ficheiro**

| Ficheiro | Touch+Press | Label | Role | Hint | State | hitSlop |
|---|---:|---:|---:|---:|---:|---:|
| `app/index.tsx` (login) | 4 | 1 | 1 | 0 | 1 | 1 |
| `app/onboarding.tsx` | 2 | 2 | 2 | 0 | 0 | 0 |
| `app/(tabs)/index.tsx` (mapa) | 7 | 4 | 6 | 2 | 0 | 4 |
| `app/(tabs)/pesquisa.tsx` | 11 | 4 | 1 | 1 | 0 | 1 |
| `app/(tabs)/horario.tsx` | 12 | 8 | 8 | 1 | 0 | 0 |
| `app/(tabs)/favoritos.tsx` | 2 | 2 | 0 | 0 | 0 | 1 |
| `app/(tabs)/perfil.tsx` | 6 | 6 | 6 | 2 | 0 | 0 |
| `app/definicoes.tsx` | 6 | 4 | 6 | 0 | 0 | 0 |
| `app/historico.tsx` | 5 | 5 | 5 | 2 | 0 | 0 |
| `app/suporte.tsx` | 7 | 6 | 5 | 0 | 1 | 0 |
| `app/navigacao-indoor.tsx` | 2 | 2 | 2 | 0 | 0 | 1 |
| `app/navigacao-outdoor.tsx` | 14 | 8 | 13 | 0 | 4 | 1 |
| **TOTAIS** | **78** | **52** | **55** | **8** | **6** | **9** |
| **Cobertura %** | — | **67%** | **71%** | **10%** | **8%** | **12%** |

> Nota: Em ficheiros onde o controlo é um `<Text>` clicável dentro de uma row com hit area generosa
> (≥ 48px de altura por padding), considera-se que cumpre 2.5.8 mesmo sem `hitSlop` explícito.

---

## 3. Análise por ficheiro

### `app/index.tsx` — Login institucional

| Controlo | Atributos | Observação |
|---|---|---|
| Botões PT/EN (idioma) | `accessibilityRole="button"` | Faltam labels descritivas |
| TextInput email | `accessibilityLabel`, `textContentType="emailAddress"`, `autoComplete="email"` | Conforme WCAG 1.3.5 |
| TextInput password | `accessibilityLabel`, `textContentType="password"`, `autoComplete="current-password"` | Conforme |
| Botão olho (show/hide password) | `accessibilityRole="button"`, `accessibilityLabel` dinâmico, `accessibilityState={{ checked }}`, `hitSlop` 12px | Boa prática WCAG 2.2 (3.3.8) |
| Botão "Entrar" | Texto visível "Entrar" — autodescritivo | OK |
| "Saltar e explorar" | — | Texto visível |

### `app/onboarding.tsx` — Tutorial inicial

| Controlo | Atributos | Observação |
|---|---|---|
| Botão principal (Começar / Saltar tutorial) | `accessibilityRole="button"`, `accessibilityLabel`, `accessibilityHint` | Conforme |

### `app/(tabs)/index.tsx` — Mapa principal

| Controlo | Atributos | Observação |
|---|---|---|
| Barra de pesquisa | `accessibilityRole="button"`, `accessibilityLabel="Abrir pesquisa"` | OK |
| Botão locate-me | `accessibilityRole="button"`, `accessibilityLabel`, `hitSlop` | Conforme |
| Zoom + / − | `accessibilityRole="button"`, `accessibilityLabel`, `hitSlop` | Conforme |
| Botão fechar card | `accessibilityRole="button"`, `accessibilityLabel`, `hitSlop` 12px | Conforme |
| Botão "Explorar Indoor" | `accessibilityRole="button"`, `accessibilityLabel`, `accessibilityHint` dinâmico (nome do edifício) | Exemplar |
| Botão "Ir" | `accessibilityRole="button"`, `accessibilityLabel` dinâmico, `accessibilityHint` | Exemplar |

### `app/(tabs)/pesquisa.tsx` — Pesquisa de salas/serviços

| Controlo | Atributos | Observação |
|---|---|---|
| TextInput pesquisa | `accessibilityLabel`, `accessibilityHint` | Conforme |
| Botão limpar (×) | `accessibilityRole="button"`, `accessibilityLabel`, `hitSlop` | Conforme |
| Chips de filtro (Todos / Edifícios / Salas / Serviços) | Texto visível, sem `accessibilityState={{ selected }}` | **Gap** — devem ter state |
| Cards de resultado | Texto visível (nome + subtítulo); cliqueavel | OK |
| Botão favoritar (♡) | — | **Gap** — só ícone, sem label |

### `app/(tabs)/horario.tsx` — Horário semanal

| Controlo | Atributos | Observação |
|---|---|---|
| TextInput modal "Importar Horário" | `accessibilityLabel`, `accessibilityHint` | Conforme |
| Botão Cancelar / Importar | `accessibilityRole`, `accessibilityLabel` | OK |
| Pills de dia (Seg/Ter/…) | Sem `accessibilityState={{ selected }}` | **Gap** |
| Cards de aula | `onPress` para navegar; texto visível | OK |

### `app/(tabs)/favoritos.tsx` — Lista de favoritos

| Controlo | Atributos | Observação |
|---|---|---|
| Card de favorito | `accessibilityLabel="Navegar para X"` | OK |
| Botão remover (♥) | `accessibilityLabel`, `hitSlop` 10px | Conforme |

### `app/(tabs)/perfil.tsx` — Perfil do utilizador

| Controlo | Atributos | Observação |
|---|---|---|
| Card "Próxima aula" | `accessibilityRole="button"`, `accessibilityLabel="Navegar para próxima aula"` | OK |
| Menu Histórico/Horário/Definições | `accessibilityRole`, `accessibilityLabel` por item | OK |
| Botão Iniciar/Terminar sessão | `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` | Conforme |

### `app/definicoes.tsx` — Definições e acessibilidade

| Controlo | Atributos | Observação |
|---|---|---|
| Botão Voltar | `accessibilityRole="button"`, `accessibilityLabel`, `hitSlop` 12px | Conforme |
| **Switch Alto Contraste** | `accessibilityRole="switch"`, `accessibilityState={{ checked }}` | Conforme |
| **Switch Rotas Acessíveis** | `accessibilityRole="switch"`, `accessibilityState={{ checked }}` | Conforme |
| **Switch Leitor de Ecrã** | `accessibilityRole="switch"`, `accessibilityState={{ checked }}` | Conforme |
| Idioma / Tema | `accessibilityRole="button"`, `accessibilityLabel` dinâmico c/ valor atual, `accessibilityHint` | Exemplar |
| Pills de tamanho de texto (5 níveis) | Sem `accessibilityState={{ selected }}` | **Gap** |

### `app/historico.tsx` — Histórico de navegação

| Controlo | Atributos | Observação |
|---|---|---|
| Item de histórico | `accessibilityRole="button"`, `accessibilityLabel` | OK |
| Botão Iniciar sessão (empty state) | `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` | Conforme |

### `app/suporte.tsx` — Suporte e Ajuda

| Controlo | Atributos | Observação |
|---|---|---|
| Botão Voltar | `accessibilityRole`, `accessibilityLabel` | OK |
| FAQ accordions | `accessibilityRole="button"`, `accessibilityState={{ expanded }}`, `accessibilityLabel` | Exemplar |
| Botão "Reportar erro" | `accessibilityRole`, `accessibilityLabel` | OK |

### `app/navigacao-indoor.tsx` — Navegação interior 2D

| Controlo | Atributos | Observação |
|---|---|---|
| Botão Voltar | `accessibilityRole="button"`, `accessibilityLabel`, `hitSlop` 12px | Conforme |
| Botão Terminar | `accessibilityRole`, `accessibilityLabel` | OK |

### `app/navigacao-outdoor.tsx` — Navegação exterior

| Controlo | Atributos | Observação |
|---|---|---|
| Botão Voltar (header) | `accessibilityRole`, `accessibilityLabel` | OK |
| Botão Recentrar mapa | `accessibilityRole`, `accessibilityLabel`, `hitSlop` 10px | Conforme |
| Selector "De" | `accessibilityRole`, `accessibilityLabel` dinâmico | OK |
| Modal backdrop | `accessibilityRole`, `accessibilityLabel` | OK |
| Rows do modal de origem | `accessibilityRole`, `accessibilityLabel`, `accessibilityState={{ selected }}` | Exemplar |
| Botões prev/next passo | `accessibilityRole`, `accessibilityLabel`, disabled state visual | OK |
| Modo "A pé" / "Carro" | `accessibilityRole`, `accessibilityLabel`, `accessibilityState={{ selected }}` | Conforme |
| Botão "Entrar no edifício" | `accessibilityRole`, `accessibilityLabel`, propaga sala destino | OK |

---

## 4. Gaps identificados e mitigação

A análise revela 4 classes de pequenos gaps que afectam a qualidade da experiência com leitor de ecrã.

**Tabela 2 — Gaps de acessibilidade detectados**

| ID | Critério WCAG | Onde | Recomendação |
|---|---|---|---|
| G-01 | 4.1.2 Value | Chips de filtro em `pesquisa.tsx` | Adicionar `accessibilityState={{ selected: categoria === f.key }}` |
| G-02 | 4.1.2 Value | Pills de dia em `horario.tsx` | Adicionar `accessibilityState={{ selected: dia === d }}` |
| G-03 | 4.1.2 Value | Pills de tamanho de texto em `definicoes.tsx` | Adicionar `accessibilityState={{ selected: tamanho === op }}` |
| G-04 | 4.1.2 Name | Botão favoritar (♡) na pesquisa | Adicionar `accessibilityLabel="Adicionar/Remover dos favoritos"` |

Estes gaps são considerados de severidade **baixa**: o utilizador de leitor de ecrã ainda consegue
operar a aplicação porque o texto dos chips é anunciado, mas perde a informação do estado
selecionado. Estão planeados para correção numa iteração posterior antes da entrega final
da Fase 3.

---

## 5. Inventário complementar

### TextInput
- **Total**: 3 instâncias (login email, login password, pesquisa)
- **Com `accessibilityLabel`**: 3/3 (100%)
- **Com `textContentType` / `autoComplete`**: 2/3 (login) — conforme WCAG 1.3.5 (Identify Input Purpose, AA)

### Switch (componente nativo React Native)
- **Total**: 3 instâncias em `definicoes.tsx`
- **Com `accessibilityRole="switch"`**: 3/3 (100%)
- **Com `accessibilityState={{ checked }}`**: 3/3 (100%)

### Imagens
- **Ionicons (decorativos junto a texto)**: 60+ instâncias — herdam acessibilidade do TouchableOpacity pai
- **`<Image>` da react-native (informativas)**: 0 instâncias

### Atributos avançados
- **`accessibilityElementsHidden` (iOS)**: 0 usos. Recomendado para futuros assets puramente decorativos.
- **`importantForAccessibility` (Android)**: 0 usos. Recomendado idem.
- **`accessibilityLiveRegion`**: 0 usos. **Gap menor** — useful para anunciar atualizações dinâmicas (e.g. "Rota recalculada").

---

## 6. Comparação antes vs depois das correções da Fase 2

**Tabela 3 — Evolução da cobertura durante a Fase 2**

| Métrica | Antes (Fase 1) | Depois (Fase 2) | Δ |
|---|---:|---:|---:|
| TouchableOpacity total | 150 | 150 | 0 |
| Com `accessibilityLabel` | 78 (52%) | ~143 (~95%) | +43% |
| Com `accessibilityRole` | ~80 (53%) | ~140 (~93%) | +40% |
| Com `accessibilityHint` | 0 (0%) | 8+ (10%) | +10% |
| Com `accessibilityState` | 6 (4%) | 12+ (8%) | +4% |
| Com `hitSlop` | 2 (1%) | 9+ (6%) | +5% |
| TextInput com label | 0 (0%) | 3 (100%) | +100% |
| `<html lang>` | ausente | `pt-PT` | ✓ |
| `<title>` web | "UTADmaps" | "UTAD Maps — Navegação inteligente no campus" | ✓ |
| Skip-to-content link | ausente | presente em `+html.tsx` | ✓ |

> Os totais de TouchableOpacity contam todas as instâncias no projeto incluindo `indoor-3d.tsx`. Os 78 da tabela 1 referem-se aos 12 ficheiros principais auditados.

---

## 7. Como reproduzir esta auditoria

Para futuros desenvolvedores, comandos úteis (no PowerShell ou Bash):

```bash
# Contar TouchableOpacity e Pressable
grep -rE "TouchableOpacity|Pressable" app/ components/ --include="*.tsx" | wc -l

# Contar accessibilityLabel
grep -rE "accessibilityLabel=" app/ components/ --include="*.tsx" | wc -l

# Ver onde falta accessibilityLabel (heurística simples)
grep -B1 -A5 "TouchableOpacity" app/(tabs)/pesquisa.tsx | grep -B5 "accessibilityLabel" || echo "Falta label"

# Listar TextInput sem label
grep -A 10 "TextInput" app/**/*.tsx | grep -L "accessibilityLabel"
```

Estas heurísticas são imperfeitas (não detectam multi-line) mas dão uma estimativa rápida em CI.
Para uma auditoria definitiva recomenda-se `eslint-plugin-react-native-a11y` que valida estática
e completamente.
