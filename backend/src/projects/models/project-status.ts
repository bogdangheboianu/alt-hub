import { GroupedProjectStatuses } from '@projects/constants/project.constants';
import { ProjectStatusEnum } from '@projects/enums/project-status.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class ProjectStatus implements IValueObject<ProjectStatus, ProjectStatusEnum> {
    private readonly value: ProjectStatusEnum;

    private constructor(value: ProjectStatusEnum) {
        this.value = value;
    }

    static draft(): ProjectStatus {
        return new ProjectStatus( ProjectStatusEnum.Draft );
    }

    static inProgress(): ProjectStatus {
        return new ProjectStatus( ProjectStatusEnum.InProgress );
    }

    static onHold(): ProjectStatus {
        return new ProjectStatus( ProjectStatusEnum.OnHold );
    }

    static maintenance(): ProjectStatus {
        return new ProjectStatus( ProjectStatusEnum.Maintenance );
    }

    static canceled(): ProjectStatus {
        return new ProjectStatus( ProjectStatusEnum.Canceled );
    }

    static completed(): ProjectStatus {
        return new ProjectStatus( ProjectStatusEnum.Completed );
    }

    static create(value: string | ProjectStatusEnum): Result<ProjectStatus> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, ProjectStatusEnum, 'status' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new ProjectStatus( value as ProjectStatusEnum ) );
    }

    getValue(): ProjectStatusEnum {
        return this.value;
    }

    equals(to: ProjectStatus): boolean {
        return this.value === to.getValue();
    }

    isActive(): boolean {
        return GroupedProjectStatuses.active.includes( this.value );
    }

    isOngoing(): boolean {
        return GroupedProjectStatuses.ongoing.includes( this.value );
    }

    isEnded(): boolean {
        return GroupedProjectStatuses.ended.includes( this.value );
    }
}
