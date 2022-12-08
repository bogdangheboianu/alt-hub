# Altamira Hub Backend

Internal management app for Altamira Software

## Environment setup

### Prerequisites

- [Install Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [Install Nest CLI](https://docs.nestjs.com/cli/overview)

### Setup project locally

```bash
git clone https://github.com/Altamira-Software/altamira-app.git
cd altamira-app
yarn install
```

### Database configuration

With `postgres` user run the following sql statement:

```sql
CREATE DATABASE altamira_app_db;
\c altamira_app_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### App configuration

Create `local.env` file following the configuration variables from `local.example.env`

### TypeORM configuration

Create `ormconfig.ts` file following the configuration from `ormconfig.example.ts`

## Using the application

### Run application

```bash
yarn run start:dev
```

### Create empty migration

```bash
NAME=YourMigrationName yarn run migration:create
```

### Generate migration

```bash
NAME=YourMigrationName yarn run migration:generate
```

### Apply migrations

```bash
yarn run migrations:run
```

### Generate module

To generate a module containing the `NestJS` module and the default application folder structure, run the following command from project root:

```bash
sh ./generate-module.sh <name-of-your-module>
```

### Default user credentials

- Username: `admin`
- Password: `test0000`
