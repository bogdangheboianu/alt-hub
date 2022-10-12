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

Create `local.env` file with the following configuration

```bash
#Application
APP_NAME=altamira_app
NODE_ENV=local

#Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=<your_postgres_user>
DB_PASSWORD=<your_postgres_password>
DB_NAME=altamira_app_db
DB_SCHEMA=public
DB_SYNC=true

#Migrations
MIGRATIONS_TABLE=migrations

#Authentication
JWT_SECRET=<dev_secret_key>
```

### TypeORM configuration

Create `ormconfig.ts` file with the following configuration

```typescript
const options: DataSourceOptions = {
    type               : 'postgres',
    host               : 'localhost',
    port               : 5432,
    username           : '<db_username>',
    password           : '<db_password>',
    database           : 'altamira_app_db',
    schema             : 'public',
    logging            : false,
    logger             : 'advanced-console',
    synchronize        : true,
    dropSchema         : false,
    extra              : {
        trustServerCertificate: true
    },
    entities           : [ `${ __dirname }/**/*.entity{.ts,.js}` ],
    migrations         : [ `${ __dirname }/migrations/*{.ts,.js}` ],
    migrationsTableName: 'migrations',
    namingStrategy     : new SnakeNamingStrategy()
};

export default new DataSource( options );
```

### Run application

```bash
export NODE_ENV=local && nest start --watch
```

### Run migrations

```bash
nest build && node -r tsconfig-paths/register -r ts-node/register node_modules/typeorm/cli.js -d ormconfig.ts migration:run
```

### Login with default credentials

- Username: `admin`
- Password: `test0000`
