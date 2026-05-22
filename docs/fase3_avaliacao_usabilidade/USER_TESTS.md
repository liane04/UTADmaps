# Testes com Utilizadores (User Tests)

**Responsável**: Participante 5
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

Avaliar a **eficácia**, **eficiência** e **satisfação** dos utilizadores ao realizarem treze tarefas representativas no UTAD Maps, identificar pontos de fricção e fundamentar propostas de melhoria.

### 1.2 Participantes

Os cinco elementos da equipa de desenvolvimento. **Limitação metodológica conhecida**: os participantes têm conhecimento prévio do produto, o que tende a **subestimar** o tempo de execução e **sobrestimar** o sucesso comparado com utilizadores externos novos. A justificação para esta amostra é o constrangimento temporal de execução da Fase 3 (20 a 22 de maio). Ainda assim, é possível extrair valor relativo (comparações entre tarefas) e identificar problemas que mesmo conhecedores enfrentam.

### 1.3 Tarefas

A ordem das tarefas foi desenhada para reproduzir um **fluxo de utilização natural**: o utilizador inicia sessão, importa e consulta o horário, navega para as suas aulas, explora favoritos e navegação outdoor/indoor, ajusta acessibilidade e personalização, consulta a ajuda e, por fim, encerra a sessão. Esta sequência garante que tarefas dependentes do horário (T3 e T4) são executadas **depois** da importação (T2).

| # | Tarefa | Critério de sucesso |
|---|---|---|
| **T1** | Na tela de início de sessão, activar e desativar o toggle de mostrar password, introduzir as credenciais e confirmar que a sessão ficou activa | Password visível no campo antes de submeter; sessão iniciada e mapa principal visível |
| **T2** | Importar horário do Inforestudante via link privado | Ver horário semanal preenchido com aulas reais |
| **T3** | Consultar o horário de quinta-feira e iniciar navegação para a sala da primeira aula | Iniciar navegação indoor/outdoor para a sala correcta |
| **T4** | No Perfil, verificar o card "Próxima Aula" e navegar tocando no card | Chegar ao ecrã de navegação da sala da próxima aula |
| **T5** | Adicionar a Biblioteca aos favoritos e usar o favorito para navegar | Ver Biblioteca em Favoritos e iniciar navegação a partir daí |
| **T6** | Mudar o ponto de partida na navegação outdoor (de GPS para um edifício) e alternar o modo entre A pé e Carro | Rota recalculada com novo ponto de partida e modo carro activo |
| **T7** | Na fase Navigating da navegação outdoor, pressionar "Começar Navegação", seguir as instruções e terminar a navegação | Card de instrução apresentado; botão Terminar encerra a navegação |
| **T8** | Consultar o histórico de navegação e renavigar para a última entrada | Chegar ao ecrã de navegação do destino histórico |
| **T9** | Mudar o piso no Indoor 3D do Sector E (Piso 0 → Piso 1) e navegar por toque até uma sala diferente | Boneco animado chega a uma sala do Piso 1 |
| **T10** | Ativar Alto Contraste e texto a 200 %, verificar usabilidade no Mapa e no Horário | Confirmar que os dois ecrãs estão funcionais e legíveis |
| **T11** | Ativar tema Escuro e mudar o idioma para Inglês; verificar Mapa e Horário em inglês | Mapa e Horário apresentados em inglês com tema escuro activo |
| **T12** | Aceder a Suporte e Ajuda e encontrar a resposta à pergunta "Como importo o meu horário?" | FAQ expandida com a resposta correcta visível |
| **T13** | Fazer logout no Perfil, voltar a entrar com as mesmas credenciais e verificar a auto-importação do horário | Sessão reiniciada e horário restaurado automaticamente |

### 1.4 Escala de facilidade

| 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|
| Muito difícil | Difícil | Razoável | Fácil | Muito fácil |

### 1.5 Sistema avaliado, plataforma e dispositivo

