import { CreateAnnualEmployeeSheetCommand } from '@fiscal/commands/impl/create-annual-employee-sheet.command';
import { UpdateAnnualEmployeeSheetCommand } from '@fiscal/commands/impl/update-annual-employee-sheet.command';
import { AnnualEmployeeSheetEntity } from '@fiscal/entities/annual-employee-sheet.entity';
import { IAnnualEmployeeSheet } from '@fiscal/interfaces/annual-employee-sheet.interface';
import { AnnualEmployeeSheetId } from '@fiscal/models/annual-employee-sheet-id';
import { FiscalYearId } from '@fiscal/models/fiscal-year-id';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { Counter } from '@shared/models/numerical/counter';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { User } from '@users/models/user';
import { CancelVacationRequestCommand } from '@vacations/commands/impl/cancel-vacation-request.command';
import { CreateVacationRequestCommand } from '@vacations/commands/impl/create-vacation-request.command';
import { UpdateVacationRequestCommand } from '@vacations/commands/impl/update-vacation-request.command';
import { NotEnoughPaidLeaveDaysException, PaidLeaveDaysConsumedException } from '@vacations/exceptions/vacation.exceptions';
import { Vacation } from '@vacations/models/vacation';

export class AnnualEmployeeSheet implements IDomainModel<AnnualEmployeeSheet, AnnualEmployeeSheetEntity> {
    id: AnnualEmployeeSheetId;
    paidLeaveDays: PositiveNumber;
    remainingPaidLeaveDays: Counter;
    user: User;
    fiscalYearId: FiscalYearId;
    audit: Audit;

    private constructor(data: IAnnualEmployeeSheet) {
        this.id = data.id ?? AnnualEmployeeSheetId.generate();
        this.paidLeaveDays = data.paidLeaveDays;
        this.remainingPaidLeaveDays = data.remainingPaidLeaveDays ?? Counter.from( this.paidLeaveDays );
        this.user = data.user;
        this.fiscalYearId = data.fiscalYearId;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateAnnualEmployeeSheetCommand, user: User, fiscalYearId: FiscalYearId): Result<AnnualEmployeeSheet> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IAnnualEmployeeSheet, 'paidLeaveDays' | 'user' | 'fiscalYearId' | 'audit'>>(
            { paidLeaveDays: PositiveNumber.create( payload.paidLeaveDays, 'paidLeaveDays' ) },
            { user },
            { fiscalYearId },
            { audit: Audit.initial( context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new AnnualEmployeeSheet( data.value! ) );
    }

    static fromEntity(entity: AnnualEmployeeSheetEntity): Result<AnnualEmployeeSheet> {
        const data = Result.aggregateObjects<IAnnualEmployeeSheet>(
            { id: AnnualEmployeeSheetId.create( entity.id ) },
            { paidLeaveDays: PositiveNumber.create( entity.paidLeaveDays, 'paidLeaveDays' ) },
            { remainingPaidLeaveDays: Counter.create( entity.remainingPaidLeaveDays, 'remainingPaidLeaveDays' ) },
            { user: User.fromEntity( entity.user ) },
            { fiscalYearId: FiscalYearId.create( entity.fiscalYearId ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new AnnualEmployeeSheet( data.value! ) );
    }

    update(command: UpdateAnnualEmployeeSheetCommand): Result<AnnualEmployeeSheet> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IAnnualEmployeeSheet, 'paidLeaveDays' | 'remainingPaidLeaveDays' | 'audit'>>(
            { paidLeaveDays: this.paidLeaveDays.update( payload.paidLeaveDays, 'paidLeaveDays' ) },
            { remainingPaidLeaveDays: this.remainingPaidLeaveDays.update( payload.remainingPaidLeaveDays, 'remainingPaidLeaveDays' ) },
            { audit: this.audit.update( context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        const { paidLeaveDays, remainingPaidLeaveDays } = data.value!;
        const validation = ValidationChain.validate<any>()
                                          .isEqualOrGreaterThan( paidLeaveDays.getValue(), remainingPaidLeaveDays!.getValue(), 'paidLeaveDays' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new AnnualEmployeeSheet( { ...this, ...data.value! } ) );
    }

    updateRemainingPaidLeaveDays(command: CreateVacationRequestCommand | UpdateVacationRequestCommand | CancelVacationRequestCommand, vacation: Vacation, daysToAddOrSubtract?: number): Result<AnnualEmployeeSheet> {
        const noMorePaidLeaveDays = vacation.isPaid() && this.remainingPaidLeaveDays.isZero();

        if( noMorePaidLeaveDays ) {
            return Failed( new PaidLeaveDaysConsumedException() );
        }

        const updatedRemainingPaidLeaveDays = vacation.isPaid()
                                              ? this.remainingPaidLeaveDays.minus( daysToAddOrSubtract ?? vacation.workingDays )
                                              : Success( this.remainingPaidLeaveDays );

        if( updatedRemainingPaidLeaveDays.isFailed ) {
            return Failed( new NotEnoughPaidLeaveDaysException() );
        }

        return Success( new AnnualEmployeeSheet( {
                                                     ...this,
                                                     remainingPaidLeaveDays: updatedRemainingPaidLeaveDays.value!,
                                                     audit                 : this.audit.update( command.data.context.user.id )
                                                 } ) );
    }

    equals(to: AnnualEmployeeSheet): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): AnnualEmployeeSheetEntity {
        return entityFactory( AnnualEmployeeSheetEntity, {
            id                    : this.id.getValue(),
            paidLeaveDays         : this.paidLeaveDays.getValue(),
            remainingPaidLeaveDays: this.remainingPaidLeaveDays.getValue(),
            user                  : this.user.toEntity(),
            fiscalYearId          : this.fiscalYearId.getValue(),
            audit                 : this.audit.toEntity()
        } );
    }
}
