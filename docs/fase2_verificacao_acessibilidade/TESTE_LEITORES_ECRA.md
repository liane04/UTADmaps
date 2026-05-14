# Protocolo de Teste com Leitores de Ecrã

> **Objetivo**: validar a acessibilidade da aplicação UTAD Maps com utilizadores de leitor de ecrã, cobrindo iOS (VoiceOver) e Android (TalkBack). Os critérios WCAG envolvidos são **4.1.2 Name/Role/Value (A)**, **2.4.4 Link Purpose (A)**, **3.3.2 Labels or Instructions (A)** e **2.5.3 Label in Name (A)**.

---

## 1. Setup do ambiente de teste

### 1.1 iOS (iPhone com iOS 15+)

1. **Instalar Expo Go**: App Store → procurar "Expo Go" → instalar
2. **Abrir a app**: terminal local → `npx expo start --tunnel` → scan QR code com câmara → abre no Expo Go
3. **Activar VoiceOver**: Definições → Acessibilidade → VoiceOver → Activar
   - **Atalho rápido**: triplo clique no botão lateral (configurar em Definições → Acessibilidade → Atalho de Acessibilidade)
4. **Gestos básicos VoiceOver**:
   - **Toque único**: seleciona e lê o elemento
   - **Toque duplo**: ativa o elemento selecionado
   - **Swipe direita/esquerda**: próximo / anterior elemento
   - **Toque com 2 dedos**: pausa/retoma leitura
   - **Swipe 3 dedos cima/baixo**: scroll
   - **Rotor (2 dedos rotação)**: muda granularidade (heading, link, button…)

### 1.2 Android (telemóvel com Android 10+)

1. **Instalar Expo Go**: Google Play → Expo Go
2. **Abrir a app**: igual ao iOS
3. **Activar TalkBack**: Definições → Acessibilidade → TalkBack → Activar
   - **Atalho rápido**: manter os 2 botões de volume premidos 3s
4. **Gestos TalkBack**:
   - **Toque único**: seleciona e lê
   - **Toque duplo**: ativa
   - **Swipe direita/esquerda**: próximo / anterior
   - **Swipe 2 dedos cima/baixo**: scroll
   - **Triângulo (gesto L)**: abre menu de leitura

### 1.3 Tipos de teste

Cada tarefa é executada em **3 modalidades**:
- **A.** Visual normal (controlo) — utilizador comum
- **B.** VoiceOver/TalkBack activo, ecrã visível — utilizador novice com leitor
- **C.** VoiceOver/TalkBack activo, ecrã **coberto com mão** — simula utilizador cego

Apenas a modalidade C é decisiva para a conformidade. A e B servem para detectar inconsistências.

---

## 2. Tarefas de teste

Define-se um conjunto de 5 tarefas-tipo representativas do uso real da aplicação. Cada uma tem
critérios de sucesso objetivos.

### Tarefa T1 — Onboarding e selecção de idioma

**Cenário**: primeiro arranque da aplicação. O utilizador deve conseguir escolher o idioma e
prosseguir.

**Passos esperados (3 ações)**:
1. Seleccionar "Português" ou "English"
2. Tocar em "Saltar e explorar" (utilizador sem credenciais)

**Critérios de sucesso**:
- [ ] Leitor anuncia "Selecionar Português, botão" (ou equivalente) — não apenas "botão"
- [ ] Estado seleccionado é anunciado (e.g. "selecionado")
- [ ] Botão "Saltar e explorar" é reconhecível pelo nome, não pela posição

### Tarefa T2 — Encontrar a sala G0.08 e iniciar navegação

**Cenário**: estudante novo precisa de chegar à sala G0.08.

**Passos esperados (4 ações)**:
1. Tocar na barra de pesquisa (mapa principal)
2. Escrever "G0.08" no campo
3. Tocar no primeiro resultado
4. Tocar em "Ir" para iniciar navegação

**Critérios de sucesso**:
- [ ] Barra de pesquisa anuncia "Abrir pesquisa, botão"
- [ ] Campo de input anuncia "Campo de pesquisa, edição de texto"
- [ ] Resultados de pesquisa anunciam nome completo da sala e edifício
- [ ] Botão "Ir" anuncia ação clara ("Ir para ECT-Polo I, botão. Inicia a navegação outdoor com indicações passo a passo")

### Tarefa T3 — Activar Alto Contraste e ampliar texto a 200%

**Cenário**: utilizador com baixa visão configura acessibilidade.

**Passos esperados (5 ações)**:
1. Abrir tab "Perfil"
2. Tocar em "Definições"
3. Tocar no switch "Alto Contraste"
4. Tocar na pill "Máximo" do "Tamanho do Texto"
5. Voltar e confirmar que toda a app está em alto contraste e texto a 200%

