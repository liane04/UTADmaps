# WCAG 2.2 — Novos Critérios Aplicados ao UTAD Maps

> O WCAG 2.2 foi publicado pelo W3C em 5 de outubro de 2023, adicionando **9 critérios novos** face ao WCAG 2.1. Esta secção analisa, critério a critério, como o UTAD Maps responde a cada um deles, com particular ênfase nos quatro críticos para aplicações móveis.

---

## Visão geral dos 9 critérios novos

| # | Critério | Nível | Aplicável a mobile? | Estado no UTAD Maps |
|---|---|---|---|---|
| 2.4.11 | Focus Not Obscured (Minimum) | AA | Limitado (web) | ✅ Conforme |
| 2.4.12 | Focus Not Obscured (Enhanced) | AAA | Limitado | ⚠️ Parcial |
| 2.4.13 | Focus Appearance | AAA | Limitado | ❌ Não implementado |
| 2.5.7 | Dragging Movements | AA | **Sim** | ✅ Conforme |
| **2.5.8** | **Target Size (Minimum)** | **AA** | **Sim — crítico** | ⚠️ Parcialmente conforme |
| 3.2.6 | Consistent Help | A | **Sim** | ✅ Conforme |
| **3.3.7** | **Redundant Entry** | **A** | **Sim** | ✅ Conforme |
| **3.3.8** | **Accessible Authentication (Minimum)** | **AA** | **Sim — crítico** | ✅ Conforme |
| 3.3.9 | Accessible Authentication (Enhanced) | AAA | Sim | ⚠️ Parcial |

---

## 2.4.11 — Focus Not Obscured (Minimum) — AA

### Definição

Quando um componente recebe foco via teclado, **pelo menos parte do indicador de foco** não pode
estar **completamente** escondido por outros elementos (cabeçalhos fixos, banners, etc.).

### Análise no UTAD Maps

- A versão **mobile** não tem navegação por teclado padrão (toque) — critério não diretamente aplicável.
- A versão **web** (`utadmaps.b-host.me`) usa o `focus-visible` definido em `app/+html.tsx`:
  ```css
  *:focus-visible {
    outline: 3px solid #0066CC;
    outline-offset: 2px;
  }
  ```
- A tab-bar inferior é fixa (`position: absolute` em RN web). Quando o foco passa para um elemento
  parcialmente escondido por ela, **o outline `outline-offset: 2px` mantém-se visível** acima da
  barra.

### Resultado: ✅ Conforme

---

## 2.4.12 — Focus Not Obscured (Enhanced) — AAA

Definição mais rigorosa: **nenhuma parte** do indicador de foco pode estar escondida. Como a tab-bar
fixa pode obscurecer parcialmente alguns elementos do fundo, este critério **não é totalmente
cumprido**. Considerado trabalho futuro.

### Resultado: ⚠️ Parcial

---

## 2.4.13 — Focus Appearance — AAA

A área do indicador de foco deve ter **dimensão ≥ 2 pixels CSS** e **contraste ≥ 3:1** contra a cor
adjacente. O nosso outline tem 3px de largura e usa `#0066CC` (rácio 5.57:1 sobre branco) — cumpre.
Falta validar em todas as combinações de fundo.

### Resultado: ⚠️ A validar

---

## 2.5.7 — Dragging Movements — AA

### Definição

Toda a funcionalidade que usa **arrastar (drag)** deve ter **alternativa por toque simples (tap)**, exceto se o arrasto for essencial.

### Análise no UTAD Maps

A aplicação **não depende de gestos de arrasto** para nenhuma funcionalidade essencial:

| Gesto | Alternativa | Conforme |
|---|---|---|
| Pan do mapa | Botões de zoom + locate-me; pesquisa por nome | ✅ |
| Swipe entre tabs | Toque na tab-bar inferior | ✅ |
| Pull-to-refresh em listas | Não implementado (sem necessidade) | N/A |
| Slider de tamanho de texto | Pills tocáveis (não slider de arrasto) | ✅ |

### Resultado: ✅ Conforme

---

## 2.5.8 — Target Size (Minimum) — AA ⭐ CRÍTICO PARA MOBILE

### Definição

Os alvos de toque devem ter, no mínimo, **24×24 CSS pixels** de área. Excepções: alvos inline em
parágrafos de texto, alvos com espaçamento suficiente entre si, controlos do agente utilizador.

> Nota: a recomendação **2.5.5 (AAA do WCAG 2.1)** exige **44×44**. O UTAD Maps adota o
> patamar **44×44** como meta, alinhando-se com as guidelines da Apple (44pt) e Google (48dp).

### Análise no UTAD Maps

