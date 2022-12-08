import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { ReactivateUserCommand } from '@users/commands/impl/reactivate-user.command';
import { FailedToActivateUserEvent } from '@users/events/impl/failed-to-activate-user.event';
import { UserReactivatedEvent } from '@users/events/impl/user-reactivated.event';
import { UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( ReactivateUserCommand )
export class ReactivateUserHandler extends BaseSyncCommandHandler<ReactivateUserCommand, User> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly userRepository: UserRepository
    ) {
        super();
    }

    async execute(command: ReactivateUserCommand): Promise<Result<User>> {
        const userResult = await this.getInactiveUserById( command );

        if( userResult.isFailed ) {
            return this.failed( command, ...userResult.errors );
        }

        const user = userResult.value!;

        if( user.isActive() ) {
            return this.successful( command, user );
        }

        const updatedUser = this.updateUser( command, user );

        if( updatedUser.isFailed ) {
            return this.failed( command, ...updatedUser.errors );
        }

        const savedUser = await this.saveUserToDb( updatedUser.value! );

        return this.successful( command, savedUser );
    }

    protected successful(command: ReactivateUserCommand, user: User): Result<User> {
        const { context } = command.data;
        const event = new UserReactivatedEvent( { context, payload: user } );

        this.eventBus.publish( event );

        return Success( user );
    }

    protected failed(command: ReactivateUserCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToActivateUserEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getInactiveUserById(command: ReactivateUserCommand): Promise<Result<User>> {
        const { userId: id } = command.data.payload;
        const userId = UserId.create( id );

        if( userId.isFailed ) {
            return Failed( ...userId.errors );
        }

        const user = await this.userRepository.findInactiveById( userId.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new UserNotFoundException() );
        }

        return user;
    }

    private updateUser(command: ReactivateUserCommand, user: User): Result<User> {
        return user.reactivate( command );
    }

    private async saveUserToDb(user: User): Promise<User> {
        const savedUser = await this.userRepository.save( user );

        if( savedUser.isFailed ) {
            throw new Exception( savedUser.errors );
        }

        return savedUser.value!;
    }
}
