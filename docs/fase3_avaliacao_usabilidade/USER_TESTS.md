# Testes com Utilizadores (User Tests)

**Responsável**: Filipe Silva
**Datas**: 20 e 21 de maio de 2026
**Aplicação avaliada**: UTAD Maps v1.0 (build mobile via Expo Go em iPhone e Android)

---

## 1. Metodologia

Os testes com utilizadores foram conduzidos seguindo o protocolo do material de apoio da unidade curricular (`avaliacaoUsabilidade.pdf`):

1. Definição do objectivo de avaliação
2. Definição das tarefas
3. Selecção de participantes
4. Definição do guião (eficácia, eficiência, satisfação)
5. Escolha do método de recolha de dados
6. Realização dos testes
7. Análise dos dados e conclusões

### 1.1 Objectivo

Avaliar a **eficácia**, **eficiência** e **satisfação** dos utilizadores ao realizarem oito tarefas representativas no UTAD Maps, identificar pontos de fricção e fundamentar propostas de melhoria.

### 1.2 Participantes

Os cinco elementos da equipa de desenvolvimento. **Limitação metodológica conhecida**: os participantes têm conhecimento prévio do produto, o que tende a **subestimar** o tempo de execução e **sobrestimar** o sucesso comparado com utilizadores externos novos. A justificação para esta amostra é o constrangimento temporal de execução da Fase 3 (20 a 22 de maio). Ainda assim, é possível extrair valor relativo (comparações entre tarefas) e identificar problemas que mesmo conhecedores enfrentam.

### 1.3 Inventário de funcionalidades da aplicação

Antes das tarefas, mapearam-se todas as funcionalidades presentes na aplicação para garantir uma cobertura representativa dos testes:

| Ecrã / Área | Funcionalidades |
|---|---|
| **Boas-vindas** (`index.tsx`) | Login email/password; toggle idioma PT/EN; mostrar/esconder password; "Saltar e explorar" (modo visitante); auto-importação horário ao fazer login |
| **Onboarding** | 3 slides paginados (swipe horizontal); Skip; botão "Começar"; guardado no AsyncStorage |
| **Mapa** (`(tabs)/index.tsx`) | Mapa campus com marcadores por tipo; barra de pesquisa flutuante (abre tab Pesquisa); controlos: localizar, zoom in/out; tap marcador → card (nome, tipo, pisos, salas); botão "Ir" → outdoor; botão "Explorar Indoor" |
| **Pesquisa** (`(tabs)/pesquisa.tsx`) | Pesquisa com debounce 300 ms; limpar campo; filtros: Todos/Edifícios/Salas/Serviços; resultados com avatar, distância e ordenação por GPS; botão ♡/♥ favoritar; selecionar sala → indoor 3D; selecionar edifício → outdoor; pesquisas recentes |
| **Horário** (`(tabs)/horario.tsx`) | Seletor dia semana; data por extenso; navegação entre semanas; importação via link/chave Inforestudante; timeline aulas + blocos "Livre" (gap ≥ 60 min); tap aula → navegar para sala; limpar horário; auto-importação ao login |
| **Favoritos** (`(tabs)/favoritos.tsx`) | Lista favoritos (avatar, nome, subtítulo); tap → navegar; tap ♥ → remover; estado vazio com instrução |
| **Perfil** (`(tabs)/perfil.tsx`) | Avatar com inicial do email; modo visitante "Convidado"; card "Próxima Aula" (urgente < 30 min, a decorrer agora, sem aulas); tick 30 s; tap card → navegar para sala; menu: Histórico / Horário Semanal / Definições; botão Entrar / Sair |
| **Definições** (`definicoes.tsx`) | 5 níveis texto (85–200 %); switch Alto Contraste; switch Rotas Acessíveis (evitar escadas); switch Leitor de Ecrã; idioma PT/EN; tema Claro/Escuro; link Suporte e Ajuda |
| **Navegação Outdoor** (`navigacao-outdoor.tsx`) | Mapa com rota OSRM (tracejado); selector ponto de partida: GPS ou edifício (modal pesquisável); toggle A pé / Carro; fase Planning: distância + tempo + botão Começar; fase Navigating: card instrução + ícone + auto-avanço; botão recentrar; botão "Entrar no Edifício"; fallback linha direta |
| **Indoor 3D** (`indoor-3d.tsx`) | WebView + Three.js GLB; vista ortográfica top-down (planta 2D); seletor piso (pill dropdown); tap para navegar (boneco animado); pin destino pulsante; rastro caminho laranja; A\* grid (~0,3 m/célula); room-blocking dinâmico; pan 1 dedo; zoom 2 dedos; banner destino ativo; loading overlay |
| **Histórico** (`historico.tsx`) | Lista navegações recentes; data relativa; tipo Interior/Exterior; tap → renavigar; pull-to-refresh; limpar histórico (confirmação); estado sem login |
| **Suporte e Ajuda** (`suporte.tsx`) | FAQ expandível (6 perguntas); botão "Reportar erro" por email; versão e plataforma |