| Campo | Valor |
|---|---|
| **Sistema Avaliado** | UTAD Maps v1.0 (build de 20 maio 2026) |
| **Tipo de Plataforma** | ☐ Website  ☑ Android  ☑ iOS |
| **Dispositivo Utilizado** | Variável por sessão (ver cada teste) |

---

## 2. Sessão 1 — Participante 1

### 2.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Filipe Silva |
| Nome do Participante | Participante 1 |
| Data | 20 de maio de 2026, 18:30 |
| Sistema Avaliado | UTAD Maps v1.0 |
| Plataforma | iOS (Expo Go) |
| Dispositivo | iPhone 13, iOS 17 |

### 2.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Login + mostrar password | Sessão iniciada, mapa principal visível | **Sim** | 25 | 0 | 5 | "Ícone de olho no campo de password é muito intuitivo — confirmei logo que não tinha errado" | Fluxo directo; toggle show/hide password funcionou sem hesitação |
| 2 | Importar horário | Ver horário preenchido | **Sim** | 95 | 1 | 4 | "Tive de procurar onde colar o link no Inforestudante" | Onboarding do importar pode ser melhorado — não indica onde encontrar a chave |
| 3 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 42 | 1 | 4 | "Tive de tocar na aula para perceber que dava para navegar" | Affordance do cartão de aula é subtil — apenas o chevron forward indica que é clicável |
| 4 | Card Próxima Aula | Navegar tocando no card | **Sim** | 48 | 1 | 4 | "Não percebi logo que o card era clicável" | Affordance do tap no card não é óbvia — falta indicação visual de elemento interactivo |
| 5 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 55 | 0 | 5 | "Mal vi o coração percebi que era para favoritar" | — |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 68 | 1 | 5 | "Igualzinho a todos os GPS" | — |
| 7 | Navigating outdoor | Card instrução, auto-avanço, terminar | **Sim** | 55 | 1 | 4 | "Cabeçalho azul claro mas não sabia que o mapa seguia automaticamente" | Auto-centering não comunicado ao utilizador |
| 8 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 40 | 0 | 5 | "Funciona bem, data relativa é boa ideia" | Fluxo directo; data relativa ("Há 2 h") fácil de interpretar |
| 9 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Sim** | 58 | 1 | 4 | "Não vi logo o pill de piso, esperava um botão mais visível" | Pill "Piso 0" no canto superior direito é discreto; dropdown funciona bem após descoberta |
| 10 | Alto contraste + texto 200 % | Verificar usabilidade | **Sim** | 71 | 0 | 5 | "Muito fácil, não achei nada dificil e ficou bem visível" | — |
| 11 | Tema Escuro + idioma EN | Mapa e Horário em inglês com tema escuro | **Sim** | 32 | 0 | 5 | "Tema escuro ficou muito bem!" | Toggle com feedback visual imediato |
| 12 | Suporte e Ajuda | Encontrar resposta "Como importo?" | **Sim** | 52 | 1 | 4 | "Tive de ler as 6 perguntas — devia ter pesquisa" | FAQ sem campo de pesquisa; percorre todas as entradas linearmente |
| 13 | Logout + Login + auto-import | Auto-importação horário | **Parcial** | 92 | 2 | 3 | "Botão 'Iniciar sessão' não respondeu após logout — reabri a app" | Bug B-01 confirmado: botão login não responde após logout sem reiniciar a app |

**Total**: 12 Sim · 1 Parcial · 0 Falhas (de 13 tarefas)

### 2.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | Tab-bar bem distribuída |
| Legibilidade do texto | ☑ | ☐ | Fonte confortável no nível normal |
| Tempo de carregamento | ☐ | ☑ | Pesquisa demorou alguns segundos por vezes; Indoor 3D ~2–3 s por piso |
| Consistência visual | ☑ | ☐ | Boa coerência geral |
| Tamanho dos botões/interações | ☐ | ☑ | Coração dos favoritos (♡) pequeno; "De" na outdoor subtil; card Próxima Aula sem indicação de clicável |
| Feedback do sistema | ☐ | ☑ | Falta confirmação visual ao activar switches; auto-centering outdoor não comunicado; bug B-01 no login pós-logout |
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
| As opções de acessibilidade e personalização satisfazem as minhas necessidades | ☐ | ☐ | ☐ | ☑ | ☐ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **4,3 / 5**

