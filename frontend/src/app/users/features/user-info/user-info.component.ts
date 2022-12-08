import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthDataModule } from '@auth/data/auth-data.module';
import { CompanyDataModule } from '@company/data/company-data.module';
import { UpdateAccountDto } from '@dtos/update-account-dto';
import { UpdateAnnualEmployeeSheetDto } from '@dtos/update-annual-employee-sheet-dto';
import { UpdateUserEmploymentInfoDto } from '@dtos/update-user-employment-info-dto';
import { UpdateUserPersonalInfoDto } from '@dtos/update-user-personal-info-dto';
import { FiscalSuccessMessage } from '@fiscal/config/fiscal.constants';
import { FiscalDataModule } from '@fiscal/data/fiscal-data.module';
import { AnnualEmployeeSheetUpdateFormComponent } from '@fiscal/ui/annual-employee-sheet-update-form.component';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ExpansionPanelComponent } from '@shared/ui/expansion-panel.component';
import { UserSuccessMessage } from '@users/config/user.constants';
import { UserDataModule } from '@users/data/user-data.module';
import { UserInfoDataService } from '@users/features/user-info/user-info-data.service';
import { UserAccountUpdateFormComponent } from '@users/ui/user-account-update-form.component';
import { UserEmploymentInfoUpdateFormComponent } from '@users/ui/user-employment-info-update-form.component';
import { UserPersonalInfoUpdateFormComponent } from '@users/ui/user-personal-info-update-form.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-user-info',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <ng-container *ngIf="data.entity as user">
                            <app-expansion-panel
                                #accountPanel
                                title="Account"
                                icon="account_box"
                                [expanded]="true"
                                (opened)="panelOpened(accountPanel)">
                                <app-user-account-update-form
                                    [initialValues]="user.account"
                                    [loading]="data.loading"
                                    [readonly]="!data.isAdmin"
                                    (onSubmit)="updateUserAccount($event)"></app-user-account-update-form>
                            </app-expansion-panel>
                            <app-expansion-panel
                                #personalInfoPanel
                                title="Personal info"
                                icon="face"
                                (opened)="panelOpened(personalInfoPanel)">
                                <app-user-personal-info-update-form
                                    [initialValues]="user.personalInfo"
                                    [loading]="data.loading"
                                    [readonly]="!data.isAdmin"
                                    (onSubmit)="updateUserPersonalInfo($event)"></app-user-personal-info-update-form>
                            </app-expansion-panel>
                            <app-expansion-panel
                                #employmentInfoPanel
                                title="Employment info"
                                icon="badge"
                                (opened)="panelOpened(employmentInfoPanel)">
                                <app-user-employment-info-update-form
                                    [initialValues]="user.employmentInfo"
                                    [loading]="data.loading"
                                    [readonly]="!data.isAdmin"
                                    [companyPositionOptions]="data.companyPositionOptions"
                                    [companyPositionOptionsLoading]="data.companyPositionOptionsLoading"
                                    (onSubmit)="updateUserEmploymentInfo($event)"></app-user-employment-info-update-form>
                            </app-expansion-panel>
                            <app-expansion-panel
                                #annualSheetPanel
                                title="Annual sheet"
                                icon="date_range"
                                (opened)="panelOpened(annualSheetPanel)">
                                <app-annual-employee-sheet-update-form
                                    [initialValues]="data.userCurrentAnnualEmployeeSheet"
                                    [loading]="data.fiscalLoading"
                                    [readonly]="!data.isAdmin"
                                    (onSubmit)="updateUserAnnualEmployeeSheet($event)"></app-annual-employee-sheet-update-form>
                            </app-expansion-panel>
                        </ng-container>
                    </ng-container>
                `,
                providers      : [ UserInfoDataService ],
                imports        : [
                    UserDataModule,
                    ExpansionPanelComponent,
                    CompanyDataModule,
                    CommonModule,
                    AuthDataModule,
                    FiscalDataModule,
                    UserAccountUpdateFormComponent,
                    UserPersonalInfoUpdateFormComponent,
                    UserEmploymentInfoUpdateFormComponent,
                    AnnualEmployeeSheetUpdateFormComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserInfoComponent implements OnInit {
    @ViewChild( UserAccountUpdateFormComponent )
    userAccountForm!: UserAccountUpdateFormComponent;

    @ViewChild( UserPersonalInfoUpdateFormComponent )
    userPersonalInfoForm!: UserPersonalInfoUpdateFormComponent;

    @ViewChild( UserEmploymentInfoUpdateFormComponent )
    userEmploymentInfoForm!: UserEmploymentInfoUpdateFormComponent;

    @ViewChild( AnnualEmployeeSheetUpdateFormComponent )
    annualEmployeeSheetForm!: AnnualEmployeeSheetUpdateFormComponent;

    @ViewChildren( ExpansionPanelComponent )
    panels!: ExpansionPanelComponent[];

    constructor(
        public readonly dataService: UserInfoDataService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    updateUserAccount(data: UpdateAccountDto): void {
        this.dataService.updateUserAccount( data );
        this.onUserAccountUpdateSuccess();
    }

    updateUserPersonalInfo(data: UpdateUserPersonalInfoDto): void {
        this.dataService.updateUserPersonalInfo( data );
        this.onUserPersonalInfoUpdateSuccess();
    }

    updateUserEmploymentInfo(data: UpdateUserEmploymentInfoDto): void {
        this.dataService.updateUserEmploymentInfo( data );
        this.onUserEmploymentInfoUpdateSuccess();
    }

    updateUserAnnualEmployeeSheet(data: UpdateAnnualEmployeeSheetDto): void {
        this.dataService.updateAnnualEmployeeSheet( data );
        this.onUserAnnualEmployeeSheetUpdateSuccess();
    }

    panelOpened(panel: ExpansionPanelComponent) {
        this.panels?.forEach( p => {
            if( p.title !== panel.title ) {
                p.close();
            }
        } );
    }

    private onUserAccountUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( UserSuccessMessage.AccountUpdated );
            this.userAccountForm.reset();
        } );
    }

    private onUserPersonalInfoUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( UserSuccessMessage.PersonalInfoUpdated );
            this.userPersonalInfoForm.reset();
        } );
    }

    private onUserEmploymentInfoUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( UserSuccessMessage.EmploymentInfoUpdated );
            this.userEmploymentInfoForm.reset();
        } );
    }

    private onUserAnnualEmployeeSheetUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.fiscalSuccess, this, () => {
            this.messageService.success( FiscalSuccessMessage.AnnualEmployeeSheetUpdated );
            this.annualEmployeeSheetForm.reset();
        } );
    }
}