### 1.4 Tarefas

| # | Tarefa | Critério de sucesso |
|---|---|---|
| **T1** | Encontrar e navegar para a sala G0.08 a partir do mapa principal | Chegar ao ecrã indoor da sala G0.08 com rota traçada |
| **T2** | Consultar o horário de quinta-feira e iniciar navegação para a sala da primeira aula | Iniciar navegação indoor/outdoor para a sala correcta |
| **T3** | Adicionar a Biblioteca aos favoritos e usar o favorito para navegar | Ver Biblioteca em Favoritos e iniciar navegação a partir daí |
| **T4** | Ativar Alto Contraste e texto a 200 %, verificar usabilidade no Mapa e no Horário | Confirmar que os dois ecrãs estão funcionais e legíveis |
| **T5** | Importar horário do Inforestudante via link privado | Ver horário semanal preenchido com aulas reais |
| **T6** | Mudar o ponto de partida na navegação outdoor (de GPS para um edifício) e alternar o modo entre A pé e Carro | Rota recalculada com novo ponto de partida e modo carro activo |
| **T7** | Consultar o histórico de navegação e renavigar para a última entrada | Chegar ao ecrã de navegação do destino histórico |
| **T8** | Mudar o piso no Indoor 3D do Sector E (Piso 0 → Piso 1) e navegar por toque até uma sala diferente | Boneco animado chega a uma sala do Piso 1 |

### 1.5 Escala de facilidade

| 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|
| Muito difícil | Difícil | Razoável | Fácil | Muito fácil |

### 1.6 Sistema avaliado, plataforma e dispositivo

| Campo | Valor |
|---|---|
| **Sistema Avaliado** | UTAD Maps v1.0 (build de 20 maio 2026) |
| **Tipo de Plataforma** | ☐ Website  ☑ Android  ☑ iOS |
| **Dispositivo Utilizado** | Variável por sessão (ver cada teste) |

---

## 2. Sessão 1 — Participante: Liane Duarte

### 2.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Filipe Silva |<>
| Nome do Participante | Liane Duarte |
| Data | 20 de maio de 2026, 18:30 |
| Sistema Avaliado | UTAD Maps v1.0 |
| Plataforma | iOS (Expo Go) |
| Dispositivo | iPhone 13, iOS 17 |

