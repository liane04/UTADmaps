# Bugs detetados durante o teste manual de acessibilidade

> Documento auxiliar para a Fase 2. Lista problemas funcionais identificados durante a execução dos testes manuais B.3 (VoiceOver) e B.4 (Responsividade) que não são especificamente de acessibilidade mas que afetam a experiência de uso. **Estes bugs reforçam o valor do teste manual** — não foram detetados pelas ferramentas automáticas.

## Bug B-01 — Botão "Iniciar sessão" no Perfil não funciona (utilizador convidado)

**Severidade**: Alta (funcional)
**Descoberto em**: Preparação do teste T1
**Onde**: `app/(tabs)/perfil.tsx`, ramo `isAnonimo === true`

**Sintoma**: quando o utilizador está em modo convidado (sem sessão iniciada) e abre a tab Perfil, vê um botão "Iniciar sessão" que **não responde ao toque**.

**Impacto a11y**: indireto — o utilizador com leitor de ecrã ouve "Iniciar sessão, botão" e dois toques não desencadeiam ação, gerando confusão. Falha potencial do critério **WCAG 2.1 SC 3.2.1 (On Focus)** e **3.2.2 (On Input)** que exigem comportamento previsível em controles.

**Hipótese de causa**: o `onPress` ou a sua callback não está implementada / o `router.replace('/')` falha porque o utilizador já está em `(tabs)/perfil`.

**Correção sugerida**: confirmar que o `onPress` chama `router.replace('/')` e que o handler está corretamente ligado ao componente.

---

## Bug B-02 — Horário mantém-se após "Terminar sessão"

**Severidade**: **Crítica (privacidade)**
**Descoberto em**: Preparação do teste T1
**Onde**: `app/(tabs)/perfil.tsx` (`handleLogout`)

**Sintoma**: ao terminar sessão, o horário académico importado do Infraestudante **continua visível** na tab Horário e no card de "Próxima Aula" do Perfil. O próximo utilizador (caso o telemóvel seja partilhado, e.g. computadores públicos da biblioteca) **vê o horário privado do anterior**.

**Impacto a11y**: indireto. Mais crítico: violação de **privacidade de dados pessoais** (GDPR — dados académicos são considerados sensíveis no contexto educacional).

**Correção sugerida**: o `handleLogout` deve, além de limpar o JWT, limpar:
- `AsyncStorage` chave `utadmaps_horario` (e similares)
- Estado do `useAppStore` (favoritos pessoais, histórico, horário)
- Cache de "próxima aula" no Perfil

---

## Bug B-03 — Warning: "Text strings must be rendered within a `<Text>` component"

**Severidade**: Baixa
**Descoberto em**: Boot da app no Expo Go
**Sintoma**: aparece no log do Metro um warning sobre uma string solta fora de `<Text>`.

**Impacto a11y**: nulo (a string não é visível porque RN ignora-a no render); no entanto, indica código a corrigir.

**Correção sugerida**: localizar a string solta (provavelmente um espaço ou variável a renderizar diretamente em JSX) e envolvê-la em `<Text>`.

---

## Bug B-04 — Require cycle entre useAppStore e api.ts

**Severidade**: Code smell
**Sintoma**: warning `Require cycle: store/useAppStore.ts -> services/api.ts -> store/useAppStore.ts`.

**Impacto a11y**: nenhum.

**Correção sugerida**: refactor para extrair os tipos partilhados para um ficheiro `types.ts` e quebrar a dependência circular.

---

## Síntese

| ID | Severidade | Impacto a11y | A corrigir antes da entrega final? |
|---|---|---|---|
| B-01 | Alta | Indireto (3.2.1/3.2.2) | **Sim** — trivial |
| B-02 | Crítica | Indireto (privacidade) | **Sim — alta prioridade** |
| B-03 | Baixa | Nulo | Sim, fácil |
| B-04 | Code smell | Nulo | Não bloqueante |

Estes 4 bugs serão referenciados na secção 3.6.7 do relatório (Trabalho Futuro) como evidência adicional de que a metodologia de teste manual produz valor para além das ferramentas automáticas.
