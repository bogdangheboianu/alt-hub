import { CreateAnnualEmployeeSheetCommand } from '@fiscal/commands/impl/create-annual-employee-sheet.command';
import { UpdateAnnualEmployeeSheetCommand } from '@fiscal/commands/impl/update-annual-employee-sheet.command';
import { FiscalYearEntity } from '@fiscal/entities/fiscal-year.entity';
import { AnnualEmployeeSheetNotFoundException, DuplicateAnnualEmployeeSheetException } from '@fiscal/exceptions/annual-employee-sheet.exceptions';
import { IFiscalYear } from '@fiscal/interfaces/fiscal-year.interface';
import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { AnnualEmployeeSheetId } from '@fiscal/models/annual-employee-sheet-id';
import { FiscalYearId } from '@fiscal/models/fiscal-year-id';
import { FiscalYearType } from '@fiscal/models/fiscal-year-type';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { DateClosedInterval } from '@shared/models/date/date-closed-interval';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';

export class FiscalYear implements IDomainModel<FiscalYear, FiscalYearEntity> {
    id: FiscalYearId;
    type: FiscalYearType;
    dateInterval: DateClosedInterval;
    annualEmployeeSheets: AnnualEmployeeSheet[];
    audit: Audit;

    private constructor(data: IFiscalYear) {
        this.id = data.id ?? FiscalYearId.generate();
        this.type = data.type;
        this.dateInterval = data.dateInterval;
        this.annualEmployeeSheets = data.annualEmployeeSheets ?? [];
        this.audit = data.audit ?? Audit.initial();
    }

    static fromEntity(entity: FiscalYearEntity): Result<FiscalYear> {
        const data = Result.aggregateObjects<IFiscalYear>(
            { id: FiscalYearId.create( entity.id ) },
            { type: FiscalYearType.create( entity.type ) },
            { dateInterval: DateClosedInterval.create( entity.startDate, entity.endDate, 'startDate', 'endDate' ) },
            { annualEmployeeSheets: Result.aggregateResults( ...entity.annualEmployeeSheets.map( s => AnnualEmployeeSheet.fromEntity( s ) ) ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new FiscalYear( data.value! ) );
    }

    addAnnualEmployeeSheet(command: CreateAnnualEmployeeSheetCommand, user: User): Result<FiscalYear> {
        if( this.annualEmployeeSheets.some( s => s.user.equals( user ) ) ) {
            return Failed( new DuplicateAnnualEmployeeSheetException() );
        }

        const sheet = AnnualEmployeeSheet.create( command, user, this.id );

        if( sheet.isFailed ) {
            return Failed( ...sheet.errors );
        }

        return Success( new FiscalYear( {
                                            ...this,
                                            annualEmployeeSheets: [ ...this.annualEmployeeSheets, sheet.value! ],
                                            audit               : this.audit.update( command.data.context.user.id )
                                        } ) );
    }

    updateAnnualEmployeeSheet(command: UpdateAnnualEmployeeSheetCommand): Result<FiscalYear> {
        const { context, payload: { annualEmployeeSheetId: id } } = command.data;
        const annualEmployeeSheetId = AnnualEmployeeSheetId.create( id, 'annualEmployeeSheetId' );

        if( annualEmployeeSheetId.isFailed ) {
            return Failed( ...annualEmployeeSheetId.errors );
        }

        const sheet = this.annualEmployeeSheets.find( sheet => sheet.id.equals( annualEmployeeSheetId.value! ) );

        if( valueIsEmpty( sheet ) ) {
            return Failed( new AnnualEmployeeSheetNotFoundException() );
        }

        const updatedSheet = sheet.update( command );

        if( updatedSheet.isFailed ) {
            return Failed( ...updatedSheet.errors );
        }

        return Success( new FiscalYear( {
                                            ...this,
                                            annualEmployeeSheets: this.annualEmployeeSheets.map( s => s.id.equals( updatedSheet.value!.id )
                                                                                                      ? updatedSheet.value!
                                                                                                      : s ),
                                            audit               : this.audit.update( context.user.id )
                                        } ) );
    }

    equals(to: FiscalYear): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): FiscalYearEntity {
        return entityFactory( FiscalYearEntity, {
            id                  : this.id.getValue(),
            type                : this.type.getValue(),
            startDate           : this.dateInterval.from.getValue(),
            endDate             : this.dateInterval.to.getValue(),
            annualEmployeeSheets: this.annualEmployeeSheets.map( s => s.toEntity() ),
            audit               : this.audit.toEntity()
        } );
    }
}
