# Testes Unitários: Mocks, Stubs e Spies

Atividade prática de testes unitários em uma API REST desenvolvida com **Node.js**, **TypeScript**, **Express** e **PostgreSQL**. O foco desta entrega está nos testes do servidor, sem depender de banco de dados ou de chamadas HTTP reais.

> Os testes usam repositórios simulados nos serviços e uma função `query` simulada nos repositórios.

## Sobre o projeto

A API de exemplo trabalha com três recursos: **alunos**, **disciplinas** e **matrículas**. A implementação separa as responsabilidades em rotas, serviços e repositórios. Nesta atividade, foram criados testes para validar entradas, regras de negócio e consultas SQL.

## O que foi testado

- Validações de identificadores, nomes e corpos de requisição.
- Reconhecimento de erros de unicidade (`23505`) e chave estrangeira (`23503`).
- Serviços de alunos, disciplinas e matrículas, incluindo erros `400`, `404` e `409`.
- Repositórios, conferindo SQL, parâmetros, ordenação, aliases e resultados vazios.
- Propagação de falhas inesperadas.
- Uso de mocks, stubs e spy.

## Tecnologias

- Node.js
- TypeScript
- Jest e ts-jest
- Express
- PostgreSQL (`pg`)

## Requisitos

- Node.js 24 ou superior
- npm

Não é necessário iniciar PostgreSQL ou Docker para executar os testes unitários.

## Como executar os testes

No PowerShell, a partir da pasta do projeto:

```powershell
cd server
npm ci
npm test
npm run test:typecheck
npm run build
```

Para visualizar os testes individualmente:

```powershell
npm run test:verbose
```

Para gerar o relatório de cobertura:

```powershell
npm run test:coverage
```

## Resultado da execução

| Verificação | Resultado |
| --- | --- |
| Suítes de teste | 9 aprovadas |
| Testes | 106 aprovados |
| Typecheck dos testes | Aprovado |
| Build TypeScript | Aprovado |

## Estrutura relacionada à atividade

```text
server/
├── src/
│   ├── database/
│   └── modules/
│       ├── courses/
│       ├── enrollments/
│       └── students/
└── test/
    ├── database/
    ├── modules/
    │   ├── courses/
    │   ├── enrollments/
    │   └── students/
    └── validation.test.ts
```

## Relatório

O resumo da implementação está em [`RELATORIO_ATIVIDADE.md`](RELATORIO_ATIVIDADE.md).
