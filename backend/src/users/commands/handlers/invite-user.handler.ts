import { SendInviteEmailCommand } from '@email/commands/impl/send-invite-email.command';
import { CommandBus, CommandHandler, EventBus } from '@nestjs/cqrs';
import { GenerateTokenCommand } from '@security/commands/impl/token/generate-token.command';
import { TokenPurposeEnum } from '@security/enums/token/token-purpose.enum';
import { TokenValueGenerator } from '@security/generators/token-value.generator';
import { Token } from '@security/models/token/token';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { InviteUserCommand } from '@users/commands/impl/invite-user.command';
import { FailedToInviteUserEvent } from '@users/events/impl/failed-to-invite-user.event';
import { UserInvitedEvent } from '@users/events/impl/user-invited.event';
import { UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( InviteUserCommand )
export class InviteUserHandler extends BaseSyncCommandHandler<InviteUserCommand, User> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly userRepository: UserRepository
    ) {
        super();
    }

    async execute(command: InviteUserCommand): Promise<Result<User>> {
        const userResult = await this.getUserById( command );

        if( userResult.isFailed ) {
            return this.failed( command, ...userResult.errors );
        }

        const user = userResult.value!;

        if( user.isInvited() ) {
            return this.successful( command, user );
        }

        const updatedUser = await user.invite( command );

        if( updatedUser.isFailed ) {
            return this.failed( command, ...updatedUser.errors );
        }

        const accountConfirmationToken = await this.generateAccountConfirmationToken( command, user );

        if( accountConfirmationToken.isFailed ) {
            return this.failed( command, ...accountConfirmationToken.errors );
        }

        const inviteEmailResult = await this.sendInviteEmail( command, user, accountConfirmationToken.value! );

        if( inviteEmailResult.isFailed ) {
            return this.failed( command, ...inviteEmailResult.errors );
        }

        const savedUser = await this.saveUserToDb( updatedUser.value! );

        return this.successful( command, savedUser );
    }

    protected successful(command: InviteUserCommand, user: User): Result<User> {
        const { context } = command.data;
        const event = new UserInvitedEvent( { context, payload: user } );

        this.eventBus.publish( event );

        return Success( user );
    }

    protected failed(command: InviteUserCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToInviteUserEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getUserById(command: InviteUserCommand): Promise<Result<User>> {
        const { userId: id } = command.data.payload;
        const userId = UserId.create( id );

        if( userId.isFailed ) {
            return Failed( ...userId.errors );
        }

        const user = await this.userRepository.findById( userId.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new UserNotFoundException() );
        }

        return user;
    }

    private async generateAccountConfirmationToken(command: InviteUserCommand, forUser: User): Promise<Result<Token>> {
        const generateTokenCommand = new GenerateTokenCommand( {
                                                                   context: command.data.context,
                                                                   payload: {
                                                                       value  : TokenValueGenerator.generateAccountConfirmationTokenValue()
                                                                                                   .getValue(),
                                                                       purpose: TokenPurposeEnum.AccountActivation,
                                                                       user   : forUser
                                                                   }
                                                               } );
        return await this.commandBus.execute( generateTokenCommand );
    }

    private async sendInviteEmail(command: InviteUserCommand, userRecipient: User, accountConfirmationToken: Token): Promise<Result<void>> {
        const sendInviteEmailCommand = new SendInviteEmailCommand( {
                                                                       context: command.data.context,
                                                                       payload: {
                                                                           userRecipient,
                                                                           accountActivationToken: accountConfirmationToken
                                                                       }
                                                                   } );
        return await this.commandBus.execute( sendInviteEmailCommand );
    }

    private async saveUserToDb(user: User): Promise<User> {
        const savedUser = await this.userRepository.save( user );

        if( savedUser.isFailed ) {
            throw new Exception( savedUser.errors );
        }

        return savedUser.value!;
    }
}
