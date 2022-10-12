import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CreateProjectTimelineDto } from '@dtos/create-project-timeline.dto';
import { ProjectSelectors } from '@project/store/project.selectors';
import { ProjectStore } from '@project/store/project.store';
import { BaseForm } from '@shared/directives/base-form.directive';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-create-project-timeline-form',
                templateUrl: './create-project-timeline-form.component.html',
                styleUrls  : [ './create-project-timeline-form.component.scss' ]
            } )
@UntilDestroy()
export class CreateProjectTimelineFormComponent extends BaseForm<CreateProjectTimelineDto> implements OnInit {
    form!: FormGroupTyped<CreateProjectTimelineDto>;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly projectStore: ProjectStore,
        private readonly projectSelectors: ProjectSelectors
    ) {
        super( projectSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.form = this.buildForm();
    }

    protected buildForm(): FormGroupTyped<CreateProjectTimelineDto> {
        const fields: FormFields<CreateProjectTimelineDto> = {
            startDate: [ this.initialValues?.startDate ?? null ],
            endDate  : [ this.initialValues?.endDate ?? null ],
            deadline : [ this.initialValues?.deadline ?? null ]
        };
        return this.formBuilder.nonNullable.group<CreateProjectTimelineDto>( fields );
    }

    protected onSubmit(): void {
        this.projectStore.setNewProjectTimeline( this.form.getRawValue() );
    }
}
