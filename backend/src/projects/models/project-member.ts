import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { CreateProjectMemberCommand } from '@projects/commands/impl/create-project-member.command';
import { UpdateProjectMemberCommand } from '@projects/commands/impl/update-project-member.command';
import { ProjectMemberEntity } from '@projects/entities/project-member.entity';
import { IProjectMember } from '@projects/interfaces/project-member.interface';
import { ProjectMemberId } from '@projects/models/project-member-id';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { OptionalPositiveNumber } from '@shared/models/numerical/optional-positive-number';
import { User } from '@users/models/user';

export class ProjectMember implements IDomainModel<ProjectMember, ProjectMemberEntity> {
    id: ProjectMemberId;
    user: User;
    pricingProfile: CompanyPricingProfile;
    isCoordinator: boolean;
    allocatedHours: OptionalPositiveNumber;
    audit: Audit;

    private constructor(data: IProjectMember) {
        this.id = data.id ?? ProjectMemberId.generate();
        this.user = data.user;
        this.pricingProfile = data.pricingProfile;
        this.isCoordinator = data.isCoordinator;
        this.allocatedHours = data.allocatedHours;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateProjectMemberCommand, user: User, pricingProfile: CompanyPricingProfile): Result<ProjectMember> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IProjectMember, 'allocatedHours'>>(
            { allocatedHours: OptionalPositiveNumber.create( payload.allocatedHours, 'allocatedHours' ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new ProjectMember( {
                                               ...data.value!,
                                               user,
                                               pricingProfile,
                                               isCoordinator: payload.isCoordinator,
                                               audit        : Audit.initial( context.user.id )
                                           } ) );
    }

    static fromEntity(entity: ProjectMemberEntity): Result<ProjectMember> {
        const data = Result.aggregateObjects<IProjectMember>(
            { id: ProjectMemberId.create( entity.id ) },
            { user: User.fromEntity( entity.user ) },
            { pricingProfile: CompanyPricingProfile.fromEntity( entity.pricingProfile ) },
            { isCoordinator: entity.isCoordinator },
            { allocatedHours: OptionalPositiveNumber.create( entity.allocatedHours, 'allocatedHours' ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new ProjectMember( data.value! ) );
    }

    update(command: UpdateProjectMemberCommand, user: User, pricingProfile: CompanyPricingProfile): Result<ProjectMember> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IProjectMember, 'allocatedHours'>>(
            { allocatedHours: this.allocatedHours.update( payload.allocatedHours, 'allocatedHours' ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new ProjectMember( {
                                               ...this,
                                               ...data.value!,
                                               user,
                                               pricingProfile,
                                               isCoordinator: payload.isCoordinator,
                                               audit        : this.audit.update( context.user.id )
                                           } ) );
    }

    updateIsCoordinator(value: boolean): Result<ProjectMember> {
        return Success( new ProjectMember( { ...this, isCoordinator: value } ) );
    }

    equals(to: ProjectMember): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): ProjectMemberEntity {
        return entityFactory( ProjectMemberEntity, {
            id            : this.id.getValue(),
            user          : this.user?.toEntity() ?? null,
            pricingProfile: this.pricingProfile.toEntity(),
            isCoordinator : this.isCoordinator,
            allocatedHours: this.allocatedHours.getValue(),
            audit         : this.audit.toEntity()
        } );
    }
}