| Componente | Tamanho visual | hitSlop | Área de toque efectiva | Conforme |
|---|---|---|---|---|
| Tab-bar (5 botões inferiores) | ~60×50 | — | ≥ 44×44 nativo | ✅ |
| Botões "Ir" / "Explorar Indoor" | ~120×44 com padding | — | ≥ 44 | ✅ |
| Ícone close de cards | 22×22 | 12px | ~46×46 | ✅ |
| Botão locate (mapa) | 44×44 | 10px | ~64×64 | ✅ |
| Zoom + / − (mapa) | 44×44 | 10px | ~64×64 | ✅ |
| Botão eye (login) | 20×20 | 12px | ~44×44 | ✅ |
| Botão favoritar ♡ (pesquisa) | 20×20 | — | ⚠️ ~20×20 | ❌ (gap G-04) |
| Chips de filtro (pesquisa) | 70×32 com padding | — | ≥ 32 | ⚠️ Parcial (≥ 24 mas < 44) |
| Pills de dia (horário) | 40×32 | — | ⚠️ < 44 | ⚠️ Parcial |

### Mitigações implementadas

- Aplicação sistemática de `hitSlop` nos botões com ícone < 44px (locate, zoom, close, eye, voltar)
- Cards e items de lista têm padding ≥ 16px que resulta em área total ≥ 48px

### Gaps remanescentes

- Favoritar ♡ na pesquisa: falta `hitSlop` (gap G-04 documentado)
- Pills/chips: cumprem 2.5.8 (≥ 24×24) mas não atingem o patamar AAA de 2.5.5 (44×44)

### Resultado: ⚠️ Parcialmente conforme

---

## 3.2.6 — Consistent Help — A

### Definição

Se uma página oferece um mecanismo de ajuda (chat, link de suporte, FAQ), ele deve aparecer **no
mesmo local relativo em todas as páginas**.

### Análise no UTAD Maps

A app oferece **Suporte e Ajuda** acessível **em todos os ecrãs** via:
- Perfil → Definições → SOBRE → Suporte e Ajuda

A consistência é garantida porque o acesso é sempre o mesmo (tab Perfil + 2 cliques), e a tab Perfil
está visível em todas as 5 tabs principais.

### Resultado: ✅ Conforme

---

## 3.3.7 — Redundant Entry — A ⭐

### Definição

Não pode pedir-se ao utilizador para reintroduzir informação já fornecida na mesma sessão, exceto
quando essa reintrodução for essencial (segurança, validação).

### Análise no UTAD Maps

- **Login**: pede email + password apenas uma vez. Sessão persistida via JWT em AsyncStorage.
- **Importação de horário**: o link/chave do Inforestudante é pedida uma vez e guardada.
- **Definições de acessibilidade**: persistidas via AsyncStorage, não repedidas.
- **Localização GPS**: pedida uma vez no primeiro uso da pesquisa/navegação, depois reutilizada.

### Resultado: ✅ Conforme

---

## 3.3.8 — Accessible Authentication (Minimum) — AA ⭐ CRÍTICO

### Definição

O processo de autenticação **não pode depender de um teste cognitivo** (recordar password complexa,
reconhecer imagens, resolver puzzles), a menos que sejam fornecidos **mecanismos alternativos**:
- Suporte a password managers (autofill)
- Suporte a copy-paste
- Possibilidade de mostrar a password
- Autenticação por biométrica ou link mágico

### Análise no UTAD Maps

| Mecanismo | Implementação | Conforme |
|---|---|---|
| Autofill de email | `textContentType="emailAddress"` + `autoComplete="email"` | ✅ |
| Autofill de password | `textContentType="password"` + `autoComplete="current-password"` | ✅ |
| Mostrar password | Botão eye toggle no input | ✅ |
| Copy-paste activo | Comportamento default do `TextInput` (não está desactivado) | ✅ |
| Sem CAPTCHA | Não usado | ✅ |
| Sem teste cognitivo de imagens | Não usado | ✅ |
| Suporte biométrica | Não implementado (trabalho futuro) | — |
| Login como convidado | "Saltar e explorar" | ✅ |

### Resultado: ✅ Conforme

---

## 3.3.9 — Accessible Authentication (Enhanced) — AAA

Versão mais estrita: também não pode pedir "transcrever ou reconhecer objectos". A app não pede
nada disso, mas falta implementação de biométrica (Face ID, Touch ID) para considerar AAA pleno.

### Resultado: ⚠️ Parcial (faltam mecanismos AAA opcionais)

---

## Conclusão

**Dos 9 critérios novos do WCAG 2.2, o UTAD Maps cumpre integralmente 5 + parcialmente 4**.

Os 4 críticos para uma aplicação móvel — **2.5.8 Target Size**, **3.2.6 Consistent Help**,
**3.3.7 Redundant Entry**, **3.3.8 Accessible Authentication** — estão conformes ou
parcialmente conformes com gaps documentados e plano de correção.

A aplicação demonstra **boa aderência ao referencial mais recente do W3C**, indo além do mínimo
ao integrar muitos dos critérios AAA do WCAG 2.1 (alto contraste, foco visível, texto 200%) e
mostrando intencionalidade clara de design inclusivo desde a fase de concepção.