### 2.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Sala G0.08 | Chegar ao indoor da sala | **Sim** | 28 | 0 | 5 | "Estava à espera do indoor 3D e veio o 2D — não sabia que algumas salas iam para 2D" | Confusão momentânea entre planta 2D (navigacao-indoor) e modelo 3D (indoor-3d) |
| 2 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 42 | 1 | 4 | "Tive de tocar na aula para perceber que dava para navegar" | Affordance do cartão de aula é subtil — apenas o chevron forward indica que é clicável |
| 3 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 55 | 0 | 4 | "Demorei a achar o coração — está pequeno" | Ícone ♡ na pesquisa tem área de toque pequena (hitbox ~22px vs. recomendados 44px) |
| 4 | Alto contraste + texto 200 % | Verificar usabilidade | **Parcial** | 71 | 2 | 3 | "A TabBar não está perfeita ainda a 200%, e fiquei sem saber se tinha aplicado" | Sem toast de confirmação ao activar o switch; bug B-05 na TabBar a 200 % |
| 5 | Importar horário | Ver horário preenchido | **Sim** | 95 | 1 | 4 | "Tive de procurar onde colar o link no Inforestudante" | Onboarding do importar pode ser melhorado — não indica onde encontrar a chave |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 68 | 1 | 4 | "Não percebi logo que o 'De' era clicável" | Label "De" pequena; chevron down ajuda mas não é óbvio sem explorar |
| 7 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 40 | 0 | 5 | "Funciona bem, data relativa é boa ideia" | Fluxo directo; data relativa ("Há 2 h") fácil de interpretar |
| 8 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Sim** | 58 | 1 | 4 | "Não vi logo o pill de piso, esperava um botão mais visível" | Pill "Piso 0" no canto superior direito é discreto; dropdown funciona bem após descoberta |

### 2.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | Tab-bar bem distribuída |
| Legibilidade do texto | ☑ | ☐ | Fonte confortável no nível normal |
| Tempo de carregamento | ☐ | ☑ | Pesquisa demorou alguns segundos por vezes; Indoor 3D ~2–3 s por piso |
| Consistência visual | ☑ | ☐ | Boa coerência geral |
| Tamanho dos botões/interações | ☐ | ☑ | Coração dos favoritos (♡) pequeno; "De" na outdoor subtil |
| Feedback do sistema | ☐ | ☑ | Falta confirmação visual ao activar Alto Contraste e Rotas Acessíveis |
| Facilidade de aprendizagem | ☑ | ☐ | Onboarding curto mas claro |
| Acessibilidade | ☑ | ☐ | 5 níveis de texto + alto contraste excelente |
| Compatibilidade móvel/responsividade | ☑ | ☐ | TabBar a 200 % corrigida após bug B-05 |
| Satisfação geral | ☑ | ☐ | Boa experiência global |

### 2.4 Questionário pós-teste (escala 1–5)

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| O sistema foi fácil de utilizar | ☐ | ☐ | ☐ | ☑ | ☐ |
| A navegação entre separadores foi intuitiva | ☐ | ☐ | ☐ | ☑ | ☐ |
| As funcionalidades estavam bem organizadas | ☐ | ☐ | ☐ | ☐ | ☑ |
| Senti-me confortável a utilizar o sistema | ☐ | ☐ | ☐ | ☑ | ☐ |
| O mapa indoor 3D foi útil para encontrar salas | ☐ | ☐ | ☐ | ☑ | ☐ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **4,3 / 5**

---

## 3. Sessão 2 — Participante: Bruno Alves

### 3.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Filipe Silva |
| Nome do Participante | Bruno Alves |
| Data | 20 de maio de 2026, 19:00 |
| Plataforma | Android (Expo Go) |
| Dispositivo | Xiaomi Redmi Note 11, Android 13 |

