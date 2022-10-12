import { Component, Input, OnInit } from '@angular/core';
import { ProjectStatusEnum } from '@dtos/project-status.enum';

@Component( {
                selector   : 'app-project-status-label',
                templateUrl: './project-status-label.component.html',
                styleUrls  : [ './project-status-label.component.scss' ]
            } )
export class ProjectStatusLabelComponent implements OnInit {
    @Input() status!: ProjectStatusEnum;

    text = '';
    isInProgress = false;
    isOnHold = false;
    isMaintenance = false;
    isCompleted = false;
    isCanceled = false;

    constructor() {
    }

    ngOnInit(): void {
        this.text = this.getText();
        this.isInProgress = this.status === ProjectStatusEnum.InProgress;
        this.isOnHold = this.status === ProjectStatusEnum.OnHold;
        this.isMaintenance = this.status === ProjectStatusEnum.Maintenance;
        this.isCompleted = this.status === ProjectStatusEnum.Completed;
        this.isCanceled = this.status === ProjectStatusEnum.Canceled;
    }

    private getText(): string {
        return this.status.replace( this.status[0], this.status[0].toUpperCase() )
                   .split( '_' )
                   .join( ' ' );
    }
}
