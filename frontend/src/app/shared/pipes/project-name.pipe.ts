import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDto } from '@dtos/project.dto';

@Pipe( { name: 'projectName', pure: true } )
export class ProjectNamePipe implements PipeTransform {
    transform(value: ProjectDto): string {
        return value.info.name;
    }

}
