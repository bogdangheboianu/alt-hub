import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectDto } from '@dtos/project-dto';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence-dto';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { ButtonModule } from '@shared/ui/button/button.module';
import { EditButtonComponent } from '@shared/ui/button/edit-button.component';
import { LinkButtonComponent } from '@shared/ui/button/link-button.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { WorkLogPipesModule } from '@work-logs/pipes/work-log-pipes.module';

export type WorkLogRecurrenceToggleStatusEvent = { id: string, active: boolean };

@Component( {
                standalone     : true,
                selector       : 'app-work-log-recurrence-list-table',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <table mat-table [dataSource]="workLogRecurrences" class="darker-header">
                        <ng-container matColumnDef="status">
                            <th mat-header-cell *matHeaderCellDef></th>
                            <td mat-cell *matCellDef="let recurrence">
                                <mat-slide-toggle color="accent"
                                                  [checked]="recurrence.active"
                                                  [matTooltip]="recurrence.active ? 'Active' : 'Inactive'"
                                                  (change)="statusSlideToggleClicked(recurrence.id, $event)"></mat-slide-toggle>
                            </td>
                        </ng-container>
                        <ng-container matColumnDef="project">
                            <th mat-header-cell *matHeaderCellDef> Project</th>
                            <td mat-cell *matCellDef="let recurrence">
                                <app-link-button
                                    appButton
                                    [label]="recurrence | workLogRecurrenceProjectName"
                                    (onClick)="projectClicked(recurrence['project'])"></app-link-button>
                            </td>
                        </ng-container>
                        <ng-container matColumnDef="minutesLogged">
                            <th mat-header-cell *matHeaderCellDef> Time to log</th>
                            <td mat-cell *matCellDef="let recurrence"> {{ recurrence['minutesLogged'] | minutesToReadableTime }} </td>
                        </ng-container>
                        <ng-container matColumnDef="weekDays">
                            <th mat-header-cell *matHeaderCellDef> Repeats</th>
                            <td mat-cell *matCellDef="let recurrence"> {{ recurrence['weekDays'] | readableWeekDays }} </td>
                        </ng-container>
                        <ng-container matColumnDef="createdAt">
                            <th mat-header-cell *matHeaderCellDef> Created on</th>
                            <td mat-cell *matCellDef="let recurrence"> {{ recurrence['audit']['createdAt'] | readableDate }} </td>
                        </ng-container>
                        <ng-container matColumnDef="actions">
                            <th mat-header-cell *matHeaderCellDef></th>
                            <td mat-cell *matCellDef="let recurrence" class="text-end">
                                <div class="d-flex align-items-center justify-content-end">
                                    <app-edit-button
                                        appButton
                                        [iconOnly]="true"
                                        (onClick)="editButtonClicked(recurrence)"></app-edit-button>
                                </div>
                            </td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="columns"></tr>
                        <tr mat-row *matRowDef="let recurrence; columns: columns;"></tr>
                    </table>
                `,
                styles         : [
                    `table {
                        width: 100%;
                    }

                    .project-button {
                        padding: 0 !important;
                        text-align: left !important;
                        transition: none !important;
                    }

                    .project-button:hover {
                        text-decoration: underline !important;
                    }

                    :host ::ng-deep {
                        .mat-button:hover:not(.mat-button-disabled) .mat-button-focus-overlay,
                        .mat-button:focus:not(.mat-button-disabled) .mat-button-focus-overlay {
                            opacity: 1 !important;
                            background: none !important;
                            text-decoration: underline !important;
                            transition: none !important;
                        }

                        .mat-button-focus-overlay {
                            transition: none !important;
                        }
                    }
                    `
                ],
                imports        : [
                    CommonModule,
                    MatTableModule,
                    MatSlideToggleModule,
                    MatTooltipModule,
                    LinkButtonComponent,
                    ButtonModule,
                    WorkLogPipesModule,
                    SharedPipesModule,
                    EditButtonComponent,
                    LoadingBarComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class WorkLogRecurrenceListTableComponent {
    @Input()
    workLogRecurrences!: WorkLogRecurrenceDto[];

    @Input()
    loading!: boolean;

    @Output()
    onEditButtonClick = new EventEmitter<WorkLogRecurrenceDto>();

    @Output()
    onToggleStatusClick = new EventEmitter<WorkLogRecurrenceToggleStatusEvent>();

    @Output()
    onProjectClick = new EventEmitter<ProjectDto>();

    columns: string[] = [
        'status',
        'project',
        'minutesLogged',
        'weekDays',
        'createdAt',
        'actions'
    ];

    projectClicked(project: ProjectDto): void {
        this.onProjectClick.emit( project );
    }

    editButtonClicked(recurrence: WorkLogRecurrenceDto): void {
        this.onEditButtonClick.emit( recurrence );
    }

    statusSlideToggleClicked(id: string, event: MatSlideToggleChange): void {
        this.onToggleStatusClick.emit( { id, active: event.checked } );
    }
}
