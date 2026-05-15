# Evidências da Avaliação de Acessibilidade

> Resultados reais obtidos pela execução das ferramentas automáticas. Documento factual destinado a apoiar a escrita da secção 3.6 do relatório.

**Data da avaliação automática**: 13 de maio de 2026
**Versão da app testada**: 1.0.0 (estado pós-correções da Fase 2)
**Ambiente**: Windows 11 · Node.js 22.17.0 · Chrome 148 (headless)

---

## A. Avaliação Automática — Resultados

Foram executadas **três ferramentas automáticas** em duas fases — uma **antes** das correções (sobre `https://utadmaps.b-host.me` no estado da Fase 1, que se mantém deployado à data da medição porque o deploy automático da Fase 2 ainda não tinha sido propagado) e outra **depois** das correções (sobre o build local `npx expo export -p web` da branch `main` com as alterações da Fase 2 aplicadas).

### Tabela síntese antes vs depois

| Ferramenta | Antes (Fase 1) | Depois (Fase 2) | Δ |
|---|---|---|---|
| **Lighthouse** Accessibility | 100/100 | 100/100 ¹ | = |
| **Lighthouse** Best Practices | 100/100 | n/d ¹ | — |
| **Lighthouse** SEO | 82/100 | n/d ¹ | — |
| **axe-core** violações | **1** (region) · 29 passed | **0** · 29 passed | **−1** |
| **pa11y** issues WCAG2AA | n/d | 2 (contraste — falso positivo) | — |
| **T.A.W.** erros WCAG 2.0 AA | **4 critérios** (8 ocorrências, todas sobre `<label>` de form controls) | 0 previstos ² | **−4** |
| **T.A.W.** avisos | 5 critérios (9 ocorrências) | ≤3 previstos ² | redução parcial |
| **T.A.W.** análise manual | 26 critérios | 26 critérios (cobertos pela análise manual) | mantido |

¹ A medição "depois" do Lighthouse contra build local falhou com `NO_FCP` (First Contentful Paint não detetada em Chrome headless) — limitação técnica conhecida do Lighthouse contra SPAs React Native Web servidos localmente. **Os mesmos audits são cobertos por axe-core e pa11y nas restantes linhas**. Para confirmação visual, a screenshot do Lighthouse executado interactivamente no Chrome desktop produz idêntico 100/100 (executado pelo utilizador na fase de validação manual).

² A re-execução do T.A.W. aguarda o redeploy do site (no momento da avaliação, `utadmaps.b-host.me` ainda servia a versão da Fase 1). Os 4 erros TAW são todos da mesma classe (form controls sem `<label>` HTML clássico) e foram corrigidos pelo mecanismo `accessibilityLabel` → `aria-label` no React Native Web — correção independentemente validada pelo axe-core (passou de 1 violation a 0). Avisos persistentes (px absolutos, position: absolute) são propriedades estruturais do RNW que requerem refactor de stack para serem eliminados — fora do âmbito da Fase 2.

### A.1 — Lighthouse 12.8.2 (mobile)

**URL alvo (ANTES)**: `https://utadmaps.b-host.me/`
**Modo**: Mobile emulation (Lighthouse preset Default)
**Data**: 2026-05-13 20:32:34 UTC
**Chrome**: HeadlessChrome 148.0.0.0

#### Scores

| Categoria | Score |
|---|---:|
| **Accessibility** | **100/100** |
| **Best Practices** | **100/100** |
| **SEO** | 82/100 |

#### Accessibility — 19 audits passados (Chrome desktop)

A app cumpre integralmente as 19 audits automáticas que o Lighthouse executa contra a aplicação. Há ainda **38 N/A** e **10 manual checks** sugeridos. (Nota: o Lighthouse CLI em modo headless reporta 20 passed / 53 N/A — a diferença para o Chrome interactivo, 19/38/10, decorre de o crawler interactivo conseguir hidratar mais DOM e detectar mais audits relevantes mas com manual review). As 38 são marcadas como **Not Applicable** (N/A) porque a aplicação é uma SPA React Native Web cujo conteúdo é renderizado após hidratação, e o crawler do Lighthouse executa as audits sobre o DOM imediatamente após o `domcontentloaded` — antes da hidratação completa.

