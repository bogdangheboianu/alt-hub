import { Component, Input } from '@angular/core';
import { CreateProjectDto } from '@dtos/create-project.dto';
import { ProjectSelectors } from '@project/store/project.selectors';
import { BaseStepContent } from '@shared/directives/base-step-content.directive';

@Component( {
                selector   : 'app-create-project-save-step',
                templateUrl: './create-project-save-step.component.html',
                styleUrls  : [ './create-project-save-step.component.scss' ]
            } )
export class CreateProjectSaveStepComponent extends BaseStepContent<CreateProjectDto> {
    @Input()
    override nextStepDisabled!: boolean;

    override form = undefined;
    override previousStepDisabled = false;
    override isLastStep = true;

    constructor(
        private projectSelectors: ProjectSelectors
    ) {
        super( projectSelectors.selectNewProjectData.bind( projectSelectors ) );
    }
}
