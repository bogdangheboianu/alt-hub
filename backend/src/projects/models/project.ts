import { Client } from '@clients/models/domain-models/client';
import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { CreateProjectMemberCommand } from '@projects/commands/impl/create-project-member.command';
import { CreateProjectCommand } from '@projects/commands/impl/create-project.command';
import { DeleteProjectMemberCommand } from '@projects/commands/impl/delete-project-member.command';
import { UpdateProjectInfoCommand } from '@projects/commands/impl/update-project-info.command';
import { UpdateProjectMemberCommand } from '@projects/commands/impl/update-project-member.command';
import { UpdateProjectPricingCommand } from '@projects/commands/impl/update-project-pricing.command';
import { UpdateProjectTimelineCommand } from '@projects/commands/impl/update-project-timeline.command';
import { ProjectEntity } from '@projects/entities/project.entity';
import { InactiveProjectException } from '@projects/exceptions/project.exceptions';
import { IProject } from '@projects/interfaces/project.interface';
import { ProjectId } from '@projects/models/project-id';
import { ProjectInfo } from '@projects/models/project-info';
import { ProjectMember } from '@projects/models/project-member';
import { ProjectMemberId } from '@projects/models/project-member-id';
import { ProjectName } from '@projects/models/project-name';
import { ProjectPricing } from '@projects/models/project-pricing';
import { ProjectTimeline } from '@projects/models/project-timeline';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';

export class Project implements IDomainModel<Project, ProjectEntity> {
    id: ProjectId;
    info: ProjectInfo;
    timeline: ProjectTimeline;
    pricing: ProjectPricing;
    members: ProjectMember[];
    audit: Audit;

    private constructor(data: IProject) {
        this.id = data.id ?? ProjectId.generate();
        this.info = data.info;
        this.timeline = data.timeline ?? ProjectTimeline.empty();
        this.members = data.members ?? [];
        this.pricing = data.pricing ?? ProjectPricing.empty();
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateProjectCommand, beneficiary?: Client): Result<Project> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IProject, 'info' | 'timeline' | 'pricing' | 'audit'>>(
            { info: ProjectInfo.create( payload.info, beneficiary ) },
            { timeline: ProjectTimeline.create( payload.timeline ) },
            { pricing: ProjectPricing.create( payload.pricing ) },
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
            { info: ProjectInfo.fromEntity( entity.info ) },
            { timeline: ProjectTimeline.fromEntity( entity.timeline ) },
            { pricing: ProjectPricing.fromEntity( entity.pricing ) },
            { members: Result.aggregateResults( ...entity.members.map( e => ProjectMember.fromEntity( e ) ) ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new Project( buildData.value! ) );
    }

    static fromName(command: IDomainCommand<any>, name: ProjectName): Result<Project> {
        return Success( new Project( {
                                         info : ProjectInfo.fromName( name ),
                                         audit: Audit.initial( command.data.context.user?.id )
                                     } ) );
    }

    updateInfo(command: UpdateProjectInfoCommand, client: Client | null): Result<Project> {
        const { context, payload } = command.data;
        const updatedProjectInfo = this.info.update( payload, client );

        if( updatedProjectInfo.isFailed ) {
            return Failed( ...updatedProjectInfo.errors );
        }

        return Success( new Project( {
                                         ...this,
                                         info : updatedProjectInfo.value!,
                                         audit: this.audit.update( context.user.id )
                                     } ) );
    }

    updateTimeline(command: UpdateProjectTimelineCommand): Result<Project> {
        const { context, payload } = command.data;
        const updatedTimeline = this.timeline.update( payload );

        if( updatedTimeline.isFailed ) {
            return Failed( ...updatedTimeline.errors );
        }

        return Success( new Project( {
                                         ...this,
                                         timeline: updatedTimeline.value!,
                                         audit   : this.audit.update( context.user.id )
                                     } ) );
    }

    updatePricing(command: UpdateProjectPricingCommand): Result<Project> {
        const { context, payload } = command.data;
        const updatedPricing = this.pricing.update( payload );

        if( updatedPricing.isFailed ) {
            return Failed( ...updatedPricing.errors );
        }

        return Success( new Project( {
                                         ...this,
                                         pricing: updatedPricing.value!,
                                         audit  : this.audit.update( context.user.id )
                                     } ) );
    }

    addMember(command: CreateProjectMemberCommand, user: User, pricingProfile: CompanyPricingProfile): Result<Project> {
        if( this.isInactive() ) {
            return Failed( new InactiveProjectException() );
        }

        const member = ProjectMember.create( command, user, pricingProfile );

        if( member.isFailed ) {
            return Failed( ...member.errors );
        }

        if( this.hasMemberById( member.value!.id ) ) {
            return Success( this );
        }

        return Success( new Project( {
                                         ...this,
                                         members: [ ...this.members, member.value! ],
                                         audit  : this.audit.update( command.data.context.user.id )
                                     } )
        );
    }

    updateMember(command: UpdateProjectMemberCommand, updatedMember: ProjectMember): Result<Project> {
        if( this.isInactive() ) {
            return Failed( new InactiveProjectException() );
        }

        if( !this.hasMemberById( updatedMember.id ) ) {
            return Success( this );
        }

        const updatedMembers = Result.aggregateResults( ...this.members.map( m => m.equals( updatedMember )
                                                                                  ? Success( updatedMember )
                                                                                  : updatedMember.isCoordinator
                                                                                    ? m.updateIsCoordinator( false )
                                                                                    : Success( m ) ) );

        if( updatedMembers.isFailed ) {
            return Failed( ...updatedMembers.errors );
        }

        return Success( new Project( {
                                         ...this,
                                         members: updatedMembers.value!,
                                         audit  : this.audit.update( command.data.context.user.id )
                                     } )
        );
    }

    removeMember(command: DeleteProjectMemberCommand): Result<Project> {
        if( this.isInactive() ) {
            return Failed( new InactiveProjectException() );
        }

        const { context, payload } = command.data;
        const memberId = ProjectMemberId.create( payload.memberId, 'memberId' );

        if( memberId.isFailed ) {
            return Failed( ...memberId.errors );
        }

        return Success( new Project( {
                                         ...this,
                                         members: this.members.filter( m => !m.id.equals( memberId.value! ) ),
                                         audit  : this.audit.update( context.user.id )
                                     } ) );
    }

    getMemberById(id: ProjectMemberId): ProjectMember | null {
        return this.members.find( member => member.id.equals( id ) ) ?? null;
    }

    hasMemberById(id: ProjectMemberId): boolean {
        return valueIsNotEmpty( this.getMemberById( id ) );
    }

    equals(to: Project): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): ProjectEntity {
        return entityFactory( ProjectEntity, {
            id      : this.id.getValue(),
            audit   : this.audit.toEntity(),
            info    : this.info.toEntity(),
            pricing : this.pricing.toEntity(),
            timeline: this.timeline.toEntity(),
            members : this.members.map( m => m.toEntity() )
        } );
    }

    private isInactive(): boolean {
        return !this.timeline.status.isActive();
    }

    private isInternal(): boolean {
        return valueIsEmpty( this.info.client ) && valueIsEmpty( this.info.clientName );
    }
}
