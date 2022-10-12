import { Component, ViewChild } from '@angular/core';
import { CreateProjectInfoDto } from '@dtos/create-project-info.dto';
import { CreateProjectInfoFormComponent } from '@project/components/create-project-info-form/create-project-info-form.component';
import { ProjectSelectors } from '@project/store/project.selectors';
import { BaseStepContent } from '@shared/directives/base-step-content.directive';

@Component( {
                selector   : 'app-create-project-info-step',
                templateUrl: './create-project-info-step.component.html',
                styleUrls  : [ './create-project-info-step.component.scss' ]
            } )
export class CreateProjectInfoStepComponent extends BaseStepContent<CreateProjectInfoDto> {
    @ViewChild( CreateProjectInfoFormComponent )
    override form!: CreateProjectInfoFormComponent;

    override nextStepDisabled = false;
    override previousStepDisabled = true;
    override isLastStep = false;

    constructor(
        private projectSelectors: ProjectSelectors
    ) {
        super( projectSelectors.selectNewProjectInfo.bind( projectSelectors ) );
    }
}
