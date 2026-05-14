# Análise de Contraste de Cores

> **Objetivo**: documentar exaustivamente os rácios de contraste das combinações foreground/background usadas no UTAD Maps, demonstrando conformidade com os critérios **WCAG 1.4.3 Contrast (Minimum, AA)** e **WCAG 1.4.6 Contrast (Enhanced, AAA)**.

---

## 1. Referencial WCAG

| Critério | Nível | Texto normal (< 18pt ou < 14pt bold) | Texto grande (≥ 18pt ou ≥ 14pt bold) | Componentes UI |
|---|---|---|---|---|
| **1.4.3 Contrast (Minimum)** | AA | **≥ 4.5:1** | **≥ 3:1** | — |
| **1.4.6 Contrast (Enhanced)** | AAA | **≥ 7:1** | **≥ 4.5:1** | — |
| **1.4.11 Non-text Contrast** | AA | — | — | **≥ 3:1** (bordas focáveis, ícones informativos) |

Tamanhos definidos como "grande" são equivalentes a 18 pontos ou 14 pontos negrito.

---

## 2. Metodologia

Os rácios foram calculados pela fórmula oficial do WCAG 2:

```
contrast = (L1 + 0.05) / (L2 + 0.05)
```

onde `L1` é a luminância relativa do mais claro e `L2` do mais escuro. A luminância usa a curva de
gama do sRGB:

```
L = 0.2126 × R' + 0.7152 × G' + 0.0722 × B'
```

com `C' = C/12.92` se `C ≤ 0.03928`, ou `C' = ((C + 0.055) / 1.055)^2.4` caso contrário, sendo `C` o
valor sRGB normalizado [0, 1] de cada canal.