---

## 3. Sessão 2 — Participante 2

### 3.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Diogo Queiroz |
| Nome do Participante | Participante 2 |
| Data | 20 de maio de 2026, 19:00 |
| Plataforma | Android (Expo Go) |
| Dispositivo | Xiaomi Redmi Note 11, Android 13 |

### 3.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Login + mostrar password | Sessão iniciada, mapa principal visível | **Sim** | 22 | 0 | 5 | "Login rápido e limpo" | Sem problemas |
| 2 | Importar horário | Ver horário preenchido | **Sim** | 130 | 1 | 4 | "Na aplicação está intuitivo mas perdi-me um pouco no inforestudantes para encontrar o link" | Tempo no inforestudantes á procura do link do horario um pouco elevado |
| 3 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 38 | 0 | 5 | "Tocar na aula é natural" | Sem problemas |
| 4 | Card Próxima Aula | Navegar tocando no card | **Sim** | 36 | 0 | 5 | "Ícone de navigate ajuda bastante" | — |
| 5 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 47 | 0 | 4 | "Podia ser mais intuitivo se tivesse um botão de favoritar no mapa" | Teve algum tempo no mapa mas depois conseguiu encontrar o sitio de favoritar |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 55 | 0 | 5 | "Muito fácil e intuitivo" | Sem Problemas |
| 7 | Navigating outdoor | Card instrução, auto-avanço, terminar | **Sim** | 45 | 0 | 5 | "Parece o Google Maps!" | — |
| 8 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 35 | 0 | 5 | "Achei simples e intuitivo" | Sem problemas fez tudo rapidamente |
| 9 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Sim** | 80 | 2 | 4 | "Se tivesse que subir escadas ou entrado noutro lado, ia me sentir perdido" | Conseguiu fazer tudo mas mostrou um desentendimento com o comentário final |
| 10 | Alto contraste + texto 200 % | Verificar usabilidade | **Sim** | 62 | 0 | 5 | "Muito intuitivo" | Sem problemas |
| 11 | Tema Escuro + idioma EN | Mapa e Horário em inglês com tema escuro | **Sim** | 28 | 0 | 5 | "Toggle muito directo" | Sem problemas |
| 12 | Suporte e Ajuda | Encontrar resposta "Como importo?" | **Sim** | 38 | 0 | 4 | "Acho que é foi facil encontrar, mas podia ser mais intuitivo" | Procurou no perfil e não encontrou, mas depois em pouco tempo foi ver as defições e descobriu o mesmo |
| 13 | Logout + Login + auto-import | Auto-importação horário | **Parcial** | 30 | 2 | 3 | "Muito facil dar logout mas depois nao consegui voltar a iniciar sessão e o meu horario já estava exposto mesmo sem conta" | Bug a tentar entrar na conta e o horario aparece mesmo sem a conta |

**Total**: 12 Sim · 1 Parcial · 0 Falhas (de 13 tarefas)

### 3.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | — |
| Legibilidade do texto | ☑ | ☐ | — |
| Tempo de carregamento | ☑ | ☐ | OK em Android; Indoor 3D aceitável |
| Consistência visual | ☑ | ☐ | — |
| Tamanho dos botões/interações | ☑ | ☐ | Sem queixas de toque no Android |
| Feedback do sistema | ☐ | ☑ | Importação podia mostrar detalhe do erro; bug B-01 no login pós-logout; bug B-02 — horário visível sem sessão activa |
| Facilidade de aprendizagem | ☐ | ☑ | Sugere botão de favoritar directamente no mapa; Suporte/Ajuda pouco óbvio (procurou no Perfil antes das Definições) |
| Acessibilidade | ☑ | ☐ | 5 níveis de texto excelente |
| Compatibilidade móvel/responsividade | ☑ | ☐ | — |
| Satisfação geral | ☑ | ☐ | Boa, exceto fricção no logout/login |

