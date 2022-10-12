import { ProjectStatusGroupEnum } from '@projects/enums/project-status-group.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class ProjectStatusGroup implements IValueObject<ProjectStatusGroup, ProjectStatusGroupEnum> {
    private readonly value: ProjectStatusGroupEnum;

    private constructor(value: ProjectStatusGroupEnum) {
        this.value = value;
    }

    static create(value: string | ProjectStatusGroupEnum): Result<ProjectStatusGroup> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, ProjectStatusGroupEnum, 'statusGroup' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new ProjectStatusGroup( value as ProjectStatusGroupEnum ) );
    }

    getValue(): ProjectStatusGroupEnum {
        return this.value;
    }

    equals(to: ProjectStatusGroup): boolean {
        return this.value === to.getValue();
    }
}
