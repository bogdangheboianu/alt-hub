import { Component, ViewChild } from '@angular/core';
import { CreateProjectTimelineDto } from '@dtos/create-project-timeline.dto';
import { CreateProjectTimelineFormComponent } from '@project/components/create-project-timeline-form/create-project-timeline-form.component';
import { ProjectSelectors } from '@project/store/project.selectors';
import { BaseStepContent } from '@shared/directives/base-step-content.directive';

@Component( {
                selector   : 'app-create-project-timeline-step',
                templateUrl: './create-project-timeline-step.component.html',
                styleUrls  : [ './create-project-timeline-step.component.scss' ]
            } )
export class CreateProjectTimelineStepComponent extends BaseStepContent<CreateProjectTimelineDto> {
    @ViewChild( CreateProjectTimelineFormComponent )
    override form!: CreateProjectTimelineFormComponent;

    override nextStepDisabled = false;
    override previousStepDisabled = false;
    override isLastStep = false;

    constructor(
        private projectSelectors: ProjectSelectors
    ) {
        super( projectSelectors.selectNewProjectTimeline.bind( projectSelectors ) );
    }
}