### 3.4 Questionário pós-teste

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| O sistema foi fácil de utilizar | ☐ | ☐ | ☐ | ☐ | ☑ |
| A navegação entre separadores foi intuitiva | ☐ | ☐ | ☐ | ☐ | ☑ |
| As funcionalidades estavam bem organizadas | ☐ | ☐ | ☐ | ☑ | ☐ |
| Senti-me confortável a utilizar o sistema | ☐ | ☐ | ☐ | ☑ | ☐ |
| O mapa indoor 3D foi útil para encontrar salas | ☐ | ☐ | ☐ | ☑ | ☐ |
| As opções de acessibilidade e personalização satisfazem as minhas necessidades | ☐ | ☐ | ☐ | ☑ | ☐ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **4,4 / 5**

---

## 4. Sessão 3 — Participante 3

### 4.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Bruno Alves |
| Nome do Participante | Participante 3 |
| Data | 21 de maio de 2026, 10:00 |
| Plataforma | Android (Expo Go) |
| Dispositivo | Samsung Galaxy A52, Android 13 |

### 4.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Login + mostrar password | Sessão iniciada, mapa principal visível | **Sim** | 32 | 1 | 4 | "Digitei mal a password à primeira — o ícone de olho ajudou a confirmar o erro" | Eye icon revelou erro de digitação; utilizador corrigiu sem dificuldade |
| 2 | Importar horário | Ver horário preenchido | **Sim** | 110 | 1 | 4 | "Funcionou bem, só tive dificuldade em encontrar a chave no Inforestudante" | Sugere link directo ou captura de ecrã do passo correcto no Inforestudante dentro do modal |
| 3 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 45 | 0 | 4 | "OK" | Fluxo OK |
| 4 | Card Próxima Aula | Navegar tocando no card | **Sim** | 38 | 0 | 4 | "Com o horário já importado, o card apareceu logo preenchido" | Com a nova ordem (importar antes), o card mostrou a próxima aula sem estado vazio — fluxo directo |
| 5 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 60 | 1 | 4 | "Achei que tinha de pesquisar primeiro a Biblioteca antes de favoritar" | Modelo mental correcto após descoberta — afinal favorita directamente dos resultados |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 72 | 1 | 4 | "Não sabia que podia mudar o modo para carro — devia ser mais visível" | Toggle A pé / Carro está no painel inferior — pouco proeminente à primeira vista |
| 7 | Navigating outdoor | Card instrução, auto-avanço, terminar | **Sim** | 58 | 1 | 4 | "Botão Terminar em vermelho intuitivo; mas o contador de passos estava subtil" | Progresso numérico de passos poderia ter maior destaque |
| 8 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 45 | 0 | 4 | "Bom, mas esperava poder filtrar por tipo (indoor/outdoor)" | Sugestão válida — actualmente apenas lista cronológica sem filtro |
| 9 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Sim** | 65 | 1 | 4 | "Demorei a perceber o gesto de pinch para zoom; depois correu bem" | Dica de gestos no hint ("Toca numa sala para navegar") não menciona zoom/pan |
| 10 | Alto contraste + texto 200 % | Verificar usabilidade | **Sim** | 80 | 2 | 3 | "O texto a 200 % deixa as definições com scroll vertical, e perdi-me um pouco" | Scroll esperado a 200 %; falta indicador visual de que o conteúdo continua abaixo |
| 11 | Tema Escuro + idioma EN | Mapa e Horário em inglês com tema escuro | **Sim** | 42 | 1 | 4 | "Fui ao Perfil primeiro antes de achar Definições" | Trajecto indirecto até Definições — utilizador não associou personalização a esse menu |
| 12 | Suporte e Ajuda | Encontrar resposta "Como importo?" | **Sim** | 47 | 0 | 4 | "Só 6 FAQs parece pouco para uma app desta dimensão" | Sugere mais conteúdo de ajuda; também ausência de campo de pesquisa |
| 13 | Logout + Login + auto-import | Auto-importação horário | **Sim** | 72 | 1 | 4 | "Consegui entrar mas toquei 2× no botão" | Manifestação atenuada do bug B-01 — botão respondeu na 2.ª tentativa sem reiniciar |

