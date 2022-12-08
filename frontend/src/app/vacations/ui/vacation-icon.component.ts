import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VacationTypeEnum } from '@dtos/vacation-type-enum';

@Component( {
                standalone     : true,
                selector       : 'app-vacation-icon',
                template       : `
                    <mat-icon class="vacation-icon"
                              [class.annual]="vacationType === 'annual_leave'"
                              [class.sick]="vacationType === 'sick_leave'"
                              [class.unpaid]="vacationType === 'unpaid_leave'">{{ icon }}</mat-icon>

                `,
                styles         : [
                    `
                        :host ::ng-deep {
                            mat-icon.vacation-icon {
                                font-size: 50px;
                                height: 50px;
                                width: 50px;
                                line-height: 50px;

                                &.annual {
                                    color: #00bd97;
                                }

                                &.sick {
                                    color: #edaa08;
                                }

                                &.unpaid {
                                    color: #f44336;
                                }
                            }
                        }

                    `
                ],
                imports        : [
                    MatIconModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class VacationIconComponent implements OnInit {
    @Input()
    set vacationType(value: VacationTypeEnum) {
        this._vacationType = value;
        switch( value ) {
            case VacationTypeEnum.AnnualLeave:
                this.icon = 'houseboat';
                break;
            case VacationTypeEnum.SickLeave:
                this.icon = 'local_hospital';
                break;
            case VacationTypeEnum.UnpaidLeave:
                this.icon = 'money_off';
                break;
        }
    }

    get vacationType(): VacationTypeEnum {
        return this._vacationType;
    }

    icon!: 'houseboat' | 'local_hospital' | 'money_off';
    private _vacationType!: VacationTypeEnum;

    constructor() {
    }

    ngOnInit(): void {
    }
}
