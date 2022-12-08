import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { AnnualEmployeeSheetDto } from '@fiscal/dtos/annual-employee-sheet.dto';
import { FiscalYearDto } from '@fiscal/dtos/fiscal-year.dto';
import { GetCurrentAnnualEmployeeSheetParamsDto } from '@fiscal/dtos/get-current-annual-employee-sheet-params.dto';
import { UpdateAnnualEmployeeSheetDto } from '@fiscal/dtos/update-annual-employee-sheet.dto';
import { FiscalService } from '@fiscal/services/fiscal.service';
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';

@Controller( 'fiscal' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.Fiscal )
export class FiscalController extends BaseController {
    constructor(private readonly fiscalService: FiscalService) {
        super();
    }

    @Get( 'years' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async getAllFiscalYears(@Headers() headers: any, @Request() request: any): Promise<FiscalYearDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return [];
    }

    @Get( 'years/current' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async getCurrentFiscalYear(@Headers() headers: any, @Request() request: any): Promise<FiscalYearDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return this.fiscalService.getCurrentFiscalYear( context );
    }

    @Put( 'years/current/annual-employee-sheets/:id' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async updateAnnualEmployeeSheet(@Headers() headers: any, @Request() request: any, @Param( 'id' ) annualEmployeeSheetId: string, @Body() data: UpdateAnnualEmployeeSheetDto): Promise<FiscalYearDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return this.fiscalService.updateAnnualEmployeeSheet( context, annualEmployeeSheetId, data );
    }

    @Get( 'current-annual-employee-sheet' )
    @HttpCode( HttpStatus.OK )
    async getCurrentAnnualEmployeeSheet(@Headers() headers: any, @Request() request: any, @Query() params: GetCurrentAnnualEmployeeSheetParamsDto): Promise<AnnualEmployeeSheetDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.fiscalService.getCurrentAnnualEmployeeSheet( context, params );
    }
}