**Total**: 13 Sim · 0 Parciais · 0 Falhas (de 13 tarefas)

### 4.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | — |
| Legibilidade do texto | ☑ | ☐ | — |
| Tempo de carregamento | ☑ | ☐ | — |
| Consistência visual | ☑ | ☐ | — |
| Tamanho dos botões/interações | ☑ | ☐ | OK no Android |
| Feedback do sistema | ☐ | ☑ | Falta confirmação em algumas acções; hint indoor não menciona gestos pan/zoom; progresso de passos outdoor pouco visível |
| Facilidade de aprendizagem | ☐ | ☑ | Pesquisa em vez de tocar no mapa não é óbvia; toggle de modo não proeminente; Definições não associada a personalização à primeira |
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
| As opções de acessibilidade e personalização satisfazem as minhas necessidades | ☐ | ☐ | ☐ | ☑ | ☐ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **4,3 / 5**

---

## 5. Sessão 4 — Participante 4

### 5.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Liane Duarte |
| Nome do Participante | Participante 4 |
| Data | 21 de maio de 2026, 11:30 |
| Plataforma | iOS (Expo Go) |
| Dispositivo | iPhone 12 Pro, iOS 17 |

### 5.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Login + mostrar password | Sessão iniciada, mapa principal visível | **Sim** | 20 | 0 | 5 | — | — |
| 2 | Importar horário | Ver horário preenchido | **Sim** | 90 | 0 | 5 | "Funcionou à primeira" | — |
| 3 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 40 | 0 | 5 | "Limpo e directo" | — |
| 4 | Card Próxima Aula | Navegar tocando no card | **Sim** | 30 | 0 | 5 | — | — |
| 5 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 50 | 0 | 5 | "Gostei do ícone de coração a ficar vermelho" | Feedback visual da mudança de estado ♡→♥ bem recebido |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 48 | 0 | 5 | "Muito completo para quem vem de carro" | Utilizador com conhecimento do produto — sem hesitações |
| 7 | Navigating outdoor | Card instrução, auto-avanço, terminar | **Sim** | 40 | 0 | 5 | — | — |
| 8 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 30 | 0 | 5 | "Limpo e funcional" | — |
| 9 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Sim** | 40 | 0 | 5 | "O boneco animado é um bom detalhe" | Sem dificuldades; boneco animado bem recebido |
| 10 | Alto contraste + texto 200 % | Verificar usabilidade | **Sim** | 65 | 0 | 5 | "Excelente, fica muito preto e branco" | Sem dificuldades |
| 11 | Tema Escuro + idioma EN | Mapa e Horário em inglês com tema escuro | **Sim** | 24 | 0 | 5 | — | — |
| 12 | Suporte e Ajuda | Encontrar resposta "Como importo?" | **Sim** | 32 | 0 | 5 | — | — |
| 13 | Logout + Login + auto-import | Auto-importação horário | **Sim** | 55 | 0 | 5 | — | — |

**Total**: 13 Sim · 0 Parciais · 0 Falhas (de 13 tarefas)

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
| As opções de acessibilidade e personalização satisfazem as minhas necessidades | ☐ | ☐ | ☐ | ☐ | ☑ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **5,0 / 5**

> *Nota: Participante 4 tem conhecimento muito profundo do produto, o que explica a pontuação máxima. Esta sessão deve ser interpretada com cautela como possivelmente enviesada por familiaridade extrema.*

---

## 6. Sessão 5 — Participante 5

> *Conduzida pelo Participante 2 para evitar conflito de interesse — Participante 5 é o moderador habitual.*

### 6.1 Informação do teste

| Campo | Valor |
|---|---|
| Nome do Avaliador | Pedro Braz |
| Nome do Participante | Participante 5 |
| Data | 21 de maio de 2026, 14:00 |
| Plataforma | iOS (Expo Go) |
| Dispositivo | iPhone 14, iOS 18 |

### 6.2 Avaliação das tarefas

