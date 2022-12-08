import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDto } from '@dtos/project-dto';

@Pipe( { name: 'projectFormattedStatus', pure: true } )
export class ProjectFormattedStatusPipe implements PipeTransform {
    transform(value: ProjectDto): string {
        const status = value.timeline.status;
        return status.replace( '_', ' ' )
                     .replace( status[0], status[0].toUpperCase() );
    }

}
