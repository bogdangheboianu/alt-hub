import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InternalContext } from '@shared/models/context/internal-context';
import { WorkLogRecurrenceService } from '@work-logs/services/work-log-recurrence.service';

@Injectable()
export class WorkLogRecurrenceScheduler {

    constructor(
        private readonly workLogRecurrenceService: WorkLogRecurrenceService
    ) {
    }

    @Cron( CronExpression.EVERY_DAY_AT_6PM )
    handleRecurrentWorkLogs(): void {
        const context = new InternalContext();
        this.workLogRecurrenceService.handleRecurrentWorkLogs( context );
    }
}
