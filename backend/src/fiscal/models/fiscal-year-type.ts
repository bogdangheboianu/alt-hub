import { FiscalYearTypeEnum } from '@fiscal/enums/fiscal-year-type.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class FiscalYearType implements IValueObject<FiscalYearType, FiscalYearTypeEnum> {
    private readonly value: FiscalYearTypeEnum;

    private constructor(value: FiscalYearTypeEnum) {
        this.value = value;
    }

    static CalendarYear(): FiscalYearType {
        return new FiscalYearType( FiscalYearTypeEnum.CalendarYear );
    }

    static CustomYear(): FiscalYearType {
        return new FiscalYearType( FiscalYearTypeEnum.CustomYear );
    }

    static create(value: string | FiscalYearTypeEnum): Result<FiscalYearType> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, FiscalYearTypeEnum, 'type' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new FiscalYearType( value as FiscalYearTypeEnum ) );
    }

    getValue(): FiscalYearTypeEnum {
        return this.value;
    }

    equals(to: FiscalYearType): boolean {
        return this.value === to.getValue();
    }
}
