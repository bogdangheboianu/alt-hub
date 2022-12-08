import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '@shared/enums/currency.enum';

export class OptionalMoneyDto {
    amount!: number | null;
    @ApiProperty( { type: 'enum', enum: CurrencyEnum, enumName: 'CurrencyEnum' } )
    currency!: CurrencyEnum | null;
}
