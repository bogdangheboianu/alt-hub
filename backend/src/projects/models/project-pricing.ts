import { CreateProjectPricingDto } from '@projects/dtos/create-project-pricing.dto';
import { UpdateProjectPricingDto } from '@projects/dtos/update-project-pricing.dto';
import { ProjectPricingEntity } from '@projects/entities/project-pricing.entity';
import { ProjectPricingTypeEnum } from '@projects/enums/project-pricing-type.enum';
import { InvalidProjectPricingException } from '@projects/exceptions/project.exceptions';
import { IProjectPricing } from '@projects/interfaces/project-pricing.interface';
import { ProjectPricingType } from '@projects/models/project-pricing-type';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IPartialModel } from '@shared/interfaces/generics/domain-partial-model.interface';
import { Result } from '@shared/models/generics/result';
import { OptionalMoney } from '@shared/models/money/optional-money';

export class ProjectPricing implements IPartialModel<ProjectPricingEntity> {
    type: ProjectPricingType;
    hourlyRate: OptionalMoney;
    fixedPrice: OptionalMoney;

    constructor(data: IProjectPricing) {
        this.type = data.type ?? ProjectPricingType.empty();
        this.hourlyRate = data.hourlyRate ?? OptionalMoney.empty();
        this.fixedPrice = data.fixedPrice ?? OptionalMoney.empty();
    }

    static create(payload: CreateProjectPricingDto): Result<ProjectPricing> {
        const data = Result.aggregateObjects<IProjectPricing>(
            { type: ProjectPricingType.create( payload.type ) },
            { hourlyRate: OptionalMoney.create( payload.hourlyRate.amount, payload.hourlyRate.currency, false ) },
            { fixedPrice: OptionalMoney.create( payload.fixedPrice.amount, payload.fixedPrice.currency, false ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        const pricing = new ProjectPricing( data.value! );
        const isFixedPriceAndHasHourlyRate = pricing.type.isFixedPrice() && pricing.hourlyRate.isSet();
        const isTimeAndMaterialAndHasFixedPrice = pricing.type.isTimeAndMaterial() && pricing.fixedPrice.isSet();

        if( isFixedPriceAndHasHourlyRate || isTimeAndMaterialAndHasFixedPrice ) {
            return Failed( new InvalidProjectPricingException() );
        }

        return Success( pricing );
    }

    static fromEntity(entity: ProjectPricingEntity): Result<ProjectPricing> {
        const data = Result.aggregateObjects<IProjectPricing>(
            { type: ProjectPricingType.create( entity.type ) },
            { hourlyRate: OptionalMoney.create( entity.hourlyRate?.amount, entity.hourlyRate?.currency, true ) },
            { fixedPrice: OptionalMoney.create( entity.fixedPrice?.amount, entity.fixedPrice?.currency, true ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        const pricing = new ProjectPricing( data.value! );
        const isFixedPriceAndHasHourlyRate = pricing.type.isFixedPrice() && pricing.hourlyRate.isSet();
        const isTimeAndMaterialAndHasFixedPrice = pricing.type.isTimeAndMaterial() && pricing.fixedPrice.isSet();

        if( isFixedPriceAndHasHourlyRate || isTimeAndMaterialAndHasFixedPrice ) {
            return Failed( new InvalidProjectPricingException() );
        }

        return Success( pricing );
    }

    static empty(): ProjectPricing {
        return new ProjectPricing( {} );
    }

    update(payload: UpdateProjectPricingDto): Result<ProjectPricing> {
        const data = Result.aggregateObjects<IProjectPricing>(
            { type: this.type.update( payload.type ) },
            {
                hourlyRate: payload.type === ProjectPricingTypeEnum.TimeAndMaterial
                            ? this.hourlyRate.update( payload.hourlyRate.amount, payload.hourlyRate.currency, false )
                            : OptionalMoney.empty()
            },
            {
                fixedPrice: payload.type === ProjectPricingTypeEnum.FixedPrice
                            ? this.fixedPrice.update( payload.fixedPrice.amount, payload.fixedPrice.currency, false )
                            : OptionalMoney.empty()
            }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        const pricing = new ProjectPricing( data.value! );
        const isFixedPriceAndHasHourlyRate = pricing.type.isFixedPrice() && pricing.hourlyRate.isSet();
        const isTimeAndMaterialAndHasFixedPrice = pricing.type.isTimeAndMaterial() && pricing.fixedPrice.isSet();

        if( isFixedPriceAndHasHourlyRate || isTimeAndMaterialAndHasFixedPrice ) {
            return Failed( new InvalidProjectPricingException() );
        }

        return Success( pricing );
    }

    toEntity(): ProjectPricingEntity {
        return entityFactory( ProjectPricingEntity, {
            type      : this.type.getValue(),
            hourlyRate: this.hourlyRate.getValue(),
            fixedPrice: this.fixedPrice.getValue()
        } );
    }
}
