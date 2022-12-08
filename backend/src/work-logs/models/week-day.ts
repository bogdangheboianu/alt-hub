import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export class WeekDay implements IValueObject<WeekDay, WeekDayEnum> {
    private readonly value: WeekDayEnum;

    private constructor(value: WeekDayEnum) {
        this.value = value;
    }

    static create(value: number | WeekDayEnum): Result<WeekDay> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, WeekDayEnum, 'weekDay' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new WeekDay( value as WeekDayEnum ) );
    }

    update(value: number | WeekDayEnum): Result<WeekDay> {
        return WeekDay.create( value );
    }

    getValue(): WeekDayEnum {
        return this.value;
    }

    equals(to: WeekDay): boolean {
        return this.value === to.getValue();
    }
}
