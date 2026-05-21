# Testes com Utilizadores (User Tests)

**Responsável**: Filipe Silva
**Datas**: 20 e 21 de maio de 2026
**Aplicação avaliada**: UTAD Maps (build mobile via Expo Go em iPhone e Android)

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

Avaliar a **eficácia**, **eficiência** e **satisfação** dos utilizadores ao realizarem cinco tarefas representativas no UTAD Maps, identificar pontos de fricção e fundamentar propostas de melhoria.

### 1.2 Participantes

Os cinco elementos da equipa de desenvolvimento. **Limitação metodológica conhecida**: os participantes têm conhecimento prévio do produto, o que tende a **subestimar** o tempo de execução e **sobrestimar** o sucesso comparado com utilizadores externos novos. A justificação para esta amostra é o constrangimento temporal de execução da Fase 3 (20 a 22 de maio). Ainda assim, é possível extrair valor relativo (comparações entre tarefas) e identificar problemas que mesmo conhecedores enfrentam.

### 1.3 Tarefas

| # | Tarefa | Critério de sucesso |
|---|---|---|
| **T1** | Encontrar e navegar para a sala G0.08 a partir do mapa principal | Chegar ao ecrã indoor da sala G0.08 com a rota traçada |
| **T2** | Consultar o horário de quinta-feira e iniciar navegação para a sala da primeira aula | Iniciar navegação outdoor para a sala correcta |
| **T3** | Adicionar a Biblioteca aos favoritos e usar o favorito para navegar | Ver Biblioteca em Favoritos e iniciar navegação a partir daí |
| **T4** | Ativar Alto Contraste e texto a 200%, verificar usabilidade no Mapa e no Horário | Confirmar que os dois ecrãs estão funcionais e legíveis |
| **T5** | Importar horário do Inforestudante via link privado | Ver horário semanal preenchido com aulas reais |

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
| 1 | Sala G0.08 | Chegar ao indoor da sala | **Sim** | 28 | 0 | 5 | "Estava à espera do indoor 3D e veio o 2D — não sabia que algumas salas iam para 2D" | Confusão momentânea entre planta 2D e modelo 3D |
| 2 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 42 | 1 | 4 | "Tive de tocar na aula para perceber que dava para navegar" | Affordance do cartão de aula é subtil |
| 3 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 55 | 0 | 4 | "Demorei a achar o coração — está pequeno" | Sugere ícone maior ou texto |
| 4 | Alto contraste + texto 200% | Verificar usabilidade | **Parcial** | 71 | 2 | 3 | "A TabBar não está perfeita ainda a 200%, e fiquei sem saber se tinha aplicado" | Não houve toast de confirmação |
| 5 | Importar horário | Ver horário preenchido | **Sim** | 95 | 1 | 4 | "Tive de procurar onde colar o link no Inforestudante" | Onboarding do importar pode ser melhor |

### 2.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | Tab-bar bem distribuída |
| Legibilidade do texto | ☑ | ☐ | Fonte confortável no nível normal |
| Tempo de carregamento | ☐ | ☑ | Pesquisa demorou alguns segundos por vezes |
| Consistência visual | ☑ | ☐ | Boa coerência geral |
| Tamanho dos botões/interações | ☐ | ☑ | Coração dos favoritos é pequeno |
| Feedback do sistema | ☐ | ☑ | Falta feedback no toggle de alto contraste |
| Facilidade de aprendizagem | ☑ | ☐ | Onboarding curto mas claro |
| Acessibilidade | ☑ | ☐ | Excelente, com 5 níveis de texto |
| Compatibilidade móvel/responsividade | ☑ | ☐ | TabBar a 200% melhorada após bug B-05 |
| Satisfação geral | ☑ | ☐ | Boa experiência global |

### 2.4 Questionário pós-teste (escala 1–5)

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| O sistema foi fácil de utilizar | ☐ | ☐ | ☐ | ☑ | ☐ |
| A navegação foi intuitiva | ☐ | ☐ | ☐ | ☑ | ☐ |
| As funcionalidades estavam bem organizadas | ☐ | ☐ | ☐ | ☐ | ☑ |
| Senti-me confortável a utilizar o sistema | ☐ | ☐ | ☐ | ☑ | ☐ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **4,4 / 5**

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
| 3 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 47 | 0 | 4 | "Boa, mas o coração na pesquisa devia ter mais área de toque" | Comentário relevante para acessibilidade (gap G-04 da Fase 2) |
| 4 | Alto contraste + texto 200% | Verificar usabilidade | **Sim** | 62 | 1 | 4 | "Funcionou bem mas o botão "Iniciar sessão" no perfil não respondeu a primeira vez" | Bug B-01 detectado pelo participante |
| 5 | Importar horário | Ver horário preenchido | **Parcial** | 130 | 2 | 3 | "Tive de tentar duas vezes porque colei só a chave em vez do link completo" | Mensagem de erro pouco específica |

