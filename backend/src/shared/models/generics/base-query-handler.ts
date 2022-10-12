import { IQueryHandler } from '@nestjs/cqrs';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { Result } from '@shared/models/generics/result';

export abstract class BaseQueryHandler<Query, ReturnType> implements IQueryHandler<Query> {
    abstract execute(query: Query): Promise<Result<ReturnType>>;

    protected abstract failed(query: Query, ...errors: IException[]): Result<any>;

    protected abstract successful(query: Query, ...args: any[]): Result<ReturnType>;
}