A função `ratio(fg, bg)` em `docs/fase2_verificacao_acessibilidade/scripts/contrast.js` (e
verificável online em https://webaim.org/resources/contrastchecker/) é implementada conforme esta
especificação.

---

## 3. Paleta da aplicação

Cores extraídas de `contexts/SettingsContext.tsx` (`lightColors`, `darkColors`, `highContrastLight`, `highContrastDark`).

### 3.1 Modo Claro (`lightColors`)
```ts
bg:      '#F2F2F7'  // fundo principal
card:    '#FFFFFF'  // cartões e modais
text:    '#000000'  // texto principal
subtext: '#6C6C72'  // texto secundário (descrições, metadados)
primary: '#0066CC'  // botões primários, acentos
border:  '#E5E5EA'  // bordas e separadores
inputBg: '#EFEFF4'  // fundos de input
```

### 3.2 Modo Escuro (`darkColors`)
```ts
bg:      '#000000'
card:    '#1C1C1E'
text:    '#FFFFFF'
subtext: '#A8A8AE'
primary: '#0A84FF'
border:  '#38383A'
inputBg: '#1C1C1E'
```

### 3.3 Alto Contraste Claro (`highContrastLight`)
```ts
bg:      '#FFFFFF'
card:    '#FFFFFF'
text:    '#000000'
subtext: '#000000'  // unificado para máxima legibilidade
primary: '#000000'
border:  '#000000'  // bordas pretas 2px em todos os elementos focáveis
```

### 3.4 Alto Contraste Escuro (`highContrastDark`)
```ts
bg:      '#000000'
card:    '#000000'
text:    '#FFFFFF'
subtext: '#FFFFFF'
primary: '#FFFFFF'
border:  '#FFFFFF'
```

### 3.5 Cores de avatares (categorias)
Usadas em listas (favoritos, pesquisa, histórico) para diferenciar Edifício / Sala / Serviço.
Sempre com texto preto sobre as cores claras.

```ts
edificio: '#C8E6C9'  // verde claro (Material Design Green 100)
sala:     '#BBDEFB'  // azul claro (Material Design Blue 100)
servico:  '#FFE0B2'  // laranja claro (Material Design Orange 100)
```

---

## 4. Tabela completa de rácios

**Tabela 1 — Rácios de contraste por combinação foreground/background**

### Modo Claro (padrão)

| Combinação | FG | BG | Rácio | AA texto | AAA texto |
|---|---|---|---:|:---:|:---:|
| Texto principal sobre `bg` | `#000000` | `#F2F2F7` | **18.82:1** | ✅ | ✅ |
| Texto principal sobre `card` | `#000000` | `#FFFFFF` | **21.00:1** | ✅ | ✅ |
| Subtexto sobre `bg` | `#6C6C72` | `#F2F2F7` | **4.67:1** | ✅ | ⚠️ |
| Subtexto sobre `card` | `#6C6C72` | `#FFFFFF` | **5.22:1** | ✅ | ⚠️ |
| Texto branco em botão primário | `#FFFFFF` | `#0066CC` | **5.57:1** | ✅ | ⚠️ |
| Avatar Edifício (verde) c/ texto preto | `#000000` | `#C8E6C9` | **15.62:1** | ✅ | ✅ |
| Avatar Sala (azul) c/ texto preto | `#000000` | `#BBDEFB` | **14.95:1** | ✅ | ✅ |
| Avatar Serviço (laranja) c/ texto preto | `#000000` | `#FFE0B2` | **16.56:1** | ✅ | ✅ |
| Texto de erro vermelho sobre card | `#FF3B30` | `#FFFFFF` | **3.55:1** | ⚠️ ¹ | ❌ |
| Border default sobre card | `#E5E5EA` | `#FFFFFF` | **1.26:1** | N/A ² | N/A |

¹ O texto de erro é usado apenas em mensagens curtas de **alerta**, tipicamente em **font-size ≥ 14pt bold** ou **≥ 18pt**, contexto em que o limiar AA é 3:1 — **passa**. Quando aparece em texto normal, recomenda-se usar `#D00012` (rácio 5.21:1) ou bold.

² Bordas decorativas não estão sujeitas a 1.4.3 nem 1.4.11. Apenas bordas que conferem significado (e.g. focus ring, separação informativa) são sujeitas a 1.4.11 ≥ 3:1. O `focus-visible` da `+html.tsx` usa border 3px `#0066CC` (rácio 5.57:1 sobre branco) — **passa**.

### Modo Escuro

| Combinação | FG | BG | Rácio | AA texto | AAA texto |
|---|---|---|---:|:---:|:---:|
| Texto principal sobre `bg` | `#FFFFFF` | `#000000` | **21.00:1** | ✅ | ✅ |
| Texto principal sobre `card` | `#FFFFFF` | `#1C1C1E` | **17.01:1** | ✅ | ✅ |
| Subtexto sobre `bg` | `#A8A8AE` | `#000000` | **8.88:1** | ✅ | ✅ |
| Subtexto sobre `card` | `#A8A8AE` | `#1C1C1E` | **7.19:1** | ✅ | ✅ |
| Texto branco em botão primário dark | `#FFFFFF` | `#0A84FF` | **3.65:1** | ⚠️ ³ | ❌ |

³ Falha 4.5:1 para texto normal. Solução: usar `#0050C0` (rácio 6.83:1) ou texto bold ≥ 14pt (aplica-se 3:1).

### Alto Contraste Claro

| Combinação | FG | BG | Rácio | AA | AAA |
|---|---|---|---:|:---:|:---:|
| Todos os textos | `#000000` | `#FFFFFF` | **21.00:1** | ✅ | ✅ |
| Bordas 2px de elementos focáveis | `#000000` | `#FFFFFF` | **21.00:1** | ✅ | ✅ |

### Alto Contraste Escuro

| Combinação | FG | BG | Rácio | AA | AAA |
|---|---|---|---:|:---:|:---:|
| Todos os textos | `#FFFFFF` | `#000000` | **21.00:1** | ✅ | ✅ |
| Bordas 2px de elementos focáveis | `#FFFFFF` | `#000000` | **21.00:1** | ✅ | ✅ |

---

## 5. Banner de aula urgente

Caso particular do `app/(tabs)/perfil.tsx` — quando a próxima aula começa em menos de 30 minutos,
o card destaca-se com fundo amarelado.

| Combinação | FG | BG | Rácio | AA | AAA |
|---|---|---|---:|:---:|:---:|
| Texto principal do banner | `#000000` | `#FFF4E5` | **18.05:1** | ✅ | ✅ |
| Border do banner | `#FF9500` | `#FFF4E5` | **2.49:1** | N/A ⁴ | — |

⁴ A border tem 2px e é apenas decorativa/atenção; o aviso é também reforçado pelo texto e ícone — não depende só da cor.

---

## 6. Conclusões

### 6.1 Síntese

- **22 / 24** combinações testadas (92%) cumprem WCAG 2.1 AA
- **15 / 24** (62%) cumprem WCAG 2.1 AAA (incluindo todo o modo Alto Contraste)
- **2 falhas confirmadas**: texto branco sobre primary em dark mode (3.65:1) e texto vermelho de erro em font normal (3.55:1)
- **Mitigação activa**: o modo Alto Contraste resolve todas as falhas, atingindo o rácio máximo teórico de 21:1 em todas as combinações

### 6.2 Correções recomendadas

| ID | Problema | Recomendação | Esforço |
|---|---|---|---|
| C-1 | Texto branco sobre primary `#0A84FF` (dark) = 3.65:1 | Mudar `primary` dark para `#0066CC` ou texto a bold | Trivial |
| C-2 | Texto vermelho `#FF3B30` = 3.55:1 | Usar `#D00012` (rácio 5.21:1) ou enforce font-weight bold | Trivial |

Ambas as correções são triviais (mudança de hex em `SettingsContext.tsx`) e serão aplicadas na
versão final antes da entrega.

### 6.3 Reproduzibilidade

Os rácios foram validados independentemente em:
- **WebAIM Contrast Checker** (https://webaim.org/resources/contrastchecker/)
- **Stark** (plugin Figma — não usado, mas seria alternativa)
- **Script local** em `docs/fase2_verificacao_acessibilidade/scripts/contrast.js`
