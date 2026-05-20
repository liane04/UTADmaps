# Melhorias Propostas — Plano Priorizado

**Responsável**: Diogo Queiroz
**Data**: 21 de maio de 2026
**Aplicação visada**: UTAD Maps v1.0 → próxima iteração

---

## 1. Critério de priorização

As melhorias propostas resultam dos 20 problemas identificados em `PROBLEMAS_DETECTADOS.md`. A priorização cruza dois eixos:

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
| **M-02** | Adicionar diálogo de confirmação antes de "Terminar sessão" via `Alert.alert` | P-03 maior | 🔴 Alto | Trivial | **I** |
| **M-03** | Corrigir o handler do botão "Iniciar sessão" no Perfil para responder após logout (rever `onPress` e a rota de retorno ao `/`) | P-02 maior | 🔴 Alto | Pequeno | **I** |
| **M-04** | Adicionar `hitSlop` de 10 px ao botão de favoritar na pesquisa | P-07 menor | 🟡 Médio | Trivial | **I** |
| **M-05** | Adicionar `accessibilityState={{ selected }}` aos chips de filtro, pills de tamanho de texto e pills de dia do horário | P-15 cosmético | 🟡 Médio ¹ | Pequeno | **I** |
| **M-06** | Adicionar *toast* de confirmação quando o utilizador activa Alto Contraste, muda tema ou altera tamanho de texto | P-04 menor | 🔴 Alto ² | Pequeno | **I** |
| **M-07** | Implementar `accessibilityLiveRegion="polite"` na barra de instruções da navegação outdoor para anunciar mudanças de manobra | P-13 menor | 🟡 Médio | Pequeno | **I** |
| **M-08** | Adicionar indicador de carregamento (`ActivityIndicator`) durante a chamada de pesquisa ao backend | P-10 menor | 🟡 Médio | Trivial | **I** |
| **M-09** | Implementar notificação de chegada ao destino (proximidade < 15 m) com mensagem clara | P-12 menor | 🟡 Médio | Médio | **II** |
| **M-10** | Acompanhar códigos de edifícios (ECT-Polo I) com nome descritivo nas listagens | P-08 menor | 🟢 Baixo | Pequeno | **III** |
| **M-11** | Reformular mensagens de erro genéricas (rota OSRM, distância elevada) com sugestões accionáveis | P-11 menor | 🟡 Médio | Pequeno | **III** |
| **M-12** | Adicionar legenda de cores dos marcadores no mapa (recolhível, canto inferior esquerdo) | P-16 menor | 🟢 Baixo | Pequeno | **III** |
| **M-13** | Implementar *clustering* de marcadores no mapa para zooms inferiores | P-06 cosmético | 🟢 Baixo | Médio | **IV** |
| **M-14** | Adicionar atalho "Próxima aula" no topo do Mapa quando utilizador tem horário importado | P-09 menor | 🟡 Médio | Médio | **II** |
| **M-15** | Enriquecer o onboarding com um quarto slide com glossário ECT, ECVA, ECHS | P-14 menor | 🟢 Baixo | Pequeno | **III** |
| **M-16** | Adicionar microtexto explicativo (tooltip) junto às opções avançadas de Definições de Acessibilidade | P-04 (parcial) | 🟢 Baixo | Pequeno | **III** |
| **M-17** | Uniformizar o raio de cantos dos cards para 12 px ou 16 px (consistente em todo o sistema de design) | P-17 cosmético | 🟢 Baixo | Pequeno | **III** |
| **M-18** | Adicionar ícone direccional visível no cartão de aula a indicar que é clicável | P-18 cosmético | 🟢 Baixo | Trivial | **III** |
| **M-19** | Adicionar dica visual prévia ao indoor (badge "2D" ou "3D") nos resultados de pesquisa | P-19 cosmético | 🟢 Baixo | Pequeno | **III** |
| **M-20** | Reescrever o passo de importação de horário com link directo para onde encontrar a chave no Inforestudante (com print de exemplo) | P-20, P-05 | 🟡 Médio | Pequeno | **II** |

> ¹ **M-05** classificada com impacto Médio (e não Baixo, apesar de P-15 ser Cosmético) porque os gaps G-01 a G-03 foram documentados na Fase 2 como requisitos de acessibilidade pendentes, tornando a sua resolução obrigatória para conformidade com as diretrizes de acessibilidade.
>
> ² **M-06** classificada com impacto Alto (e não Menor, apesar de P-04 ter severidade Menor) porque P-04 foi o **único problema detectado pelas três técnicas em simultâneo** (AH + SH + UT), o que, pela regra de desempate, eleva o seu impacto para Alto.

