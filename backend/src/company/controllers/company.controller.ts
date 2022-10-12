import { CompanyDto } from '@company/dtos/company.dto';
import { CreateCompanyPositionDto } from '@company/dtos/create-company-position.dto';
import { CompanyService } from '@company/services/company.service';
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';

@Controller( 'company' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
export class CompanyController extends BaseController {
    constructor(
        private readonly companyService: CompanyService
    ) {
        super();
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    async getCompany(@Headers() headers: any, @Request() request: any): Promise<CompanyDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.companyService.getCompany( context );
    }

    @Post( '/positions' )
    @HttpCode( HttpStatus.CREATED )
    @UseAdminGuard()
    async addPositionToCompany(@Headers() headers: any, @Request() request: any, @Body() data: CreateCompanyPositionDto): Promise<CompanyDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.companyService.addPositionToCompany( context, data );
    }
}
