import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectDto } from '@dtos/project-dto';
import { ProjectStatusEnum } from '@dtos/project-status-enum';
import { UpdateProjectTimelineDto } from '@dtos/update-project-timeline-dto';
import { ProjectSuccessMessage } from '@projects/config/project.constants';
import { ProjectTimelineUpdateFormModalData } from '@projects/config/project.interfaces';
import { ProjectTimelineField } from '@projects/config/project.types';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { ProjectTimelineDataService } from '@projects/features/project-timeline/project-timeline-data.service';
import { ProjectTimelineDateComponent } from '@projects/ui/project-timeline-date.component';
import { ProjectTimelineUpdateFormComponent } from '@projects/ui/project-timeline-update-form.component';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { valueIsEmpty, valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ModalService } from '@shared/features/modal/modal.service';
import { ContainerComponent } from '@shared/ui/container.component';
import * as dayjs from 'dayjs';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-project-timeline',
                template       : `
                    <app-container *ngIf="(dataService.data$ | async)! as data" height="115px">
                        <div *ngIf="data.entity as project" class="row">
                            <div class="col-2 d-flex flex-column justify-content-center align-items-center">
                                <app-project-timeline-date type="startDate"
                                                           [date]="project.timeline.startDate"
                                                           [clickable]="(dataService.projectTimelineIsUpdatable() | async)!"
                                                           (onClick)="openProjectTimelineForm('startDate')"></app-project-timeline-date>
                            </div>
                            <div class="col-6 d-flex flex-column justify-content-center align-items-center">
                                <mat-progress-bar mode="determinate"
                                                  [value]="completionPercentage"
                                                  [class.completed]="completionPercentage === 100"
                                                  [class.overdue]="overdue"></mat-progress-bar>
                            </div>
                            <div class="col-2 d-flex flex-column justify-content-center align-items-center">
                                <app-project-timeline-date type="endDate"
                                                           [date]="project.timeline.endDate"
                                                           [clickable]="(dataService.projectTimelineIsUpdatable() | async)!"
                                                           (onClick)="openProjectTimelineForm('endDate')"></app-project-timeline-date>
                            </div>
                            <div class="col-2 d-flex flex-column justify-content-center align-items-center">
                                <app-project-timeline-date type="deadline"
                                                           [date]="project.timeline.deadline"
                                                           [clickable]="(dataService.projectTimelineIsUpdatable() | async)!"
                                                           (onClick)="openProjectTimelineForm('deadline')"></app-project-timeline-date>
                            </div>
                        </div>
                    </app-container>
                `,
                styles         : [
                    `
                        :host {
                            width: 100%;
                        }

                        :host ::ng-deep {
                            .mat-progress-bar .completed > .mat-progress-bar-fill::after {
                                background-color: #00bd97 !important;
                            }

                            .mat-progress-bar .overdue > .mat-progress-bar-fill::after {
                                background-color: #f44336 !important;
                            }
                        }

                    `
                ],
                providers      : [ ProjectTimelineDataService ],
                imports        : [
                    ProjectTimelineDateComponent,
                    MatProgressBarModule,
                    CommonModule,
                    ProjectDataModule,
                    ProjectTimelineUpdateFormComponent,
                    ContainerComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectTimelineComponent implements OnInit {
    completionPercentage = 0;
    overdue = false;

    constructor(
        public readonly dataService: ProjectTimelineDataService,
        private readonly modalService: ModalService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
        this.setData();
    }

    setData(): void {
        this.dataService.entity$.subscribe( project => {
            this.completionPercentage = this.determineCompletionPercentage( project );
            this.overdue = this.isOverdue( project );
        } );
    }

    updateProjectTimeline(data: UpdateProjectTimelineDto): void {
        this.dataService.updateProjectTimeline( data );
        this.onProjectTimelineUpdateSuccess();
    }

    openProjectTimelineForm(timelineField: ProjectTimelineField): void {
        this.dataService.entity
            .then( async (project: ProjectDto) =>
                       this.modalService.openSmModal<ProjectTimelineUpdateFormModalData>( ProjectTimelineUpdateFormComponent, this, {
                           initialValues: project.timeline,
                           focusOnInput : timelineField,
                           loading$     : this.dataService.source!.loading,
                           onSubmit     : this.updateProjectTimeline.bind( this ),
                           onCancel     : this.closeProjectTimelineUpdateModal.bind( this )
                       }, { autoFocus: false } ) );
    }

    private onProjectTimelineUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( ProjectSuccessMessage.TimelineUpdated );
            this.closeProjectTimelineUpdateModal();
        } );
    }

    private closeProjectTimelineUpdateModal(): void {
        this.modalService.close( ProjectTimelineUpdateFormComponent );
    }

    private determineCompletionPercentage(project: ProjectDto): number {
        const { status, startDate, endDate, deadline } = project.timeline;

        if( status === ProjectStatusEnum.Draft || status === ProjectStatusEnum.Canceled ) {
            return 0;
        }

        if( status === ProjectStatusEnum.Completed || status === ProjectStatusEnum.Maintenance ) {
            return 100;
        }

        if( valueIsEmpty( startDate ) ) {
            return 0;
        }

        if( valueIsEmpty( endDate ) && valueIsEmpty( deadline ) ) {
            return 0;
        }

        const toDate = valueIsNotEmpty( endDate )
                       ? endDate
                       : deadline;
        const totalDays = dayjs( toDate )
            .diff( startDate, 'days' );
        const daysPassed = dayjs()
            .diff( startDate, 'days' );

        return Math.round( daysPassed / totalDays * 100 );
    }

    private isOverdue(project: ProjectDto): boolean {
        return this.completionPercentage !== 100
            && valueIsNotEmpty( project.timeline.deadline )
            && dayjs( project.timeline.deadline )
                .isBefore( dayjs() );
    }
}
