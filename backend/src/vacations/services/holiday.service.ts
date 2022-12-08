import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { InternalContext } from '@shared/models/context/internal-context';
import { Result } from '@shared/models/generics/result';
import { RefreshHolidaysCommand } from '@vacations/commands/impl/refresh-holidays.command';
import { HolidayDto } from '@vacations/dtos/holiday.dto';
import { modelsToHolidayDtoList } from '@vacations/mappers/holiday.mappers';
import { Holiday } from '@vacations/models/holiday';
import { GetAllHolidaysQuery } from '@vacations/queries/impl/get-all-holidays.query';

@Injectable()
export class HolidayService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {
    }

    async refreshHolidays(context: InternalContext): Promise<Holiday[]> {
        const command = new RefreshHolidaysCommand( { context, payload: {} } );
        const result: Result<Holiday[]> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new Exception( result.errors );
        }

        return result.value!;
    }

    async getAllHolidays(context: AuthenticatedContext): Promise<HolidayDto[]> {
        const query = new GetAllHolidaysQuery( { context, params: null } );
        const result: Result<Holiday[]> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelsToHolidayDtoList( result.value! );
    }
}
