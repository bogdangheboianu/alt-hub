import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, Put, Query, Request, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { ApiFile } from '@shared/decorators/api-file.decorator';
import { DeletedEntityResponseDto } from '@shared/dtos/deleted-entity-response.dto';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';
import { CreateWorkLogRecurrenceDto } from '@work-logs/dtos/create-work-log-recurrence.dto';
import { CreateWorkLogsDto } from '@work-logs/dtos/create-work-logs.dto';
import { CsvWorkLogDto } from '@work-logs/dtos/csv-work-log.dto';
import { GetAllCsvWorkLogsParamsDto } from '@work-logs/dtos/get-all-csv-work-logs-params.dto';
import { GetPaginatedWorkLogsParamsDto } from '@work-logs/dtos/get-paginated-work-logs-params.dto';
import { PaginatedWorkLogsDto } from '@work-logs/dtos/paginated-work-logs.dto';
import { UpdateWorkLogRecurrenceDto } from '@work-logs/dtos/update-work-log-recurrence.dto';
import { UpdateWorkLogDto } from '@work-logs/dtos/update-work-log.dto';
import { WorkLogRecurrenceDto } from '@work-logs/dtos/work-log-recurrence.dto';
import { WorkLogDto } from '@work-logs/dtos/work-log.dto';
import { WorkLogsFileImportResultDto } from '@work-logs/dtos/work-logs-file-import-result.dto';
import { WorkLogRecurrenceService } from '@work-logs/services/work-log-recurrence.service';
import { WorkLogService } from '@work-logs/services/work-log.service';
import { Express } from 'express';

@Controller( 'work-logs' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.WorkLogs )
export class WorkLogController extends BaseController {
    constructor(
        private readonly workLogService: WorkLogService,
        private readonly workLogRecurrenceService: WorkLogRecurrenceService
    ) {
        super();
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    async getPaginatedWorkLogs(@Headers() headers: any, @Request() request: any, @Query( new ValidationPipe( { transform: true } ) ) params: GetPaginatedWorkLogsParamsDto): Promise<PaginatedWorkLogsDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogService.getPaginatedWorkLogs( context, params );
    }

    @Get( '/csv' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async getAllCsvWorkLogs(@Headers() headers: any, @Request() request: any, @Query( new ValidationPipe( { transform: true } ) ) params: GetAllCsvWorkLogsParamsDto): Promise<CsvWorkLogDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogService.getAllCsvWorkLogs( context, params );
    }

    @Post()
    @HttpCode( HttpStatus.CREATED )
    async createWorkLogs(@Headers() headers: any, @Request() request: any, @Body() data: CreateWorkLogsDto): Promise<WorkLogDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogService.createWorkLogs( context, data );
    }

    @Post( 'import' )
    @HttpCode( HttpStatus.CREATED )
    @UseInterceptors( FileInterceptor( 'file' ) )
    @ApiConsumes( 'multipart/form-data' )
    @ApiFile()
    @UseAdminGuard()
    async importWorkLogsFromFile(
        @Headers() headers: any,
        @Request() request: any,
        @UploadedFile(
            new ParseFilePipeBuilder().addFileTypeValidator( { fileType: 'text/csv' } )
                                      .addMaxSizeValidator( { maxSize: 50000 } )
                                      .build( { errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY } )
        ) file: Express.Multer.File
    ): Promise<WorkLogsFileImportResultDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogService.importWorkLogsFromFile( context, file );
    }

    @Put( '/:id' )
    @HttpCode( HttpStatus.OK )
    async updateWorkLog(@Headers() headers: any, @Request() request: any, @Param( 'id' ) workLogId: string, @Body() data: UpdateWorkLogDto): Promise<WorkLogDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogService.updateWorkLog( context, workLogId, data );
    }

    @Delete( '/:id' )
    @HttpCode( HttpStatus.OK )
    async deleteWorkLog(@Headers() headers: any, @Request() request: any, @Param( 'id' ) workLogId: string): Promise<DeletedEntityResponseDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogService.deleteWorkLog( context, workLogId );
    }

    @Get( '/recurrences' )
    @HttpCode( HttpStatus.OK )
    async getAllUserWorkLogRecurrences(@Headers() headers: any, @Request() request: any): Promise<WorkLogRecurrenceDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogRecurrenceService.getAllUserWorkLogRecurrences( context );
    }

    @Post( '/recurrences' )
    @HttpCode( HttpStatus.CREATED )
    async createWorkLogRecurrence(@Headers() headers: any, @Request() request: any, @Body() data: CreateWorkLogRecurrenceDto): Promise<WorkLogRecurrenceDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogRecurrenceService.createWorkLogRecurrence( context, data );
    }

    @Put( '/recurrences/:id' )
    @HttpCode( HttpStatus.OK )
    async updateWorkLogRecurrence(@Headers() headers: any, @Request() request: any, @Param( 'id' ) id: string, @Body() data: UpdateWorkLogRecurrenceDto): Promise<WorkLogRecurrenceDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogRecurrenceService.updateWorkLogRecurrence( context, id, data );
    }

    @Patch( '/recurrences/:id/activate' )
    @HttpCode( HttpStatus.OK )
    async activateWorkLogRecurrence(@Headers() headers: any, @Request() request: any, @Param( 'id' ) id: string): Promise<WorkLogRecurrenceDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogRecurrenceService.activateWorkLogRecurrence( context, id );
    }

    @Patch( '/recurrences/:id/deactivate' )
    @HttpCode( HttpStatus.OK )
    async deactivateWorkLogRecurrence(@Headers() headers: any, @Request() request: any, @Param( 'id' ) id: string): Promise<WorkLogRecurrenceDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogRecurrenceService.deactivateWorkLogRecurrence( context, id );
    }

    @Delete( '/recurrences/:id' )
    @HttpCode( HttpStatus.OK )
    async deleteWorkLogRecurrence(@Headers() headers: any, @Request() request: any, @Param( 'id' ) id: string): Promise<DeletedEntityResponseDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogRecurrenceService.deleteWorkLogRecurrence( context, id );
    }
}
