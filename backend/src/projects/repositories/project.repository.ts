import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupedProjectStatuses } from '@projects/constants/project.constants';
import { ProjectEntity } from '@projects/entities/project.entity';
import { IProjectsSelectionCriteria } from '@projects/interfaces/projects-selection-criteria.interface';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectName } from '@projects/models/project-name';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { Result } from '@shared/models/generics/result';
import { UserId } from '@users/models/user-id';
import { EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class ProjectRepository {
    constructor(
        @InjectRepository( ProjectEntity ) private readonly repository: Repository<ProjectEntity>
    ) {
    }

    @catchAsyncExceptions()
    async findAllProjects(selectionCriteria: IProjectsSelectionCriteria): Promise<Result<Project[]>> {
        const { statusGroup, userId } = selectionCriteria;
        let searchConditions: any = {};

        if( valueIsNotEmpty( statusGroup ) ) {
            searchConditions = { ...searchConditions, status: In( GroupedProjectStatuses[statusGroup!.getValue()] ) };
        }

        if( valueIsNotEmpty( userId ) ) {
            searchConditions = { ...searchConditions, members: { id: userId.getValue() } };
        }

        const results = await this.repository.find( { where: searchConditions } );

        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => Project.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findProjectByName(name: ProjectName): Promise<Result<Project>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              name: name.getValue()
                                                          }
                                                      }
        );
        return valueIsNotEmpty( result )
               ? Project.fromEntity( result )
               : NotFound();
    }

    @catchAsyncExceptions()
    async findProjectById(id: ProjectId, userId?: UserId): Promise<Result<Project>> {
        let searchConditions: any = { id: id.getValue() };

        if( valueIsNotEmpty( userId ) ) {
            searchConditions = { ...searchConditions, members: { id: userId.getValue() } };
        }

        const result = await this.repository.findOne( { where: searchConditions } );

        return valueIsNotEmpty( result )
               ? Project.fromEntity( result )
               : NotFound();
    }

    @catchAsyncExceptions()
    async findActiveProjectById(id: ProjectId): Promise<Result<Project>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id    : id.getValue(),
                                                              status: In( GroupedProjectStatuses.active )
                                                          }
                                                      }
        );
        return valueIsNotEmpty( result )
               ? Project.fromEntity( result )
               : NotFound();
    }

    @catchAsyncExceptions()
    async findOngoingProjectById(id: ProjectId): Promise<Result<Project>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id    : id.getValue(),
                                                              status: In( GroupedProjectStatuses.ongoing )
                                                          }
                                                      }
        );
        return valueIsNotEmpty( result )
               ? Project.fromEntity( result )
               : NotFound();
    }

    @catchAsyncExceptions()
    async saveProject(project: Project, externalTransaction?: EntityManager): Promise<Result<Project>> {
        const entity = project.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );

        return Project.fromEntity( savedEntity );
    }
}
