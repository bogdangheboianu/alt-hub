import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { CurrencyEnum } from '@shared/enums/currency.enum';
import { Column } from 'typeorm';

export class MoneyEntity {
    @Column( { type: ColTypesEnum.Int, nullable: false } )
    amount!: number;

    @Column( { type: ColTypesEnum.Enum, enum: CurrencyEnum, nullable: false, enumName: 'currency_enum' } )
    currency!: CurrencyEnum;
}

export class OptionalMoneyEntity {
    @Column( { type: ColTypesEnum.Int, nullable: true } )
    amount: number | null = null;

    @Column( { type: ColTypesEnum.Enum, enum: CurrencyEnum, nullable: true, enumName: 'currency_enum' } )
    currency: CurrencyEnum | null = null;
}
