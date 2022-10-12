import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InternalContext } from '@shared/models/context/internal-context';
import { WorkLogRecurrenceService } from '@work-logs/services/work-log-recurrence.service';

@Injectable()
export class WorkLogRecurrenceScheduler {
    private readonly logger = new Logger( WorkLogRecurrenceScheduler.name );

    constructor(
        private readonly workLogRecurrenceService: WorkLogRecurrenceService
    ) {
    }

    @Cron( CronExpression.EVERY_DAY_AT_6PM )
    async handleRecurrentWorkLogs(): Promise<void> {
        const context = new InternalContext();
        const workLogs = await this.workLogRecurrenceService.handleRecurrentWorkLogs( context );

        this.logger.log( `${ workLogs.length } recurrent work logs added` );
    }
}
