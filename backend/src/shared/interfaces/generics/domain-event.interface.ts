import { IContext } from '@shared/interfaces/generics/context.interface';
import { IException } from '@shared/interfaces/generics/exception.interface';

export interface IDomainEventData<Payload> {
    context: IContext;
    payload?: Payload;
    errors?: IException[];
}

export interface IContextJsonData {
    correlationId: string;
    userId: string | null;
}

export interface IDomainEventJsonData {
    context: IContextJsonData;
    payload: any;
    name: string;
    errors: any;
}

export interface IDomainEvent<T> {
    readonly data: IDomainEventData<T>;
    readonly name: string;

    toJson(): IDomainEventJsonData;
}
