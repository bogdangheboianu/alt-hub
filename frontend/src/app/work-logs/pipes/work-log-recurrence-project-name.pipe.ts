import { Pipe, PipeTransform } from '@angular/core';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence-dto';

@Pipe( { name: 'workLogRecurrenceProjectName', pure: true } )
export class WorkLogRecurrenceProjectNamePipe implements PipeTransform {
    transform(value: WorkLogRecurrenceDto): string {
        return value.project?.info.name ?? '';
    }

}
