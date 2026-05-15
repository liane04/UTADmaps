# Bugs detetados durante o teste manual de acessibilidade

> Documento auxiliar para a Fase 2. Lista problemas funcionais identificados durante a execução dos testes manuais B.3 (VoiceOver) e B.4 (Responsividade) que não são especificamente de acessibilidade mas que afetam a experiência de uso. **Estes bugs reforçam o valor do teste manual** — não foram detetados pelas ferramentas automáticas.

## Bug B-01 — Botão "Iniciar sessão" no Perfil não funciona (utilizador convidado)

**Severidade**: Alta (funcional)
**Descoberto em**: Preparação do teste T1
**Onde**: `app/(tabs)/perfil.tsx`, ramo `isAnonimo === true`

**Sintoma**: ocorre **após o utilizador ter feito logout uma vez**. Sequência reproduzível:
1. Utilizador inicia sessão (botão "Entrar" do ecrã de login — funciona ✓)
2. Utilizador navega para Perfil → "Terminar sessão" (funciona ✓)
3. Utilizador permanece em modo convidado na tab Perfil
4. Utilizador toca em "Iniciar sessão" no Perfil → **NÃO RESPONDE**

O botão "Entrar" no ecrã de login original funciona corretamente. O bug é específico do botão "Iniciar sessão" do ecrã de Perfil quando aparece após um logout.

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

## Bug B-03 — Warning: "Text strings must be rendered within a `<Text>` component" ✅ RESOLVIDO

**Severidade**: Baixa (mas chocante para o utilizador porque aparece como LogBox vermelho)
**Descoberto em**: Boot da app no Expo Go (visível no ecrã Definições)
**Onde**: `app/definicoes.tsx`, linha 40

**Sintoma**: aparece um LogBox vermelho no fundo do ecrã com a mensagem "Text strings must be rendered within a `<Text>` component", com call stack apontando para `createTextInstance` no `ReactFabric-dev.js`.

**Causa raiz identificada**: o `<View style={styles.header}>` tinha três children, sendo o terceiro:

```jsx
<View style={{ width: 80 }} /> {/* Spacer to center title */}
```

O **espaço em branco entre `/>` e `{/* … */}`** estava a ser interpretado como string solta dentro do `<View>` pai. O React Native (motor Fabric) sinaliza isto como erro porque texto solto não pode ser renderizado fora de um `<Text>`.

**Correção aplicada**: reorganizar o JSX para que o comentário fique numa linha própria antes do spacer, eliminando o espaço:

```jsx
{/* Spacer para centrar o título */}
<View style={{ width: 80 }} />
```

**Impacto a11y**: nulo (a string não é visível); no entanto, o LogBox sobreposto no ecrã prejudicava significativamente a experiência durante desenvolvimento e o teste com utilizadores.

**Estado**: ✅ Corrigido. Verificado por grep `/> \{/\*` em `app/` que não encontra mais ocorrências.

---

## Bug B-05 — TabBar inferior cresce desproporcionalmente com tamanho de texto ✅ RESOLVIDO

**Severidade**: Média (afeta usabilidade ao aumentar texto — princípio de acessibilidade WCAG 1.4.4 Resize Text)
**Descoberto em**: B.4 Teste de responsividade (utilizador a aumentar texto a "Máximo")
**Onde**: `app/(tabs)/_layout.tsx`, linha 30

**Sintoma**: ao ajustar o tamanho do texto em Definições → Tamanho do Texto para "Máximo" (200%), a barra de navegação inferior **subia ocupando metade do ecrã** e deixava o conteúdo da tab actual (mapa, pesquisa, etc.) com um espaço em branco visual entre o conteúdo e a TabBar.

**Causa raiz identificada**: a altura da TabBar era calculada como:

```jsx
height: fs(75) + Math.max(insets.bottom, 12)
```

A função `fs()` escala linearmente pelo factor de tamanho do texto. Com texto a 200%, `fs(75) = 150`, o que tornava a TabBar com 150px + 30px (home indicator iOS) = **180px de altura**, demasiado para uso prático.

**Correção aplicada**: substituir o cálculo linear por um cálculo com **saturação**, que garante que a TabBar cresce moderadamente sem se tornar excessiva, e adicionar `justifyContent: 'center'` ao `tabBarItemStyle` para distribuir icon+label uniformemente no espaço disponível.

```jsx
const tabBarBaseHeight = Math.max(75, fs(48) + 28);
const bottomInset = Math.max(insets.bottom, 12);

// ...
tabBarItemStyle: {
  justifyContent: 'center',
  paddingVertical: 6,
},
tabBarStyle: {
  height: tabBarBaseHeight + bottomInset,
  paddingBottom: bottomInset,
  paddingTop: 4,
}
```

Resultado: altura passa de 75px (texto normal) → ~110px (texto máximo), em vez dos 180px anteriores.

**Impacto a11y**: **positivo direto** — cumpre o critério WCAG 1.4.4 (Resize Text) de forma mais funcional. O utilizador com baixa visão pode aumentar o texto a 200% sem perder área útil do ecrã.

**Estado**: ✅ Corrigido. Validação por inspecção visual no iPhone com texto a "Máximo".

---

## Bug B-04 — Require cycle entre useAppStore e api.ts

**Severidade**: Code smell
**Sintoma**: warning `Require cycle: store/useAppStore.ts -> services/api.ts -> store/useAppStore.ts`.

**Impacto a11y**: nenhum.

**Correção sugerida**: refactor para extrair os tipos partilhados para um ficheiro `types.ts` e quebrar a dependência circular.

---

## Síntese

| ID | Severidade | Impacto a11y | Estado |
|---|---|---|---|
| B-01 | Alta | Indireto (3.2.1/3.2.2) | ⏳ Pendente — correção trivial |
| B-02 | Crítica (privacidade) | Indireto (privacidade) | ⏳ Pendente — alta prioridade |
| B-03 | Baixa (chocante visualmente) | Nulo | ✅ **Resolvido** durante Fase 2 |
| B-04 | Code smell | Nulo | ⏸️ Não bloqueante |
| B-05 | Média (WCAG 1.4.4) | **Direto** — Resize Text 200% | ✅ **Resolvido** durante Fase 2 |

Os 5 bugs constituem **evidência do valor do teste manual** — nenhum foi reportado pelas ferramentas automáticas. **B-03 e B-05 foram resolvidos durante a Fase 2**, justificando o procedimento e produzindo melhorias concretas no produto. B-01, B-02 e B-04 ficam para iteração antes da Fase 3.

Esta tabela será referenciada na secção 3.6.7 do relatório (Trabalho Futuro) e na secção 3.6.6 (Correções Implementadas), demonstrando que a metodologia de teste manual produz valor para além das ferramentas automáticas.
