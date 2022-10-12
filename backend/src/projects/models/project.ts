import { Client } from '@clients/models/domain-models/client';
import { AssignCoordinatorToProjectCommand } from '@projects/commands/impl/project-members/assign-coordinator-to-project.command';
import { AssignUsersToProjectCommand } from '@projects/commands/impl/project-members/assign-users-to-project.command';
import { CreateProjectCommand } from '@projects/commands/impl/project/create-project.command';
import { ProjectEntity } from '@projects/entities/project.entity';
import { InactiveProjectException } from '@projects/exceptions/project.exceptions';
import { IProject } from '@projects/interfaces/project.interface';
import { ProjectId } from '@projects/models/project-id';
import { ProjectInfo } from '@projects/models/project-info';
import { ProjectMembersData } from '@projects/models/project-members-data';
import { ProjectTimeline } from '@projects/models/project-timeline';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';

export class Project implements IDomainModel<Project, ProjectEntity> {
    id: ProjectId;
    info: ProjectInfo;
    timeline: ProjectTimeline;
    membersData: ProjectMembersData;
    audit: Audit;

    private constructor(data: IProject) {
        this.id = data.id ?? ProjectId.generate();
        this.info = data.info;
        this.timeline = data.timeline;
        this.membersData = data.membersData ?? ProjectMembersData.empty();
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateProjectCommand, beneficiary?: Client): Result<Project> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IProject, 'info' | 'timeline' | 'audit'>>(
            { info: ProjectInfo.create( payload.info, beneficiary ) },
            { timeline: ProjectTimeline.create( payload.timeline ) },
            { audit: Audit.initial( context.user?.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new Project( data.value! ) );
    }

    static fromEntity(entity: ProjectEntity): Result<Project> {
        const buildData = Result.aggregateObjects<IProject>(
            { id: ProjectId.create( entity.id ) },
            { info: ProjectInfo.fromEntity( { ...entity } ) },
            { timeline: ProjectTimeline.fromEntity( { ...entity } ) },
            { membersData: ProjectMembersData.fromEntity( { ...entity } ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new Project( buildData.value! ) );
    }

    equals(to: Project): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): ProjectEntity {
        return entityFactory( ProjectEntity, {
            id   : this.id.getValue(),
            audit: this.audit.toEntity(),
            ...this.info.toEntity(),
            ...this.timeline.toEntity(),
            ...this.membersData.toEntity()
        } );
    }

    assignUsers(command: AssignUsersToProjectCommand, users: User[]): Result<Project> {
        if( this.isInactive() ) {
            return Failed( new InactiveProjectException() );
        }

        return Success( new Project( {
                                         ...this,
                                         membersData: this.membersData.addMembers( users ),
                                         audit      : this.audit.update( command.data.context.user?.id )
                                     } )
        );
    }

    assignCoordinator(command: AssignCoordinatorToProjectCommand, user: User): Result<Project> {
        if( this.isInactive() ) {
            return Failed( new InactiveProjectException() );
        }

        return Success( new Project( {
                                         ...this,
                                         membersData: this.membersData.setCoordinator( user ),
                                         audit      : this.audit.update( command.data.context.user?.id )
                                     } )
        );
    }

    hasUser(user: User): boolean {
        return this.membersData.hasMember( user );
    }

    private isInactive(): boolean {
        return !this.timeline.status.isActive();
    }
}
