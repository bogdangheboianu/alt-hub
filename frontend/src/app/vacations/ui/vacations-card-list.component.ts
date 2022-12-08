import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserDto } from '@dtos/user-dto';
import { VacationDto } from '@dtos/vacation-dto';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { ButtonModule } from '@shared/ui/button/button.module';
import { LinkButtonComponent } from '@shared/ui/button/link-button.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { UserPipesModule } from '@users/pipes/user-pipes.module';
import { VacationPipesModule } from '@vacations/pipes/vacation-pipes.module';
import { VacationIconComponent } from '@vacations/ui/vacation-icon.component';

@Component( {
                standalone     : true,
                selector       : 'app-vacations-card-list',
                template       : `
                    <div *ngIf="vacations.length > 0" class="w-100">
                        <div class="mb-3">
                            <app-section-title
                                [title]="title"
                                [icon]="icon"></app-section-title>
                        </div>
                        <div [class]="horizontalScroll ? 'd-flex align-items-center justify-content-start w-100' : 'row w-100'"
                             [style]="horizontalScroll ? 'overflow-x: auto' : ''">
                            <div [class]="horizontalScroll ? '' : 'col-2'" *ngFor="let vacation of vacations">
                                <div class="vacation-list-item shadow-sm"
                                     [style]="horizontalScroll ? 'margin-right: 20px' : 'margin-bottom: 20px'"
                                     [class.no-edit]="editDisabled"
                                     [matTooltip]="(vacation.type | startCase) + ' | ' + vacation.workingDays + ' working days'"
                                     (click)="editButtonClicked(vacation)">
                                    <div class="vacation-working-days-badge">{{ vacation.workingDays }}</div>
                                    <app-vacation-icon [vacationType]="vacation.type"></app-vacation-icon>
                                    <div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 60px">
                                        <span style="font-size: 11px">{{ vacation.fromDate | readableDate }}</span>
                                        <mat-icon *ngIf="vacation | vacationHasDateInterval" style="font-size: 17px; height: 17px">arrow_circle_down</mat-icon>
                                        <span *ngIf="vacation | vacationHasDateInterval" style="font-size: 11px">{{ vacation.toDate | readableDate }}</span>
                                    </div>
                                    <app-link-button
                                        appButton
                                        *ngIf="showUsers"
                                        [label]="vacation.annualEmployeeSheet.user | userFullName"
                                        (onClick)="userClicked(vacation.annualEmployeeSheet.user)"></app-link-button>
                                </div>
                            </div>
                        </div>
                    </div>

                `,
                styles         : [
                    `:host ::ng-deep {
                        .mat-list-base {
                            padding: 0 !important;
                        }

                        .mat-list-item {
                            height: auto !important;
                        }

                        .mat-list-item-content {
                            padding: 0 !important;
                        }

                        .vacation-list-item {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 10px;
                            border: solid 0.5px lightgray;
                            border-radius: 5px;
                            cursor: pointer;
                            position: relative;
                            min-height: 135px;

                            &.no-edit {
                                cursor: initial;
                            }
                        }

                        .vacation-working-days-badge {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 35px;
                            height: 35px;
                            line-height: 35px;
                            background: #f48fb1;
                            color: rgba(0, 0, 0, 0.87);
                            text-align: center;
                            display: inline-block;
                            border-radius: 50%;
                            transition: transform 200ms ease-in-out;
                            transform: scale(0.6);
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            pointer-events: none;
                            font-weight: 600;
                            font-size: 22px;
                            font-family: Roboto, "Helvetica Neue", sans-serif;
                        }

                        .mat-button .mat-button-wrapper > *, .mat-flat-button .mat-button-wrapper > *, .mat-stroked-button .mat-button-wrapper > *, .mat-raised-button .mat-button-wrapper > *, .mat-icon-button .mat-button-wrapper > *, .mat-fab .mat-button-wrapper > *, .mat-mini-fab .mat-button-wrapper > * {
                            font-size: 11px !important;
                        }

                        button.mat-raised-button, button.mat-stroked-button, button.mat-flat-button, button.mat-button, button.mat-button-toggle-button, span.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
                            line-height: 11px !important;
                        }
                    }
                    `
                ],
                imports        : [
                    CommonModule,
                    SectionTitleComponent,
                    MatTooltipModule,
                    SharedPipesModule,
                    VacationIconComponent,
                    MatIconModule,
                    VacationPipesModule,
                    LinkButtonComponent,
                    ButtonModule,
                    UserPipesModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class VacationsCardListComponent {
    @Input()
    vacations!: VacationDto[];

    @Input()
    title!: string;

    @Input()
    icon!: string;

    @Input()
    editDisabled = true;

    @Input()
    showUsers = false;

    @Input()
    horizontalScroll = false;

    @Output()
    onEditButtonClick = new EventEmitter<VacationDto>();

    @Output()
    onUserClick = new EventEmitter<UserDto>();

    editButtonClicked(vacation: VacationDto): void {
        if( this.editDisabled ) {
            return;
        }

        this.onEditButtonClick.emit( vacation );
    }

    userClicked(user: UserDto): void {
        this.onUserClick.emit( user );
    }
}
