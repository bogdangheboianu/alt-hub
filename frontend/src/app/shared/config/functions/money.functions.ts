import { MoneyDto } from '@dtos/money-dto';
import { OptionalMoneyDto } from '@dtos/optional-money-dto';
import { valueIsEmpty } from '@shared/config/functions/value.functions';

export function formatMoneyAmount(money: MoneyDto | OptionalMoneyDto | null): string {
    if( valueIsEmpty( money?.amount ) ) {
        return '';
    }

    return (
        money!.amount / 100
    ).toFixed( 2 );
}
