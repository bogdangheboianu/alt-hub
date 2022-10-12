import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDto } from '@dtos/project.dto';

@Pipe( { name: 'projectClientName', pure: true } )
export class ProjectClientNamePipe implements PipeTransform {
    transform(value: ProjectDto): string {
        return value.info.client?.name ?? '-';
    }

}