| Nº | Tarefa | Objectivo | Sucesso | Tempo (s) | Erros | Facilidade (1–5) | Comentários do utilizador | Observações do moderador |
|:---:|---|---|:---:|---:|:---:|:---:|---|---|
| 1 | Login + mostrar password | Sessão iniciada, mapa principal visível | **Sim** | 18 | 0 | 5 | — | — |
| 2 | Importar horário | Ver horário preenchido | **Sim** | 85 | 0 | 5 | "OK" | — |
| 3 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 35 | 0 | 5 | "Boa" | — |
| 4 | Card Próxima Aula | Navegar tocando no card | **Sim** | 28 | 0 | 5 | — | — |
| 5 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 45 | 0 | 5 | "Boa" | — |
| 6 | Mudar partida + modo carro | Rota com novo origen e modo carro | **Sim** | 40 | 0 | 5 | "Modal de picker de origem muito bem feito" | — |
| 7 | Navigating outdoor | Card instrução, auto-avanço, terminar | **Sim** | 38 | 0 | 5 | — | — |
| 8 | Histórico + renavigar | Navegar a partir do histórico | **Sim** | 28 | 0 | 5 | "Limpo" | — |
| 9 | Mudar piso Indoor 3D | Boneco no Piso 1, tap sala | **Sim** | 38 | 0 | 5 | "Transição entre pisos rápida" | — |
| 10 | Alto contraste + texto 200 % | Verificar usabilidade | **Sim** | 55 | 0 | 5 | "Excelente após o fix do B-05" | — |
| 11 | Tema Escuro + idioma EN | Mapa e Horário em inglês com tema escuro | **Sim** | 22 | 0 | 5 | — | — |
| 12 | Suporte e Ajuda | Encontrar resposta "Como importo?" | **Sim** | 30 | 0 | 5 | — | — |
| 13 | Logout + Login + auto-import | Auto-importação horário | **Sim** | 50 | 0 | 5 | "Auto-importação do horário funcionou perfeitamente" | — |

**Total**: 13 Sim · 0 Parciais · 0 Falhas (de 13 tarefas)

### 6.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Todos os aspectos | ☑ | ☐ | Avaliação muito positiva mas potencialmente enviesada por familiaridade |

### 6.4 Questionário pós-teste

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| Todas as 7 questões | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **5,0 / 5**

---

## 7. Compilação dos resultados

### 7.1 Taxa de sucesso global

| Tarefa | U1 P1 | U2 P2 | U3 P3 | U4 P4 | U5 P5 | Taxa de sucesso |
|---|:---:|:---:|:---:|:---:|:---:|---|
| T1 Login + mostrar password | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T2 Importar | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T3 Horário + navegar 1.ª aula | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T4 Card Próxima Aula | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T5 Favoritos | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T6 Outdoor partida+modo | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T7 Navigating outdoor | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T8 Histórico+renavigar | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T9 Indoor 3D piso+tap | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T10 Acessibilidade | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T11 Tema+idioma | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T12 Suporte FAQ | Sim | Sim | Sim | Sim | Sim | **100 %** |
| T13 Logout+Login+auto-import | **Parcial** | **Parcial** | Sim | Sim | Sim | **60 %** (2 parciais) |
| **Total** | 12S · 1P | 12S · 1P | 13S | 13S | 13S | **96,9 %** (63/65) |

### 7.2 Tempos médios por tarefa

| Tarefa | Tempo médio (s) | Min | Max | Desvio |
|---|---:|---:|---:|---:|
| T1 Login + mostrar password | **23** | 18 | 32 | ±6 |
| T2 Importar | **102** | 85 | 130 | ±17 |
| T3 Horário + navegar 1.ª aula | **40** | 35 | 45 | ±4 |
| T4 Card Próxima Aula | **36** | 28 | 48 | ±8 |
| T5 Favoritos | **51** | 45 | 60 | ±6 |
| T6 Outdoor partida+modo | **57** | 40 | 72 | ±12 |
| T7 Navigating outdoor | **47** | 38 | 58 | ±8 |
| T8 Histórico+renavigar | **36** | 28 | 45 | ±6 |
| T9 Indoor 3D piso+tap | **56** | 38 | 80 | ±15 |
| T10 Acessibilidade | **67** | 55 | 80 | ±9 |
| T11 Tema+idioma | **30** | 22 | 42 | ±8 |
| T12 Suporte FAQ | **40** | 30 | 52 | ±9 |
| T13 Logout+Login+auto-import | **60** | 30 | 92 | ±23 |
| **Média global** | **50** | — | — | — |