---

## 3. Plano de ação por sprints

A próxima iteração do produto pode organizar as 20 melhorias em três sprints sequenciais.

### Sprint 1 — Correções críticas (1 dia de trabalho)

Concentra todas as melhorias do Quadrante I (Impacto Alto × Esforço Baixo). Resolve o problema catastrófico (P-01) e os dois maiores (P-02, P-03), além das melhorias de feedback de alto impacto.

- **M-01** — Limpar storage no logout
- **M-02** — Confirmação no logout
- **M-03** — Fix do botão "Iniciar sessão"
- **M-04** — `hitSlop` no botão favoritar
- **M-05** — `accessibilityState` nos chips e pills
- **M-06** — *Toast* nas alterações de definições
- **M-07** — `accessibilityLiveRegion` na barra de navegação
- **M-08** — Indicador de carregamento na pesquisa

**Output esperado**: aplicação sem bugs catastróficos nem maiores, com feedback informativo adequado e suporte AAA para leitores de ecrã.

### Sprint 2 — Melhorias de fluxo (2 dias)

Quadrante II — melhorias com impacto significativo que, pela sua natureza ou dependências, beneficiam de planeamento dedicado. M-20, apesar do esforço de implementação reduzido, é incluída aqui pela necessidade de preparar material de apoio (capturas de ecrã do Inforestudante, ligações directas) antes da integração no onboarding.

- **M-09** — Notificação de chegada ao destino
- **M-14** — Atalho "Próxima aula" no Mapa
- **M-20** — Onboarding melhorado para importação de horário

### Sprint 3 — Polimento (1 dia)

Quadrante III e IV — refinamentos cosméticos e de usabilidade não críticos. M-13 (Quadrante IV — Impacto Baixo × Esforço Médio) é incluída neste sprint por conveniência, devendo ser reavaliada caso os recursos disponíveis sejam limitados.

- **M-10** a **M-13** — Códigos, mensagens de erro, legenda do mapa, *clustering*
- **M-15** a **M-19** — Glossário onboarding, tooltips, raio de cantos, dicas visuais

---

## 4. Métricas de sucesso da próxima iteração

Após implementação das três sprints, propõe-se reavaliar com as mesmas três técnicas e medir os seguintes indicadores:

| Indicador | Estado actual | Meta da próxima iteração |
|---|---|---|
| Problemas catastróficos (sev 4) | 1 | **0** |
| Problemas maiores (sev 3) | 2 | **0** |
| Problemas menores (sev 2) | 12 | ≤ 5 |
| Taxa de sucesso nos user tests | 92 % | ≥ 95 % |
| Tempo médio na tarefa T5 (Importar horário) | 102 s | ≤ 70 s |
| Facilidade média nos user tests | 4,4/5 | ≥ 4,7/5 |
| Pontuação Likert pós-teste | 4,68/5 | ≥ 4,8/5 |
| Cobertura `accessibilityState` em chips/pills | 0 % | **100 %** |

---

## 5. Conclusões

O plano de melhorias propõe **20 acções concretas** distribuídas por três sprints de execução sequencial. **Oito acções são de prioridade máxima** (Quadrante I — Impacto Alto × Esforço Baixo) e cobrem todos os problemas catastróficos e maiores, podendo ser concluídas em um dia de trabalho.

A correção do problema P-01 (privacidade — horário persiste após logout) é a **mais urgente** do conjunto, podendo ser resolvida com poucas linhas de código adicionais no `handleLogout` da tab Perfil que limpem as chaves apropriadas do `AsyncStorage`. As acções M-02 (confirmação no logout) e M-03 (fix do botão "Iniciar sessão") complementam esta correção para fechar definitivamente o ciclo de gestão de sessão.

A implementação destas oito acções de prioridade máxima deverá elevar a aplicação de **92 % de taxa de sucesso** para uma estimativa de **97–98 %**, fundada na eliminação das falhas directamente observadas nos user tests (P-02, P-04 e P-10) e na resolução dos problemas catastróficos e maiores; esta estimativa deverá ser validada numa iteração subsequente com os mesmos utilizadores e tarefas.
