import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { Controller, Get, Headers, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';
import { HolidayDto } from '@vacations/dtos/holiday.dto';
import { HolidayService } from '@vacations/services/holiday.service';

@Controller( 'holidays' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.Vacations )
export class HolidayController extends BaseController {
    constructor(private readonly holidayService: HolidayService) {
        super();
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    async getAllHolidays(@Headers() headers: any, @Request() request: any): Promise<HolidayDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.holidayService.getAllHolidays( context );
    }
}
