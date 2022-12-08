import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDto } from '@dtos/project-dto';
import { UserDto } from '@dtos/user-dto';

@Pipe( { name: 'projectCoordinator', pure: true } )
export class ProjectCoordinatorPipe implements PipeTransform {
    transform(value: ProjectDto): UserDto | null {
        return value.members.find( m => m.isCoordinator )?.user ?? null;
    }

}
