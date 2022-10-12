import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDto } from '@dtos/project.dto';

@Pipe( { name: 'projectStatus', pure: true } )
export class ProjectStatusPipe implements PipeTransform {
    transform(value: ProjectDto): string {
        const status = value.timeline.status;
        return status.replace( '_', ' ' )
                     .replace( status[0], status[0].toUpperCase() );
    }

}
