import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';
import { CreateVacationRequestDto } from '@vacations/dtos/create-vacation-request.dto';
import { GetAllVacationsParamsDto } from '@vacations/dtos/get-all-vacations-params.dto';
import { UpdateVacationRequestDto } from '@vacations/dtos/update-vacation-request.dto';
import { VacationDto } from '@vacations/dtos/vacation.dto';
import { VacationService } from '@vacations/services/vacation.service';

@Controller( 'vacations' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.Vacations )
export class VacationController extends BaseController {
    constructor(private readonly vacationService: VacationService) {
        super();
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    async getAllVacations(@Headers() headers: any, @Request() request: any, @Query() params: GetAllVacationsParamsDto): Promise<VacationDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.vacationService.getAllVacations( context, params );
    }

    @Post()
    @HttpCode( HttpStatus.CREATED )
    async createVacationRequest(@Headers() headers: any, @Request() request: any, @Body() data: CreateVacationRequestDto): Promise<VacationDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.vacationService.createVacationRequest( context, data );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    async updateVacationRequest(@Headers() headers: any, @Request() request: any, @Param( 'id' ) id: string, @Body() data: UpdateVacationRequestDto): Promise<VacationDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.vacationService.updateVacationRequest( context, id, data );
    }

    @Patch( ':id/cancel' )
    @HttpCode( HttpStatus.OK )
    async cancelVacationRequest(@Headers() headers: any, @Request() request: any, @Param( 'id' ) id: string): Promise<VacationDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.vacationService.cancelVacationRequest( context, id );
    }
}
