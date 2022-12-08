import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { RefreshHolidaysCommand } from '@vacations/commands/impl/refresh-holidays.command';
import { CreateHolidayDto } from '@vacations/dtos/create-holiday.dto';
import { FailedToRefreshHolidaysEvent } from '@vacations/events/impl/failed-to-refresh-holidays.event';
import { HolidaysRefreshedEvent } from '@vacations/events/impl/holidays-refreshed.event';
import { Holiday } from '@vacations/models/holiday';
import { HolidayRepository } from '@vacations/repositories/holiday.repository';
import { HolidayApiServiceProvider } from '@vacations/services/holiday-api-service-provider';
import { DataSource, EntityManager } from 'typeorm';

@CommandHandler( RefreshHolidaysCommand )
export class RefreshHolidaysHandler extends BaseSyncCommandHandler<RefreshHolidaysCommand, Holiday[]> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly holidayRepository: HolidayRepository,
        private readonly holidayApiServiceProvider: HolidayApiServiceProvider,
        private readonly dataSource: DataSource
    ) {
        super();
    }

    async execute(command: RefreshHolidaysCommand): Promise<Result<Holiday[]>> {
        const apiHolidays = await this.holidayApiServiceProvider.fetchCurrentYearRomanianPublicHolidays();

        if( apiHolidays.isFailed ) {
            return this.failed( command, ...apiHolidays.errors );
        }

        const refreshedHolidays = this.refreshHolidays( apiHolidays.value! );

        if( refreshedHolidays.isFailed ) {
            return this.failed( command, ...refreshedHolidays.errors );
        }

        const savedHolidays = await this.dataSource.transaction( async (entityManager: EntityManager) => {
            await this.holidayRepository.deleteAll( entityManager );
            return await this.saveHolidaysToDb( refreshedHolidays.value!, entityManager );
        } );

        return this.successful( command, savedHolidays );
    }

    protected successful(command: RefreshHolidaysCommand, holidays: Holiday[]): Result<Holiday[]> {
        const { context } = command.data;
        const event = new HolidaysRefreshedEvent( { context, payload: holidays } );

        this.eventBus.publish( event );

        return Success( holidays );
    }

    protected failed(command: RefreshHolidaysCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToRefreshHolidaysEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private refreshHolidays(apiHolidays: CreateHolidayDto[]): Result<Holiday[]> {
        return Result.aggregateResults( ...apiHolidays.map( ah => Holiday.create( ah ) ) );
    }

    private async saveHolidaysToDb(holidays: Holiday[], entityManager: EntityManager): Promise<Holiday[]> {
        const savedHolidays = await this.holidayRepository.saveAll( holidays, entityManager );

        if( savedHolidays.isFailed ) {
            throw new Exception( savedHolidays.errors );
        }

        return savedHolidays.value!;
    }
}
