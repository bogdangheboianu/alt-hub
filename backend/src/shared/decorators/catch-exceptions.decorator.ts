import { InternalServerErrorException } from '@nestjs/common';
import { Result } from '@shared/models/generics/result';
import { isNil } from 'lodash';

export function catchExceptions(): MethodDecorator {
    // tslint:disable-next-line:ban-types
    // @ts-ignore
    return (target: Object, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
        if( isNil( propertyDescriptor ) ) {
            propertyDescriptor = Object.getOwnPropertyDescriptor( target, propertyName )!;
        }

        const originalMethod = propertyDescriptor.value;
        const className = target.constructor.name;

        propertyDescriptor.value = function(...args: any[]): Result<any> {
            try {
                return originalMethod.apply( this, args );
            } catch( e: any ) {
                console.log( e?.message || 'Internal server error', e, `${ className }:${ propertyName }` );
                throw new InternalServerErrorException();
            }

        };

        return propertyDescriptor;
    };
}
