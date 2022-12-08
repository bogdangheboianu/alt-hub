import { Pipe, PipeTransform } from '@angular/core';
import { WorkLogDto } from '@dtos/work-log-dto';

@Pipe( { name: 'workLogProjectName', pure: true } )
export class WorkLogProjectNamePipe implements PipeTransform {
    transform(value: WorkLogDto): string {
        return value.project?.info.name ?? value.projectName;
    }

}
