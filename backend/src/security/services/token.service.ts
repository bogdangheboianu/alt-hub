import { ConfigurationService } from '@configuration/services/configuration.service';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredEvent } from '@security/events/impl/token/token-expired.event';
import { userToAccessTokenPayload } from '@security/mappers/auth.mappers';
import { AuthToken } from '@security/models/token/auth-token';
import { TokenPurpose } from '@security/models/token/token-purpose';
import { TokenRepository } from '@security/repositories/token.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { PublicContext } from '@shared/models/context/public-context';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configurationService: ConfigurationService,
        private readonly tokenRepository: TokenRepository,
        private readonly eventBus: EventBus
    ) {
    }

    async generateAuthToken(user: User, context: PublicContext): Promise<Result<AuthToken>> {
        const existingTokenResult = await this.findExistingAuthenticationToken( user );
        const existingToken = existingTokenResult.value!;

        if( valueIsNotEmpty( existingToken ) ) {
            if( existingToken.getValue()
                             .isActive() ) {
                return Success( existingToken );
            }

            this.emitTokenExpiredEvent( existingToken, context );
        }

        const authToken = await this.createAuthToken( user );

        if( authToken.isFailed ) {
            return Failed( ...authToken.errors );
        }

        const savedAuthToken = await this.saveTokenToDb( authToken.value! );

        return Success( savedAuthToken );
    }

    private async findExistingAuthenticationToken(user: User): Promise<Result<AuthToken>> {
        const tokenOrNotFound = await this.tokenRepository.findActiveTokenByPurposeAndUserId( TokenPurpose.forAuthentication(), user.id );

        if( tokenOrNotFound.isFailed ) {
            throw new Exception( tokenOrNotFound.errors );
        }

        if( tokenOrNotFound.isNotFound ) {
            return Success();
        }

        return Success( AuthToken.of( tokenOrNotFound.value! ) );
    }

    private async createAuthToken(user: User): Promise<Result<AuthToken>> {
        const secret = this.configurationService.jwtSecret;
        const payload = userToAccessTokenPayload( user );
        const signedToken = await this.jwtService.signAsync( payload, { secret } );

        return AuthToken.create( signedToken, user );
    }

    private async saveTokenToDb(authToken: AuthToken): Promise<AuthToken> {
        const savedToken = await this.tokenRepository.saveToken( authToken.getValue() );
        return AuthToken.of( savedToken );
    }

    private emitTokenExpiredEvent(token: AuthToken, context: PublicContext): void {
        const event = new TokenExpiredEvent( { context, payload: token.getValue() } );
        this.eventBus.publish( event );
    }
}
