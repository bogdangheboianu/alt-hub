import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { NoAuth } from '@security/decorators/no-auth.decorator';
import { LoginResponseDto } from '@security/dtos/login-response.dto';
import { LoginWithCredentialsDto } from '@security/dtos/login-with-credentials.dto';
import { AuthService } from '@security/services/auth.service';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { PublicContext } from '@shared/models/context/public-context';
import { BaseController } from '@shared/models/generics/base-controller';

@Controller( 'auth' )
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.Auth )
export class AuthController extends BaseController {
    constructor(
        private readonly authService: AuthService
    ) {
        super();
    }

    @NoAuth()
    @Post( '/login' )
    @HttpCode( HttpStatus.OK )
    async loginWithCredentials(@Headers() headers: any, @Request() request: any, @Body() data: LoginWithCredentialsDto): Promise<LoginResponseDto> {
        const context = this.getContext<PublicContext>( headers, request );
        return await this.authService.loginWithCredentials( context, data );
    }
}
