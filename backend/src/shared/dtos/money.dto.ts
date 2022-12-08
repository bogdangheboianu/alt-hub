import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '@shared/enums/currency.enum';

export class MoneyDto {
    amount!: number;
    @ApiProperty( { type: 'enum', enum: CurrencyEnum, enumName: 'CurrencyEnum' } )
    currency!: CurrencyEnum;
}
