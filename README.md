# Atena

[![e2e-test](https://github.com/LucasRodriguesOliveira/atena/actions/workflows/e2e-test.yaml/badge.svg)](https://github.com/LucasRodriguesOliveira/atena/actions/workflows/e2e-test.yaml)
[![unit-test](https://github.com/LucasRodriguesOliveira/atena/actions/workflows/unit-test.yaml/badge.svg)](https://github.com/LucasRodriguesOliveira/atena/actions/workflows/unit-test.yaml)
[![Coverage Status](https://coveralls.io/repos/github/LucasRodriguesOliveira/atena/badge.svg)](https://coveralls.io/github/LucasRodriguesOliveira/atena)

## Description
Api com objetivo de fornecer conteúdo administrativo para gerenciar 
dados de contrato do site Zeus (Hermes/Hercules/Hera)

## Libs, API's, Frameworks, etc...
Javascript, Typescript, Node.js, Nest.js, Docker, Eslint, Prettier, Dotenv, DBdiagram.io, Typeorm,
Swagger, Jest, JWT, Passport.js, Bcrypt

## Installation

### Docker
Já existe uma configuração para implementar utilizando docker, basta executar o seguinte comando:
```bash
$ docker compose up
```
Que será configurado os containers necessários:
 - Banco de dados em PostgreSQL
 - API em Node.js utilizando Nest.js como framework

### Locally
```bash
$ npm install
```

ou

```bash
$ yarn
```

Apesar de ser devidamente instalado as dependências dos pacotes da API e o banco, ainda é necessário
executar as migrations, para tal, será necessário utilizar um pacote chamado `typeorm` que pode
ser instalado na máquina ou acessado por `npx`:
```bash
# yarn global add typeorm
$ npm i -g typeorm
# necessário estar no diretório raiz do projeto
$ npm typeorm migration:run -d ./db/postgres
```
ou
```bash
$ npx typeorm migration:run -d ./db/postgres
```

## Running the app

```bash
# development
$ npm run start
# $ yarn start

# watch mode
$ npm run start:dev
# $ yarn start:dev

# production mode
$ npm run start:prod
# yarn start:prod
```

## Test

```bash
# unit tests
$ npm run test
# yarn test

# e2e tests
$ npm run test:e2e
# yarn test:e2e

# test coverage
$ npm run test:cov
# yarn test:cov
```

## License

Atena is [MIT licensed](LICENSE).
