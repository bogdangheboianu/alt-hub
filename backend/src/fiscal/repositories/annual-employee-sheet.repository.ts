import { AnnualEmployeeSheetEntity } from '@fiscal/entities/annual-employee-sheet.entity';
import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { UserId } from '@users/models/user-id';
import { EntityManager, LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class AnnualEmployeeSheetRepository {
    constructor(@InjectRepository( AnnualEmployeeSheetEntity ) private readonly repository: Repository<AnnualEmployeeSheetEntity>) {
    }

    @catchAsyncExceptions()
    async findCurrentByUserId(userId: UserId): Promise<Result<AnnualEmployeeSheet>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              user      : {
                                                                  id: userId.getValue()
                                                              },
                                                              fiscalYear: {
                                                                  startDate: LessThan( new Date() ),
                                                                  endDate  : MoreThan( new Date() )
                                                              }
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : AnnualEmployeeSheet.fromEntity( result );
    }

    @catchAsyncExceptions()
    async save(sheet: AnnualEmployeeSheet, externalTransaction?: EntityManager): Promise<Result<AnnualEmployeeSheet>> {
        const entity = sheet.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );

        return AnnualEmployeeSheet.fromEntity( savedEntity );
    }
}
