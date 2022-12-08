import { ApiBody } from '@nestjs/swagger';

export const ApiFile = (fileName: string = 'file'): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        return ApiBody( {
                            schema: {
                                type      : 'object',
                                properties: {
                                    [fileName]: {
                                        type  : 'string',
                                        format: 'binary'
                                    }
                                }
                            }
                        } )( target, propertyKey, descriptor );
    };
};
