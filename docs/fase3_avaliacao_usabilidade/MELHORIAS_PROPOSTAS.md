# Melhorias Propostas — Plano Priorizado

**Responsável**: Diogo Queiroz
**Data**: 21 de maio de 2026
**Aplicação visada**: UTAD Maps v1.0 → próxima iteração

---

## 1. Critério de priorização

As melhorias propostas resultam dos 16 problemas identificados em `PROBLEMAS_DETECTADOS.md`. A priorização cruza dois eixos:

- **Impacto** — gravidade do problema corrigido (catastrófico, maior, menor, cosmético)
- **Esforço** — tempo estimado de implementação (Trivial < 30 min, Pequeno 1–2 h, Médio 4–8 h, Grande 1+ dias)

A matriz **Impacto × Esforço** classifica cada melhoria em quatro quadrantes:

| | Esforço baixo | Esforço alto |
|---|---|---|
| **Impacto alto** | **Quadrante I — Prioridade máxima** | Quadrante II — Planeamento |
| **Impacto baixo** | Quadrante III — Iterações futuras | Quadrante IV — Reavaliar necessidade |

> **Nota sobre classificação de impacto "Médio"**: a matriz usa uma escala binária (Alto/Baixo), mas a tabela de melhorias emprega três níveis (Alto/Médio/Baixo). A regra de desempate adoptada é a seguinte: impacto **Médio** é promovido a **Alto** (Quadrante I ou II) quando o problema associado tem convergência de duas ou mais técnicas de avaliação ou constitui um requisito de acessibilidade documentado na Fase 2; caso contrário, é tratado como **Baixo** (Quadrante III ou IV). Quando o impacto é Médio e o esforço é elevado, cai em Quadrante II (planeamento).

---

## 2. Tabela priorizada de melhorias

Ordenada por prioridade decrescente.

| # | Melhoria | Problema resolvido | Impacto | Esforço | Quadrante |
|:---:|---|---|:---:|:---:|:---:|
| **M-01** | Limpar `AsyncStorage` no logout (chaves do horário, favoritos, próxima aula, histórico) | P-01 catastrófico | 🔴 Alto | Trivial | **I** |
| **M-02** | Corrigir o handler do botão "Iniciar sessão" no Perfil para responder após logout (rever `onPress` e a rota de retorno ao `/`) | P-02 maior | 🔴 Alto | Pequeno | **I** |
| **M-03** | Adicionar `accessibilityState={{ selected }}` aos chips de filtro, pills de tamanho de texto e pills de dia do horário | P-11 cosmético | 🟡 Médio ¹ | Pequeno | **I** |
| **M-04** | Adicionar *toast* de confirmação quando o utilizador activa Alto Contraste, muda tema ou altera tamanho de texto | P-03 menor | 🔴 Alto ² | Pequeno | **I** |
| **M-05** | Implementar `accessibilityLiveRegion="polite"` na barra de instruções da navegação outdoor para anunciar mudanças de manobra | P-09 menor | 🟡 Médio | Pequeno | **I** |
| **M-06** | Adicionar indicador de carregamento (`ActivityIndicator`) durante a chamada de pesquisa ao backend | P-06 menor | 🟡 Médio | Trivial | **I** |
| **M-07** | Implementar notificação de chegada ao destino (proximidade < 15 m) com mensagem clara | P-08 menor | 🟡 Médio | Médio | **II** |
| **M-08** | Reformular mensagens de erro genéricas (rota OSRM, distância elevada) com sugestões accionáveis | P-07 menor | 🟡 Médio | Pequeno | **III** |
| **M-09** | Adicionar legenda de cores dos marcadores no mapa (recolhível, canto inferior esquerdo) | P-12 menor | 🟢 Baixo | Pequeno | **III** |
| **M-10** | Adicionar atalho "Próxima aula" no topo do Mapa quando utilizador tem horário importado | P-05 menor | 🟡 Médio | Médio | **II** |
| **M-11** | Enriquecer o onboarding com um quarto slide com glossário ECT, ECVA, ECHS | P-10 menor | 🟢 Baixo | Pequeno | **III** |
| **M-12** | Adicionar microtexto explicativo (tooltip) junto às opções avançadas de Definições de Acessibilidade | P-03 (parcial) | 🟢 Baixo | Pequeno | **III** |
| **M-13** | Uniformizar o raio de cantos dos cards para 12 px ou 16 px (consistente em todo o sistema de design) | P-13 cosmético | 🟢 Baixo | Pequeno | **III** |
| **M-14** | Adicionar ícone direccional visível no cartão de aula a indicar que é clicável | P-14 cosmético | 🟢 Baixo | Trivial | **III** |
| **M-15** | Adicionar dica visual prévia ao indoor (badge "2D" ou "3D") nos resultados de pesquisa | P-15 cosmético | 🟢 Baixo | Pequeno | **III** |
| **M-16** | Reescrever o passo de importação de horário com link directo para onde encontrar a chave no Inforestudante (com print de exemplo) | P-16, P-04 | 🟡 Médio | Pequeno | **II** |