### 7.3 Facilidade média por tarefa

| Tarefa | Facilidade média (1–5) |
|---|:---:|
| T1 Login + mostrar password | **4,8** |
| T2 Importar | **4,4** |
| T3 Horário + navegar 1.ª aula | **4,6** |
| T4 Card Próxima Aula | **4,6** |
| T5 Favoritos | **4,6** |
| T6 Outdoor partida+modo | **4,8** |
| T7 Navigating outdoor | **4,6** |
| T8 Histórico+renavigar | **4,8** |
| T9 Indoor 3D piso+tap | **4,4** |
| T10 Acessibilidade | **4,6** |
| T11 Tema+idioma | **4,8** |
| T12 Suporte FAQ | **4,4** |
| T13 Logout+Login+auto-import | **4,0** |
| **Média global** | **4,6 / 5** |

### 7.4 Erros médios por tarefa

| Tarefa | Erros médios | Tipo de erro mais comum |
|---|---:|---|
| T1 | **0,2** | Erro de digitação na password (P3) — detectado e corrigido com o eye icon |
| T2 | **0,6** | Dificuldade em encontrar a chave/link no Inforestudante; mensagem de erro pouco específica |
| T3 | **0,2** | Affordance do cartão de aula (não parece clicável à primeira) |
| T4 | **0,2** | Card Próxima Aula não aparenta ser clicável à primeira (P1) |
| T5 | **0,2** | Tamanho reduzido do botão ♡ (hitbox); dúvida se favorita da pesquisa |
| T6 | **0,4** | Label "De" na outdoor não identificada como clicável; toggle de modo pouco proeminente |
| T7 | **0,4** | Auto-centering não comunicado; contador de passos subtil |
| T8 | **0,0** | Sem erros registados — fluxo directo |
| T9 | **0,8** | Pill de piso discreto; gesto de pinch/zoom não sinalizado no hint |
| T10 | **0,4** | Scroll a 200 % sem indicador de continuação do conteúdo (P3) |
| T11 | **0,2** | Trajecto indirecto até Definições (Perfil em vez de menu tab) |
| T12 | **0,2** | Percorrer todas as FAQs linearmente sem campo de pesquisa |
| T13 | **1,0** | Bug B-01 (login não responde após logout) e Bug B-02 (horário visível sem sessão) |

### 7.5 Questionário Likert — médias globais

| Questão | Média (1–5) | Interpretação |
|---|:---:|---|
| O sistema foi fácil de utilizar | **4,6** | Muito positivo |
| A navegação entre separadores foi intuitiva | **4,6** | Muito positivo |
| As funcionalidades estavam bem organizadas | **4,8** | Excelente |
| Senti-me confortável a utilizar o sistema | **4,4** | Muito positivo |
| O mapa indoor 3D foi útil para encontrar salas | **4,4** | Muito positivo |
| As opções de acessibilidade e personalização satisfazem as minhas necessidades | **4,4** | Muito positivo |
| Voltaria a utilizar esta aplicação | **5,0** | Excelente |
| **Média global (System Usability)** | **4,6 / 5** | **Excelente** |

### 7.6 Checklist agregada

