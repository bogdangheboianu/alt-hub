import { logAction } from '@datorama/akita';

export function storeEvent(name: string): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
        logAction( name );
        return descriptor;
    };
}

export function uiEvent(name: string): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
        logAction( name );
        return descriptor;
    };
}
