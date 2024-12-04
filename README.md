

## Description
Nest Starter Kit
## Installation

loom video : https://www.loom.com/share/2095288c62ff47bfa4e03bff8764f758?sid=c10470b8-ea4b-48d0-8d9d-3b1d941f1b01
```bash
$ copy .env.example to .env file
 # Access the app http://localhost:3000/v1
```

## LOCAL SETUP (Docker)

  1. First, add a `.env` file manually in the root folder.

  2. Then run the command:
  ```bash
    docker-compose up -d --build
  ```
  3. Open [http://apiadmin2.localhost/v1] with your browser to see the result.

  4. For a visual guide on the setup process, watch this Loom video:
   ```https://www.loom.com/share/989df5f45efd4c1c9e5266c1c301411f?sid=ef9ee336-99fd-42e8-b772-1e5e91f95f72

  5. You can start editing the page by modifying `src/app.service.ts`. The page auto-updates as you edit the file.


  for PD ADMIN
  access url: localhost:8888
  PGADMIN_DEFAULT_EMAIL: admin@gmail.com
  PGADMIN_DEFAULT_PASSWORD: admin@123

 Details need to added in new server in pg admin portal 

  Name: 1851
  connection:
    host: db
    username: postgres
    password: password


  check loom video for how to access the PG admin  https://www.loom.com/share/565a0d98934e4269af53c7cd5a67b49e?sid=6a64f9a7-ef4e-4574-8a1c-48e9cb3b4ebb

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