| Aspecto avaliado | Adequado | Necessita melhorias |
|---|:---:|:---:|
| Facilidade de navegação | **5 / 5** | 0 |
| Legibilidade do texto | **5 / 5** | 0 |
| Tempo de carregamento | 4 / 5 | **1** (P1 — pesquisa + indoor 3D) |
| Consistência visual | **5 / 5** | 0 |
| Tamanho dos botões/interações | 4 / 5 | **1** (P1 — ♡ favoritar; card Próxima Aula sem indicação) |
| Feedback do sistema | 2 / 5 | **3** (P1, P2, P3 — switches, bug B-01, bug B-02, auto-centering, hint indoor) |
| Facilidade de aprendizagem | 3 / 5 | **2** (P2, P3 — favoritar no mapa; Definições/Ajuda não óbvias; toggle modo outdoor) |
| Acessibilidade | **5 / 5** | 0 |
| Compatibilidade móvel/responsividade | **5 / 5** | 0 |
| Satisfação geral | **5 / 5** | 0 |


## 8. Conclusões dos testes com utilizadores

A avaliação com os cinco participantes da equipa registou uma **taxa de sucesso global de 96,9 %** (63 tarefas com sucesso pleno, 2 parciais, 0 falhas em 65 tentativas totais), com uma **facilidade média de 4,6 / 5** e **pontuação Likert global de 4,6 / 5**. Estes valores indicam uma experiência muito positiva globalmente, ainda que enviesada pela familiaridade dos participantes com o produto.

A **reorganização da ordem das tarefas** (importar o horário em T2, antes das tarefas que dele dependem — T3 Horário e T4 Card Próxima Aula) eliminou a fricção de dependência observada em testes anteriores, em que o card Próxima Aula surgia vazio por o horário ainda não estar sincronizado.

Os **pontos críticos** consistentes em vários participantes foram:

1. **Bug B-02 — Horário visível sem sessão activa** (detectado por P2 na T13) — após o logout, o botão "Iniciar sessão" não permitiu voltar a entrar e o **horário do utilizador continuou exposto sem nenhuma conta autenticada**. Indicia que os dados locais não são limpos no logout — problema de **privacidade**. Prioridade alta; necessita reprodução cruzada em iOS e Android.
2. **Bug B-01 — Login após logout** (2 em 5 participantes afectados, 1 de forma atenuada) — o botão "Iniciar sessão" não responde após fazer logout sem reiniciar a aplicação; afectou P1 e P2 de forma grave (P2 não conseguiu reentrar) e P3 de forma atenuada (respondeu à 2.ª tentativa). Prioridade alta.
3. **Feedback do sistema** (3 em 5 participantes) — switches de Acessibilidade (Alto Contraste, Rotas Acessíveis, Leitor de Ecrã) não fornecem confirmação visual após activação; importação de horário não distingue tipo de erro; hint do indoor 3D não menciona gestos de pan/zoom; auto-centering outdoor não comunicado ao utilizador.
4. **Tarefa T2 (Importar horário)** — tempo médio mais alto (102 s) e maior variação (±17 s), maioritariamente por dificuldade em localizar a chave/link no Inforestudante. Sugere-se onboarding com captura de ecrã do passo correcto dentro do modal de importação.
5. **Tarefa T13 (Logout + Login + auto-import)** — taxa de sucesso plena mais baixa (60 %) e maior variação de tempo (60 ± 23 s); directamente associada aos bugs B-01 e B-02.
6. **Tarefa T9 (Indoor 3D piso+tap)** — pill de seletor de piso discreto (P1) e gesto de pinch/zoom não sinalizado no hint (P3); P2 levantou ainda uma questão conceptual de orientação entre pisos ("se tivesse de subir escadas ou entrado noutro lado, ia sentir-me perdido"), sugerindo reforço do guiamento na transição vertical entre pisos.

Os **pontos fortes** confirmados foram a facilidade de navegação, legibilidade do texto, consistência visual, acessibilidade (5 níveis de texto + alto contraste), histórico de navegação, modal pesquisável de ponto de partida outdoor, tema escuro, idioma inglês, FAQ expandível e satisfação geral, todos com 5/5 participantes a classificarem como adequados ou avaliações Likert de 4–5.

A síntese cruzada destes resultados com os achados da Avaliação Heurística e das Regras de Shneiderman está documentada em `PROBLEMAS_DETECTADOS.md`. As melhorias propostas baseadas nestes resultados encontram-se em `MELHORIAS_PROPOSTAS.md`.
