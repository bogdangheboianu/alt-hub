import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginWithCredentialsHandler } from '@security/commands/handlers/auth/login-with-credentials.handler';
import { GenerateTokenHandler } from '@security/commands/handlers/token/generate-token.handler';
import { InvalidateTokenHandler } from '@security/commands/handlers/token/invalidate-token.handler';
import { AUTH_ACCESS_TOKEN_VALIDITY_MIN } from '@security/constants/token.constants';
import { AuthController } from '@security/controllers/auth.controller';
import { TokenEntity } from '@security/entities/token.entity';
import { JwtAuthGuard } from '@security/guards/jwt-auth.guard';
import { TokenRepository } from '@security/repositories/token.repository';
import { TokenSagas } from '@security/sagas/token.sagas';
import { AuthService } from '@security/services/auth.service';
import { TokenService } from '@security/services/token.service';
import { JwtStrategy } from '@security/strategies/jwt.strategy';
import { UserModule } from '@users/user.module';

const Entities = [
    TokenEntity
];

const Controllers = [
    AuthController
];

const Services = [
    AuthService,
    TokenService
];

const Strategies = [
    JwtStrategy
];

const CommandHandlers = [
    GenerateTokenHandler,
    InvalidateTokenHandler,
    LoginWithCredentialsHandler
];

const Repositories = [
    TokenRepository
];

const Sagas = [
    TokenSagas
];

const Exports = [
    TokenRepository
];

@Module( {
             controllers: [ ...Controllers ],
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule,
                 PassportModule,
                 JwtModule.register( {
                                         signOptions: { expiresIn: `${ AUTH_ACCESS_TOKEN_VALIDITY_MIN }m` }
                                     } ),
                 forwardRef( () => UserModule )
             ],
             providers  : [
                 ...Services,
                 ...Repositories,
                 ...CommandHandlers,
                 ...Sagas,
                 ...Strategies,
                 {
                     provide : APP_GUARD,
                     useClass: JwtAuthGuard
                 }
             ],
             exports    : [ ...Exports ]
         } )
export class SecurityModule {
}