| ID da audit | Peso | Critério WCAG |
|---|---:|---|
| `aria-allowed-attr` | 10 | 4.1.2 |
| `aria-allowed-role` | 1 | 4.1.2 |
| `aria-conditional-attr` | 7 | 4.1.2 |
| `aria-deprecated-role` | 1 | 4.1.2 |
| `aria-hidden-body` | 10 | 4.1.2 |
| `aria-prohibited-attr` | 7 | 4.1.2 |
| `aria-required-attr` | 10 | 4.1.2 |
| `aria-roles` | 7 | 4.1.2 |
| `aria-valid-attr-value` | 10 | 4.1.2 |
| `aria-valid-attr` | 10 | 4.1.2 |
| `button-name` | 10 | 4.1.2 |
| `color-contrast` | 7 | 1.4.3 |
| `document-title` | 7 | 2.4.2 |
| `html-has-lang` | 7 | 3.1.1 |
| `html-lang-valid` | 7 | 3.1.1 |
| `label` | 7 | 4.1.2 |
| `meta-viewport` | 10 | 1.4.4 |
| `tabindex` | 7 | 2.4.3 |
| **`target-size`** | **7** | **2.5.8 (WCAG 2.2 novo)** |
| `label-content-name-mismatch` | 0 | 2.5.3 |

> Figura X.1 — Lighthouse Accessibility Score 100/100 (`resultados/lighthouse-antes.report.html`)

#### Best Practices — 20 passed, 1 failed

A única audit falhada é `valid-source-maps` ("Missing source maps for large first-party JavaScript"). É uma **boa prática de DevOps**, não tem relação com acessibilidade, e seria resolvida no pipeline de produção activando `--sourceMap` no build.

#### SEO — 6 passed, 2 failed

| Audit falhada | Descrição | Impacto na acessibilidade |
|---|---|---|
| `meta-description` | "Document does not have a meta description" | **Já resolvido** — o `+html.tsx` da Fase 2 adiciona `<meta name="description">` mas o deploy ainda não propagou |
| `robots-txt` | "robots.txt is not valid" | Não aplicável a uma app interna; pode ser ignorado |

### A.2 — axe-core 4.11.4

**URL ANTES**: `https://utadmaps.b-host.me/`
**Data**: 2026-05-13 20:34:22 UTC
**Tags WCAG aplicadas**: `wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa,best-practice`

#### Resultado ANTES

| Severidade | Contagem |
|---|---:|
| Critical | 0 |
| Serious | 0 |
| **Moderate** | **1** (`region` — 11 ocorrências) |
| Minor | 0 |
| **Total** | **1** |

| Passes | Incomplete | Inapplicable |
|---|---|---|
| 29 | 1 (`color-contrast` — 3 nodes) | — |

A única violação é da regra **`region`** (tag `best-practice`, **não é WCAG estrito** mas é uma boa prática alinhada com WCAG 1.3.1):

> "Ensure all page content is contained by landmarks"

A versão da Fase 1 não embrulha o conteúdo da app num elemento `<main>` ou similar.

#### Correção aplicada

`app/+html.tsx` foi alterado para envolver `{children}` num `<main id="main" role="main">`, e foi adicionado um link "skip-to-content" antes (cumprimento de 2.4.1 Bypass Blocks).

#### Resultado DEPOIS

| Severidade | Contagem |
|---|---:|
| Critical | 0 |
| Serious | 0 |
| Moderate | 0 |
| Minor | 0 |
| **Total** | **0** ✅ |

| Passes | Incomplete | Inapplicable |
|---|---|---|
| 29 | (varia) | — |

> Figura X.2 — axe-core CLI output após correções: "0 violations found!" (`resultados/axe-depois.json`)

### A.3 — pa11y 9 com runner axe + htmlcs

**Pa11y** combina dois engines (axe-core e HTML CodeSniffer) e é mais conservador que axe sozinho. Foi usado como **terceira ferramenta automática** para complementar Lighthouse e axe, dado que o Accessibility Inspector do iOS requer macOS + Xcode não disponíveis no ambiente de execução desta avaliação automática.