### 3.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | — |
| Legibilidade do texto | ☑ | ☐ | — |
| Tempo de carregamento | ☑ | ☐ | OK em Android |
| Consistência visual | ☑ | ☐ | — |
| Tamanho dos botões/interações | ☐ | ☑ | Coração dos favoritos pequeno demais |
| Feedback do sistema | ☐ | ☑ | Importação podia mostrar mais detalhe |
| Facilidade de aprendizagem | ☑ | ☐ | — |
| Acessibilidade | ☑ | ☐ | 5 níveis de texto excelente |
| Compatibilidade móvel/responsividade | ☑ | ☐ | — |
| Satisfação geral | ☑ | ☐ | — |

### 3.4 Questionário pós-teste

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| O sistema foi fácil de utilizar | ☐ | ☐ | ☐ | ☐ | ☑ |
| A navegação foi intuitiva | ☐ | ☐ | ☐ | ☐ | ☑ |
| As funcionalidades estavam bem organizadas | ☐ | ☐ | ☐ | ☑ | ☐ |
| Senti-me confortável a utilizar o sistema | ☐ | ☐ | ☐ | ☑ | ☐ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **4,6 / 5**

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
| 1 | Sala G0.08 | Chegar ao indoor da sala | **Sim** | 35 | 1 | 4 | "Estava à espera de carregar no mapa primeiro" | Confusão entre carregar no edifício vs pesquisar |
| 2 | Horário 5.ª feira | Iniciar nav. da 1.ª aula | **Sim** | 45 | 0 | 4 | "OK" | Fluxo OK |
| 3 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 60 | 1 | 4 | "Achei que tinha de pesquisar primeiro a Biblioteca antes de favoritar" | Erro mental — afinal podia fazer dos resultados |
| 4 | Alto contraste + texto 200% | Verificar usabilidade | **Sim** | 80 | 2 | 3 | "O texto a 200% deixa as definições com scroll vertical, e perdi-me um pouco" | Necessidade de scroll, esperado |
| 5 | Importar horário | Ver horário preenchido | **Sim** | 110 | 1 | 4 | "Funcionou bem, só tive dificuldade em encontrar a chave no Inforestudante" | Sugere link directo |

### 4.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Facilidade de navegação | ☑ | ☐ | — |
| Legibilidade do texto | ☑ | ☐ | — |
| Tempo de carregamento | ☑ | ☐ | — |
| Consistência visual | ☑ | ☐ | — |
| Tamanho dos botões/interações | ☑ | ☐ | OK em Android (área natural maior) |
| Feedback do sistema | ☐ | ☑ | Falta confirmação visual em algumas acções |
| Facilidade de aprendizagem | ☐ | ☑ | Pesquisa em vez de tocar no mapa não é óbvia |
| Acessibilidade | ☑ | ☐ | — |
| Compatibilidade móvel/responsividade | ☑ | ☐ | — |
| Satisfação geral | ☑ | ☐ | — |

### 4.4 Questionário pós-teste

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| O sistema foi fácil de utilizar | ☐ | ☐ | ☐ | ☑ | ☐ |
| A navegação foi intuitiva | ☐ | ☐ | ☐ | ☑ | ☐ |
| As funcionalidades estavam bem organizadas | ☐ | ☐ | ☐ | ☐ | ☑ |
| Senti-me confortável a utilizar o sistema | ☐ | ☐ | ☐ | ☑ | ☐ |
| Voltaria a utilizar esta aplicação | ☐ | ☐ | ☐ | ☐ | ☑ |

**Pontuação Likert média**: **4,4 / 5**

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
| 3 | Favoritos da Biblioteca | Nav. a partir de favoritos | **Sim** | 50 | 0 | 5 | "Gostei do swipe para remover" | Confundiu-se ao swipar — afinal o swipe é só para mostrar acção |
| 4 | Alto contraste + texto 200% | Verificar usabilidade | **Sim** | 65 | 0 | 5 | "Excelente, fica muito preto e branco" | Sem dificuldades |
| 5 | Importar horário | Ver horário preenchido | **Sim** | 90 | 0 | 5 | "Funcionou à primeira" | — |

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
| A navegação foi intuitiva | ☐ | ☐ | ☐ | ☐ | ☑ |
| As funcionalidades estavam bem organizadas | ☐ | ☐ | ☐ | ☐ | ☑ |
| Senti-me confortável a utilizar o sistema | ☐ | ☐ | ☐ | ☐ | ☑ |
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
| 4 | Alto contraste + texto 200% | Verificar usabilidade | **Sim** | 55 | 0 | 5 | "Excelente após o fix do B-05" | — |
| 5 | Importar horário | Ver horário preenchido | **Sim** | 85 | 0 | 5 | "OK" | — |

### 6.3 Checklist de usabilidade

| Aspecto avaliado | ☑ Adequado | ☐ Necessita Melhorias | Observações |
|---|:---:|:---:|---|
| Todos os aspectos | ☑ | ☐ | Avaliação muito positiva mas potencialmente enviesada por familiaridade |

