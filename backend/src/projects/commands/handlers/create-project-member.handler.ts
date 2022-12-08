import { CompanyPricingProfileNotFoundException } from '@company/exceptions/company-pricing-profile.exceptions';
import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { CompanyPricingProfileId } from '@company/models/company-pricing-profile-id';
import { CompanyPricingProfileRepository } from '@company/repositories/company-pricing-profile.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateProjectMemberCommand } from '@projects/commands/impl/create-project-member.command';
import { GroupedProjectStatuses } from '@projects/constants/project.constants';
import { FailedToCreateProjectMemberEvent } from '@projects/events/impl/failed-to-create-project-member.event';
import { ProjectMemberCreatedEvent } from '@projects/events/impl/project-member-created.event';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { UserInactiveException, UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( CreateProjectMemberCommand )
export class CreateProjectMemberHandler extends BaseSyncCommandHandler<CreateProjectMemberCommand, Project> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly projectRepository: ProjectRepository,
        private readonly userRepository: UserRepository,
        private readonly pricingProfileRepository: CompanyPricingProfileRepository
    ) {
        super();
    }

    async execute(command: CreateProjectMemberCommand): Promise<Result<Project>> {
        const projectPromise = this.getProjectById( command );
        const userPromise = this.getUserById( command );
        const pricingProfilePromise = this.getPricingProfileById( command );

        const project = await projectPromise;
        const user = await userPromise;
        const pricingProfile = await pricingProfilePromise;

        if( project.isFailed ) {
            return this.failed( command, ...project.errors );
        }

        if( user.isFailed ) {
            return this.failed( command, ...user.errors );
        }

        if( pricingProfile.isFailed ) {
            return this.failed( command, ...pricingProfile.errors );
        }

        const updatedProject = project.value!.addMember( command, user.value!, pricingProfile.value! );

        if( updatedProject.isFailed ) {
            return this.failed( command, ...updatedProject.errors );
        }

        const savedProject = await this.saveProjectToDb( updatedProject.value! );

        return this.successful( command, savedProject );
    }

    protected successful(command: CreateProjectMemberCommand, project: Project): Result<Project> {
        const { context } = command.data;
        const event = new ProjectMemberCreatedEvent( { context, payload: project } );

        this.eventBus.publish( event );

        return Success( project );
    }

    protected failed(command: CreateProjectMemberCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateProjectMemberEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getProjectById(command: CreateProjectMemberCommand): Promise<Result<Project>> {
        const { projectId: id } = command.data.payload;
        const projectId = ProjectId.create( id );

        if( projectId.isFailed ) {
            return Failed( ...projectId.errors );
        }

        const project = await this.projectRepository.findById( projectId.value!, { statusGroup: GroupedProjectStatuses.active } );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }

        if( project.isNotFound ) {
            return Failed( new ProjectNotFoundException() );
        }

        return project;
    }

    private async getUserById(command: CreateProjectMemberCommand): Promise<Result<User>> {
        const { userId: id } = command.data.payload;
        const userId = UserId.create( id );

        if( userId.isFailed ) {
            return Failed( ...userId.errors );
        }

        const user = await this.userRepository.findById( userId.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new UserNotFoundException() );
        }

        if( user.value!.isInactive() ) {
            return Failed( new UserInactiveException() );
        }

        return user;
    }

    private async getPricingProfileById(command: CreateProjectMemberCommand): Promise<Result<CompanyPricingProfile>> {
        const { pricingProfileId: id } = command.data.payload;
        const pricingProfileId = CompanyPricingProfileId.create( id );

        if( pricingProfileId.isFailed ) {
            return Failed( ...pricingProfileId.errors );
        }

        const pricingProfile = await this.pricingProfileRepository.findById( pricingProfileId.value! );

        if( pricingProfile.isFailed ) {
            throw new Exception( pricingProfile.errors );
        }

        if( pricingProfile.isNotFound ) {
            return Failed( new CompanyPricingProfileNotFoundException() );
        }

        return pricingProfile;
    }

    private async saveProjectToDb(project: Project): Promise<Project> {
        const savedProject = await this.projectRepository.save( project );

        if( savedProject.isFailed ) {
            throw new Exception( savedProject.errors );
        }

        return savedProject.value!;
    }
}