### 3.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Sala G0.08 | Chegar ao indoor da sala | **Sim** | 22 | 0 | 5 | "Rápido, a barra de pesquisa está bem visível" | Fluxo executado sem hesitação |
| 2 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 38 | 0 | 5 | "Tocar na aula é natural" | Sem problemas |
| 3 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 47 | 0 | 4 | "Boa, mas o coração na pesquisa devia ter mais área de toque" | Gap G-04 da Fase 2 confirmado pelo utilizador |
| 4 | Alto contraste + texto 200 % | Verificar usabilidade | **Sim** | 62 | 1 | 4 | "Funcionou bem mas o botão 'Iniciar sessão' no perfil não respondeu a primeira vez" | Bug B-01 detectado pelo participante |
| 5 | Importar horário | Ver horário preenchido | **Parcial** | 130 | 2 | 3 | "Tive de tentar duas vezes porque colei só a chave em vez do link completo" | Mensagem de erro pouco específica — não distingue chave inválida de chave bem formada mas errada |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 55 | 0 | 5 | "Picker de edifício muito útil, a pesquisa dentro dele é boa" | Modal pesquisável dentro do seletor de origem funciona bem no Android |
| 7 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 35 | 0 | 5 | "Pull-to-refresh funciona" | Verificou explicitamente a atualização por pull — fluxo OK |
| 8 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Parcial** | 80 | 2 | 3 | "O boneco apareceu numa posição estranha no Piso 1 — tinha de fazer zoom out primeiro" | Posição inicial do Piso 1 definida em FLOOR_START_POSITIONS parece fora do corredor — necessita ajuste |

### 3.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | — |
| Legibilidade do texto | ☑ | ☐ | — |
| Tempo de carregamento | ☑ | ☐ | OK em Android; Indoor 3D aceitável |
| Consistência visual | ☑ | ☐ | — |
| Tamanho dos botões/interações | ☐ | ☑ | ♡ favoritar com hitbox pequena |
| Feedback do sistema | ☐ | ☑ | Importação podia mostrar detalhe do erro; posição inicial piso 1 confusa |
| Facilidade de aprendizagem | ☑ | ☐ | — |
| Acessibilidade | ☑ | ☐ | 5 níveis de texto excelente |
| Compatibilidade móvel/responsividade | ☑ | ☐ | — |
| Satisfação geral | ☑ | ☐ | — |

### 3.4 Questionário pós-teste

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| O sistema foi fácil de utilizar | ☐ | ☐ | ☐ | ☐ | ☑ |
| A navegação entre separadores foi intuitiva | ☐ | ☐ | ☐ | ☐ | ☑ |
| As funcionalidades estavam bem organizadas | ☐ | ☐ | ☐ | ☑ | ☐ |
| Senti-me confortável a utilizar o sistema | ☐ | ☐ | ☐ | ☑ | ☐ |
| O mapa indoor 3D foi útil para encontrar salas | ☐ | ☐ | ☑ | ☐ | ☐ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **4,5 / 5**

---

## 4. Sessão 3 — Participante: Pedro Braz

### 4.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Filipe Silva |
| Nome do Participante | Pedro Braz |
| Data | 21 de maio de 2026, 10:00 |
| Plataforma | Android (Expo Go) |
| Dispositivo | Samsung Galaxy A52, Android 13 |

### 4.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Sala G0.08 | Chegar ao indoor da sala | **Sim** | 35 | 1 | 4 | "Estava à espera de carregar no mapa primeiro" | Confusão entre tocar no marcador do mapa vs. usar barra de pesquisa |
| 2 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 45 | 0 | 4 | "OK" | Fluxo OK |
| 3 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 60 | 1 | 4 | "Achei que tinha de pesquisar primeiro a Biblioteca antes de favoritar" | Modelo mental correcto após descoberta — afinal favorita directamente dos resultados |
| 4 | Alto contraste + texto 200 % | Verificar usabilidade | **Sim** | 80 | 2 | 3 | "O texto a 200% deixa as definições com scroll vertical, e perdi-me um pouco" | Scroll esperado a 200 %; falta indicador visual de que o conteúdo continua abaixo |
| 5 | Importar horário | Ver horário preenchido | **Sim** | 110 | 1 | 4 | "Funcionou bem, só tive dificuldade em encontrar a chave no Inforestudante" | Sugere link directo ou captura de ecrã do passo correcto no Inforestudante dentro do modal |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 72 | 1 | 4 | "Não sabia que podia mudar o modo para carro — devia ser mais visível" | Toggle A pé / Carro está no painel inferior — pouco proeminente à primeira vista |
| 7 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 45 | 0 | 4 | "Bom, mas esperava poder filtrar por tipo (indoor/outdoor)" | Sugestão válida — actualmente apenas lista cronológica sem filtro |
| 8 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Sim** | 65 | 1 | 4 | "Demorei a perceber o gesto de pinch para zoom; depois correu bem" | Dica de gestos no hint ("Toca numa sala para navegar") não menciona zoom/pan |

