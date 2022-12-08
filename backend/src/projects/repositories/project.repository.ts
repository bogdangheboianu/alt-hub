import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupedProjectStatuses } from '@projects/constants/project.constants';
import { ProjectEntity } from '@projects/entities/project.entity';
import { ProjectStatusEnum } from '@projects/enums/project-status.enum';
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
    async findAll(selectionCriteria: IProjectsSelectionCriteria): Promise<Result<Project[]>> {
        const { statusGroup, userId, clientId } = selectionCriteria;
        let searchConditions: any = {};

        if( valueIsNotEmpty( statusGroup ) ) {
            searchConditions = {
                ...searchConditions,
                timeline: {
                    status: In( GroupedProjectStatuses[statusGroup!.getValue()] )
                }
            };
        }

        if( valueIsNotEmpty( userId ) ) {
            searchConditions = {
                ...searchConditions,
                members: {
                    user: { id: userId.getValue() }
                }
            };
        }

        if( valueIsNotEmpty( clientId ) ) {
            searchConditions = {
                ...searchConditions,
                info: {
                    client: {
                        id: clientId.getValue()
                    }
                }
            };
        }

        const results = await this.repository.find( { where: searchConditions } );

        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => Project.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findByName(name: ProjectName): Promise<Result<Project>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              info: {
                                                                  name: name.getValue()
                                                              }
                                                          }
                                                      }
        );
        return valueIsNotEmpty( result )
               ? Project.fromEntity( result )
               : NotFound();
    }

    @catchAsyncExceptions()
    async findById(id: ProjectId, extra: { userId?: UserId, statusGroup?: ProjectStatusEnum[] } = {}): Promise<Result<Project>> {
        let searchConditions: any = { id: id.getValue() };
        const { userId, statusGroup } = extra;

        if( valueIsNotEmpty( userId ) ) {
            searchConditions = {
                ...searchConditions,
                members: {
                    user: { id: userId.getValue() }
                }
            };
        }

        if( valueIsNotEmpty( statusGroup ) ) {
            searchConditions = {
                ...searchConditions,
                timeline: {
                    status: In( statusGroup )
                }
            };
        }

        const result = await this.repository.findOne( { where: searchConditions } );

        return valueIsNotEmpty( result )
               ? Project.fromEntity( result )
               : NotFound();
    }

    @catchAsyncExceptions()
    async save(project: Project, externalTransaction?: EntityManager): Promise<Result<Project>> {
        const entity = project.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );

        return Project.fromEntity( savedEntity );
    }

    @catchAsyncExceptions()
    async saveAll(projects: Project[], externalTransaction?: EntityManager): Promise<Result<Project[]>> {
        const entities = projects.map( p => p.toEntity() );
        const savedEntities = valueIsEmpty( externalTransaction )
                              ? await this.repository.save( entities )
                              : await externalTransaction.save( entities );

        return Result.aggregateResults( ...savedEntities.map( entity => Project.fromEntity( entity ) ) );
    }

    @catchAsyncExceptions()
    async delete(project: Project, externalTransaction?: EntityManager): Promise<void> {
        const entity = project.toEntity();
        valueIsEmpty( externalTransaction )
        ? await this.repository.remove( entity )
        : await externalTransaction.remove( entity );
    }
}