> ¹ **M-03** classificada com impacto Médio (e não Baixo, apesar de P-11 ser Cosmético) porque os gaps G-01 a G-03 foram documentados na Fase 2 como requisitos de acessibilidade pendentes, tornando a sua resolução obrigatória para conformidade com as diretrizes de acessibilidade.
>
> ² **M-04** classificada com impacto Alto (e não Menor, apesar de P-03 ter severidade Menor) porque P-03 foi o **único problema detectado pelas três técnicas em simultâneo** (AH + SH + UT), o que, pela regra de desempate, eleva o seu impacto para Alto.

---

## 3. Plano de ação por sprints

A próxima iteração do produto pode organizar as 16 melhorias em três sprints sequenciais.

### Sprint 1 — Correções críticas (1 dia de trabalho)

Concentra todas as melhorias do Quadrante I (Impacto Alto × Esforço Baixo). Resolve o problema catastrófico (P-01) e o maior (P-02), além das melhorias de feedback de alto impacto.

- **M-01** — Limpar storage no logout
- **M-02** — Fix do botão "Iniciar sessão"
- **M-03** — `accessibilityState` nos chips e pills
- **M-04** — *Toast* nas alterações de definições
- **M-05** — `accessibilityLiveRegion` na barra de navegação
- **M-06** — Indicador de carregamento na pesquisa

**Output esperado**: aplicação sem bugs catastróficos nem maiores, com feedback informativo adequado e suporte AAA para leitores de ecrã.

### Sprint 2 — Melhorias de fluxo (2 dias)

Quadrante II — melhorias com impacto significativo que, pela sua natureza ou dependências, beneficiam de planeamento dedicado. M-16, apesar do esforço de implementação reduzido, é incluída aqui pela necessidade de preparar material de apoio (capturas de ecrã do Inforestudante, ligações directas) antes da integração no onboarding.

- **M-07** — Notificação de chegada ao destino
- **M-10** — Atalho "Próxima aula" no Mapa
- **M-16** — Onboarding melhorado para importação de horário

### Sprint 3 — Polimento (1 dia)

Quadrante III — refinamentos cosméticos e de usabilidade não críticos.

- **M-08** e **M-09** — Mensagens de erro, legenda do mapa
- **M-11** a **M-15** — Glossário onboarding, tooltips, raio de cantos, dicas visuais

---

## 4. Métricas de sucesso da próxima iteração

Após implementação das três sprints, propõe-se reavaliar com as mesmas três técnicas e medir os seguintes indicadores:

| Indicador | Estado actual | Meta da próxima iteração |
|---|---|---|
| Problemas catastróficos (sev 4) | 1 | **0** |
| Problemas maiores (sev 3) | 1 | **0** |
| Problemas menores (sev 2) | 10 | ≤ 5 |
| Taxa de sucesso nos user tests | 92 % | ≥ 95 % |
| Tempo médio na tarefa T5 (Importar horário) | 102 s | ≤ 70 s |
| Facilidade média nos user tests | 4,4/5 | ≥ 4,7/5 |
| Pontuação Likert pós-teste | 4,68/5 | ≥ 4,8/5 |
| Cobertura `accessibilityState` em chips/pills | 0 % | **100 %** |

---

## 5. Conclusões

O plano de melhorias propõe **16 acções concretas** distribuídas por três sprints de execução sequencial. **Seis acções são de prioridade máxima** (Quadrante I — Impacto Alto × Esforço Baixo) e cobrem o problema catastrófico e o único maior, podendo ser concluídas em um dia de trabalho.

A correção do problema P-01 (privacidade — horário persiste após logout) é a **mais urgente** do conjunto, podendo ser resolvida com poucas linhas de código adicionais no `handleLogout` da tab Perfil que limpem as chaves apropriadas do `AsyncStorage`. A acção M-02 (fix do botão "Iniciar sessão") complementa esta correção para fechar definitivamente o ciclo de gestão de sessão.

A implementação destas seis acções de prioridade máxima deverá elevar a aplicação de **92 % de taxa de sucesso** para uma estimativa de **97–98 %**, fundada na eliminação das falhas directamente observadas nos user tests (P-02, P-03 e P-06) e na resolução dos problemas catastróficos e maiores; esta estimativa deverá ser validada numa iteração subsequente com os mesmos utilizadores e tarefas.