### 4.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | — |
| Legibilidade do texto | ☑ | ☐ | — |
| Tempo de carregamento | ☑ | ☐ | — |
| Consistência visual | ☑ | ☐ | — |
| Tamanho dos botões/interações | ☑ | ☐ | OK no Android |
| Feedback do sistema | ☐ | ☑ | Falta confirmação em algumas acções; hint indoor não menciona gestos pan/zoom |
| Facilidade de aprendizagem | ☐ | ☑ | Pesquisa em vez de tocar no mapa não é óbvia; toggle de modo não proeminente |
| Acessibilidade | ☑ | ☐ | — |
| Compatibilidade móvel/responsividade | ☑ | ☐ | — |
| Satisfação geral | ☑ | ☐ | — |

### 4.4 Questionário pós-teste

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| O sistema foi fácil de utilizar | ☐ | ☐ | ☐ | ☑ | ☐ |
| A navegação entre separadores foi intuitiva | ☐ | ☐ | ☐ | ☑ | ☐ |
| As funcionalidades estavam bem organizadas | ☐ | ☐ | ☐ | ☐ | ☑ |
| Senti-me confortável a utilizar o sistema | ☐ | ☐ | ☐ | ☑ | ☐ |
| O mapa indoor 3D foi útil para encontrar salas | ☐ | ☐ | ☐ | ☑ | ☐ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **4,3 / 5**

---

## 5. Sessão 4 — Participante: Diogo Queiroz

### 5.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Filipe Silva |
| Nome do Participante | Diogo Queiroz |
| Data | 21 de maio de 2026, 11:30 |
| Plataforma | iOS (Expo Go) |
| Dispositivo | iPhone 12 Pro, iOS 17 |

### 5.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Sala G0.08 | Chegar ao indoor da sala | **Sim** | 30 | 0 | 5 | "Indoor 3D ficou bonito" | Sem dificuldades |
| 2 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 40 | 0 | 5 | "Limpo e directo" | — |
| 3 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 50 | 0 | 5 | "Gostei do ícone de coração a ficar vermelho" | Feedback visual da mudança de estado ♡→♥ bem recebido |
| 4 | Alto contraste + texto 200 % | Verificar usabilidade | **Sim** | 65 | 0 | 5 | "Excelente, fica muito preto e branco" | Sem dificuldades |
| 5 | Importar horário | Ver horário preenchido | **Sim** | 90 | 0 | 5 | "Funcionou à primeira" | — |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 48 | 0 | 5 | "Muito completo para quem vem de carro" | Utilizador com conhecimento do produto — sem hesitações |
| 7 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 30 | 0 | 5 | "Limpo e funcional" | — |
| 8 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Sim** | 40 | 0 | 5 | "O boneco animado é um bom detalhe" | Posição inicial no piso 1 OK neste dispositivo iOS |

### 5.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | — |
| Legibilidade do texto | ☑ | ☐ | — |
| Tempo de carregamento | ☑ | ☐ | — |
| Consistência visual | ☑ | ☐ | — |
| Tamanho dos botões/interações | ☑ | ☐ | — |
| Feedback do sistema | ☑ | ☐ | — |
| Facilidade de aprendizagem | ☑ | ☐ | — |
| Acessibilidade | ☑ | ☐ | — |
| Compatibilidade móvel/responsividade | ☑ | ☐ | — |
| Satisfação geral | ☑ | ☐ | — |

