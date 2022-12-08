import { Pipe, PipeTransform } from '@angular/core';
import { ClientDto } from '@dtos/client-dto';
import { ProjectDto } from '@dtos/project-dto';

@Pipe( { name: 'projectClient', pure: true } )
export class ProjectClientPipe implements PipeTransform {
    transform(value: ProjectDto): ClientDto | null {
        return value.info.client;
    }
}
