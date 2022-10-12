import { Failed } from '@shared/functions/result-builder.functions';
import { Result } from '@shared/models/generics/result';
import { isNil } from 'lodash';

export function catchAsyncExceptions(): MethodDecorator {
    // @ts-ignore
    return (target: Object, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
        if( isNil( propertyDescriptor ) ) {
            propertyDescriptor = Object.getOwnPropertyDescriptor( target, propertyName )!;
        }

        const originalMethod = propertyDescriptor.value;
        const className = target.constructor.name;

        propertyDescriptor.value = async function(...args: any[]): Promise<Result<any>> {
            try {
                return await originalMethod.apply( this, args );
            } catch( e: any ) {
                console.log( e?.message || 'Internal server error', e, `${ className }:${ propertyName }` );
                console.log( 'should return', Failed( { name: 'internal_server_error', message: e?.message ?? 'Internal server error', field: null } ) );
                return Failed( { name: 'internal_server_error', message: e?.message ?? 'Internal server error', field: null } );
            }

        };

        return propertyDescriptor;
    };
}