### 5.4 Questionário pós-teste

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| O sistema foi fácil de utilizar | ☐ | ☐ | ☐ | ☐ | ☑ |
| A navegação entre separadores foi intuitiva | ☐ | ☐ | ☐ | ☐ | ☑ |
| As funcionalidades estavam bem organizadas | ☐ | ☐ | ☐ | ☐ | ☑ |
| Senti-me confortável a utilizar o sistema | ☐ | ☐ | ☐ | ☐ | ☑ |
| O mapa indoor 3D foi útil para encontrar salas | ☐ | ☐ | ☐ | ☐ | ☑ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **5,0 / 5**

> *Nota: Diogo é o responsável pela modelação 3D — conhecimento muito profundo do produto, o que explica a pontuação máxima. Esta sessão deve ser interpretada com cautela como possivelmente enviesada por familiaridade extrema.*

---

## 6. Sessão 5 — Participante: Filipe Silva

> *Conduzida pelo Bruno Alves para evitar conflito de interesse — Filipe é o moderador habitual.*

### 6.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Bruno Alves |
| Nome do Participante | Filipe Silva |
| Data | 21 de maio de 2026, 14:00 |
| Plataforma | iOS (Expo Go) |
| Dispositivo | iPhone 14, iOS 18 |

### 6.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Sala G0.08 | Chegar ao indoor da sala | **Sim** | 25 | 0 | 5 | "Tudo OK" | — |
| 2 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 35 | 0 | 5 | "Boa" | — |
| 3 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 45 | 0 | 5 | "Boa" | — |
| 4 | Alto contraste + texto 200 % | Verificar usabilidade | **Sim** | 55 | 0 | 5 | "Excelente após o fix do B-05" | — |
| 5 | Importar horário | Ver horário preenchido | **Sim** | 85 | 0 | 5 | "OK" | — |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 40 | 0 | 5 | "Modal de picker de origem muito bem feito" | — |
| 7 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 28 | 0 | 5 | "Limpo" | — |
| 8 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Sim** | 38 | 0 | 5 | "Transição entre pisos rápida" | — |

### 6.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Todos os aspectos | ☑ | ☐ | Avaliação muito positiva mas potencialmente enviesada por familiaridade |

### 6.4 Questionário pós-teste

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| Todas as 6 questões | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **5,0 / 5**

---

## 7. Compilação dos resultados

### 7.1 Taxa de sucesso global

| Tarefa | U1 Liane | U2 Bruno | U3 Pedro | U4 Diogo | U5 Filipe | Taxa de sucesso |
|---|:---:|:---:|:---:|:---:|:---:|---|
| T1 G0.08 | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T2 Horário | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T3 Favoritos | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T4 Acessibilidade | **Parcial** | Sim | Sim | Sim | Sim | **80 %** (1 parcial) |
| T5 Importar | Sim | **Parcial** | Sim | Sim | Sim | **80 %** (1 parcial) |
| T6 Outdoor partida+modo | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T7 Histórico+renavigar | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T8 Indoor 3D piso+tap | Sim | **Parcial** | Sim | Sim | Sim | **80 %** (1 parcial) |
| **Total** | 7S 1P | 6S 2P | 8S | 8S | 8S | **93,75 %** |

### 7.2 Tempos médios por tarefa

| Tarefa | Tempo médio (s) | Min | Max | Desvio |
|---|---:|---:|---:|---:|
| T1 G0.08 | **28** | 22 | 35 | ±5 |
| T2 Horário | **40** | 35 | 45 | ±4 |
| T3 Favoritos | **51** | 45 | 60 | ±6 |
| T4 Acessibilidade | **67** | 55 | 80 | ±9 |
| T5 Importar | **102** | 85 | 130 | ±17 |
| T6 Outdoor partida+modo | **57** | 40 | 72 | ±12 |
| T7 Histórico+renavigar | **36** | 28 | 45 | ±6 |
| T8 Indoor 3D piso+tap | **56** | 38 | 80 | ±15 |
| **Média global** | **55** | — | — | — |

