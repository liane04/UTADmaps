# Checklist Final — Entrega Fase 2 (15 maio 2026, 23:59 NONIO)

> Use este documento como **lista de verificação última** antes da submissão.
> Tudo o que esteja marcado a ✅ está documentado e pronto. Tudo ⏳ ainda precisa de acção tua.

---

## 1. Avaliação automática (4 ferramentas)

| Ferramenta | Estado | Output | Localização |
|---|:---:|---|---|
| **Lighthouse 12** (mobile) | ✅ | 100/100 Accessibility | `resultados/lighthouse-antes.{html,json}` |
| **axe-core 4.11** | ✅ | 1 → 0 violations | `resultados/axe-{antes,depois}.{html,json}` |
| **pa11y 9** | ✅ | 2 falsos positivos | `resultados/pa11y-depois.{html,json}` |
| **T.A.W.** (UC) | ✅ | 4 erros (mesma raiz) + 5 avisos + 26 manual | `resultados/taw-antes.{html,json}` |

## 2. Análise manual (4 procedimentos)

| # | Procedimento | Estado | Documento |
|---|---|:---:|---|
| B.1 | Inventário de atributos React Native em 12 ficheiros | ✅ | `INVENTARIO_ATRIBUTOS_A11Y.md` |
| B.2 | Rácios de contraste em 24 combinações de cores | ✅ | `CONTRASTE.md` + `scripts/contrast.js` |
| B.3 | Exploração com VoiceOver no iPhone (modalidade A + B) | ✅ | `EVIDENCIAS.md` secção A.4 |
| B.4 | Responsividade (texto 200%, alto contraste, reflow, orientação) | ✅ | `EVIDENCIAS.md` secção B.4 + `TESTE_RESPONSIVO.md` |

## 3. Documentos produzidos

| Documento | Linhas | Estado |
|---|---:|:---:|
| `AVALIACAO_ACESSIBILIDADE.md` (texto 3.6 do relatório) | ~330 | ✅ |
| `CHECKLIST_WCAG.md` (40 critérios A+AA) | ~200 | ✅ |
| `EVIDENCIAS.md` (dados reais) | ~370 | ✅ |
| `CONTRASTE.md` | ~190 | ✅ |
| `INVENTARIO_ATRIBUTOS_A11Y.md` | ~260 | ✅ |
| `WCAG22_NOVOS_CRITERIOS.md` | ~210 | ✅ |
| `TESTE_LEITORES_ECRA.md` | ~200 | ✅ |
| `TESTE_RESPONSIVO.md` | ~210 | ✅ |
| `PROCEDIMENTO.md` | ~250 | ✅ |
| `BUGS_DETETADOS.md` | ~140 | ✅ |
| `README.md` | ~130 | ✅ |
| **TOTAL** | **~2500 linhas Markdown** | ✅ |

## 4. Correções aplicadas durante a Fase 2 (9)

| ID | Descrição | Critério WCAG |
|---|---|---|
| C-01 | `app/+html.tsx` (NOVO) com `lang="pt-PT"`, title, meta description, skip-link, focus-visible | 3.1.1 · 2.4.2 · 2.4.1 · 2.4.7 |
| C-02 | `app.json` com campo `description` | 2.4.2 |
| C-03 | 3 TextInput com label + hint + textContentType | 4.1.2 · 1.3.5 · 3.3.8 |
| C-04 | ~65 TouchableOpacity com accessibilityLabel + Role | 4.1.2 |
| C-05 | hitSlop em 8 ficheiros | 2.5.8 (WCAG 2.2 novo) |
| C-06 | Botão eye em login com accessibilityState | 4.1.2 · 3.3.8 |
| C-07 | accessibilityHint em cards e botões principais | 3.3.2 |
| **C-08** | **Bug B-03**: comentário JSX reorganizado em `definicoes.tsx` (LogBox "Text strings" removido) | 4.1.2 (indireto) |
| **C-09** | **Bug B-05**: cálculo de altura da TabBar com saturação (`Math.max(75, fs(48)+28)`) | **1.4.4 Resize Text (AA)** |

## 5. Conformidade WCAG 2.2 AA — score final

