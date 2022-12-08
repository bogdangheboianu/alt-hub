import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InternalContext } from '@shared/models/context/internal-context';
import { HolidayService } from '@vacations/services/holiday.service';

@Injectable()
export class HolidayScheduler {
    private readonly logger = new Logger( HolidayScheduler.name );

    constructor(
        private readonly holidayService: HolidayService
    ) {
    }

    @Cron( CronExpression.EVERY_YEAR )
    async refreshHolidays(): Promise<void> {
        const context = new InternalContext();
        const holidays = await this.holidayService.refreshHolidays( context );

        this.logger.log( `${ holidays.length } holidays refreshed` );
    }
}