### 7.3 Facilidade média por tarefa

| Tarefa | Facilidade média (1–5) |
|---|:---:|
| T1 G0.08 | **4,8** |
| T2 Horário | **4,6** |
| T3 Favoritos | **4,4** |
| T4 Acessibilidade | **4,0** |
| T5 Importar | **4,2** |
| T6 Outdoor partida+modo | **4,6** |
| T7 Histórico+renavigar | **4,8** |
| T8 Indoor 3D piso+tap | **4,2** |
| **Média global** | **4,5 / 5** |

### 7.4 Erros médios por tarefa

| Tarefa | Erros médios | Tipo de erro mais comum |
|---|---:|---|
| T1 | **0,2** | Confusão entre planta 2D e modelo 3D |
| T2 | **0,2** | Affordance do cartão de aula (não parece clicável à primeira) |
| T3 | **0,2** | Tamanho reduzido do botão ♡ (hitbox) |
| T4 | **1,0** | Falta feedback de confirmação nos switches de acessibilidade |
| T5 | **0,8** | Mensagem de erro pouco específica + dificuldade em encontrar chave no Inforestudante |
| T6 | **0,4** | Label "De" na outdoor não identificada como clicável à primeira |
| T7 | **0,0** | Sem erros registados — fluxo directo |
| T8 | **0,8** | Pill de piso discreto + posição inicial do boneco em piso 1 pouco clara (Android) |

### 7.5 Questionário Likert — médias globais

| Questão | Média (1–5) | Interpretação |
|---|:---:|---|
| O sistema foi fácil de utilizar | **4,6** | Muito positivo |
| A navegação entre separadores foi intuitiva | **4,6** | Muito positivo |
| As funcionalidades estavam bem organizadas | **4,8** | Excelente |
| Senti-me confortável a utilizar o sistema | **4,4** | Muito positivo |
| O mapa indoor 3D foi útil para encontrar salas | **4,2** | Muito positivo |
| Voltaria a utilizar esta aplicação | **5,0** | Excelente |
| **Média global (System Usability)** | **4,6 / 5** | **Excelente** |

### 7.6 Checklist agregada

| Aspecto avaliado | Adequado | Necessita melhorias |
|---|:---:|:---:|
| Facilidade de navegação | **5 / 5** | 0 |
| Legibilidade do texto | **5 / 5** | 0 |
| Tempo de carregamento | 4 / 5 | **1** (Liane — pesquisa + indoor 3D) |
| Consistência visual | **5 / 5** | 0 |
| Tamanho dos botões/interações | 3 / 5 | **2** (Liane, Bruno — ♡ favoritar) |
| Feedback do sistema | 2 / 5 | **3** (Liane, Bruno, Pedro — switches, importação, indoor hint) |
| Facilidade de aprendizagem | 4 / 5 | **1** (Pedro — pesquisa vs. tap mapa; toggle modo outdoor) |
| Acessibilidade | **5 / 5** | 0 |
| Compatibilidade móvel/responsividade | **5 / 5** | 0 |
| Satisfação geral | **5 / 5** | 0 |

### 7.7 Cobertura de funcionalidades pelos testes

A tabela seguinte indica quais funcionalidades foram exercidas por cada tarefa, permitindo identificar eventuais lacunas de cobertura.

