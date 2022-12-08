import { CurrencyEnum } from '@shared/enums/currency.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IOptionalMoney } from '@shared/interfaces/money/money.interface';
import { Result } from '@shared/models/generics/result';
import { Currency } from '@shared/models/money/currency';
import { MoneyAmount } from '@shared/models/money/money-amount';

export class OptionalMoney {
    amount: MoneyAmount | null;
    currency: Currency | null;

    private constructor(amount?: MoneyAmount, currency?: Currency) {
        this.amount = amount ?? null;
        this.currency = currency ?? null;
    }

    static empty(): OptionalMoney {
        return new OptionalMoney();
    }

    static create(amount: number | null | undefined, currency: CurrencyEnum | string | null | undefined, fromDb: boolean, amountPropertyName: string = 'amount', currencyPropertyName: string = 'currency'): Result<OptionalMoney> {
        if( valueIsEmpty( amount ) || valueIsEmpty( currency ) ) {
            return Success( this.empty() );
        }

        const data = Result.aggregateObjects<any>(
            { amount: MoneyAmount.create( amount, fromDb, amountPropertyName ) },
            { currency: Currency.create( currency, currencyPropertyName ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new OptionalMoney( data.value!.amount, data.value!.currency ) );
    }

    getValue(): IOptionalMoney {
        return { amount: this.amount?.getValue() ?? null, currency: this.currency?.getValue() ?? null };
    }

    equals(to: OptionalMoney): boolean {
        return valueIsNotEmpty( this.amount ) && valueIsNotEmpty( this.currency ) && valueIsNotEmpty( to.amount ) && valueIsNotEmpty( to.currency )
               ? this.amount.equals( to.amount ) && this.currency.equals( to.currency )
               : false;
    }

    isSet(): boolean {
        return valueIsNotEmpty( this.amount ) && valueIsNotEmpty( this.currency );
    }

    update(amount: number | null | undefined, currency: CurrencyEnum | string | null | undefined, fromDb: boolean, amountPropertyName: string = 'amount', currencyPropertyName: string = 'currency'): Result<OptionalMoney> {
        return OptionalMoney.create( amount, currency, fromDb, amountPropertyName, currencyPropertyName );
    }
}
