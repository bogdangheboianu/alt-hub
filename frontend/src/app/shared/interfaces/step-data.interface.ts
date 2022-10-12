import { MatStep } from '@angular/material/stepper';
import { BaseStepContent } from '@shared/directives/base-step-content.directive';

export interface IStepData<FormData> {
    label: string;
    component: MatStep;
    content: BaseStepContent<FormData>;
    editable: boolean;
    optional?: boolean;
    errorMessage?: string;
}
