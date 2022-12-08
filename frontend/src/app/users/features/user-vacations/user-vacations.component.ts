import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthDataModule } from '@auth/data/auth-data.module';
import { IsOwnProfilePageModule } from '@auth/directives/is-own-profile-page/is-own-profile-page.module';
import { VacationDto } from '@dtos/vacation-dto';
import { FiscalDataModule } from '@fiscal/data/fiscal-data.module';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ModalModule } from '@shared/features/modal/modal.module';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { ButtonModule } from '@shared/ui/button/button.module';
import { PrimaryButtonComponent } from '@shared/ui/button/primary-button.component';
import { UserDataModule } from '@users/data/user-data.module';
import { UserVacationsDataService } from '@users/features/user-vacations/user-vacations-data.service';
import { VacationSuccessMessage } from '@vacations/config/vacation.constants';
import { VacationCreateFormModalData, VacationUpdateFormModalData } from '@vacations/config/vacation.interfaces';
import { CreateVacationRequest, UpdateVacationRequest } from '@vacations/config/vacation.types';
import { VacationDataModule } from '@vacations/data/vacation-data.module';
import { VacationCreateFormComponent } from '@vacations/ui/vacation-create-form.component';
import { VacationUpdateFormComponent } from '@vacations/ui/vacation-update-form.component';
import { VacationsGanttChartComponent } from '@vacations/ui/vacations-gantt-chart.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-user-vacations',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <div class="py-3">
                            <div class="d-flex align-items-center justify-content-between">
                            <span class="paid-days-left"
                                  *ngIf="data.currentAnnualEmployeeSheet as sheet"
                                  [class.zero]="sheet.remainingPaidLeaveDays === 0">
                                <span *ngIf="sheet.remainingPaidLeaveDays > 0; else zeroDaysLeft">
                                    <strong>{{ sheet.remainingPaidLeaveDays }}/{{ sheet.paidLeaveDays }}</strong> paid leave days left
                                </span>
                                <ng-template #zeroDaysLeft>No more paid leave days left</ng-template>
                            </span>
                                <app-primary-button
                                    appButton
                                    *isOwnProfilePage
                                    label="Create vacation request"
                                    icon="history_edu"
                                    (onClick)="openVacationCreateFormModal()"></app-primary-button>
                            </div>
                        </div>
                        <app-vacations-gantt-chart [vacationsByTimePeriod]="data.vacationsByTimePeriod"
                                                   [loading]="data.vacationsLoading"
                                                   (onEditButtonClick)="openVacationUpdateFormModal($event)"
                                                   (onUserClick)="navigationService.userDetails($event.id)"></app-vacations-gantt-chart>
                    </ng-container>
                `,
                styles         : [
                    `.paid-days-left {
                        padding: 5px 7px;
                        border-radius: 5px;
                        border: solid 0.5px #00bd97;
                        color: #00bd97;

                        &.zero {
                            color: #f44336;
                            border: solid 0.5px #f44336;
                        }
                    }
                    `
                ],
                providers      : [ UserVacationsDataService ],
                imports        : [
                    UserDataModule,
                    CommonModule,
                    FiscalDataModule,
                    AuthDataModule,
                    VacationDataModule,
                    PrimaryButtonComponent,
                    ButtonModule,
                    VacationCreateFormComponent,
                    VacationUpdateFormComponent,
                    VacationsGanttChartComponent,
                    ModalModule,
                    IsOwnProfilePageModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserVacationsComponent implements OnInit {
    constructor(
        public readonly dataService: UserVacationsDataService,
        private readonly messageService: MessageService,
        private readonly modalService: ModalService,
        public readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    openVacationCreateFormModal(): void {
        this.modalService.openSmModal<VacationCreateFormModalData>( VacationCreateFormComponent, this, {
            loading$: this.dataService.source!.vacationsLoading,
            onSubmit: this.createVacation.bind( this ),
            onCancel: this.closeVacationCreateFormModal.bind( this )
        } );
    }

    openVacationUpdateFormModal(vacation: VacationDto): void {
        this.modalService.openSmModal<VacationUpdateFormModalData>( VacationUpdateFormComponent, this, {
            initialValues: vacation,
            loading$     : this.dataService.source!.vacationsLoading,
            onSubmit     : (data: UpdateVacationRequest) => this.updateVacation( vacation.id, data ),
            onDelete     : () => this.cancelVacation( vacation.id ),
            onCancel     : this.closeVacationUpdateFormModal.bind( this )
        } );
    }

    createVacation(data: CreateVacationRequest): void {
        this.dataService.createVacation( data );
        this.onVacationCreateSuccess();
    }

    updateVacation(id: string, data: UpdateVacationRequest): void {
        this.dataService.updateVacation( id, data );
        this.onVacationUpdateSuccess();
    }

    cancelVacation(id: string): void {
        this.dataService.cancelVacation( id );
        this.onVacationCancelSuccess();
    }

    closeVacationCreateFormModal(): void {
        this.modalService.close( VacationCreateFormComponent );
    }

    closeVacationUpdateFormModal(): void {
        this.modalService.close( VacationUpdateFormComponent );
    }

    private onVacationCreateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.vacationsSuccess, this, () => {
            this.messageService.success( VacationSuccessMessage.Created );
            this.dataService.loadCurrentAnnualEmployeeSheet();
            this.closeVacationCreateFormModal();
        } );
    }

    private onVacationUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.vacationsSuccess, this, () => {
            this.messageService.success( VacationSuccessMessage.Updated );
            this.dataService.loadCurrentAnnualEmployeeSheet();
            this.closeVacationUpdateFormModal();
        } );
    }

    private onVacationCancelSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.vacationsSuccess, this, () => {
            this.messageService.success( VacationSuccessMessage.Canceled );
            this.dataService.loadCurrentAnnualEmployeeSheet();
            this.closeVacationUpdateFormModal();
        } );
    }
}
