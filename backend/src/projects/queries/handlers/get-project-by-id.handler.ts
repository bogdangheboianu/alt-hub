import { QueryHandler } from '@nestjs/cqrs';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { GetProjectByIdQuery } from '@projects/queries/impl/get-project-by-id.query';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';

@QueryHandler( GetProjectByIdQuery )
export class GetProjectByIdHandler extends BaseQueryHandler<GetProjectByIdQuery, Project> {
    constructor(
        private readonly projectRepository: ProjectRepository
    ) {
        super();
    }

    async execute(query: GetProjectByIdQuery): Promise<Result<Project>> {
        const project = await this.getProjectById( query );

        if( project.isFailed ) {
            return this.failed( query, ...project.errors );
        }

        return this.successful( query, project.value! );
    }

    protected failed(query: GetProjectByIdQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetProjectByIdQuery, project: Project): Result<Project> {
        return Success( project );
    }

    private async getProjectById(query: GetProjectByIdQuery): Promise<Result<Project>> {
        const { context: { user }, params } = query.data;

        const id = ProjectId.create( params.id );

        if( id.isFailed ) {
            return Failed( ...id.errors );
        }

        const project = await this.projectRepository.findProjectById( id.value!,
                                                                      user.isAdmin
                                                                      ? undefined
                                                                      : user.id );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }

        if( project.isNotFound ) {
            return Failed( new ProjectNotFoundException() );
        }

        return project;
    }
}
