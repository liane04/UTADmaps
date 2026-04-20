# Prompt — UTADmaps (Antigravity)

## Mockup References

The following mockup images are the **primary visual reference**. Replicate the layout, spacing, typography, and component style of each screen as closely as possible — treat them as the source of truth for the UI.

| Ficheiro | Ecrã |
|---|---|
| `mockups/image.png` | Welcome / Onboarding |
| `mockups/image copy.png` | Pesquisa (Search) |
| `mockups/image copy 2.png` | Navegação Indoor (Floor Plan) |
| `mockups/image copy 3.png` | Navegação Outdoor (Campus Map) |
| `mockups/image copy 4.png` | Mapa (Main Map Tab) |
| `mockups/image copy 5.png` | Perfil (Profile) |
| `mockups/image copy 6.png` | Definições (Settings) |
| `mockups/image copy 7.png` | Horário (Schedule) |

Look at each image carefully before generating the corresponding screen. Pay attention to font weight, element alignment, icon style, button shape, spacing, and exact wording of all labels.

---

## Goal

Build a **static, frontend-only UI prototype** of a mobile campus navigation app called **UTADmaps** using **Expo (React Native)** with `expo-router`. 

**Nothing needs to be functional.** No real maps, no API calls, no authentication, no state management. All data is hardcoded. The only goal is to reproduce the visual design of each screen as faithfully as possible to the mockups.

---

## Tech Stack

- **Framework:** Expo (React Native), SDK 51+
- **Navigation:** `expo-router` (tab + stack) — for moving between screens only
- **Styling:** `StyleSheet` API
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Maps:** use a plain `Image` or a gray `View` placeholder instead of a real MapView
- **Language:** TypeScript

---

## Design System

| Token | Value |
|---|---|
| Background | `#F2F2F7` |
| Card / Surface | `#FFFFFF` |
| Primary button | `#000000` |
| Text on button | `#FFFFFF` |
| Accent / Active | `#007AFF` |
| Text primary | `#000000` |
| Text secondary | `#8E8E93` |
| Divider | `#E5E5EA` |
| Border radius (cards) | `12px` |
| Border radius (buttons) | `12px` |
| Border radius (chips) | `20px` (pill) |
| Font | System default (SF Pro on iOS) |

---

## Navigation Structure

```
app/
  _layout.tsx               ← root layout
  welcome.tsx               ← shown first (static, button navigates to tabs)
  (tabs)/
    _layout.tsx             ← tab bar
    index.tsx               ← Mapa
    pesquisa.tsx            ← Pesquisa
    horario.tsx             ← Horário
    favoritos.tsx           ← Favoritos
    perfil.tsx              ← Perfil
  navigacao-outdoor.tsx
  navigacao-indoor.tsx
  definicoes.tsx
```

**Bottom tab bar — 5 tabs:**
Mapa · Pesquisa · Horário · Favoritos · Perfil

---

## Screens

### 1. Welcome (`welcome.tsx`)
- Small logo `Ü` top-center
- Bold heading: **"Bem-vindo ao UTAD Maps"**
- Subtitle: *"Navegue pelo campus com facilidade"*
- Language toggle pills: **Português** (selected/filled) | **English** (outline) — purely visual, no logic
- Text input: placeholder `"Email Institucional Login (optional)"` — no validation
- Black full-width button **"Continuar"** → navigates to `(tabs)/index`
- Text link **"Saltar e explorar"** → same navigation

---

### 2. Mapa (`(tabs)/index.tsx`)
- Light gray `View` filling the screen as map placeholder (draw some static rectangles/labels to represent buildings: Biblioteca, Bloco A, Bloco B, Cantina, Reitoria, Eng. Civil)
- Search bar overlay at top (white, rounded, shadow): placeholder `"Pesquisar edifício, sala, serviço..."`
- `+` / `−` zoom buttons bottom-right (decorative)
- Location crosshair button near zoom controls (decorative)

---

