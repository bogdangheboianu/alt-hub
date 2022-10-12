import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectStepperComponent } from '@project/components/create-project-stepper/create-project-stepper.component';
import { ProjectActions } from '@project/store/project.actions';

@Component( {
                selector   : 'app-project-list-page',
                templateUrl: './project-list-page.component.html',
                styleUrls  : [ './project-list-page.component.scss' ]
            } )
export class ProjectListPageComponent implements OnInit {
    constructor(
        private dialog: MatDialog,
        private projectActions: ProjectActions
    ) {
    }

    ngOnInit(): void {
        this.projectActions.loadAllProjects();
    }

    openCreateProjectDialog(): void {
        this.dialog.open( CreateProjectStepperComponent, { width: '80%' } );
    }
}
