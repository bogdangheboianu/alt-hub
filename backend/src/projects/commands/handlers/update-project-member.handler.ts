import { CompanyPricingProfileNotFoundException } from '@company/exceptions/company-pricing-profile.exceptions';
import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { CompanyPricingProfileId } from '@company/models/company-pricing-profile-id';
import { CompanyPricingProfileRepository } from '@company/repositories/company-pricing-profile.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateProjectMemberCommand } from '@projects/commands/impl/update-project-member.command';
import { GroupedProjectStatuses } from '@projects/constants/project.constants';
import { FailedToCreateProjectMemberEvent } from '@projects/events/impl/failed-to-create-project-member.event';
import { ProjectMemberCreatedEvent } from '@projects/events/impl/project-member-created.event';
import { ProjectMemberNotFoundException, ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectMember } from '@projects/models/project-member';
import { ProjectMemberId } from '@projects/models/project-member-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( UpdateProjectMemberCommand )
export class UpdateProjectMemberHandler extends BaseSyncCommandHandler<UpdateProjectMemberCommand, Project> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly projectRepository: ProjectRepository,
        private readonly userRepository: UserRepository,
        private readonly pricingProfileRepository: CompanyPricingProfileRepository
    ) {
        super();
    }

    async execute(command: UpdateProjectMemberCommand): Promise<Result<Project>> {
        const projectResult = await this.getProjectById( command );

        if( projectResult.isFailed ) {
            return this.failed( command, ...projectResult.errors );
        }

        const project = projectResult.value!;
        const memberResult = this.getProjectMember( command, project );

        if( memberResult.isFailed ) {
            return this.failed( command, ...memberResult.errors );
        }

        const member = memberResult.value!;
        const userPromise = this.getUserById( command, member );
        const pricingProfilePromise = this.getPricingProfileById( command, member );

        const user = await userPromise;
        const pricingProfile = await pricingProfilePromise;

        if( user.isFailed ) {
            return this.failed( command, ...user.errors );
        }

        if( pricingProfile.isFailed ) {
            return this.failed( command, ...pricingProfile.errors );
        }

        const updatedMember = member.update( command, user.value!, pricingProfile.value! );

        if( updatedMember.isFailed ) {
            return this.failed( command, ...updatedMember.errors );
        }

        const updatedProject = project.updateMember( command, updatedMember.value! );

        if( updatedProject.isFailed ) {
            return this.failed( command, ...updatedProject.errors );
        }

        const savedProject = await this.saveProjectToDb( updatedProject.value! );

        return this.successful( command, savedProject );
    }

    protected successful(command: UpdateProjectMemberCommand, project: Project): Result<Project> {
        const { context } = command.data;
        const event = new ProjectMemberCreatedEvent( { context, payload: project } );

        this.eventBus.publish( event );

        return Success( project );
    }

    protected failed(command: UpdateProjectMemberCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateProjectMemberEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getProjectById(command: UpdateProjectMemberCommand): Promise<Result<Project>> {
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

    private getProjectMember(command: UpdateProjectMemberCommand, project: Project): Result<ProjectMember> {
        const memberId = ProjectMemberId.create( command.data.payload.memberId, 'memberId' );

        if( memberId.isFailed ) {
            return Failed( ...memberId.errors );
        }

        const member = project.getMemberById( memberId.value! );

        return valueIsNotEmpty( member )
               ? Success( member )
               : Failed( new ProjectMemberNotFoundException() );
    }

    private async getUserById(command: UpdateProjectMemberCommand, projectMember: ProjectMember): Promise<Result<User>> {
        const { userId: id } = command.data.payload;
        const userId = UserId.create( id );

        if( userId.isFailed ) {
            return Failed( ...userId.errors );
        }

        if( userId.value!.equals( projectMember.user.id ) ) {
            return Success( projectMember.user );
        }

        const user = await this.userRepository.findActiveById( userId.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new UserNotFoundException() );
        }

        return user;
    }

    private async getPricingProfileById(command: UpdateProjectMemberCommand, projectMember: ProjectMember): Promise<Result<CompanyPricingProfile>> {
        const { pricingProfileId: id } = command.data.payload;
        const pricingProfileId = CompanyPricingProfileId.create( id );

        if( pricingProfileId.isFailed ) {
            return Failed( ...pricingProfileId.errors );
        }

        if( pricingProfileId.value!.equals( projectMember.pricingProfile.id ) ) {
            return Success( projectMember.pricingProfile );
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
