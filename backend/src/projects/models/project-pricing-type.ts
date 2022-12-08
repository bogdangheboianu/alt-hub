import { ProjectPricingTypeEnum } from '@projects/enums/project-pricing-type.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class ProjectPricingType implements IValueObject<ProjectPricingType, ProjectPricingTypeEnum | null> {
    private readonly value: ProjectPricingTypeEnum | null;

    private constructor(value?: ProjectPricingTypeEnum) {
        this.value = value ?? null;
    }

    static empty(): ProjectPricingType {
        return new ProjectPricingType();
    }

    static fixedPrice(): ProjectPricingType {
        return new ProjectPricingType( ProjectPricingTypeEnum.FixedPrice );
    }

    static timeAndMaterial(): ProjectPricingType {
        return new ProjectPricingType( ProjectPricingTypeEnum.TimeAndMaterial );
    }

    static create(value: string | ProjectPricingTypeEnum | null): Result<ProjectPricingType> {
        if( valueIsEmpty( value ) ) {
            return Success( this.empty() );
        }

        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, ProjectPricingTypeEnum, 'type' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new ProjectPricingType( value as ProjectPricingTypeEnum ) );
    }

    getValue(): ProjectPricingTypeEnum | null {
        return this.value;
    }

    equals(to: ProjectPricingType): boolean {
        return this.value === to.getValue();
    }

    update(value: string | ProjectPricingTypeEnum | null): Result<ProjectPricingType> {
        return ProjectPricingType.create( value );
    }

    isFixedPrice(): boolean {
        return this.value === ProjectPricingTypeEnum.FixedPrice;
    }

    isTimeAndMaterial(): boolean {
        return this.value === ProjectPricingTypeEnum.TimeAndMaterial;
    }
}
