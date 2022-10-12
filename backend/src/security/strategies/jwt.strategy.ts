import { ConfigurationService } from '@configuration/services/configuration.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { CUSTOM_JWT_STRATEGY } from '@security/constants/auth.constants';
import { IAccessTokenPayload } from '@security/interfaces/access-token-payload.interface';
import { Token } from '@security/models/token/token';
import { TokenPurpose } from '@security/models/token/token-purpose';
import { TokenRepository } from '@security/repositories/token.repository';
import { Failed } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy, CUSTOM_JWT_STRATEGY ) {
    constructor(
        private readonly configurationService: ConfigurationService,
        private readonly tokenRepository: TokenRepository
    ) {
        super( {
                   jwtFromRequest  : ExtractJwt.fromAuthHeaderAsBearerToken(),
                   ignoreExpiration: false,
                   secretOrKey     : configurationService.jwtSecret
               } );
    }

    async validate(payload: IAccessTokenPayload): Promise<User> {
        const token = await this.findValidAuthTokenByUserId( payload.sub );

        if( token.isFailed ) {
            throw new UnauthorizedException();
        }

        const user = token.value!.user;

        if( valueIsEmpty( user ) || user.isNotActive() ) {
            throw new UnauthorizedException();
        }

        return user;
    }

    private async findValidAuthTokenByUserId(userId: string): Promise<Result<Token>> {
        const userIdResult = UserId.create( userId );

        if( userIdResult.isFailed ) {
            return Failed();
        }

        const token = await this.tokenRepository.findActiveTokenByPurposeAndUserId( TokenPurpose.forAuthentication(), userIdResult.value! );

        if( token.isFailed || token.isNotFound ) {
            return Failed();
        }

        return token;
    }
}
