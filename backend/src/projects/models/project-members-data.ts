import { IProjectMembersData } from '@projects/interfaces/project-members-data.interface';
import { ProjectMembersDataEntity } from '@projects/types/project.types';
import { Failed, NotFound, Success } from '@shared/functions/result-builder.functions';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IPartialModel } from '@shared/interfaces/generics/domain-partial-model.interface';
import { Result } from '@shared/models/generics/result';
import { OptionalUserId } from '@users/models/optional-user-id';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';

export class ProjectMembersData implements IPartialModel<ProjectMembersDataEntity> {
    members: User[];
    coordinatorUserId: OptionalUserId;

    private constructor(data: IProjectMembersData) {
        this.members = data.members ?? [];
        this.coordinatorUserId = data.coordinatorUserId ?? OptionalUserId.empty();
    }

    static empty(): ProjectMembersData {
        return new ProjectMembersData( {} );
    }

    static fromEntity(entity: ProjectMembersDataEntity): Result<ProjectMembersData> {
        const buildData = Result.aggregateObjects<IProjectMembersData>(
            {
                members: valueIsNotEmpty( entity.members )
                         ? Result.aggregateResults( ...entity.members.map( e => User.fromEntity( e ) ) )
                         : undefined
            },
            {
                coordinatorUserId: valueIsNotEmpty( entity.coordinatorUserId )
                                   ? OptionalUserId.create( entity.coordinatorUserId, 'coordinatorUserId' )
                                   : undefined
            }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new ProjectMembersData( buildData.value! ) );
    }

    getMemberByUserId(id: UserId): Result<User> {
        const user = this.members?.find( user => user.id.equals( id ) );
        return valueIsNotEmpty( user )
               ? Success( user )
               : NotFound();
    }

    hasMemberByUserId(id: UserId): boolean {
        return !this.getMemberByUserId( id ).isNotFound;
    }

    addMembers(users: User[]): ProjectMembersData {
        let updatedProjectMembersData;
        users.forEach( user => updatedProjectMembersData = this.addMember( user ) );

        return updatedProjectMembersData ?? this;
    }

    setCoordinator(coordinator: User): ProjectMembersData {
        const updatedMembersData = this.addMember( coordinator );
        return new ProjectMembersData( {
                                           ...updatedMembersData,
                                           coordinatorUserId: OptionalUserId.fromEntityId( coordinator.id )
                                       } );
    }

    hasMember(user: User): boolean {
        return this.hasMemberByUserId( user.id ) || (
            valueIsNotEmpty( this.coordinatorUserId ) && this.coordinatorUserId.equals( user.id )
        );
    }

    toEntity(): ProjectMembersDataEntity {
        return {
            members          : this.members.map( e => e.toEntity() ),
            coordinatorUserId: this.coordinatorUserId?.getValue()
        };
    }

    private addMember(user: User): ProjectMembersData {
        if( this.hasMemberByUserId( user.id ) ) {
            return this;
        }

        return new ProjectMembersData( {
                                           ...this,
                                           members: valueIsNotEmpty( this.members )
                                                    ? [ ...this.members, user ]
                                                    : [ user ]
                                       }
        );
    }
}
