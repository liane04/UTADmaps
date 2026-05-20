# Fase 3 — Avaliação de Usabilidade

**Desafio 3 · Interação Pessoa-Computador · UTAD 2025/2026 · Entrega: 22 maio 2026**

Esta pasta contém toda a documentação da Fase 3: avaliação de usabilidade do **UTAD Maps**, combinando as três técnicas previstas no enunciado do desafio:

1. **Heurísticas de Nielsen** (10 heurísticas, avaliação por peritos)
2. **Regras de Ouro de Shneiderman** (8 regras)
3. **Testes com utilizadores** (user tests)

As grelhas seguem os modelos disponibilizados pelos docentes nos ficheiros `tabelaexemplo_Aheuristica.pdf` e `tabelaexemplo_userstestes.pdf`.

---

## Estrutura desta pasta

```
fase3_avaliacao_usabilidade/
├── README.md                          ← este ficheiro (enquadramento + divisão de trabalho)
│
├── AVALIACAO_USABILIDADE.md           ← texto final para a secção 3.7 do relatório
│
├── HEURISTICAS_NIELSEN.md             ← 3 grelhas de peritos + síntese
├── REGRAS_SHNEIDERMAN.md              ← análise pelas 8 regras + tabela
├── USER_TESTS.md                      ← 5 sessões com a equipa + tabelas
│
├── PROBLEMAS_DETECTADOS.md            ← síntese cruzada dos problemas das 3 técnicas
└── MELHORIAS_PROPOSTAS.md             ← recomendações priorizadas
```

---

## Divisão do trabalho pelos 5 elementos da equipa

| Elemento | Responsabilidade | Documento(s) a produzir |
|---|---|---|
| **Bruno Alves** | Coordenação geral · Texto final da secção 3.7 do relatório · Síntese cruzada das 3 técnicas | `AVALIACAO_USABILIDADE.md` + edição no Word |
| **Filipe Silva** | **Testes com Utilizadores** — organizar 5 sessões com a equipa, recolher tempos, sucessos, erros, comentários, questionário Likert | `USER_TESTS.md` |
| **Liane Duarte** | **Regras de Ouro de Shneiderman** — análise pelas 8 regras com tabela e texto justificativo | `REGRAS_SHNEIDERMAN.md` |
| **Pedro Braz** | **Análise Heurística de Nielsen** — receber as 3 grelhas dos peritos, compilar, calcular média de severidade, redigir conclusões | `HEURISTICAS_NIELSEN.md` |
| **Diogo Queiroz** | **Problemas Detectados + Melhorias Propostas** — síntese cruzada dos problemas das 3 técnicas e plano priorizado de correção | `PROBLEMAS_DETECTADOS.md` + `MELHORIAS_PROPOSTAS.md` |

---

## Peritos da avaliação heurística (externos à equipa de desenvolvimento)

Conforme indicado nas instruções da grelha do professor, *"os elementos da equipa de desenvolvimento não podem fazer a avaliação"*. Foram convidados três peritos com perfis complementares.

| # | Nome | Formação | Foco da avaliação |
|---|---|---|---|
| **P1** | Maria Costa | 3.º ano de Engenharia Informática, UTAD | Aspectos técnicos: consistência, prevenção de erros, padrões |
| **P2** | João Pereira | Mestrado em Design Multimédia, UTAD | Aspectos visuais: estética, hierarquia, feedback |
| **P3** | Ana Marques | Licenciada em Engenharia Informática (UTAD) · UI/UX designer freelancer | Aspectos cognitivos: carga mental, reconhecimento, fluxos |

Cada perito realizou a avaliação **individualmente** com a grelha das 10 heurísticas de Nielsen (escala 0–4 de severidade). Os resultados são compilados em `HEURISTICAS_NIELSEN.md`.

---

## Participantes dos User Tests

Os cinco elementos da equipa do projeto serviram simultaneamente de participantes nos testes com utilizadores. Esta opção representa uma **limitação metodológica conhecida** (potencial enviesamento por conhecimento do produto) e é assumidamente documentada no relatório. A justificação é o constrangimento temporal de execução da Fase 3 entre 20 e 22 de maio (dois dias úteis).

| # | Nome | Papel no projeto |
|---|---|---|
| **U1** | Filipe Silva | Núcleo técnico — mapas e navegação |
| **U2** | Liane Duarte | Interface e experiência do utilizador |
| **U3** | Bruno Alves | Backend e integrações |
| **U4** | Pedro Braz | Backend e arquitetura |
| **U5** | Diogo Queiroz | Frontend e modelação 3D |

Cada participante executou as **cinco tarefas-tipo** definidas em `USER_TESTS.md`.

---

## Tarefas dos User Tests

| # | Tarefa | Foco principal |
|---|---|---|
| **T1** | Encontrar e navegar para a sala **G0.08** a partir do mapa principal | Pesquisa + navegação outdoor + transição para indoor |
| **T2** | Consultar **horário de quinta-feira** e iniciar navegação para a sala da primeira aula | Integração horário + navegação contextual |
| **T3** | Adicionar a **Biblioteca aos favoritos** e usar o favorito para navegar | Favoritos + navegação a partir de favoritos |
| **T4** | Ativar **Alto Contraste e texto a 200%**, verificar usabilidade | Definições + acessibilidade visual |
| **T5** | **Importar horário** do Inforestudante via link privado | Login + integração externa + persistência |

---

## Cronograma de execução

| Data | Atividade |
|---|---|
| 20 maio | Setup, distribuição de grelhas pelos peritos, organização de user tests |
| 21 maio | Recolha das grelhas, compilação, redação dos documentos e da secção 3.7 |
| 22 maio | Revisão final, integração no Word, geração do PDF, submissão NONIO |
