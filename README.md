

## Description
Nest Starter Kit
## Installation

```bash
$ copy .env.example to .env file
 # Access the app http://localhost:3000/v1
```

## Docker

```bash
$ cp .env.example .env
$ docker-compose up --build
 # Access the app http://localhost:3000/v1
for PD ADMIN
localhost:8888
  PGADMIN_DEFAULT_EMAIL: test@gmail.com
  PGADMIN_DEFAULT_PASSWORD: password
```

```bash
$ yarn
```
## Local
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

