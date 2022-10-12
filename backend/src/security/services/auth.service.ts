import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginWithCredentialsCommand } from '@security/commands/impl/auth/login-with-credentials.command';
import { LoginResponseDto } from '@security/dtos/login-response.dto';
import { LoginWithCredentialsDto } from '@security/dtos/login-with-credentials.dto';
import { PublicContext } from '@shared/models/context/public-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

@Injectable()
export class AuthService {
    constructor(
        private readonly commandBus: CommandBus
    ) {
    }

    async loginWithCredentials(context: PublicContext, data: LoginWithCredentialsDto): Promise<LoginResponseDto> {
        const validation = ValidationChain.validate<typeof data>()
                                          .isNotEmpty( data.emailOrUsername, 'emailOrUsername' )
                                          .isNotEmpty( data.password, 'password' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new LoginWithCredentialsCommand( { context, payload: data } );
        const result: Result<LoginResponseDto> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }
        
        return result.value!;
    }
}
