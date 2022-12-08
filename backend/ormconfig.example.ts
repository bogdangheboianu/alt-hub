import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// To generate empty migration, run:  typeorm migration:create ./src/migrations/<MigrationName>

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
    migrations         : [ `${ __dirname }/src/migrations/*{.ts,.js}` ],
    migrationsTableName: 'migrations',
    namingStrategy     : new SnakeNamingStrategy()
};

export default new DataSource( options );
