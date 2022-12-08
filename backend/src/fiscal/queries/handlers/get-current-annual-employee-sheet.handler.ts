import { AnnualEmployeeSheetNotFoundException } from '@fiscal/exceptions/annual-employee-sheet.exceptions';
import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { GetCurrentAnnualEmployeeSheetQuery } from '@fiscal/queries/impl/get-current-annual-employee-sheet.query';
import { AnnualEmployeeSheetRepository } from '@fiscal/repositories/annual-employee-sheet.repository';
import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';
import { UserId } from '@users/models/user-id';

@QueryHandler( GetCurrentAnnualEmployeeSheetQuery )
export class GetCurrentAnnualEmployeeSheetHandler extends BaseQueryHandler<GetCurrentAnnualEmployeeSheetQuery, AnnualEmployeeSheet> {
    constructor(
        private readonly annualEmployeeSheetRepository: AnnualEmployeeSheetRepository
    ) {
        super();
    }

    async execute(query: GetCurrentAnnualEmployeeSheetQuery): Promise<Result<AnnualEmployeeSheet>> {
        const annualEmployeeSheet = await this.getCurrentAnnualEmployeeSheetByUserId( query );

        if( annualEmployeeSheet.isFailed ) {
            return this.failed( query, ...annualEmployeeSheet.errors );
        }

        return this.successful( query, annualEmployeeSheet.value! );
    }

    protected failed(query: GetCurrentAnnualEmployeeSheetQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetCurrentAnnualEmployeeSheetQuery, sheet: AnnualEmployeeSheet): Result<AnnualEmployeeSheet> {
        return Success( sheet );
    }

    private async getCurrentAnnualEmployeeSheetByUserId(query: GetCurrentAnnualEmployeeSheetQuery): Promise<Result<AnnualEmployeeSheet>> {
        const userId = UserId.create( query.data.params.userId );

        if( userId.isFailed ) {
            return Failed( ...userId.errors );
        }

        const user = await this.annualEmployeeSheetRepository.findCurrentByUserId( userId.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new AnnualEmployeeSheetNotFoundException() );
        }

        return user;
    }
}
