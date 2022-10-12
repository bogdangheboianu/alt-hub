import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { LoginWithCredentialsCommand } from '@security/commands/impl/auth/login-with-credentials.command';
import { LoginResponseDto } from '@security/dtos/login-response.dto';
import { FailedToLoginWithCredentialsEvent } from '@security/events/impl/auth/failed-to-login-with-credentials.event';
import { LoggedInWithCredentialsEvent } from '@security/events/impl/auth/logged-in-with-credentials.event';
import { InvalidLoginCredentialsException } from '@security/exceptions/auth.exceptions';
import { AuthToken } from '@security/models/token/auth-token';
import { TokenService } from '@security/services/token.service';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { modelToUserDto } from '@users/mappers/user.mappers';
import { User } from '@users/models/user';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( LoginWithCredentialsCommand )
export class LoginWithCredentialsHandler extends BaseSyncCommandHandler<LoginWithCredentialsCommand, LoginResponseDto> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly authTokenServiceProvider: TokenService,
        private readonly userRepository: UserRepository
    ) {
        super();
    }

    async execute(command: LoginWithCredentialsCommand): Promise<Result<any>> {
        const userResult = await this.getUserByEmailOrUsername( command );

        if( userResult.isFailed ) {
            return this.failed( command, ...userResult.errors );
        }

        const user = userResult.value!;
        const loggedInUser = this.loginUser( command, user );

        if( loggedInUser.isFailed ) {
            return this.failed( command, ...loggedInUser.errors );
        }

        const authToken = await this.generateAuthenticationToken( command, user );

        if( authToken.isFailed ) {
            return this.failed( command, ...authToken.errors );
        }

        const savedUser = await this.saveUserToDb( loggedInUser.value! );
        const loginResponse = this.buildLoginResponse( authToken.value!, user );

        return this.successful( command, loginResponse, savedUser );
    }

    protected successful(command: LoginWithCredentialsCommand, loginResponse: LoginResponseDto, user: User): Result<LoginResponseDto> {
        const { context } = command.data;
        const event = new LoggedInWithCredentialsEvent( { context, payload: { loginResponse, user } } );

        this.eventBus.publish( event );

        return Success( loginResponse );
    }

    protected failed(command: LoginWithCredentialsCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToLoginWithCredentialsEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getUserByEmailOrUsername(command: LoginWithCredentialsCommand): Promise<Result<User>> {
        const { emailOrUsername } = command.data.payload;
        const userOrNotFound = await this.userRepository.findActiveByEmailAddressOrUsername( emailOrUsername );

        if( userOrNotFound.isFailed ) {
            throw new Exception( userOrNotFound.errors );
        }

        if( userOrNotFound.isNotFound ) {
            return Failed( new InvalidLoginCredentialsException() );
        }

        return userOrNotFound;
    }

    private loginUser(command: LoginWithCredentialsCommand, user: User): Result<User> {
        return user.login( command );
    }

    private async generateAuthenticationToken(command: LoginWithCredentialsCommand, user: User): Promise<Result<AuthToken>> {
        return await this.authTokenServiceProvider.generateAuthToken( user, command.data.context );
    }

    private async saveUserToDb(user: User): Promise<User> {
        const savedUser = await this.userRepository.save( user );

        if( savedUser.isFailed ) {
            throw new Exception( savedUser.errors );
        }

        return savedUser.value!;
    }

    private buildLoginResponse(authToken: AuthToken, user: User): LoginResponseDto {
        return {
            accessToken: authToken.getValue()
                                  .value
                                  .getValue(),
            user       : modelToUserDto( user )
        };
    }
}
