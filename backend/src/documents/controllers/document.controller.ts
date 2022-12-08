import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { CreateDocumentDto } from '@documents/dtos/create-document.dto';
import { DocumentDto } from '@documents/dtos/document.dto';
import { GetAllDocumentsParamsDto } from '@documents/dtos/get-all-documents-params.dto';
import { DocumentService } from '@documents/services/document.service';
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query, Request, UploadedFiles, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';
import { Express } from 'express';

@Controller( 'documents' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.Documents )
export class DocumentController extends BaseController {
    constructor(private readonly documentService: DocumentService) {
        super();
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    async getAllDocuments(@Headers() headers: any, @Request() request: any, @Query( new ValidationPipe( { transform: true } ) ) params: GetAllDocumentsParamsDto): Promise<DocumentDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.documentService.getAllDocuments( context, params );
    }

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @ApiConsumes( 'multipart/form-data' )
    @UseInterceptors( FilesInterceptor( 'files', 3 ) )
    @UseAdminGuard()
    async createDocument(@Headers() headers: any, @Request() request: any, @Body() data: CreateDocumentDto, @UploadedFiles() files: Array<Express.Multer.File>): Promise<DocumentDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.documentService.createDocument( context, data, files );
    }
}
