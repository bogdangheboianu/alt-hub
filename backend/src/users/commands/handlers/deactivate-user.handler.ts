import { CommandBus, CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { DeactivateUserCommand } from '@users/commands/impl/deactivate-user.command';
import { FailedToDeactivateUserEvent } from '@users/events/impl/failed-to-deactivate-user.event';
import { UserDeactivatedEvent } from '@users/events/impl/user-deactivated.event';
import { UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( DeactivateUserCommand )
export class DeactivateUserHandler extends BaseSyncCommandHandler<DeactivateUserCommand, User> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly userRepository: UserRepository
    ) {
        super();
    }

    async execute(command: DeactivateUserCommand): Promise<Result<User>> {
        const userResult = await this.getUserById( command );

        if( userResult.isFailed ) {
            return this.failed( command, ...userResult.errors );
        }

        if( userResult.value!.isInactive() ) {
            return this.successful( command, userResult.value! );
        }

        const updatedUser = userResult.value!.deactivate( command );

        if( updatedUser.isFailed ) {
            return this.failed( command, ...updatedUser.errors );
        }

        const savedUser = await this.saveUserToDb( updatedUser.value! );

        return this.successful( command, savedUser );
    }

    protected failed(command: DeactivateUserCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToDeactivateUserEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: DeactivateUserCommand, user: User): Result<User> {
        const { context } = command.data;
        const event = new UserDeactivatedEvent( { context, payload: user } );

        this.eventBus.publish( event );

        return Success( user );
    }

    private async saveUserToDb(user: User): Promise<User> {
        const savedUser = await this.userRepository.save( user );

        if( savedUser.isFailed ) {
            throw new Exception( savedUser.errors );
        }

        return savedUser.value!;
    }

    private async getUserById(command: DeactivateUserCommand): Promise<Result<User>> {
        const { payload: { userId } } = command.data;
        const id = UserId.create( userId, 'userId' );

        if( id.isFailed ) {
            return Failed( ...id.errors );
        }

        const user = await this.userRepository.findById( id.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new UserNotFoundException() );
        }

        return user;
    }
}
