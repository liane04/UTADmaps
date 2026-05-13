# Evidências da Avaliação de Acessibilidade

> Template para registar os valores e observações obtidos durante a execução do `PROCEDIMENTO.md`.
> Após preencher, transferir os números para `AVALIACAO_ACESSIBILIDADE.md` (substituir `[VAL]`).

**Data da avaliação**: _________________
**Avaliador**: _________________
**Dispositivo iOS**: _________________ · iOS _____
**Dispositivo Android**: _________________ · Android _____

---

## A. Avaliação Automática

### A.1 Lighthouse (Chrome DevTools, mobile)

**URL avaliada**: http://localhost:8081 (ou utadmaps.b-host.me)
**Device emulado**: ____________________ (e.g. iPhone 12 Pro)
**Data/hora**: ____________________

| Métrica | Valor |
|---|---|
| Score Accessibility | _____/100 |
| Score Best Practices | _____/100 |
| Score SEO | _____/100 |
| Audits Passed | _____ |
| Audits Failed | _____ |
| Manual checks suggested | _____ |
| N/A | _____ |

**Audits failed (lista)**:
1. ___________________________________________________________ → critério WCAG ______
2. ___________________________________________________________ → critério WCAG ______
3. ___________________________________________________________ → critério WCAG ______
4. ___________________________________________________________ → critério WCAG ______

**Screenshots tirados**:
- [ ] `01_lighthouse_scores.png`
- [ ] `02_lighthouse_a11y_detalhe.png`

---

### A.2 axe DevTools

**Data/hora**: ____________________

| Severidade | Antes Fase 2 | Após Fase 2 |
|---|---:|---:|
| Critical | _____ | _____ |
| Serious | _____ | _____ |
| Moderate | _____ | _____ |
| Minor | _____ | _____ |
| **Total** | **_____** | **_____** |

**Issues remanescentes (top 5 por severidade)**:

| # | Severidade | Critério WCAG | Descrição | Ficheiro:linha sugerido |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

**Screenshots tirados**:
- [ ] `03_axe_resumo.png`
- [ ] `04_axe_issue_detalhe.png`

---

### A.3 Accessibility Inspector (iOS)

> Alternativa Android: TalkBack Developer Settings em A.4

| Elemento | Label esperada | Label efectiva | Role | Hint | ✅/⚠️/❌ |
|---|---|---|---|---|:---:|
| Botão "Ir" no card | "Ir para X" | | button | "Inicia a navegação..." | |
| Switch "Alto Contraste" | "Alto Contraste" | | switch | — | |
| Switch "Rotas Acessíveis" | "Rotas Acessíveis" | | switch | — | |
| TextInput pesquisa | "Campo de pesquisa" | | none | "Escreve o nome..." | |
| TextInput email login | "Email" | | none | — | |
| Botão "Importar Horário" | "Importar Horário" | | button | — | |
| Card "Próxima Aula" | "Navegar para próxima aula" | | button | — | |
| Botão Voltar (Definições) | "Voltar" | | button | — | |
| Pill "Máximo" tamanho texto | "Máximo" | | button (deveria ter selected) | — | |
| Chip "Edifícios" pesquisa | "Edifícios" | | button (deveria ter selected) | — | |
| Botão ♡ favoritar | (gap G-04) | | (faltar) | — | |
| Botão eye password | "Mostrar/Esconder password" | | button | — | |

**Screenshots tirados**:
- [ ] `05_a11y_inspector_botao.png`
- [ ] `06_a11y_inspector_switch.png`

---

## B. Análise Manual

### B.1 Auditoria de atributos

Esta análise está pré-feita em `INVENTARIO_ATRIBUTOS_A11Y.md`. Confirmar que a tabela bate certo
após eventuais alterações ao código:

- [ ] N.º TouchableOpacity/Pressable total: _____ (esperado ~78 nos 12 ficheiros)
- [ ] Cobertura `accessibilityLabel`: _____ % (esperado ≥ 65%)
- [ ] Cobertura `accessibilityRole`: _____ % (esperado ≥ 70%)
- [ ] Switches com role+state: _____/3 (esperado 3/3)
- [ ] TextInput com label: _____/3 (esperado 3/3)

---

### B.2 Rácios de contraste

Esta análise está pré-feita em `CONTRASTE.md`. Confirmar reprodução:

```bash
cd docs/fase2_verificacao_acessibilidade/scripts
node contrast.js
```

- [ ] Combinações testadas: 24 (ver `CONTRASTE.md`)
- [ ] Cumprem AA: _____/24 (esperado ≥ 22)
- [ ] Cumprem AAA: _____/24
- [ ] Falhas detectadas (lista): _____, _____

---

### B.3 Teste com VoiceOver / TalkBack

Para cada tarefa, registar tempo, sucesso (modalidade C = ecrã coberto), tentativas e observações.

#### T1 — Onboarding e selecção de idioma

