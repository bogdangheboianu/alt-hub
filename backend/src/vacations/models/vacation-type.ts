import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { VacationTypeEnum } from '@vacations/enums/vacation-type.enum';

export class VacationType implements IValueObject<VacationType, VacationTypeEnum> {
    private readonly value: VacationTypeEnum;

    private constructor(value: VacationTypeEnum) {
        this.value = value;
    }

    static AnnualLeave(): VacationType {
        return new VacationType( VacationTypeEnum.AnnualLeave );
    }

    static SickLeave(): VacationType {
        return new VacationType( VacationTypeEnum.SickLeave );
    }

    static UnpaidLeave(): VacationType {
        return new VacationType( VacationTypeEnum.UnpaidLeave );
    }

    static create(value: string | VacationTypeEnum): Result<VacationType> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, VacationTypeEnum, 'type' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new VacationType( value as VacationTypeEnum ) );
    }

    isAnnualLeave(): boolean {
        return this.value === VacationTypeEnum.AnnualLeave;
    }

    isUnpaidLeave(): boolean {
        return this.value === VacationTypeEnum.UnpaidLeave;
    }

    getValue(): VacationTypeEnum {
        return this.value;
    }

    equals(to: VacationType): boolean {
        return this.value === to.getValue();
    }
}
