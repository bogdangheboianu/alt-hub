import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IsAdminModule } from '@auth/directives/is-admin/is-admin.module';
import { isDefined } from '@datorama/akita';
import { ProjectTimelineField } from '@projects/config/project.types';
import * as dayjs from 'dayjs';

@Component( {
                standalone     : true,
                selector       : 'app-project-timeline-date',
                template       : `
                    <div *ngIf="date; else noDate"
                         class="project-timeline-date-container"
                         matTooltipPosition="below"
                         [class.no-click]="!clickable"
                         [matTooltip]="clickable ? 'Click to edit' : ''"
                         (click)="handleClick()">
                        <span class="formatted-type-text">{{ formattedType }}</span>
                        <span class="day-text">{{ day }}</span>
                        <span class="month-text">{{ month }}</span>
                        <!--  <span class="year-text">{{ year }}</span>-->
                    </div>
                    <ng-template #noDate>
                        <div class="project-timeline-date-container no-date"
                             matTooltipPosition="below"
                             [class.no-click]="!clickable"
                             [matTooltip]="clickable ? 'Click to set' : ''"
                             (click)="handleClick()">
                            <mat-icon class="add-icon" *isAdmin>add</mat-icon>
                            <span class="no-date-text">{{ noDateText }}</span>
                        </div>
                    </ng-template>
                `,
                styles         : [
                    `
                        :host {
                            width: 100%;
                        }

                        .project-timeline-date-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 10px;
                            margin: 0;
                            border-radius: 5px;
                            width: 100%;
                            height: 80px;
                            background: #cedaff;
                            color: #3F51B5;
                            cursor: pointer;
                        }

                        .project-timeline-date-container.no-click {
                            cursor: initial;
                        }

                        .project-timeline-date-container.no-date {
                            background: none;
                            color: #3F51B5;
                            border: 0.1px #3F51B5 solid;
                        }

                        .day-text {
                            font-weight: bold;
                            font-size: 30px;
                            margin-bottom: 5px;
                        }

                        .month-text {
                            font-size: 20px;
                        }

                        .formatted-type-text {
                            font-size: 10px;
                            margin-bottom: 3px;
                        }

                        .add-icon {
                            font-size: 30px;
                            height: 30px;
                            width: 30px;
                        }

                        .no-date-text {
                            font-size: 10px;
                            font-style: italic;
                            text-align: center;
                            line-height: 10px;
                        }

                    `
                ],
                imports        : [
                    CommonModule,
                    MatTooltipModule,
                    MatIconModule,
                    IsAdminModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ProjectTimelineDateComponent implements OnInit {
    @Input()
    set date(value: Date | string | null) {
        this._date = value;
        this.setData();
    }

    get date(): Date | string | null {
        return this._date;
    }

    @Input()
    type!: ProjectTimelineField;

    @Input()
    clickable!: boolean;

    @Output()
    onClick = new EventEmitter<void>();

    day?: string;
    month?: string;
    year?: string;
    formattedType = '';
    noDateText = '';
    private _date!: Date | string | null;

    ngOnInit(): void {
        this.setData();
        this.formattedType = this.getFormattedType();
    }

    handleClick(): void {
        if( this.clickable ) {
            this.onClick.emit();
        }
    }

    private setData(): void {
        if( isDefined( this._date ) ) {
            this.day = this.getDay();
            this.month = this.getMonth();
            this.year = this.getYear();
        } else {
            this.noDateText = this.getNoDateText();
        }
    }

    private getDay(): string {
        return dayjs()
            .date( dayjs( this._date! )
                       .date() )
            .format( 'DD' );
    }

    private getMonth(): string {
        return dayjs()
            .month( dayjs( this._date! )
                        .month() )
            .format( 'MMM' );
    }

    private getYear(): string {
        return dayjs()
            .year( dayjs( this._date! )
                       .year() )
            .format( 'YYYY' );
    }

    private getFormattedType(): string {
        switch( this.type ) {
            case 'startDate':
                return 'Start date';
            case 'endDate':
                return 'End date';
            case 'deadline':
                return 'Deadline';
        }
    }

    private getNoDateText(): string {
        return `No ${ this.getFormattedType()
                          .toLowerCase() } set`;

    }
}