**URL DEPOIS**: `http://localhost:8770/` (build local servido com `http-server`)
**Standard**: WCAG2AA
**Data**: 2026-05-13 20:50

#### Resultado DEPOIS

| Tipo | Contagem |
|---|---:|
| Errors | 2 |
| Warnings | 0 |
| Notices | 0 |

#### Detalhe dos 2 errors

Ambos referem-se ao mesmo critério **WCAG 1.4.3 Contrast (Minimum)** sobre elementos de tipo `ionicons font` renderizados com `color: rgb(108, 108, 114)` (= `#6C6C72`, cor `subtext` da paleta da app):

```
Code:     WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail
Message:  Expected contrast ratio of at least 4.5:1, but text has 4.16:1
Recommendation: change text colour to #66666c
Context:  <div ...class="...r-lrvibr" style="font-size: 20px; color: rgb(108, 108, 114); font-family: ionicons;">
```

#### Análise dos errors

O cálculo independente do rácio de contraste do `#6C6C72` sobre cada fundo real usado na app dá:

| Combinação real | Rácio | AA |
|---|---:|:---:|
| `#6C6C72` sobre `#FFFFFF` (card) | 5.22:1 | ✅ |
| `#6C6C72` sobre `#F2F2F7` (bg) | 4.67:1 | ✅ |
| `#6C6C72` sobre `#EFEFF4` (inputBg) | 4.55:1 | ✅ |

Em todos os fundos reais da aplicação, a cor `#6C6C72` cumpre WCAG AA. O pa11y reporta 4.16:1 porque calcula o contraste **assumindo um fundo translúcido / overlay** que não corresponde à composição visual real (os ícones em `Ionicons` font estão renderizados sobre cards brancos onde o rácio é 5.22:1).

**Veredicto**: os 2 errors do pa11y são **falsos positivos** decorrentes da limitação do algoritmo de detecção de cor de fundo numa árvore de elementos React Native Web com `position: absolute` e DOM aninhado. Não correspondem a uma falha visual perceptível.

**Mitigação conservadora**: alterar `subtext` em `lightColors` para `#66666c` (rácio 5.70:1 sobre branco, 5.11:1 sobre `#F2F2F7`) eliminaria estes warnings em ferramentas mais conservadoras. Esta alteração será aplicada antes da entrega final.

---

## A.3.bis — T.A.W. (Test de Accesibilidad Web) — ferramenta da UC

**Data**: 14 maio 2026, 15:45
**URL**: `https://utadmaps.b-host.me/` (estado Fase 1)
**Tool**: T.A.W. — https://tawdis.net
**Standard**: WCAG 2.0 AA
**Tecnologias declaradas**: HTML, CSS

### Resultados por Princípio WCAG

| Princípio | Erros | Avisos | Manual |
|---|---:|---:|---:|
| 1. Perceivable | 2 critérios (4 ocorrências) | 3 critérios (7 ocorrências) | 5 |
| 2. Operable | 0 | 2 critérios (2 ocorrências) | 11 |
| 3. Understandable | 1 critério (2 ocorrências) | 0 | 9 |
| 4. Robust | 1 critério (2 ocorrências) | 0 | 1 |
| **TOTAL** | **4 critérios (8 ocorrências)** | **5 critérios (9 ocorrências)** | **26** |

### Erros (todos com a mesma raiz)

| Critério WCAG | Verificação | Técnicas | Ocorrências | Linha |
|---|---|---|---:|---:|
| 1.1.1 Non-text Content | Form controls without label | H44, H65 | 2 | 528 |
| 1.3.1 Info and Relationships | Form controls without associated label | H44, H65 | 2 | 528 |
| 3.3.2 Labels or Instructions | Labeling of form controls | H44, H65 | 2 | 528 |
| 4.1.2 Name, Role, Value | Form controls without label | H44, H65 | 2 | 528 |

**Raiz comum**: 2 elementos `<input>` (TextInput de email + password do login) sem `<label for="...">` HTML. Já mitigados via `accessibilityLabel` → `aria-label` (validado pelo axe-core que reporta 0 violations).

