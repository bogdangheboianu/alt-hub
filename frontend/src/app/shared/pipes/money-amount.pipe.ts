import { Pipe, PipeTransform } from '@angular/core';
import { MoneyDto } from '@dtos/money-dto';
import { OptionalMoneyDto } from '@dtos/optional-money-dto';
import { formatMoneyAmount } from '@shared/config/functions/money.functions';

@Pipe( { name: 'moneyAmount', pure: true } )
export class MoneyAmountPipe implements PipeTransform {
    transform(value: MoneyDto | OptionalMoneyDto | null): string {
        return formatMoneyAmount( value );
    }

}
