import { IContext } from '@shared/interfaces/generics/context.interface';

export interface IDomainQuery<Params> {
    readonly data: {
        context: IContext;
        params?: Params;
    };
    readonly name: string;
}
