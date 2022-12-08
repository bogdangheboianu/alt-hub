import { CommandBus, CommandHandler, EventBus } from '@nestjs/cqrs';
import { TokenExpiredEvent } from '@security/events/impl/token/token-expired.event';
import { InvalidOrExpiredTokenException } from '@security/exceptions/token.exceptions';
import { Token } from '@security/models/token/token';
import { TokenPurpose } from '@security/models/token/token-purpose';
import { TokenValue } from '@security/models/token/token-value';
import { TokenRepository } from '@security/repositories/token.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { ActivateUserCommand } from '@users/commands/impl/activate-user.command';
import { FailedToActivateUserEvent } from '@users/events/impl/failed-to-activate-user.event';
import { UserActivatedEvent } from '@users/events/impl/user-activated.event';
import { User } from '@users/models/user';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( ActivateUserCommand )
export class ActivateUserHandler extends BaseSyncCommandHandler<ActivateUserCommand, User> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly userRepository: UserRepository,
        private readonly tokenRepository: TokenRepository
    ) {
        super();
    }

    async execute(command: ActivateUserCommand): Promise<Result<User>> {
        const accountActivationToken = await this.getAccountActivationToken( command );

        if( accountActivationToken.isFailed ) {
            return this.failed( command, ...accountActivationToken.errors );
        }

        const user = accountActivationToken.value!.user!;
        const updatedUser = user.activate( command );

        if( updatedUser.isFailed ) {
            return this.failed( command, ...updatedUser.errors );
        }

        const savedUser = await this.saveUserToDb( updatedUser.value! );

        return this.successful( command, savedUser, accountActivationToken.value! );
    }

    protected successful(command: ActivateUserCommand, user: User, token?: Token): Result<User> {
        const { context } = command.data;
        const event = new UserActivatedEvent( { context, payload: { user, accountActivationToken: token } } );

        this.eventBus.publish( event );

        return Success( user );
    }

    protected failed(command: ActivateUserCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToActivateUserEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getAccountActivationToken(command: ActivateUserCommand): Promise<Result<Token>> {
        const { token: accountActivationToken } = command.data.payload;
        const tokenValue = TokenValue.create( accountActivationToken );

        if( tokenValue.isFailed ) {
            return Failed( ...tokenValue.errors );
        }

        const token = await this.tokenRepository.findTokenByValueAndPurpose( tokenValue.value!, TokenPurpose.forAccountActivation() );

        if( token.isFailed ) {
            throw new Exception( token.errors );
        }

        if( token.isNotFound ) {
            return Failed( new InvalidOrExpiredTokenException() );
        }

        if( token.value!.isNotActive() ) {
            this.emitTokenExpiredEvent( token.value!, command.data.context );
            return Failed( new InvalidOrExpiredTokenException() );
        }

        return token;
    }

    private async saveUserToDb(user: User): Promise<User> {
        const savedUser = await this.userRepository.save( user );

        if( savedUser.isFailed ) {
            throw new Exception( savedUser.errors );
        }

        return savedUser.value!;
    }

    private emitTokenExpiredEvent(token: Token, context: AuthenticatedContext): void {
        const event = new TokenExpiredEvent( { context, payload: token } );
        this.eventBus.publish( event );
    }
}