### 6.4 Questionário pós-teste

| Questão | 1 | 2 | 3 | 4 | 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| Todas as 5 questões | ☐ | ☐ | ☐ | ☐ | ☑ |

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
| **Total** | 4S 1P | 4S 1P | 5S | 5S | 5S | **92 %** |

### 7.2 Tempos médios por tarefa

| Tarefa | Tempo médio (s) | Min | Max | Desvio |
|---|---:|---:|---:|---:|
| T1 G0.08 | **28** | 22 | 35 | ±5 |
| T2 Horário | **40** | 35 | 45 | ±4 |
| T3 Favoritos | **51** | 45 | 60 | ±6 |
| T4 Acessibilidade | **67** | 55 | 80 | ±9 |
| T5 Importar | **102** | 85 | 130 | ±17 |
| **Média global** | **58** | — | — | — |

### 7.3 Facilidade média por tarefa

| Tarefa | Facilidade média (1–5) |
|---|:---:|
| T1 G0.08 | **4,8** |
| T2 Horário | **4,6** |
| T3 Favoritos | **4,4** |
| T4 Acessibilidade | **4,0** |
| T5 Importar | **4,2** |
| **Média global** | **4,4 / 5** |

### 7.4 Erros médios por tarefa

| Tarefa | Erros médios | Tipo de erro mais comum |
|---|---:|---|
| T1 | **0,2** | Confusão entre 2D e 3D |
| T2 | **0,2** | Affordance do cartão de aula |
| T3 | **0,2** | Tamanho do botão de favoritar |
| T4 | **1,0** | Falta feedback de confirmação |
| T5 | **0,8** | Mensagem de erro pouco específica + dificuldade em encontrar chave no Inforestudante |

### 7.5 Questionário Likert — médias globais

| Questão | Média (1–5) | Interpretação |
|---|:---:|---|
| O sistema foi fácil de utilizar | **4,6** | Muito positivo |
| A navegação foi intuitiva | **4,6** | Muito positivo |
| As funcionalidades estavam bem organizadas | **4,8** | Excelente |
| Senti-me confortável a utilizar o sistema | **4,4** | Muito positivo |
| Voltaria a utilizar esta aplicação | **5,0** | Excelente |
| **Média global (System Usability)** | **4,68 / 5** | **Excelente** |

### 7.6 Checklist agregada

| Aspecto avaliado | Adequado | Necessita melhorias |
|---|:---:|:---:|
| Facilidade de navegação | **5 / 5** | 0 |
| Legibilidade do texto | **5 / 5** | 0 |
| Tempo de carregamento | 4 / 5 | **1** (Liane) |
| Consistência visual | **5 / 5** | 0 |
| Tamanho dos botões/interações | 3 / 5 | **2** (Liane, Bruno — favoritar pequeno) |
| Feedback do sistema | 2 / 5 | **3** (Liane, Pedro, Bruno) |
| Facilidade de aprendizagem | 4 / 5 | **1** (Pedro) |
| Acessibilidade | **5 / 5** | 0 |
| Compatibilidade móvel/responsividade | **5 / 5** | 0 |
| Satisfação geral | **5 / 5** | 0 |

---

## 8. Conclusões dos testes com utilizadores

A avaliação com os cinco participantes da equipa registou uma **taxa de sucesso global de 92 %** (23 tarefas concluídas com sucesso, 2 parciais), com uma **facilidade média de 4,4/5** e **pontuação Likert global de 4,68/5**. Estes valores indicam uma experiência muito positiva globalmente, ainda que enviesada pela familiaridade dos participantes com o produto.

Os **pontos críticos** consistentes em vários participantes foram:

1. **Feedback do sistema** (3 em 5 participantes apontam como melhorável) — em particular no toggle de Alto Contraste e na importação de horário, onde a aplicação deveria oferecer confirmação visual mais clara da acção concluída
2. **Tamanho dos botões/interações** (2 em 5) — especificamente o ícone de favoritar (♡) na pesquisa, que tem hitbox pequena
3. **Tarefa T5 (Importar horário)** — tempo médio mais elevado (102 s) e maior número de erros (0,8/sessão), maioritariamente por dificuldade em encontrar a chave no portal Inforestudante e por mensagem de erro pouco específica quando o utilizador cola apenas a chave em vez do link completo
4. **Bug B-01 confirmado** — o Bruno Alves detectou novamente que o botão "Iniciar sessão" no perfil não responde após um logout prévio

Os pontos fortes confirmados foram a **facilidade de navegação**, **legibilidade do texto**, **consistência visual**, **acessibilidade** (que beneficia das correcções da Fase 2) e **satisfação geral**, todos com 5/5 participantes a classificarem como adequados.

A síntese cruzada destes resultados com os achados da Avaliação Heurística e das Regras de Shneiderman está documentada em `PROBLEMAS_DETECTADOS.md`.
