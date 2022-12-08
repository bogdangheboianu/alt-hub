import { CurrencyEnum } from '@shared/enums/currency.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IMoney } from '@shared/interfaces/money/money.interface';
import { Result } from '@shared/models/generics/result';
import { Currency } from '@shared/models/money/currency';
import { MoneyAmount } from '@shared/models/money/money-amount';

export class Money {
    amount: MoneyAmount;
    currency: Currency;

    private constructor(amount: MoneyAmount, currency: Currency) {
        this.amount = amount;
        this.currency = currency;
    }

    static create(amount: number, currency: CurrencyEnum | string, fromDb: boolean, amountPropertyName: string = 'amount', currencyPropertyName: string = 'currency'): Result<Money> {
        const data = Result.aggregateObjects<any>(
            { amount: MoneyAmount.create( amount, fromDb, amountPropertyName ) },
            { currency: Currency.create( currency, currencyPropertyName ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new Money( data.value!.amount, data.value!.currency ) );
    }

    getValue(): IMoney {
        return { amount: this.amount.getValue(), currency: this.currency.getValue() };
    }

    equals(to: Money): boolean {
        return this.amount.equals( to.amount ) && this.currency.equals( to.currency );
    }
}
