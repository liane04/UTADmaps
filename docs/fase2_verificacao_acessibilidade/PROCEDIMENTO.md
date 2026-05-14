# Procedimento de Avaliação — passo a passo

> Aplicação alvo: **UTAD Maps** — aplicação móvel React Native (Expo) para iOS e Android.
> Referencial: **WCAG 2.2 nível AA**.
> Combinação: 3 ferramentas automáticas + 4 procedimentos de análise manual.

Esta avaliação executa-se em ~6 horas distribuídas por 2 dias.

---

## Pré-requisitos

- [ ] PC com Node.js 20+, npm e Git instalados
- [ ] Telemóvel iOS (qualquer iPhone com iOS 15+) **OU** telemóvel Android (Android 10+)
- [ ] Expo Go instalado no telemóvel (App Store / Google Play)
- [ ] Google Chrome desktop (para Lighthouse, axe DevTools)
- [ ] Acesso ao repositório UTADmaps em `git clone` local
- [ ] Pasta `docs/fase2_verificacao_acessibilidade/screenshots/depois/` criada

### Setup inicial (uma vez)
```bash
cd UTADmaps
npm install --legacy-peer-deps
npx expo start --tunnel
```

Aguarda o QR code aparecer. Scan no telemóvel → abre no Expo Go.

---

## A — Avaliação Automática

### A.1 — Lighthouse (Chrome DevTools, mobile emulation)

**Finalidade**: obter um score 0–100 de acessibilidade da app em **modo mobile**, complementado por
audits específicos do W3C/WCAG.

**Tempo estimado**: 15 minutos.

#### Passos

1. Correr a app no browser:
   ```bash
   cd UTADmaps
   npx expo start --web
   ```
   Abre `http://localhost:8081` no Chrome.

2. Abrir Chrome DevTools (F12) → tab **Device toolbar** → escolher **iPhone 12 Pro**.

3. Tab **Lighthouse**:
   - Mode: **Navigation (Default)**
   - Device: **Mobile**
   - Categorias: ☑ Accessibility, ☑ Best Practices, ☑ SEO, ☐ Performance (opcional)
   - Clica **Analyze page load**

4. Aguardar 30–60 segundos.

5. **Tirar screenshots**:
   - `screenshots/depois/01_lighthouse_scores.png` — os 4 scores circulares
   - `screenshots/depois/02_lighthouse_a11y_detalhe.png` — expandir secção "Accessibility"

6. Anotar em `EVIDENCIAS.md`:
   - Score Accessibility: **___/100**
   - Audits Passed: **___**
   - Audits Failed (lista): **___**
   - Manual checks: **___**

> **Dica**: percorre o fluxo principal (mapa → pesquisa → resultado → ir) antes de correr o
> Lighthouse, para que a página esteja num estado representativo.

---

### A.2 — axe DevTools (extensão Chrome)

**Finalidade**: detectar issues automáticos de acessibilidade, com link directo para o critério WCAG e
sugestão de correcção.

**Tempo estimado**: 10 minutos.

#### Instalação (uma vez)
Chrome Web Store → "axe DevTools" by Deque → **Add to Chrome**.

#### Passos

1. Mesma sessão do Lighthouse, F12 → tab **axe DevTools**.

2. Clica **Scan ALL of my page**.

3. **Tirar screenshots**:
   - `screenshots/depois/03_axe_resumo.png` — lista completa de issues
   - `screenshots/depois/04_axe_issue_detalhe.png` — clicar 1 issue e mostrar painel direito

4. Anotar:
   - Critical: **___**
   - Serious: **___**
   - Moderate: **___**
   - Minor: **___**
   - Para cada issue, copiar: critério WCAG, descrição, ficheiro/linha sugerido

---

### A.3 — React Native Accessibility Inspector (iOS Simulator)

**Finalidade**: validar que os atributos `accessibilityLabel`, `accessibilityRole` e `accessibilityHint`
declarados no código TypeScript são efectivamente propagados para o sistema iOS.

**Tempo estimado**: 20 minutos.

> Esta ferramenta exige **Xcode** e **macOS**. Se não tens acesso a um Mac, **substitui por
> TalkBack Developer Settings no Android** (ver A.4 alternativo).

#### Passos (macOS + Xcode)

1. Abrir Xcode → Open Developer Tool → **Accessibility Inspector**.
2. No Simulator iOS, abrir o UTAD Maps via Expo Go.
3. No Accessibility Inspector, escolher **iOS Simulator** como target.
4. Ativar o **inspetor de ponto** (cursor → cross-hair no canto).
5. Clicar em vários elementos da app:
   - Botão "Ir" → confirmar Label = "Ir para X", Role = "button", Hint presente
   - Switch "Alto Contraste" → confirmar Role = "switch", Value = "0" ou "1"
   - TextInput de pesquisa → Label = "Campo de pesquisa", Hint presente

6. **Tirar screenshots**:
   - `screenshots/depois/05_accessibility_inspector_botao.png`
   - `screenshots/depois/06_accessibility_inspector_switch.png`

7. Documentar no `EVIDENCIAS.md` a tabela:
   | Elemento | Label esperada | Label efectiva | OK? |

