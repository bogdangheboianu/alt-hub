import { Injectable } from '@nestjs/common';
import { Logger, QueryRunner } from 'typeorm';

@Injectable()
export class DbLoggerService implements Logger {

  constructor(
  ) {
  }

  log( level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner ): any {
    switch ( level ) {
      case 'info':
        console.log( message );
        break;
      case 'log':
        console.log( message );
        break;
      case 'warn':
        console.log( message );
        break;
      default:
        console.log( message );
    }
  }

  logMigration( message: string, queryRunner?: QueryRunner ): any {
    console.debug( message );
  }

  logQuery( query: string, parameters?: any[], queryRunner?: QueryRunner ): any {
    // console.log(query, parameters);
    console.log( 'SQL Query', DbLoggerService.name, { data: JSON.stringify( { query, parameters } ) } );
  }

  logQueryError( error: string, query: string, parameters?: any[], queryRunner?: QueryRunner ): any {
    // console.log(error, query);
    console.log( 'SQL Query Error', undefined, DbLoggerService.name, {
      data: JSON.stringify( {
        query,
        parameters,
        error,
      } ),
    } );
  }

  logQuerySlow( time: number, query: string, parameters?: any[], queryRunner?: QueryRunner ): any {
    console.log( 'Slow Query Error', DbLoggerService.name, {
      data: JSON.stringify( {
        query,
        parameters,
        time,
      } ),
    } );
  }

  logSchemaBuild( message: string, queryRunner?: QueryRunner ): any {
    console.log( message );
  }

}
