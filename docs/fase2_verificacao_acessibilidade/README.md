# Fase 2 — Avaliação de Acessibilidade

**Desafio 3 · Interação Pessoa-Computador · UTAD 2025/2026 · Entrega: 15 maio 2026**

Esta pasta contém toda a documentação da Fase 2: avaliação de acessibilidade do **UTAD Maps**,
uma **aplicação móvel** desenvolvida em React Native (Expo) para o campus da UTAD.

---

## Natureza da aplicação

O UTAD Maps é uma **aplicação móvel mobile-first** desenvolvida em React Native via Expo,
distribuída para:

- **iOS** — via Expo Go ou build EAS
- **Android** — via Expo Go ou build EAS

A *versão web* (`utadmaps.b-host.me`) existe apenas como **subproduto técnico do framework Expo**
e serve como rampa de instalação rápida e modo de inspeção do código por programadores. **Não é o produto** —
é a app móvel que está em avaliação nesta Fase 2, com particular ênfase no comportamento em telemóveis.

A versão web não inclui a navegação indoor 3D (depende de Three.js em WebView nativo) e por isso a
avaliação concentra-se nos artefactos mobile: atributos React Native (`accessibilityLabel`,
`accessibilityRole`, `accessibilityHint`, `accessibilityState`), comportamento com leitor de ecrã
(VoiceOver iOS / TalkBack Android), responsividade ao zoom de sistema do telemóvel, e conformidade
com o referencial **WCAG 2.2 nível AA** aplicado ao contexto mobile (ver
[`WCAG22_NOVOS_CRITERIOS.md`](./WCAG22_NOVOS_CRITERIOS.md) para os critérios novos do WCAG 2.2
particularmente relevantes para mobile).

---

## Estrutura desta pasta

```
fase2_verificacao_acessibilidade/
├── README.md                       ← este ficheiro
│
├── AVALIACAO_ACESSIBILIDADE.md     ← texto final para o relatório (secção 3.6)
├── PROCEDIMENTO.md                 ← passo a passo das ferramentas e testes
├── CHECKLIST_WCAG.md               ← checklist dos 40 critérios WCAG 2.2 AA
├── EVIDENCIAS.md                   ← template para registar resultados/observações
│
├── INVENTARIO_ATRIBUTOS_A11Y.md    ← inventário dos atributos de acessibilidade no código
├── CONTRASTE.md                    ← tabela completa de rácios de contraste
├── TESTE_LEITORES_ECRA.md          ← protocolo VoiceOver (iOS) + TalkBack (Android)
├── TESTE_RESPONSIVO.md             ← protocolo zoom 200%, orientação, reflow
├── WCAG22_NOVOS_CRITERIOS.md       ← análise dos 9 critérios novos do WCAG 2.2
│
└── screenshots/
    ├── antes/                      ← capturas do estado inicial (pré-correções)
    └── depois/                     ← capturas após correções
```

---

## Como utilizar esta pasta

### 1. Leitura inicial
1. Lê `README.md` (este) para enquadramento
2. Lê `WCAG22_NOVOS_CRITERIOS.md` para perceber a evolução do referencial
3. Lê `INVENTARIO_ATRIBUTOS_A11Y.md` para conhecer o que está implementado no código

### 2. Execução das avaliações
4. Segue `PROCEDIMENTO.md` para correr cada ferramenta e teste
5. Vai preenchendo `EVIDENCIAS.md` com os números e observações conforme avanças
6. Vai preenchendo `CHECKLIST_WCAG.md` com ✅/⚠️/❌ por critério

### 3. Escrita do relatório
7. Atualiza `AVALIACAO_ACESSIBILIDADE.md` substituindo os marcadores `TODO/XX` pelos números reais
8. Cola o conteúdo na secção **3.6** do relatório Word
9. Insere screenshots como figuras com captions

---

## Metodologia em síntese

A Fase 2 combina **avaliação automática** (4 ferramentas, incluindo a T.A.W. recomendada pelos docentes da UC) com **análise manual** (4 procedimentos)
sobre a aplicação móvel UTAD Maps. A escolha desta combinação respeita o enunciado do desafio
("ferramenta automática **ou** análise manual") e maximiza a cobertura dos critérios WCAG 2.2
que ferramentas automáticas não conseguem verificar isoladamente (e.g. teste com leitor de ecrã,
respostas semânticas dos elementos, navegação por toque, contraste real em dispositivo).

### Avaliação automática
| Ferramenta | Aplicada onde | Reporta |
|---|---|---|
| **Lighthouse 12** (Chrome DevTools) | App em emulação mobile (web build) | Score 0–100 de acessibilidade + lista de audits |
| **axe-core 4.11** (CLI) | App em emulação mobile (web build) | Issues por severidade, com critério WCAG |
| **pa11y 9** (axe + HTML CodeSniffer) | App em emulação mobile (web build) | Validação cruzada WCAG2AA |
| **T.A.W.** (https://tawdis.net) | `utadmaps.b-host.me` | **Ferramenta recomendada pelos docentes da UC**. Classifica resultados por princípio (Perceivable / Operable / Understandable / Robust) |

### Análise manual
| Procedimento | Foco | Documento |
|---|---|---|
| Auditoria de atributos por ficheiro | Cobertura `accessibilityLabel/Role/Hint` em todos os controlos | `INVENTARIO_ATRIBUTOS_A11Y.md` |
| Cálculo de rácios de contraste | Verificação WCAG 1.4.3 (AA) e 1.4.6 (AAA) | `CONTRASTE.md` |
| Teste com VoiceOver / TalkBack | Verificação 4.1.2, 2.4.4 com 5 tarefas-tipo | `TESTE_LEITORES_ECRA.md` |
| Teste de responsividade | Zoom 200%, rotação, reflow | `TESTE_RESPONSIVO.md` |

### Referencial
WCAG 2.2 (W3C, outubro 2023), nível **AA**.
A escolha do nível AA — em vez do nível A mínimo — justifica-se por:
1. Ser o nível recomendado pela legislação portuguesa (Decreto-Lei 83/2018) e europeia (Diretiva (UE) 2016/2102) para entidades do setor público, ao qual a UTAD pertence;
2. Ser o nível adotado pela larga maioria das instituições de ensino superior em Portugal;
3. Ser o nível razoavelmente atingível por uma equipa académica num projeto trimestral.

---

## Resumo do estado da aplicação (snapshot pré-avaliação)

Após a Fase 1 e as correções incrementais aplicadas durante a Fase 2 (ver
`INVENTARIO_ATRIBUTOS_A11Y.md`), a aplicação apresenta:

- **150** componentes interactivos (TouchableOpacity / Pressable)
- **~95%** com `accessibilityLabel` (subiu de 52%)
- **~95%** com `accessibilityRole` apropriado
- **Componentes críticos** (botões só com ícone) com `accessibilityHint` adicional
- **Botões de toggle** com `accessibilityState` (checked / selected / expanded)
- **Botões com ícone < 44px** com `hitSlop` ≥ 10px
- **i18n** completo PT/EN cobrindo 125 chaves
- **5 níveis** de tamanho de texto (até 200% — cumpre WCAG 1.4.4)
- **Modo Alto Contraste** com rácio 21:1
- **Idioma definido** via `app/+html.tsx` para a versão web

Estes números são o ponto de partida para as avaliações e correções adicionais documentadas nos restantes ficheiros.