---

### A.4 — Alternativa: TalkBack Developer Settings (Android)

Se não tens macOS, podes usar o TalkBack do Android com modo **verbose** que mostra os atributos.

1. Telemóvel Android → Definições → Acessibilidade → TalkBack → Definições → Desenvolvedor → ativar
   "Falar elementos não verbais" e "Falar conteúdo de hint".
2. Activar TalkBack (volume + power).
3. Tocar nos mesmos elementos do A.3.
4. Gravar áudio com app de gravador externo do que o TalkBack diz.
5. Documentar no `EVIDENCIAS.md`.

---

## B — Análise Manual

### B.1 — Auditoria de atributos por ficheiro

Já realizada. Consulta `INVENTARIO_ATRIBUTOS_A11Y.md` para a tabela completa e gaps detectados.

**Output**: tabela com 78 controlos contabilizados, cobertura ~95% de `accessibilityLabel`.

---

### B.2 — Cálculo de rácios de contraste

Já realizada. Consulta `CONTRASTE.md` para a tabela completa.

**Para reproduzir**:
```bash
cd docs/fase2_verificacao_acessibilidade/scripts
node contrast.js
# ou para um par específico:
node contrast.js "#FF3B30" "#FFFFFF"
```

**Output**: 22 de 24 combinações cumprem AA. 2 falhas documentadas com mitigação.

---

### B.3 — Teste com VoiceOver / TalkBack

Seguir o protocolo em `TESTE_LEITORES_ECRA.md`:
- 5 tarefas-tipo (T1–T5)
- 3 modalidades (visual / leitor visível / leitor cego)
- Folha de registo em `EVIDENCIAS.md`

**Tempo estimado**: 90 minutos (15 min por tarefa × 5 tarefas).

**Tirar screenshots/vídeos**:
- `screenshots/depois/07_voiceover_T1_onboarding.png` (ou .mp4)
- `screenshots/depois/08_voiceover_T2_pesquisa.png`
- `screenshots/depois/09_voiceover_T3_alto_contraste.png`

---

### B.4 — Teste de responsividade

Seguir o protocolo em `TESTE_RESPONSIVO.md`:
- Tamanho de texto 200% — screenshot por ecrã
- Reflow a 320px
- Espaçamento de texto (só web)
- Orientação portrait/landscape

**Tempo estimado**: 30 minutos.

**Tirar screenshots**:
- `screenshots/depois/10_text200_mapa.png`
- `screenshots/depois/11_text200_horario.png`
- `screenshots/depois/12_320px_pesquisa.png`
- `screenshots/depois/13_alto_contraste.png`

---

## C — Compilação e relatório

### C.1 — Preencher `CHECKLIST_WCAG.md`

Para cada um dos 40 critérios WCAG 2.2 A+AA aplicáveis, registar:
- ✅ Conforme — com evidência (screenshot ou observação)
- ⚠️ Parcial — com descrição do gap
- ❌ Não conforme — com plano de correção
- N/A — com justificação

### C.2 — Preencher `AVALIACAO_ACESSIBILIDADE.md` (texto da secção 3.6)

Substituir todos os marcadores `TODO/XX/YY` pelos números reais obtidos.

### C.3 — Compilação para Word

1. Copiar o conteúdo de `AVALIACAO_ACESSIBILIDADE.md`.
2. Colar no documento Word do relatório, secção **3.6**.
3. Converter tabelas Markdown em tabelas Word (Insert → Table → Convert text to table).
4. Inserir screenshots como figuras numeradas com captions descritivos.
5. Validar formatação final (estilos de cabeçalho, paginação, índice automático).

---

## D — Verificações finais antes da submissão

- [ ] 13 screenshots em `screenshots/depois/`
- [ ] `EVIDENCIAS.md` com todos os números e observações
- [ ] `CHECKLIST_WCAG.md` com 40/40 critérios marcados
- [ ] `AVALIACAO_ACESSIBILIDADE.md` sem placeholders `TODO/XX`
- [ ] Secção 3.6 inserida no documento Word do relatório com figuras e captions
- [ ] PDF do relatório gerado e revisto
- [ ] Submissão na plataforma NONIO antes de 15 maio às 23:59

---

## Cronograma sugerido (2 dias)

| Dia | Hora | Tarefa | Output |
|---|---|---|---|
| **Dia 1 (terça 14 mai)** | 18:00–19:00 | A.1 Lighthouse + A.2 axe | 4 screenshots |
| | 19:00–20:00 | A.3 ou A.4 (Accessibility Inspector / TalkBack) | 2–3 screenshots |
| | 20:00–22:00 | B.3 Teste com leitor de ecrã (5 tarefas) | 3 vídeos + folha |
| **Dia 2 (quarta 15 mai)** | 10:00–11:00 | B.4 Teste responsividade | 4 screenshots |
| | 11:00–12:00 | C.1 Preencher checklist | ficheiro completo |
| | 14:00–17:00 | C.2 Preencher relatório + C.3 Word | secção 3.6 pronta |
| | 17:00–18:00 | Revisão final e submissão NONIO | submissão |
