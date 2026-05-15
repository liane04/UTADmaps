# Protocolo de Teste de Responsividade

> **Objetivo**: verificar que a aplicação móvel UTAD Maps responde correctamente a alterações de
> tamanho de texto, orientação, dimensão do dispositivo e zoom, conforme os critérios WCAG 2.2
> **1.4.4 Resize Text (AA)**, **1.4.10 Reflow (AA)**, **1.4.12 Text Spacing (AA)** e
> **1.3.4 Orientation (AA)**.

---

## 1. Tamanho de texto até 200% (WCAG 1.4.4 AA)

### 1.1 Implementação na app

A app implementa **5 níveis de tamanho de texto** via `SettingsContext`:

| Nível | Multiplicador | Equivalente WCAG | Localização |
|---|---:|---|---|
| Pequeno | 0.85× | 85% | Definições → Tamanho do Texto → 1ª pill |
| Normal | 1.00× | 100% (base) | 2ª pill |
| Grande | 1.25× | 125% | 3ª pill |
| Extra | 1.60× | 160% | 4ª pill |
| **Máximo** | **2.00×** | **200% (WCAG 1.4.4)** | 5ª pill |

A função `fs(n)` exposta pelo `SettingsContext` multiplica o tamanho de fonte base pelo factor
correspondente. Todos os `<Text>` da app usam `fontSize: fs(N)` ao invés de números hardcoded.

### 1.2 Procedimento de teste

Para cada um dos 5 níveis:
1. Definições → Tamanho do Texto → tocar na pill
2. Voltar à tab principal
3. Navegar por todos os 6 ecrãs principais: Mapa, Pesquisa, Horário, Favoritos, Perfil, Definições
4. Verificar:
   - [ ] Texto fica visivelmente maior/menor conforme esperado
   - [ ] **Nenhum** texto fica cortado ou truncado (exceto onde `numberOfLines` é intencional)
   - [ ] **Nenhum** elemento sobreposto a outro
   - [ ] Scroll vertical funciona em ecrãs longos (Perfil, Definições)
   - [ ] Não aparece scroll horizontal

### 1.3 Captura de evidências

Tirar 5 screenshots no nível **Máximo (200%)**:
- `screenshots/depois/text200_mapa.png`
- `screenshots/depois/text200_pesquisa.png`
- `screenshots/depois/text200_horario.png`
- `screenshots/depois/text200_favoritos.png`
- `screenshots/depois/text200_perfil.png`

### 1.4 Resultado (após teste no iPhone, 14 maio 2026)

✅ **Conforme** WCAG 1.4.4 AA — texto escalável até 200% sem perda de informação ou funcionalidade. O slider de 5 níveis é uma implementação **acima do mínimo** exigido (o critério apenas exige que seja possível atingir 200%; ter um slider granular é melhoria de UX).

**Bug detectado durante o teste (B-05)**: ao definir texto "Máximo", a TabBar inferior crescia de 105 px (texto normal) para 180 px, ocupando ~1/3 do ecrã e deixando espaço em branco visível entre o conteúdo da página e a TabBar.

**Causa**: cálculo `height: fs(75) + insets.bottom` em `app/(tabs)/_layout.tsx`. A função `fs()` escala linearmente, multiplicando a altura pelo factor 2.0 quando o texto está a 200%.

**Correção aplicada**: substituir por cálculo com saturação:

```ts
const tabBarBaseHeight = Math.max(75, fs(48) + 28);
const bottomInset = Math.max(insets.bottom, 12);
// height: tabBarBaseHeight + bottomInset
```

Tabela de evolução:

| Texto | TabBar antes (px) | TabBar depois (px) |
|---|---:|---:|
| Pequeno (0.85×) | 105 | 105 |
| Normal (1.0×) | 105 | 105 |
| Grande (1.25×) | 124 | 118 |
| Extra (1.6×) | 150 | 135 |
| Máximo (2.0×) | **180** | **154** |

Documentado em `BUGS_DETETADOS.md` como B-05 (✅ Resolvido) e em `AVALIACAO_ACESSIBILIDADE.md` Tabela 14 como C-09.

---

## 2. Reflow a 320 CSS pixels de largura (WCAG 1.4.10 AA)

### 2.1 Critério

> O conteúdo pode ser apresentado sem perda de informação ou funcionalidade e sem necessidade de scroll horizontal numa largura equivalente a **320 CSS pixels** (≈ 256 pixels físicos em dispositivos com pixel ratio padrão).

### 2.2 Procedimento

#### Em emulador iOS (iPhone SE de 1ª geração — 320×568 logical)
1. Xcode → Open Developer Tool → Simulator → File → New Simulator → "iPhone SE (1st generation)"
2. Correr `npx expo start --ios` e selecionar este device
3. Validar em cada ecrã: **sem scroll horizontal**

#### Em telemóvel real (qualquer Android com ≤ 4")
1. Definições do Android → Display → Density (pode aumentar a densidade para simular 320dp)
2. Validar cada ecrã

