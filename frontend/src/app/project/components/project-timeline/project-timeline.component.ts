import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectTimelineDto } from '@dtos/project-timeline.dto';
import { UpdateProjectTimelineFormComponent } from '@project/components/update-project-timeline-form/update-project-timeline-form.component';
import { IUpdateProjectTimelineFormInputData } from '@project/interfaces/update-project-timeline-form-input-data.interface';

@Component( {
                selector   : 'app-project-timeline',
                templateUrl: './project-timeline.component.html',
                styleUrls  : [ './project-timeline.component.scss' ]
            } )
export class ProjectTimelineComponent implements OnInit {
    @Input()
    projectId!: string;

    @Input()
    timeline!: ProjectTimelineDto;

    completionPercentage = 0;

    constructor(
        private readonly dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.completionPercentage = this.determineCompletionPercentage();
    }

    openProjectTimelineForm(): void {
        this.dialog.open( UpdateProjectTimelineFormComponent, {
            data : {
                projectId    : this.projectId,
                initialValues: this.timeline
            } as IUpdateProjectTimelineFormInputData,
            width: '500px'
        } );
    }

    private determineCompletionPercentage(): number {
        return 100;
    }
}
