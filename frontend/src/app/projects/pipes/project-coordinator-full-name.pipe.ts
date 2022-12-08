import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDto } from '@dtos/project-dto';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
import { userFullName } from '@users/config/user.functions';

@Pipe( { name: 'projectCoordinatorFullName', pure: true } )
export class ProjectCoordinatorFullNamePipe implements PipeTransform {
    transform(value: ProjectDto): string {
        const coordinator = value.members.find( m => m.isCoordinator );

        return valueIsEmpty( coordinator )
               ? '-'
               : userFullName( coordinator.user );
    }

}
