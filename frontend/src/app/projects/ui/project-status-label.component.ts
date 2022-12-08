import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ProjectStatusEnum } from '@dtos/project-status-enum';

@Component( {
                standalone     : true,
                selector       : 'app-project-status-label',
                template       : `
                    <div class="project-status-label"
                         [class.in-progress]="isInProgress"
                         [class.completed]="isCompleted"
                         [class.on-hold]="isOnHold"
                         [class.maintenance]="isMaintenance"
                         [class.canceled]="isCanceled">{{ text }}</div>
                `,
                styles         : [
                    `.project-status-label {
                        padding: 2px 10px;
                        margin: 0;
                        text-align: center;
                        border-radius: 4px;
                        border: 0.1px lightgray solid;
                        width: auto;
                    }

                    .project-status-label.in-progress {
                        background: #cedaff;
                        color: #3F51B5;
                        opacity: 1;
                        border: none;
                    }

                    .project-status-label.completed {
                        background: #d1f8ef;
                        color: #00bd97;
                        opacity: 1;
                        border: none;
                    }

                    .project-status-label.canceled {
                        background: #f4c8c6;
                        color: #f44336;
                        opacity: 1;
                        border: none;
                    }

                    .project-status-label.on-hold {
                        background: #ffd3e2;
                        color: #ff4081;
                        opacity: 1;
                        border: none;
                    }
                    `
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ProjectStatusLabelComponent implements OnInit {
    @Input()
    set status(value: ProjectStatusEnum) {
        this._status = value;
        this.setData();
    }

    get status(): ProjectStatusEnum {
        return this._status;
    }

    text = '';
    isInProgress = false;
    isOnHold = false;
    isMaintenance = false;
    isCompleted = false;
    isCanceled = false;

    private _status!: ProjectStatusEnum;

    ngOnInit(): void {
        this.setData();
    }

    private setData(): void {
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
