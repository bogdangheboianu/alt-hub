import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { FileService } from '@files/services/file.service';
import { Controller, Get, Headers, HttpCode, HttpStatus, Param, Request, Response, StreamableFile } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';

@Controller( 'files' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.Files )
export class FileController extends BaseController {
    constructor(private readonly fileService: FileService) {
        super();
    }

    @Get( ':id/download' )
    @HttpCode( HttpStatus.OK )
    async downloadFile(@Headers() headers: any, @Request() request: any, @Response( { passthrough: true } ) response: any, @Param( 'id' ) fileId: string): Promise<StreamableFile> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.fileService.download( context, fileId );
    }
}
