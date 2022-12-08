import { ProjectPricingTypeEnum } from '@projects/enums/project-pricing-type.enum';
import { OptionalMoneyEntity } from '@shared/entities/money.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column } from 'typeorm';

export class ProjectPricingEntity {
    @Column( { type: ColTypesEnum.Enum, enum: ProjectPricingTypeEnum, nullable: true } )
    type!: ProjectPricingTypeEnum | null;

    @Column( () => OptionalMoneyEntity )
    hourlyRate!: OptionalMoneyEntity | null;

    @Column( () => OptionalMoneyEntity )
    fixedPrice!: OptionalMoneyEntity | null;
}