### 3. Pesquisa (`(tabs)/pesquisa.tsx`)
- Header: **"UTAD Campus"** centered
- Search bar with 🔍 icon and `×` clear button (hardcoded text `"Sala 2.1"`)
- Filter chips row: **Todos** (black/filled) | Edifícios | Salas | Serviços — static, no filtering
- Hardcoded result rows:
  - `B` avatar · Sala 2.1 – Bloco A · Piso 2 · Edifício A · `120m` → taps to `navigacao-indoor`
  - `B` avatar · Sala 2.1 – Bloco B · Piso 2 · Edifício B · `350m`
  - `S` avatar · Sala 2.10 – Bloco A · Piso 2 · Edifício A · `125m`
- Section **"Pesquisas recentes"**: pill chips — Biblioteca · Cantina Principal · Secretaria

---

### 4. Navegação Outdoor (`navigacao-outdoor.tsx`)
- Light gray `View` as map placeholder with a dashed blue line drawn using a `View` or SVG to simulate a route
- Back button `← Navegação Outdoor` top-left
- Bottom white panel (rounded top):
  - `450m – 6 min a pe`
  - Mode pills: **A pé** (selected) | Carro
  - Black button **"Terminar"** → `router.back()`

---

### 5. Navegação Indoor (`navigacao-indoor.tsx`)
- Back button `← Back` | **"Navegação Indoor"** | floor pill `Piso 2` top-right
- Heading: **"Sala 2.1 – Bloco A"**
- Static floor plan: use a plain `Image` of the mockup cropped to the floor plan area, or recreate it with `View` rectangles labeled with room names (2.2, 2.3, WC, Lab 1, Lab 2, Sala 2.1) and a dashed route path
- Bottom instruction card:
  - Up arrow icon
  - *"Siga pelo corredor"* / *"Vire à esquerda na sala 2.1"*
  - `Passo 2/3`
- Black button **"Terminar"** → `router.back()`

---

### 6. Horário (`(tabs)/horario.tsx`)
- Title **"Horário"** centered
- Day selector: Seg · Ter · Qua · **Qui** (active, black underline) · Sex · Sáb
- Date: *"Quinta-feira, 21 Março 2026"*
- Timeline with hour labels + hardcoded class cards:
  - *Programação Web* · Sala 1.3 – Bloco B · 09:00 – 11:00
  - *Livre* gap
  - *IPC* · Sala 2.1 – Bloco A · 14:00 – 16:00 → taps to `navigacao-indoor`
  - *Base de Dados* · Lab 2 – Bloco B · 16:00 – 18:00

---

### 7. Favoritos (`(tabs)/favoritos.tsx`)
- Empty state: heart icon + *"Sem favoritos ainda"* centered (decorative only)

---

### 8. Perfil (`(tabs)/perfil.tsx`)
- Circular avatar with initials `F` (gray background)
- **"Filipe Neves"** bold · *"filipe@utad.eu"* gray
- Próxima aula card (white, bordered):
  - **IPC** · Sala 2.1, Bloco A · Hoje, 14:00 – 16:00 · arrow icon → taps to `navigacao-indoor`
- Menu rows (chevron right): Favoritos · Histórico de Navegação · Horário Semanal · Definições → taps to `definicoes`

---

### 9. Definições (`definicoes.tsx`)
- `← Voltar` back button → `router.back()`
- Title **"Definições"** centered
- Section **ACESSIBILIDADE:**
  - Tamanho do Texto — decorative slider
  - Alto Contraste — Toggle (off)
  - Rotas Acessíveis *(Evitar escadas)* — Toggle (on)
  - Leitor de Ecrã — Toggle (off)
- Section **PERSONALIZAÇÃO:**
  - Idioma → `Português >`
  - Tema → `Claro >`
- Section **SOBRE:**
  - Suporte e Ajuda `>`
- Footer: `UTADmaps v1.0` small gray centered

---

## Important Notes

- **All data is hardcoded** — no useState for data, no fetch calls, no AsyncStorage
- **Toggles and sliders are purely visual** — they can have local useState just to animate the toggle, but nothing else changes
- **Map screens use placeholder Views** — no react-native-maps dependency needed
- **Navigation between screens is the only real logic needed**
- Pixel-match the mockups as closely as possible in terms of layout and visual style