**Critérios de sucesso**:
- [ ] Switch anuncia "Alto Contraste, interruptor, desativado" → após toque "ativado"
- [ ] Pill seleccionada anuncia "Máximo, selecionado" (depende de `accessibilityState`)
- [ ] Após ativação, todos os ecrãs estão visivelmente em preto/branco
- [ ] Não há overflow de texto a 200% (validação visual)

### Tarefa T4 — Importar horário do Inforestudante

**Cenário**: utilizador autenticado quer integrar o seu horário.

**Passos esperados (4 ações)**:
1. Abrir tab "Horário"
2. Tocar no botão de cloud / "Importar horário"
3. Colar link no input
4. Tocar em "Importar"

**Critérios de sucesso**:
- [ ] Botão de importar tem label clara
- [ ] Modal abre com leitura "Importar Horário, título" no topo
- [ ] Input anuncia "Link ou chave do Infraestudante, edição de texto. Cola aqui o link privado…"
- [ ] Mensagens de sucesso/erro são anunciadas (via `Alert.alert` que é lido automaticamente)

### Tarefa T5 — Adicionar aos favoritos e remover

**Cenário**: utilizador guarda a Biblioteca como favorito e depois remove.

**Passos esperados (4 ações)**:
1. Pesquisar "Biblioteca"
2. Tocar no ícone ♡ ao lado do resultado
3. Abrir tab "Favoritos"
4. Tocar no ♥ vermelho ao lado da Biblioteca para remover

**Critérios de sucesso**:
- [ ] Ícone ♡ anuncia "Adicionar aos favoritos" (em vez de "coração")
- [ ] Após toque, anuncia "Remover dos favoritos" ou "Favorito adicionado"
- [ ] Na tab Favoritos, o card é anunciado completamente
- [ ] Botão de remover anuncia "Remover dos favoritos"

---

## 3. Folha de registo

Para cada tarefa, registar em `EVIDENCIAS.md`:

```markdown
### T1 — Onboarding (iOS / VoiceOver / Modalidade C)
- Tempo total: XX segundos
- Tentativas: 1ª tentativa? Falhou? Quantas vezes recomeçou?
- Critérios cumpridos: 2/3
- Observações qualitativas: "leitor anunciou apenas 'botão' no Saltar e explorar"
- Severidade: Alta / Média / Baixa
- Ação correctiva: adicionar accessibilityLabel
```

---

## 4. Aspetos qualitativos a observar

Além do binário "consegue/não consegue", anotar:

- **Velocidade de fala**: o leitor consegue acompanhar o ritmo natural do utilizador?
- **Anúncios redundantes**: o mesmo elemento é anunciado várias vezes?
- **Anúncios genéricos**: aparece "botão" sem mais? "edição de texto" sem label?
- **Ordem lógica**: a navegação por swipe direita-esquerda segue a ordem visual esperada?
- **Anúncios de mudança**: quando a rota é calculada, o leitor diz algo ("Rota disponível")? (Critério 4.1.3 Status Messages)
- **Idioma correto**: o iOS pronúncia em PT-PT (não EN ou ES)?

---

## 5. Resultados esperados (baseline antes do teste real)

Com base no inventário em `INVENTARIO_ATRIBUTOS_A11Y.md`, prevê-se:

| Tarefa | Probabilidade de sucesso na modalidade C | Pontos críticos |
|---|---|---|
| T1 Onboarding | Alta (90%) | Botões de idioma podem estar a falta de label explícita |
| T2 Pesquisa + navegação | Alta (85%) | Cards de resultado têm bons labels; ícone "Ir" tem hint |
| T3 Alto contraste + texto 200% | **Excelente (95%)** | Switches têm role+state; pills de texto faltam state |
| T4 Importar horário | Média (75%) | Input do modal tem label+hint; falta confirmação de sucesso explícita |
| T5 Favoritos | Média (70%) | Ícone ♡ na pesquisa pode estar sem label |

A coluna "Pontos críticos" alimenta directamente o backlog de pequenas correções na `INVENTARIO_ATRIBUTOS_A11Y.md` (gaps G-01 a G-04).

---

## 6. Critério global de aprovação

A aplicação é considerada **conforme com leitor de ecrã** se:
- Pelo menos **4 das 5 tarefas** completadas com sucesso na modalidade C (ecrã coberto)
- Nenhum ecrã apresenta elementos críticos sem label
- O fluxo de navegação principal (mapa → pesquisa → resultado → ir) é 100% funcional sem visão

---

## 7. Notas finais

- **Não confiar 100% no Accessibility Inspector do Xcode**: ele mostra os atributos, mas não simula
  a experiência real do utilizador cego. O teste com mão sobre o ecrã (modalidade C) é o que conta.
- **Testar em dispositivos diferentes**: VoiceOver no iPhone 13 não é idêntico a iPhone SE. Testar
  pelo menos em 1 iPhone moderno e 1 Android moderno.
- **Documentar com vídeo**: gravar o ecrã durante T2 e T3 é prática recomendada para evidência no
  relatório (ScreenRecord no iOS e gravação de ecrã no Android).