| Princípio | Conformes ✅ | Parciais ⚠️ | Não conformes ❌ |
|---|---:|---:|---:|
| 1. Percetível | 10 | 2 | 0 |
| 2. Operável | 10 | 1 | 0 |
| 3. Compreensível | 8 | 1 | 0 |
| 4. Robusto | 1 | 1 | 0 |
| **TOTAL** | **29 (85%)** | **5 (15%)** | **0** |

> **0 critérios não conformes**. Aplicação cumpre adicionalmente alguns critérios AAA (1.4.6 Contrast Enhanced, 1.4.8 Visual Presentation parcial, 2.4.10 Section Headings).

---

## ⏳ O que ainda falta fazer

### Screenshots a tirar (~10 min no iPhone)

- [ ] `screenshots/depois/12_text200_mapa.png` — Mapa com texto a Máximo (validar TabBar corrigida)
- [ ] `screenshots/depois/13_text200_definicoes.png` — Definições com texto a Máximo
- [ ] `screenshots/depois/14_alto_contraste_mapa.png` — Mapa em Alto Contraste
- [ ] `screenshots/depois/15_alto_contraste_definicoes.png` — Definições em Alto Contraste
- [ ] `screenshots/taw/01_taw_perceivable.png` (renomear screenshot existente)
- [ ] `screenshots/taw/02_taw_operable.png`
- [ ] `screenshots/taw/03_taw_understandable.png`
- [ ] `screenshots/taw/04_taw_robust.png`

### Integração no relatório Word (~30 min)

- [ ] Copiar o conteúdo de `AVALIACAO_ACESSIBILIDADE.md` para a secção **3.6** do documento Word
- [ ] Converter tabelas Markdown em tabelas Word (Insert → Table → Convert text to table)
- [ ] Inserir screenshots como **Figuras X.1 a X.11** com captions descritivos
- [ ] Renumerar as figuras coerentemente com as restantes do relatório
- [ ] Validar índice automático

### Submissão NONIO (~5 min)

- [ ] Gerar PDF do relatório final
- [ ] Validar PDF (verificar paginação, tabelas, figuras)
- [ ] Upload no NONIO
- [ ] Confirmar recibo de submissão

---

## 🎯 Pontos fortes do trabalho para mencionar oralmente se houver apresentação

1. **4 ferramentas automáticas em vez das 1 ou 2 típicas** — incluindo a T.A.W. recomendada pelos docentes
2. **Combinação rigorosa de automático + manual** — cobertura dos 67 audits Lighthouse + 26 manual checks T.A.W.
3. **2 bugs detectados e CORRIGIDOS durante a Fase 2** — B-03 (LogBox) e B-05 (TabBar 200%) — evidência do valor do teste manual
4. **Conformidade WCAG 2.2 AA com 0 critérios falhados** (29 ✅ / 5 ⚠️ / 0 ❌)
5. **Sobreconformidade AAA em vários critérios** — 1.4.6 Contraste Enhanced (rácio 21:1), 2.4.10 Headings, 1.4.8 parcial
6. **9 novos critérios WCAG 2.2 analisados individualmente** em documento dedicado
7. **Scripts reproduzíveis** — `contrast.js` para qualquer pessoa validar os rácios
8. **Documentação de ~2500 linhas Markdown** + 3 relatórios HTML formatados das ferramentas

---

## 🎤 Resposta-tipo se te perguntarem

**P: "Resume a Fase 2 em 30 segundos."**
> "Combinei 4 ferramentas automáticas — Lighthouse, axe-core, pa11y e a T.A.W. indicada pelos docentes — com 4 análises manuais segundo o WCAG 2.2 AA. A app teve 100/100 no Lighthouse, 0 violations no axe após adicionar `<main>` e skip-link, e os 4 erros do T.A.W. são todos da mesma raiz (form controls sem `<label>` HTML clássico — já mitigados com `aria-label` via `accessibilityLabel` do React Native). Durante o teste manual no iPhone detectei e corrigi 2 bugs que as ferramentas automáticas não apanharam: um LogBox vermelho e a TabBar a crescer 80% com texto a 200%. No total, 9 correções, 29 critérios WCAG 2.2 AA totalmente conformes e 0 falhas."
