import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { Exception } from '@shared/exceptions/exception';
import { pageObject } from '@shared/functions/page-object.function';
import { paginatedResult } from '@shared/functions/paginated-result.function';
import { Failed, NotFound, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { PaginatedResult } from '@shared/models/generics/paginated-result';
import { Result } from '@shared/models/generics/result';
import { UserId } from '@users/models/user-id';
import { WorkLogEntity } from '@work-logs/entities/work-log.entity';
import { IWorkLogsSelectionCriteria } from '@work-logs/interfaces/work-logs-selection-criteria.interface';
import { WorkLog } from '@work-logs/models/work-log';
import { WorkLogId } from '@work-logs/models/work-log-id';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class WorkLogRepository {
    constructor(
        @InjectRepository( WorkLogEntity ) private readonly repository: Repository<WorkLogEntity>
    ) {
    }

    @catchAsyncExceptions()
    async findAll(selectionCriteria?: IWorkLogsSelectionCriteria): Promise<Result<WorkLog[]>> {
        const searchConditions = valueIsNotEmpty( selectionCriteria )
                                 ? this.buildWorkLogsSearchConditions( selectionCriteria )
                                 : {};
        const results = await this.repository.find( {
                                                        where: searchConditions,
                                                        order: {
                                                            date: 'DESC'
                                                        }
                                                    } );
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => WorkLog.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findAllPaginated(selectionCriteria: IWorkLogsSelectionCriteria, pageNumber?: number, itemsPerPage?: number): Promise<Result<PaginatedResult<WorkLog>>> {
        const { skip, take } = pageObject( pageNumber, itemsPerPage );
        const searchConditions = this.buildWorkLogsSearchConditions( selectionCriteria );
        const [ results, total ] = await this.repository.findAndCount( {
                                                                           where: searchConditions,
                                                                           order: {
                                                                               date: 'DESC'
                                                                           },
                                                                           take,
                                                                           skip
                                                                       } );
        const resultValues = valueIsEmpty( results )
                             ? Success( [] )
                             : Result.aggregateResults( ...results.map( r => WorkLog.fromEntity( r ) ) );

        if( resultValues.isFailed ) {
            return Failed( ...resultValues.errors );
        }

        return paginatedResult( resultValues.value!, total, pageNumber, itemsPerPage );
    }

    @catchAsyncExceptions()
    async findByIdAndUserId(id: WorkLogId, userId: UserId): Promise<Result<WorkLog>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id  : id.getValue(),
                                                              user: {
                                                                  id: userId.getValue()
                                                              }
                                                          }
                                                      }
        );
        return valueIsNotEmpty( result )
               ? WorkLog.fromEntity( result )
               : NotFound();
    }

    @catchAsyncExceptions()
    async save(workLog: WorkLog, externalTransaction?: EntityManager): Promise<Result<WorkLog>> {
        const entity = workLog.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );

        return WorkLog.fromEntity( savedEntity );
    }

    @catchAsyncExceptions()
    async saveAll(workLogs: WorkLog[], externalTransaction?: EntityManager): Promise<WorkLog[]> {
        const entities = workLogs.map( wl => wl.toEntity() );
        const savedEntities = valueIsEmpty( externalTransaction )
                              ? await this.repository.save( entities )
                              : await externalTransaction.save( entities );
        const savedWorkLogs = Result.aggregateResults( ...savedEntities.map( e => WorkLog.fromEntity( e ) ) );

        if( savedWorkLogs.isFailed ) {
            throw new Exception( savedWorkLogs.errors );
        }

        return savedWorkLogs.value!;
    }

    private buildWorkLogsSearchConditions(selectionCriteria: IWorkLogsSelectionCriteria): any {
        let searchConditions: any = {};
        const { fromDate, toDate, userId, projectId } = selectionCriteria;

        if( valueIsNotEmpty( fromDate ) ) {
            const from_date = fromDate.getValue();
            searchConditions = { ...searchConditions, date: MoreThanOrEqual( from_date ) };
        }

        if( valueIsNotEmpty( toDate ) ) {
            const to_date = toDate.getValue();
            searchConditions = { ...searchConditions, date: LessThanOrEqual( to_date ) };
        }

        if( valueIsNotEmpty( userId ) ) {
            const user_id = userId.getValue();
            searchConditions = { ...searchConditions, user: { id: user_id } };
        }

        if( valueIsNotEmpty( projectId ) ) {
            const project_id = projectId.getValue();
            searchConditions = { ...searchConditions, project: { id: project_id } };
        }

        return searchConditions;
    }
}
