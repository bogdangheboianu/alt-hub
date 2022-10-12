export function uiEvent(name: string): MethodDecorator {
    // TODO: log event to redux dev tools
    return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
        return descriptor;
    };
}