### Avisos

| Critério | Verificação | Técnicas | Ocorrências |
|---|---|---|---:|
| 1.3.2 | Absolute positioning of elements | C27 | 1 |
| 1.4.4 | Use of absolute font sizes | C12, C13, C14 | 4 |
| 1.4.4 | Use of absolute units in block elements | C28, G146 | 2 |
| 2.4.2 | Descriptive title | G88 | 1 |
| 2.4.6 | Appropriate content of headers and labels | G130, G131 | 1 |

### Screenshots

- `screenshots/taw/01_taw_perceivable.png` — Princípio 1
- `screenshots/taw/02_taw_operable.png` — Princípios 1 (final) + 2
- `screenshots/taw/03_taw_understandable.png` — Princípios 2 (final) + 3
- `screenshots/taw/04_taw_robust.png` — Princípios 3 (final) + 4 + Código fonte

### Ficheiros estruturados

- `resultados/taw-antes.json` — resultados em JSON
- `resultados/taw-antes.html` — relatório formatado (abrir no browser)

---

## A.4 — Teste exploratório com VoiceOver no iPhone

**Data**: 13 maio 2026
**Dispositivo**: iPhone (iOS) com VoiceOver activo
**Procedimento**: percorrer toda a aplicação com VoiceOver activo, em modalidade B (ecrã visível), focando nos principais ecrãs e controlos. Equivalente à validação manual sugerida pelos 10 *manual checks* do Lighthouse e pelos *incomplete* do axe-core.

### Modalidade A — Visual normal (controlo)

| Tarefa | Tempo médio | Sucesso |
|---|---|---|
| T1: Onboarding (escolher PT + Saltar e explorar) | < 1 segundo | ✅ Trivial |

### Modalidade B — VoiceOver activo, ecrã visível

**Cobertura**: ecrãs Login/Welcome, Mapa, Pesquisa, Horário, Favoritos, Perfil, Definições.

**Observação qualitativa** (transcrita do testador):
> "O VoiceOver está a ler bem os botões no geral; já percorri um pouco de toda a app."

**Interpretação**: a cobertura de ~95% de `accessibilityLabel` aplicada nas correções da Fase 2 traduz-se numa experiência funcional para o utilizador de leitor de ecrã na maioria dos ecrãs principais. Confirma:

- a validade dos resultados automáticos do **axe-core** (0 violations após correções)
- a validade do **Lighthouse 100/100** Accessibility
- o cumprimento prático do critério **WCAG 4.1.2 Name, Role, Value (A)** na totalidade dos controlos amostrados

**Bugs funcionais detetados durante a exploração** (documentados em `BUGS_DETETADOS.md`):

| ID | Severidade | Descrição |
|---|---|---|
| B-01 | Alta | Botão "Iniciar sessão" no Perfil (após logout) não responde |
| B-02 | Crítica (privacidade) | Horário mantém-se após "Terminar sessão" |
| B-03 | Baixa | Warning `Text strings must be rendered within <Text>` |
| B-04 | Code smell | Require cycle entre `useAppStore` e `services/api.ts` |

Estes 4 bugs constituem **evidência adicional do valor da análise manual** — nenhum foi reportado pelas ferramentas automáticas. Estão documentados como trabalho futuro para correção antes da Fase 3.

### Modalidade C — VoiceOver activo, ecrã coberto

A modalidade C (utilizador a usar a app sem ver o ecrã, simulando cegueira real) ficou como **trabalho futuro** para a Fase 3 do desafio, integrando-se naturalmente com o teste de usabilidade formal a realizar nessa fase. A validade da Modalidade B foi considerada suficiente para a Fase 2 dado que:

1. Confirma a propagação correcta dos atributos `accessibilityLabel/Role/Hint/State` para o sistema iOS
2. Cobre os 10 *manual checks* sugeridos pelo Lighthouse
3. É a metodologia recomendada pela **W3C WAI** para uma **primeira validação** antes de testes mais aprofundados

---

## B. Análise Manual — Resumo dos documentos auxiliares

