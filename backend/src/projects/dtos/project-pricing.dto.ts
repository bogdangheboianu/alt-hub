import { ApiProperty } from '@nestjs/swagger';
import { ProjectPricingTypeEnum } from '@projects/enums/project-pricing-type.enum';
import { OptionalMoneyDto } from '@shared/dtos/optional-money.dto';

export class ProjectPricingDto {
    @ApiProperty( { type: 'enum', enum: ProjectPricingTypeEnum } )
    type!: ProjectPricingTypeEnum | null;
    hourlyRate!: OptionalMoneyDto;
    fixedPrice!: OptionalMoneyDto;
}
