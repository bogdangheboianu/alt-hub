import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { VacationStatusEnum } from '@vacations/enums/vacation-status.enum';

export class VacationStatus implements IValueObject<VacationStatus, VacationStatusEnum> {
    private readonly value: VacationStatusEnum;

    private constructor(value: VacationStatusEnum) {
        this.value = value;
    }

    static Pending(): VacationStatus {
        return new VacationStatus( VacationStatusEnum.Pending );
    }

    static Approved(): VacationStatus {
        return new VacationStatus( VacationStatusEnum.Approved );
    }

    static Declined(): VacationStatus {
        return new VacationStatus( VacationStatusEnum.Declined );
    }

    static Canceled(): VacationStatus {
        return new VacationStatus( VacationStatusEnum.Canceled );
    }

    static create(value: string | VacationStatusEnum): Result<VacationStatus> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, VacationStatusEnum, 'status' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new VacationStatus( value as VacationStatusEnum ) );
    }

    isPending(): boolean {
        return this.value === VacationStatusEnum.Pending;
    }

    isApproved(): boolean {
        return this.value === VacationStatusEnum.Approved;
    }

    isDeclined(): boolean {
        return this.value === VacationStatusEnum.Declined;
    }

    isCanceled(): boolean {
        return this.value === VacationStatusEnum.Canceled;
    }

    getValue(): VacationStatusEnum {
        return this.value;
    }

    equals(to: VacationStatus): boolean {
        return this.value === to.getValue();
    }
}
