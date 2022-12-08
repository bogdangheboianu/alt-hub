import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDto } from '@dtos/project-dto';
import { ProjectStatusEnum } from '@dtos/project-status-enum';

@Pipe( { name: 'projectStatus', pure: true } )
export class ProjectStatusPipe implements PipeTransform {
    transform(value: ProjectDto): ProjectStatusEnum {
        return value.timeline.status;
    }

}