| Funcionalidade | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Barra pesquisa flutuante (mapa) | ☑ | | | | | | | |
| Pesquisa com filtros e distância | ☑ | | ☑ | | | | | |
| Botão ♡ favoritar | | | ☑ | | | | | |
| Lista de favoritos + navegar | | | ☑ | | | | | |
| Horário — seletor dia + semana | | ☑ | | | | | | |
| Horário — tap aula → navegar | | ☑ | | | | | | |
| Importação horário (modal) | | | | | ☑ | | | |
| Alto Contraste (switch) | | | | ☑ | | | | |
| Tamanho de texto a 200 % | | | | ☑ | | | | |
| Switch Rotas Acessíveis | | | | ☑ | | | | |
| Indoor 3D — tap sala + boneco | ☑ | | | | | | | ☑ |
| Indoor 3D — mudar piso (dropdown) | | | | | | | | ☑ |
| Indoor 3D — pan + zoom gestos | | | | | | | | ☑ |
| Outdoor — fase Planning | | ☑ | ☑ | | | ☑ | ☑ | |
| Outdoor — selector ponto partida | | | | | | ☑ | | |
| Outdoor — toggle A pé / Carro | | | | | | ☑ | | |
| Outdoor — fase Navigating | | | | | | | | |
| Card Próxima Aula (Perfil) | | | | | | | | |
| Histórico — lista + renavigar | | | | | | | ☑ | |
| Histórico — pull-to-refresh | | | | | | | ☑ | |
| Tema Claro/Escuro | | | | ☑ | | | | |
| Idioma PT/EN | | | | ☑ | | | | |
| Suporte e Ajuda (FAQ) | | | | | | | | |
| Login / Logout | | | | | | | | |
| Onboarding (slides) | | | | | | | | |

> **Funcionalidades não cobertas pelos 8 testes**: fase Navigating do outdoor, card Próxima Aula, FAQ/Suporte, Login/Logout e Onboarding. Estas foram excluídas por constrangimento de tempo, pelo que os dados de usabilidade correspondentes devem ser recolhidos em iterações futuras com utilizadores externos.

---

## 8. Conclusões dos testes com utilizadores

A avaliação com os cinco participantes da equipa registou uma **taxa de sucesso global de 93,75 %** (37 tarefas concluídas com sucesso, 3 parciais), com uma **facilidade média de 4,5 / 5** e **pontuação Likert global de 4,6 / 5**. Estes valores indicam uma experiência muito positiva globalmente, ainda que enviesada pela familiaridade dos participantes com o produto.

Os **pontos críticos** consistentes em vários participantes foram:

1. **Feedback do sistema** (3 em 5 participantes) — switches de Acessibilidade (Alto Contraste, Rotas Acessíveis, Leitor de Ecrã) não fornecem confirmação visual após activação; importação de horário não distingue tipo de erro; hint do indoor 3D não menciona gestos de pan/zoom
2. **Tamanho dos botões/interações** (2 em 5) — ícone ♡ de favoritar na pesquisa tem hitbox insuficiente; label "De" na navegação outdoor não é imediatamente reconhecida como clicável
3. **Tarefa T5 (Importar horário)** — tempo médio mais alto (102 s) e maior variação (±17 s), maioritariamente por dificuldade em localizar a chave no Inforestudante; mensagem de erro não distingue formato inválido de chave errada
4. **Tarefa T8 (Indoor 3D piso+tap)** — posição inicial do boneco no Piso 1 parece incorrecta em dispositivos Android (Bruno); pill de seletor de piso discreto (Liane)
5. **Bug B-01 reconfirmado** — botão "Iniciar sessão" no Perfil não responde após logout prévio (Bruno)

Os **pontos fortes** confirmados foram a facilidade de navegação, legibilidade do texto, consistência visual, acessibilidade (5 níveis de texto + alto contraste), histórico de navegação, modal pesquisável de ponto de partida outdoor e satisfação geral, todos com 5/5 participantes a classificarem como adequados ou avaliações Likert de 4–5.

A síntese cruzada destes resultados com os achados da Avaliação Heurística e das Regras de Shneiderman está documentada em `PROBLEMAS_DETECTADOS.md`. As melhorias propostas baseadas nestes resultados encontram-se em `MELHORIAS_PROPOSTAS.md`.
