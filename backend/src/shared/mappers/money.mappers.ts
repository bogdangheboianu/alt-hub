import { MoneyDto } from '@shared/dtos/money.dto';
import { OptionalMoneyDto } from '@shared/dtos/optional-money.dto';
import { Money } from '@shared/models/money/money';
import { OptionalMoney } from '@shared/models/money/optional-money';

export const modelToMoneyDto = (model: Money): MoneyDto => (
    {
        amount  : model.amount.getValue(),
        currency: model.currency.getValue()
    }
);

export const modelToOptionalMoneyDto = (model: OptionalMoney): OptionalMoneyDto => (
    {
        amount  : model.amount?.getValue() ?? null,
        currency: model.currency?.getValue() ?? null
    }
);