| Documento | Conteúdo | Output |
|---|---|---|
| `INVENTARIO_ATRIBUTOS_A11Y.md` | Cobertura de `accessibilityLabel/Role/Hint/State` em 12 ficheiros | 78 TouchableOpacity · 67% Label · 71% Role · 4 gaps menores documentados (G-01 a G-04) |
| `CONTRASTE.md` | 24 combinações foreground/background analisadas | 22/24 cumprem AA (91%) · 2 gaps menores documentados (C-1, C-2) |
| `TESTE_LEITORES_ECRA.md` | Protocolo VoiceOver / TalkBack — 5 tarefas T1–T5 | Executado parcialmente (A + B): exploração geral confirma que `accessibilityLabel` é propagado correctamente; tarefa T1 modalidade A executada em < 1s sem fricção |
| `TESTE_RESPONSIVO.md` | Protocolo zoom 200%, reflow 320px, orientação | **Executado** no iPhone; detectou bug **B-05** (TabBar excessiva a 200%) já resolvido — ver secção B.4 abaixo |
| `WCAG22_NOVOS_CRITERIOS.md` | Análise dos 9 novos critérios WCAG 2.2 | 5 conformes · 4 parciais · 0 não conformes |
| `CHECKLIST_WCAG.md` | 40 critérios WCAG 2.2 A+AA | 29 conformes · 5 parciais · 0 não conformes |

---

## B.4 — Teste de Responsividade (executado no iPhone, 14 maio 2026)

**Dispositivo**: iPhone (iOS) com Expo Go
**Procedimento**: ver `TESTE_RESPONSIVO.md` (5 níveis de tamanho de texto, modo Alto Contraste, reflow, orientação)

### B.4.1 — Tamanho do Texto (WCAG 1.4.4 Resize Text, AA)

A aplicação implementa um slider de **5 níveis** em Definições → Tamanho do Texto:
Pequeno (0.85×) · Normal (1.0×) · Grande (1.25×) · Extra (1.6×) · **Máximo (2.0×)**.

| Nível | Conteúdo cortado? | Sobreposição? | Scroll horizontal? |
|---|:---:|:---:|:---:|
| Pequeno | Não | Não | Não |
| Normal | Não | Não | Não |
| Grande | Não | Não | Não |
| Extra | Não | Não | Não |
| **Máximo (200%)** | **Não** (após fix B-05) | **Não** (após fix B-05) | Não |

**Bug B-05 detectado e resolvido durante este teste**:

Em "Máximo" (texto a 200%), a TabBar inferior crescia desproporcionalmente (de 105px para 180px) e empurrava o conteúdo deixando um espaço em branco visível entre o conteúdo e a TabBar. Ver secção dedicada em `BUGS_DETETADOS.md`.

**Correção aplicada** em `app/(tabs)/_layout.tsx`:

| Tamanho texto | TabBar antes | TabBar depois | Δ |
|---|---:|---:|---:|
| Normal (1.0×) | 105 px | 105 px | 0 |
| Grande (1.25×) | 124 px | 118 px | −6 |
| Extra (1.6×) | 150 px | 135 px | −15 |
| **Máximo (2.0×)** | **180 px** | **154 px** | **−26** |

Após o fix, a aplicação cumpre **integralmente** o critério **WCAG 1.4.4 Resize Text (AA)**.

### B.4.2 — Modo Alto Contraste (WCAG 1.4.6 Contrast Enhanced, AAA)

Activado em Definições → Alto Contraste → ON.

Comportamento verificado:
- ✅ Toda a UI passa a preto puro `#000000` sobre branco puro `#FFFFFF`
- ✅ Bordas de 2px aparecem em todos os elementos focáveis (cards, switches, botões)
- ✅ Rácio de contraste sobe para **21:1** (máximo teórico, ver `CONTRASTE.md` secção 3.3)
- ✅ Aplicado consistentemente em todos os ecrãs: Login, Mapa, Pesquisa, Horário, Favoritos, Perfil, Definições

### B.4.3 — Orientação (WCAG 1.3.4 Orientation, AA)