| Modalidade | Tempo (s) | Sucesso | Tentativas |
|---|---|---|---|
| A — Visual | | | |
| B — Leitor visível | | | |
| C — Leitor com ecrã coberto | | | |

**Observações**:
_________________________________________________________________
_________________________________________________________________

**Critérios cumpridos**: ___/3

#### T2 — Encontrar a sala G0.08 e iniciar navegação

| Modalidade | Tempo (s) | Sucesso | Tentativas |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

**Observações**:
_________________________________________________________________

**Critérios cumpridos**: ___/4

#### T3 — Activar Alto Contraste e ampliar texto a 200%

| Modalidade | Tempo (s) | Sucesso | Tentativas |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

**Observações**:
_________________________________________________________________

**Critérios cumpridos**: ___/4

#### T4 — Importar horário do Inforestudante

| Modalidade | Tempo (s) | Sucesso | Tentativas |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

**Observações**:
_________________________________________________________________

**Critérios cumpridos**: ___/4

#### T5 — Adicionar aos favoritos e remover

| Modalidade | Tempo (s) | Sucesso | Tentativas |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

**Observações**:
_________________________________________________________________

**Critérios cumpridos**: ___/4

#### Resumo geral T1–T5

- **Sucesso na modalidade C**: ___/5 tarefas (critério de aprovação: ≥ 4/5)
- **Tempo médio modalidade A**: _____s
- **Tempo médio modalidade C**: _____s (ratio C/A: _____)
- **Pontos críticos detectados**:
  1. _________________________________________________________________
  2. _________________________________________________________________
  3. _________________________________________________________________

**Screenshots/vídeos**:
- [ ] `07_voiceover_T1_onboarding.png/.mp4`
- [ ] `08_voiceover_T2_pesquisa.png/.mp4`
- [ ] `09_voiceover_T3_alto_contraste.png/.mp4`
- [ ] `10_voiceover_T4_horario.png/.mp4`
- [ ] `11_voiceover_T5_favoritos.png/.mp4`

---

### B.4 Teste de Responsividade

#### Texto 200%

Configurar Definições → Tamanho do Texto → Máximo, depois validar cada ecrã.

| Ecrã | Conteúdo cortado? | Sobreposição? | Scroll horizontal? |
|---|:---:|:---:|:---:|
| Mapa | | | |
| Pesquisa | | | |
| Horário | | | |
| Favoritos | | | |
| Perfil | | | |
| Definições | | | |

**Screenshots**:
- [ ] `12_text200_mapa.png`
- [ ] `13_text200_pesquisa.png`
- [ ] `14_text200_horario.png`
- [ ] `15_text200_perfil.png`

#### Reflow 320×568

Chrome DevTools → Custom 320×568, validar:
- [ ] Mapa renderiza sem scroll horizontal
- [ ] Pesquisa funciona normalmente
- [ ] Horário cards não sobrepõem
- [ ] Modal "Importar Horário" cabe

#### Alto Contraste

- [ ] Activado em Definições
- [ ] Aplicado a todos os ecrãs
- [ ] Bordas 2px visíveis em elementos focáveis

**Screenshots**:
- [ ] `16_alto_contraste_mapa.png`
- [ ] `17_alto_contraste_definicoes.png`

#### Orientação

- [ ] App bloqueia em portrait (esperado)
- [ ] Justificação documentada em `TESTE_RESPONSIVO.md` secção 4

---

## C. Síntese final

### Score WCAG 2.2 AA

A partir do `CHECKLIST_WCAG.md`:

- **Critérios conformes (✅)**: _____ / 34 = _____ %
- **Critérios parcialmente conformes (⚠️)**: _____ / 34
- **Critérios não conformes (❌)**: _____ / 34
- **N/A**: _____ / 39

### Pontos fortes

1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________

### Pontos a melhorar (priorizado)

| Prioridade | Item | Esforço estimado | Critério WCAG |
|---|---|---|---|
| Alta | | | |
| Alta | | | |
| Média | | | |
| Baixa | | | |

---

## Anexo — Lista de screenshots

Inventário esperado em `screenshots/depois/`:

| # | Ficheiro | Tema |
|---|---|---|
| 01 | `01_lighthouse_scores.png` | Lighthouse 4 scores |
| 02 | `02_lighthouse_a11y_detalhe.png` | Lighthouse Accessibility audits |
| 03 | `03_axe_resumo.png` | axe DevTools lista de issues |
| 04 | `04_axe_issue_detalhe.png` | axe issue específico |
| 05 | `05_a11y_inspector_botao.png` | Accessibility Inspector — botão "Ir" |
| 06 | `06_a11y_inspector_switch.png` | Accessibility Inspector — switch Alto Contraste |
| 07-11 | `voiceover_T1..T5.png/.mp4` | VoiceOver nas 5 tarefas |
| 12-15 | `text200_*.png` | Texto 200% nos ecrãs principais |
| 16-17 | `alto_contraste_*.png` | Modo Alto Contraste |

Total esperado: **15–17 screenshots**.
