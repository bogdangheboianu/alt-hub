import { IEventHandler } from '@nestjs/cqrs';
import { Result } from '@shared/models/generics/result';

export abstract class BaseAsyncEventHandler<Event> implements IEventHandler<Event> {
    abstract handle(event: Event): Promise<void>;
}

export abstract class BaseSyncEventHandler<Event, ReturnType> implements IEventHandler<Event> {
    abstract handle(event: Event): Promise<Result<ReturnType>> ;
}