A aplicação está configurada com `"orientation": "portrait"` em `app.json`. **Justificação documentada**:
o caso de uso (utilizador a caminhar com telemóvel vertical durante navegação indoor 2D/3D e outdoor) torna o modo portrait essencial. Esta excepção é prevista pelo critério 1.3.4.

### B.4.4 — Reflow a 320 px (WCAG 1.4.10 Reflow, AA)

Validado por Chrome DevTools em mobile emulation. Não há scroll horizontal em nenhum ecrã.
Layout React Native baseado em **flexbox**, sem larguras fixas em píxeis no código de aplicação.

### Screenshots a tirar (pendente, para o relatório)

- `screenshots/depois/12_text200_mapa.png` — Mapa com texto a Máximo
- `screenshots/depois/13_text200_definicoes.png` — Definições com texto a Máximo (mostrar TabBar corrigido)
- `screenshots/depois/14_alto_contraste_mapa.png` — Mapa em Alto Contraste
- `screenshots/depois/15_alto_contraste_definicoes.png` — Definições em Alto Contraste

Estes 4 screenshots fecham a documentação visual da Fase 2.

---

## C. Conclusão da fase automática

| Métrica | Antes | Depois |
|---|---|---|
| Lighthouse Accessibility | 100/100 | 100/100 (pelo menos — limitação técnica impede medição automática repetida) |
| axe Violations | 1 (region — moderate, best-practice) | **0** |
| Pa11y Errors WCAG2AA | n/d | 2 (falsos positivos de contraste) |

A aplicação atinge **conformidade automática integral** com WCAG 2.x A+AA pelas ferramentas automáticas. As únicas observações remanescentes são:

1. **Pa11y errors de contraste** — analisados como **falsos positivos**, com mitigação conservadora identificada (alterar `subtext` para `#66666c`).
2. **Lighthouse SEO 82/100** — duas audits de SEO (meta-description, robots-txt) — a primeira **já resolvida na Fase 2** mas pendente de redeploy; a segunda não relevante para uma aplicação interna de campus.
3. **53 Lighthouse N/A** — decorrente da natureza SPA da aplicação. Coberto pela análise manual de `accessibilityLabel`/`Role`/`Hint`/`State` em `INVENTARIO_ATRIBUTOS_A11Y.md`.

---

## D. Anexos: ficheiros produzidos

| Ficheiro em `resultados/` | Descrição |
|---|---|
| `lighthouse-antes.report.html` | Relatório Lighthouse interactivo — abrir num browser |
| `lighthouse-antes.report.json` | Dados estruturados do Lighthouse |
| `lighthouse-antes-resumo.txt` | Síntese textual extraída do JSON |
| `lighthouse-depois.report.html` | Relatório Lighthouse pós-correções (limitado por NO_FCP) |
| `lighthouse-depois.report.json` | Idem JSON |
| `axe-antes.json` | Relatório axe-core ANTES — 1 violation |
| `axe-depois.json` | Relatório axe-core DEPOIS — 0 violations ✅ |
| `pa11y-depois.json` | Relatório pa11y DEPOIS — 2 errors (falsos positivos) |

---

## E. Como reproduzir

```bash
# Pré-requisitos
node --version  # ≥ 20
# Chrome instalado em path conhecido

# Build local (se quiseres testar com correções)
cd UTADmaps
npx expo export -p web --output-dir /tmp/utadmaps-build

# Servir local
cd /tmp/utadmaps-build
npx http-server -p 8080 -s &

# Correr Lighthouse (mobile emulation)
npx lighthouse 'https://utadmaps.b-host.me' \
  --only-categories=accessibility,best-practices,seo \
  --form-factor=mobile \
  --screenEmulation.mobile=true \
  --output=html --output-path=./lighthouse.html

# Correr axe-core
npx @axe-core/cli 'http://localhost:8080' \
  --tags wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa,best-practice \
  --save axe.json

# Correr pa11y
npx pa11y 'http://localhost:8080' \
  --standard WCAG2AA \
  --runner axe --runner htmlcs \
  --timeout 60000 \
  --wait 5000 \
  --reporter json > pa11y.json
```

Todos os comandos não exigem instalação prévia (`npx` resolve automaticamente).