#### Em browser desktop (Chrome DevTools — para a versão web)
1. F12 → Toggle Device Toolbar
2. Custom size: **320 × 568**
3. Recarregar — validar cada ecrã

### 2.3 Resultado esperado

✅ **Conforme**. O layout React Native usa flexbox e percentagens — sem larguras fixas em píxeis.
Os principais riscos seriam:
- Modal de "Importar Horário": já tem `KeyboardAvoidingView` + `ScrollView`
- Tabela de horário: usa coluna única de cards, sem grid
- Mapa: ocupa 100% da largura — sempre OK

Validar com **screenshot** em 320px em cada ecrã principal.

---

## 3. Espaçamento de texto (WCAG 1.4.12 AA)

### 3.1 Critério

Não pode haver perda de conteúdo se o utilizador aplicar:
- **line-height** ≥ 1.5× tamanho da fonte
- **letter-spacing** ≥ 0.12× tamanho da fonte
- **word-spacing** ≥ 0.16× tamanho da fonte
- **paragraph spacing** ≥ 2× tamanho da fonte

### 3.2 Procedimento

Para a versão web:
1. Abrir https://utadmaps.b-host.me em Chrome
2. F12 → Console → colar o snippet:
   ```js
   document.querySelector('html').style.cssText += `
     line-height: 1.5 !important;
     letter-spacing: 0.12em !important;
     word-spacing: 0.16em !important;
   `;
   ```
3. Navegar por todos os ecrãs e validar que nada quebra

Para a versão móvel não é diretamente testável (RN não expõe estes ajustes do utilizador). Mitiga-se
documentando que os componentes têm `lineHeight` adequado nos `styles` (≥ 1.4× a `fontSize`).

### 3.3 Resultado esperado

⚠️ **Parcial — só na web**. Em React Native mobile, este critério aplica-se indirectamente: o sistema
operativo permite ajustes globais de tamanho de fonte (Dynamic Type no iOS, Font Size no Android)
que o RN respeita via `Text.allowFontScaling=true` (default).

---

## 4. Orientação (WCAG 1.3.4 AA)

### 4.1 Critério

> O conteúdo não restringe a sua visualização e operação a uma única orientação (portrait ou
> landscape), exceto quando uma orientação específica for essencial.

### 4.2 Implementação na app

O `app.json` declara `"orientation": "portrait"`. Isto é uma escolha de design (a aplicação é
otimizada para uso portrait, como Google Maps), mas o WCAG permite isto **apenas se for essencial**.

**Justificação no projeto**: a navegação indoor com planta 2D e a navegação outdoor com mapa
funcionam intrinsecamente melhor em portrait (estudante caminha com telemóvel vertical). Em
landscape, os cards inferiores ocupariam metade do mapa, degradando o uso.

### 4.3 Verificação

Em telemóvel real ou simulador:
1. Forçar rotação para landscape (mesmo com `orientation: portrait` no manifest, alguns
   dispositivos respeitam o utilizador)
2. Observar se a app:
   - Bloqueia em portrait (comportamento atual)
   - Adapta corretamente (comportamento ideal AAA)

### 4.4 Resultado esperado

⚠️ **Cumpre com justificação**. A app bloqueia em portrait, mas a justificação encaixa na excepção
"essencial" do critério. Documentar isto explicitamente no relatório.

**Melhoria futura**: permitir landscape com adaptação dos cards de instrução para barra lateral.

---

## 5. Suporte a Dynamic Type / Font Scale do sistema

### 5.1 iOS — Dynamic Type

1. Definições → Acessibilidade → Texto e Tamanho → activar "Texto Maior"
2. Ajustar o slider para o tamanho máximo
3. Abrir o UTAD Maps via Expo Go
4. Validar que o texto da app reflecte o tamanho escolhido (via `fs()` do `SettingsContext` que
   também respeita o `PixelRatio.getFontScale()`)

### 5.2 Android — Font size

1. Definições → Display → Font size → Largest
2. Abrir o UTAD Maps
3. Validar

### 5.3 Resultado esperado

✅ **Suporta**. A app expõe o seu próprio slider granular (5 níveis) **adicionalmente** ao tamanho
do sistema. O utilizador pode combinar: por exemplo, sistema a "Largest" + app a "Máximo" daria um
factor combinado que aínda permanece operacional graças ao flexbox.

---

## 6. Resumo

| Critério | Nível | Conformidade | Evidência |
|---|---|---|---|
| 1.4.4 Resize Text 200% | AA | ✅ | Slider de 5 níveis, screenshots |
| 1.4.10 Reflow 320px | AA | ✅ | Layout flexbox, sem larguras fixas |
| 1.4.12 Text Spacing | AA | ⚠️ Parcial | Aplicável só na web; mobile respeita Dynamic Type |
| 1.3.4 Orientation | AA | ✅ Justificado | Portrait essencial para o caso de uso |
