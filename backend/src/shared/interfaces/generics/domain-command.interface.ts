import { IContext } from '@shared/interfaces/generics/context.interface';

export interface IDomainCommand<Payload> {
    readonly data: {
        context: IContext;
        payload: Payload;
    };
    readonly name: string;
}
