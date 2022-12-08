import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { DateClosedInterval } from '@shared/models/date/date-closed-interval';
import { Result } from '@shared/models/generics/result';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { CancelVacationRequestCommand } from '@vacations/commands/impl/cancel-vacation-request.command';
import { CreateVacationRequestCommand } from '@vacations/commands/impl/create-vacation-request.command';
import { UpdateVacationRequestCommand } from '@vacations/commands/impl/update-vacation-request.command';
import { VacationEntity } from '@vacations/entities/vacation.entity';
import { VacationTypeEnum } from '@vacations/enums/vacation-type.enum';
import { MissingVacationReasonException, NoWorkingDaysException } from '@vacations/exceptions/vacation.exceptions';
import { IVacation } from '@vacations/interfaces/vacation.interface';
import { VacationId } from '@vacations/models/vacation-id';
import { VacationReason } from '@vacations/models/vacation-reason';
import { VacationStatus } from '@vacations/models/vacation-status';
import { VacationType } from '@vacations/models/vacation-type';

export class Vacation implements IDomainModel<Vacation, VacationEntity> {
    id: VacationId;
    type: VacationType;
    status: VacationStatus;
    reason: VacationReason;
    dateInterval: DateClosedInterval;
    workingDays: PositiveNumber;
    approved: boolean;
    annualEmployeeSheet: AnnualEmployeeSheet;
    audit: Audit;

    private constructor(data: IVacation) {
        this.id = data.id ?? VacationId.generate();
        this.type = data.type;
        this.status = data.status ?? VacationStatus.Approved();
        this.reason = data.reason ?? VacationReason.empty();
        this.dateInterval = data.dateInterval;
        this.workingDays = data.workingDays;
        this.approved = data.approved ?? false;
        this.annualEmployeeSheet = data.annualEmployeeSheet;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateVacationRequestCommand, workingDays: PositiveNumber, annualEmployeeSheet: AnnualEmployeeSheet): Result<Vacation> {
        if( workingDays.isZero() ) {
            return Failed( new NoWorkingDaysException() );
        }

        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Omit<IVacation, 'id' | 'workingDays' | 'approved'>>(
            { type: VacationType.create( payload.type ) },
            {
                reason: payload.type === VacationTypeEnum.UnpaidLeave
                        ? VacationReason.create( payload.reason )
                        : VacationReason.empty()
            },
            { dateInterval: DateClosedInterval.create( payload.fromDate, payload.toDate, 'fromDate', 'toDate', true ) },
            { annualEmployeeSheet },
            { audit: Audit.initial( context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        const buildData = data.value!;

        if( buildData.type.isUnpaidLeave() && buildData.reason!.isEmpty() ) {
            return Failed( new MissingVacationReasonException() );
        }

        return Success( new Vacation( { ...buildData, workingDays } ) );
    }

    static fromEntity(entity: VacationEntity): Result<Vacation> {
        const data = Result.aggregateObjects<IVacation>(
            { id: VacationId.create( entity.id ) },
            { type: VacationType.create( entity.type ) },
            { status: VacationStatus.create( entity.status ) },
            { reason: VacationReason.create( entity.reason ) },
            { dateInterval: DateClosedInterval.create( entity.fromDate, entity.toDate, 'fromDate', 'toDate', true ) },
            { workingDays: PositiveNumber.create( entity.workingDays, 'workingDays' ) },
            { approved: entity.approved },
            { annualEmployeeSheet: AnnualEmployeeSheet.fromEntity( entity.annualEmployeeSheet ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new Vacation( data.value! ) );
    }

    update(command: UpdateVacationRequestCommand, workingDays: PositiveNumber): Result<Vacation> {
        if( workingDays.isZero() ) {
            return Failed( new NoWorkingDaysException() );
        }

        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IVacation, 'reason' | 'dateInterval' | 'audit'>>(
            {
                reason: this.type.isUnpaidLeave()
                        ? VacationReason.create( payload.reason )
                        : VacationReason.empty()
            },
            { dateInterval: this.dateInterval.update( payload.fromDate, payload.toDate, 'fromDate', 'toDate', true ) },
            { audit: this.audit.update( context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        const buildData = data.value!;

        if( this.type.isUnpaidLeave() && buildData.reason!.isEmpty() ) {
            return Failed( new MissingVacationReasonException() );
        }

        return Success( new Vacation( { ...this, ...buildData, workingDays } ) );
    }

    cancel(command: CancelVacationRequestCommand): Result<Vacation> {
        return Success( new Vacation( {
                                          ...this,
                                          status: VacationStatus.Canceled(),
                                          audit : this.audit.update( command.data.context.user.id )
                                      } ) );
    }

    isPaid(): boolean {
        return this.type.isAnnualLeave();
    }

    equals(to: Vacation): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): VacationEntity {
        return entityFactory( VacationEntity, {
            id                 : this.id.getValue(),
            type               : this.type.getValue(),
            status             : this.status.getValue(),
            reason             : this.reason.getValue(),
            fromDate           : this.dateInterval.from.getValue(),
            toDate             : this.dateInterval.to.getValue(),
            workingDays        : this.workingDays.getValue(),
            approved           : this.approved,
            annualEmployeeSheet: this.annualEmployeeSheet.toEntity(),
            audit              : this.audit.toEntity()
        } );
    }
}
