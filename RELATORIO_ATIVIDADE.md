# Relatório da atividade

## Objetivo

Implementar testes unitários para validações, identificação de erros PostgreSQL, serviços e repositórios do servidor, usando Jest, TypeScript e dublês para evitar dependência de banco de dados, Docker ou servidor HTTP.

## O que foi feito

- Criados os nove arquivos de teste pedidos em `server/test/`.
- Cobertos casos válidos e inválidos das funções de validação, com conferência de `statusCode: 400`.
- Testados os reconhecedores de violações de unicidade (`23505`) e chave estrangeira (`23503`).
- Testados os serviços de cursos, alunos e matrículas com repositórios simulados, verificando retornos, argumentos, erros `400`, `404` e `409`, campos extras e propagação de falhas inesperadas.
- Demonstrados mock, stub e spy no serviço de cursos.
- Testados os repositórios com `query` simulado, conferindo SQL, parâmetros, aliases, resultados vazios e propagação de erros.
- Mantido o escopo apenas em testes; o código de produção não foi alterado.

## Verificação

As verificações foram executadas após instalar as dependências na pasta `server`:

- `npm test`: 9 suítes aprovadas, 106 testes aprovados.
- `npm run test:typecheck`: aprovado.
- `npm run build`: aprovado.

## Como executar

Os comandos precisam ser executados dentro de `server`, pois é lá que ficam `package.json` e `package-lock.json`. No PowerShell:

```powershell
cd C:\Users\Cobra\Downloads\atividade1\server
npm ci
npm test
npm run test:typecheck
npm run build
```

Os testes foram escritos para usar mocks em memória e não necessitam de PostgreSQL ou Docker.
