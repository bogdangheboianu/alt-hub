import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';
import { Holiday } from '@vacations/models/holiday';
import { GetAllHolidaysQuery } from '@vacations/queries/impl/get-all-holidays.query';
import { HolidayRepository } from '@vacations/repositories/holiday.repository';

@QueryHandler( GetAllHolidaysQuery )
export class GetAllHolidaysHandler extends BaseQueryHandler<GetAllHolidaysQuery, Holiday[]> {
    constructor(private readonly holidayRepository: HolidayRepository) {
        super();
    }

    async execute(query: GetAllHolidaysQuery): Promise<Result<Holiday[]>> {
        const holidays = await this.getAllHolidays();

        if( holidays.isFailed ) {
            return this.failed( query, ...holidays.errors );
        }

        return this.successful( query, holidays.value! );
    }

    protected failed(query: GetAllHolidaysQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetAllHolidaysQuery, holidays: Holiday[]): Result<Holiday[]> {
        return Success( holidays );
    }

    private async getAllHolidays(): Promise<Result<Holiday[]>> {
        const holidays = await this.holidayRepository.findAll();

        if( holidays.isFailed ) {
            throw new Exception( holidays.errors );
        }

        if( holidays.isNotFound ) {
            return Success( [] );
        }

        return holidays;
    }
}
