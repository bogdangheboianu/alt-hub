import { ConfigurationService } from '@configuration/services/configuration.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { Result } from '@shared/models/generics/result';
import { CreateHolidayDto } from '@vacations/dtos/create-holiday.dto';
import { HolidayApiObjDto } from '@vacations/dtos/holiday-api-obj.dto';
import { HolidayApiException } from '@vacations/exceptions/holiday.exceptions';
import { holidayApiObjsToCreateHolidayDtoList } from '@vacations/mappers/holiday.mappers';
import { AxiosError, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HolidayApiServiceProvider {

    constructor(
        private readonly httpService: HttpService,
        private readonly configurationService: ConfigurationService
    ) {
    }

    fetchCurrentYearRomanianPublicHolidays(): Promise<Result<CreateHolidayDto[]>> {
        const currentYear = new Date().getFullYear();
        const countryCode = this.configurationService.holidaysApiCountryCode;
        const url = `${ this.configurationService.holidaysApiUrl }/${ currentYear }/${ countryCode }`;

        return firstValueFrom( this.httpService.get<HolidayApiObjDto[]>( url, {
            headers: {
                [CustomHttpHeaders.RapidApiKey.header] : this.configurationService.holidaysApiKey,
                [CustomHttpHeaders.RapidApiHost.header]: this.configurationService.holidaysApiHost
            }
        } ) )
            .then( (response: AxiosResponse<HolidayApiObjDto[]>) => Success( holidayApiObjsToCreateHolidayDtoList( response.data ) ) )
            .catch( (error: AxiosError) => Failed( new HolidayApiException( error.name, error.message ) ) );
    }
}
