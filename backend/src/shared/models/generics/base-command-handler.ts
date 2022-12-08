import { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { Result } from '@shared/models/generics/result';

export abstract class BaseAsyncCommandHandler<Command extends ICommand> implements ICommandHandler<Command> {
    abstract execute(command: Command): Promise<void>;

    protected abstract failed(command: Command, data?: any, ...errors: IException[]): void;

    protected abstract successful(command: Command, ...args: any[]): void;

}

export abstract class BaseSyncCommandHandler<Command extends ICommand, ReturnType> implements ICommandHandler<Command> {
    abstract execute(command: Command): Promise<Result<ReturnType>>;

    protected abstract failed(command: Command, data?: any, ...errors: IException[]): Result<ReturnType>;

    protected abstract successful(command: Command, ...args: any[]): Result<any>;
}
