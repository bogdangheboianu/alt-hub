import { CurrencyEnum } from '@shared/enums/currency.enum';

export interface IMoney {
    amount: number;
    currency: CurrencyEnum;
}

export interface IOptionalMoney {
    amount: number | null;
    currency: CurrencyEnum | null;
}
