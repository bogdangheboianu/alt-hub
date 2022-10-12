import { isNil } from 'lodash';

export function entityFactory<T>(entityType: new (...args: any[]) => T, data: T): T {
    if( isNil( entityType ) || isNil( data ) ) {
        throw new Error( 'Invalid arguments provided for entityFactory' );
    }

    const entity = new entityType();

    Object.keys( data )
          .map( (key: string) => {
              // @ts-ignore
              entity[key] = data[key];
          } );

    return entity;
}
