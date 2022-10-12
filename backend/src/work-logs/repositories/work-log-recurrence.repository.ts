import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { Exception } from '@shared/exceptions/exception';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { UserId } from '@users/models/user-id';
import { WorkLogRecurrenceEntity } from '@work-logs/entities/work-log-recurrence.entity';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRecurrenceId } from '@work-logs/models/work-log-recurrence-id';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class WorkLogRecurrenceRepository {
    constructor(
        @InjectRepository( WorkLogRecurrenceEntity ) private readonly repository: Repository<WorkLogRecurrenceEntity>
    ) {
    }

    @catchAsyncExceptions()
    async findAllByUserId(userId: UserId): Promise<Result<WorkLogRecurrence[]>> {
        const results = await this.repository.find( {
                                                        where: {
                                                            user: {
                                                                id: userId.getValue()
                                                            }
                                                        },
                                                        order: {
                                                            audit: {
                                                                createdAt: 'DESC'
                                                            }
                                                        }
                                                    } );
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => WorkLogRecurrence.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findAllActive(): Promise<Result<WorkLogRecurrence[]>> {
        const results = await this.repository.find( {
                                                        where: {
                                                            active: true
                                                        }
                                                    } );
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => WorkLogRecurrence.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findByIdAndUserId(id: WorkLogRecurrenceId, userId: UserId): Promise<Result<WorkLogRecurrence>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id  : id.getValue(),
                                                              user: {
                                                                  id: userId.getValue()
                                                              }
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : WorkLogRecurrence.fromEntity( result );
    }

    @catchAsyncExceptions()
    async save(recurrence: WorkLogRecurrence, externalTransaction?: EntityManager): Promise<WorkLogRecurrence> {
        const entity = recurrence.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );
        const savedRecurrence = WorkLogRecurrence.fromEntity( savedEntity );

        if( savedRecurrence.isFailed ) {
            throw new Exception( savedRecurrence.errors );
        }

        return savedRecurrence.value!;
    }
}
