import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDto } from '@dtos/project.dto';
import { UserDto } from '@dtos/user.dto';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';

@Pipe( { name: 'projectCoordinator', pure: true } )
export class ProjectCoordinatorPipe implements PipeTransform {
    transform(value: ProjectDto): UserDto | null {
        if( valueIsEmpty( value.membersData.coordinatorUserId ) ) {
            return null;
        }

        return value.membersData.members.find( m => m.id === value.membersData.coordinatorUserId ) ?? null;
    }

}
