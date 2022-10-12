import { QueryHandler } from '@nestjs/cqrs';
import { IProjectsSelectionCriteria } from '@projects/interfaces/projects-selection-criteria.interface';
import { Project } from '@projects/models/project';
import { ProjectStatusGroup } from '@projects/models/project-status-group';
import { GetAllProjectsQuery } from '@projects/queries/impl/get-all-projects.query';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';

@QueryHandler( GetAllProjectsQuery )
export class GetAllProjectsHandler extends BaseQueryHandler<GetAllProjectsQuery, Project[]> {
    constructor(
        private readonly projectRepository: ProjectRepository
    ) {
        super();
    }

    async execute(query: GetAllProjectsQuery): Promise<Result<Project[]>> {
        const projects = await this.getAllProjects( query );

        if( projects.isFailed ) {
            return this.failed( query, ...projects.errors );
        }

        return this.successful( query, projects.value! );
    }

    protected failed(query: GetAllProjectsQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetAllProjectsQuery, projects: Project[]): Result<Project[]> {
        return Success( projects );
    }

    private async getAllProjects(query: GetAllProjectsQuery): Promise<Result<Project[]>> {
        const selectionCriteria = this.buildProjectsSelectionCriteria( query );

        if( selectionCriteria.isFailed ) {
            return Failed( ...selectionCriteria.errors );
        }

        const projects = await this.projectRepository.findAllProjects( selectionCriteria.value! );

        if( projects.isFailed ) {
            throw new Exception( projects.errors );
        }

        if( projects.isNotFound ) {
            return Success( [] );
        }

        return projects;
    }

    private buildProjectsSelectionCriteria(query: GetAllProjectsQuery): Result<IProjectsSelectionCriteria> {
        const { context: { user }, params } = query.data;
        return Result.aggregateObjects<IProjectsSelectionCriteria>(
            {
                statusGroup: valueIsEmpty( params.statusGroup )
                             ? undefined
                             : ProjectStatusGroup.create( params.statusGroup )
            },
            {
                userId: user.isAdmin
                        ? undefined
                        : user.id
            }
        );
    }
}
