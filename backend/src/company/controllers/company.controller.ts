import { CompanyPositionDto } from '@company/dtos/company-position.dto';
import { CompanyPricingProfileDto } from '@company/dtos/company-pricing-profile.dto';
import { CompanyDto } from '@company/dtos/company.dto';
import { CreateCompanyPositionDto } from '@company/dtos/create-company-position.dto';
import { CreateCompanyPricingProfileDto } from '@company/dtos/create-company-pricing-profile.dto';
import { CompanyService } from '@company/services/company.service';
import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';

@Controller( 'company' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.Company )
export class CompanyController extends BaseController {
    constructor(private readonly companyService: CompanyService) {
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
    async createCompanyPosition(@Headers() headers: any, @Request() request: any, @Body() data: CreateCompanyPositionDto): Promise<CompanyPositionDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.companyService.createCompanyPosition( context, data );
    }

    @Post( '/pricing-profiles' )
    @HttpCode( HttpStatus.CREATED )
    @UseAdminGuard()
    async createCompanyPricingProfile(@Headers() headers: any, @Request() request: any, @Body() data: CreateCompanyPricingProfileDto): Promise<CompanyPricingProfileDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.companyService.createCompanyPricingProfile( context, data );
    }
}
