import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Request, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';
import { CreateWorkLogRecurrenceDto } from '@work-logs/dtos/create-work-log-recurrence.dto';
import { CreateWorkLogDto } from '@work-logs/dtos/create-work-log.dto';
import { CsvWorkLogDto } from '@work-logs/dtos/csv-work-log.dto';
import { GetAllCsvWorkLogsParamsDto } from '@work-logs/dtos/get-all-csv-work-logs-params.dto';
import { GetPaginatedWorkLogsParamsDto } from '@work-logs/dtos/get-paginated-work-logs-params.dto';
import { PaginatedWorkLogsDto } from '@work-logs/dtos/paginated-work-logs.dto';
import { UpdateWorkLogRecurrenceDto } from '@work-logs/dtos/update-work-log-recurrence.dto';
import { UpdateWorkLogDto } from '@work-logs/dtos/update-work-log.dto';
import { WorkLogRecurrenceDto } from '@work-logs/dtos/work-log-recurrence.dto';
import { WorkLogDto } from '@work-logs/dtos/work-log.dto';
import { WorkLogRecurrenceService } from '@work-logs/services/work-log-recurrence.service';
import { WorkLogService } from '@work-logs/services/work-log.service';

@Controller( 'work-logs' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
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
    async createWorkLog(@Headers() headers: any, @Request() request: any, @Body() data: CreateWorkLogDto): Promise<WorkLogDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogService.createWorkLog( context, data );
    }

    @Put( '/:id' )
    @HttpCode( HttpStatus.OK )
    async updateWorkLog(@Headers() headers: any, @Request() request: any, @Param( 'id' ) workLogId: string, @Body() data: UpdateWorkLogDto): Promise<WorkLogDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.workLogService.updateWorkLog( context, workLogId, data );
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
}
