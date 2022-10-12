import { CommonModule, NgForOf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AddButtonComponent } from '@shared/components/buttons/add-button/add-button.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { CancelButtonComponent } from '@shared/components/buttons/cancel-button/cancel-button.component';
import { DeleteIconButtonComponent } from '@shared/components/buttons/delete-icon-button/delete-icon-button.component';
import { DownloadButtonComponent } from '@shared/components/buttons/download-button/download-button.component';
import { EditIconButtonComponent } from '@shared/components/buttons/edit-icon-button/edit-icon-button.component';
import { LinkButtonComponent } from '@shared/components/buttons/link-button/link-button.component';
import { NextButtonComponent } from '@shared/components/buttons/next-button/next-button.component';
import { OpenButtonComponent } from '@shared/components/buttons/open-button/open-button.component';
import { PrevButtonComponent } from '@shared/components/buttons/prev-button/prev-button.component';
import { SaveButtonComponent } from '@shared/components/buttons/save-button/save-button.component';
import { StepperButtonsComponent } from '@shared/components/buttons/stepper-buttons/stepper-buttons.component';
import { CheckboxInputComponent } from '@shared/components/inputs/checkbox-input/checkbox-input.component';
import { DateInputComponent } from '@shared/components/inputs/date-input/date-input.component';
import { EmailInputComponent } from '@shared/components/inputs/email-input/email-input.component';
import { NumberInputComponent } from '@shared/components/inputs/number-input/number-input.component';
import { PasswordInputComponent } from '@shared/components/inputs/password-input/password-input.component';
import { SelectInputComponent } from '@shared/components/inputs/select-input/select-input.component';
import { TextInputComponent } from '@shared/components/inputs/text-input/text-input.component';
import { TextareaInputComponent } from '@shared/components/inputs/textarea-input/textarea-input.component';
import { ErrorMessageComponent } from '@shared/components/messages/error-message/error-message.component';
import { SuccessMessageComponent } from '@shared/components/messages/success-message/success-message.component';
import { CardComponent } from '@shared/components/misc/card/card.component';
import { ResourceIconComponent } from '@shared/components/misc/resource-icon/resource-icon.component';
import { PageTitleComponent } from '@shared/components/typography/page-title/page-title.component';
import { CreatePageWrapperComponent } from '@shared/components/wrappers/create-page-wrapper/create-page-wrapper.component';
import { FormDialogWrapperComponent } from '@shared/components/wrappers/form-dialog-wrapper/form-dialog-wrapper.component';
import { ListPageWrapperComponent } from '@shared/components/wrappers/list-page-wrapper/list-page-wrapper.component';
import { ListTabWrapperComponent } from '@shared/components/wrappers/list-tab-wrapper/list-tab-wrapper.component';
import { PageHeaderWrapperComponent } from '@shared/components/wrappers/page-header-wrapper/page-header-wrapper.component';
import { ApiRequestInterceptor } from '@shared/interceptors/api-request.interceptor';
import { ApiResponseInterceptor } from '@shared/interceptors/api-response.interceptor';
import { CreatedAtPipe } from '@shared/pipes/created-at.pipe';
import { MinutesToReadableTimePipe } from '@shared/pipes/minutes-to-readable-time.pipe';
import { ProjectClientNamePipe } from '@shared/pipes/project-client-name.pipe';
import { ProjectCoordinatorPipe } from '@shared/pipes/project-coordinator.pipe';
import { ProjectNamePipe } from '@shared/pipes/project-name.pipe';
import { ProjectStatusPipe } from '@shared/pipes/project-status.pipe';
import { ReadableDatePipe } from '@shared/pipes/readable-date.pipe';
import { ReadableWeekDaysPipe } from '@shared/pipes/readable-week-days.pipe';
import { UserCompanyPositionPipe } from '@shared/pipes/user-company-position.pipe';
import { UserEmailPipe } from '@shared/pipes/user-email.pipe';
import { UserEmployeeIdPipe } from '@shared/pipes/user-employee-id.pipe';
import { UserEmploymentPeriodPipe } from '@shared/pipes/user-employment-period.pipe';
import { UserFullNamePipe } from '@shared/pipes/user-full-name.pipe';
import { UserHasAccessPipe } from '@shared/pipes/user-has-access.pipe';
import { UserIsAdminPipe } from '@shared/pipes/user-is-admin.pipe';
import { CsvFileDownloadService } from '@shared/services/csv-file-download.service';
import { MessageService } from '@shared/services/message.service';
import { ModalService } from '@shared/services/modal.service';

@NgModule( {
               declarations: [
                   PageTitleComponent,
                   ListPageWrapperComponent,
                   CreatePageWrapperComponent,
                   TextInputComponent,
                   PasswordInputComponent,
                   SelectInputComponent,
                   TextareaInputComponent,
                   DateInputComponent,
                   NumberInputComponent,
                   ButtonComponent,
                   AddButtonComponent,
                   SaveButtonComponent,
                   NextButtonComponent,
                   PrevButtonComponent,
                   OpenButtonComponent,
                   CancelButtonComponent,
                   EmailInputComponent,
                   CardComponent,
                   FormDialogWrapperComponent,
                   ReadableDatePipe,
                   EditIconButtonComponent,
                   DeleteIconButtonComponent,
                   CreatedAtPipe,
                   PageHeaderWrapperComponent,
                   CheckboxInputComponent,
                   MinutesToReadableTimePipe,
                   ListTabWrapperComponent,
                   UserFullNamePipe,
                   UserCompanyPositionPipe,
                   UserHasAccessPipe,
                   UserEmailPipe,
                   UserEmploymentPeriodPipe,
                   UserEmployeeIdPipe,
                   UserIsAdminPipe,
                   ReadableWeekDaysPipe,
                   ProjectNamePipe,
                   ProjectStatusPipe,
                   ProjectClientNamePipe,
                   LinkButtonComponent,
                   DownloadButtonComponent,
                   ResourceIconComponent,
                   StepperButtonsComponent,
                   ErrorMessageComponent,
                   SuccessMessageComponent,
                   ProjectCoordinatorPipe
               ],
               imports     : [
                   CommonModule,
                   MatButtonModule,
                   RouterModule,
                   MatFormFieldModule,
                   MatInputModule,
                   ReactiveFormsModule,
                   FormsModule,
                   MatStepperModule,
                   MatAutocompleteModule,
                   MatDatepickerModule,
                   MatIconModule,
                   MatDialogModule,
                   MatTableModule,
                   MatProgressSpinnerModule,
                   MatCheckboxModule,
                   MatSelectModule,
                   MatSnackBarModule,
                   NgForOf
               ],
               providers   : [
                   CsvFileDownloadService,
                   MessageService,
                   ModalService,
                   ApiRequestInterceptor,
                   ApiResponseInterceptor
               ],
               exports     : [
                   PageTitleComponent,
                   ListPageWrapperComponent,
                   CreatePageWrapperComponent,
                   TextInputComponent,
                   PasswordInputComponent,
                   SelectInputComponent,
                   TextareaInputComponent,
                   DateInputComponent,
                   NumberInputComponent,
                   ButtonComponent,
                   AddButtonComponent,
                   SaveButtonComponent,
                   NextButtonComponent,
                   PrevButtonComponent,
                   OpenButtonComponent,
                   CancelButtonComponent,
                   EmailInputComponent,
                   FormDialogWrapperComponent,
                   ReadableDatePipe,
                   EditIconButtonComponent,
                   DeleteIconButtonComponent,
                   CreatedAtPipe,
                   CardComponent,
                   PageHeaderWrapperComponent,
                   CheckboxInputComponent,
                   MinutesToReadableTimePipe,
                   ListTabWrapperComponent,
                   UserFullNamePipe,
                   UserCompanyPositionPipe,
                   UserHasAccessPipe,
                   UserEmailPipe,
                   UserEmploymentPeriodPipe,
                   UserEmployeeIdPipe,
                   UserIsAdminPipe,
                   ReadableWeekDaysPipe,
                   ProjectNamePipe,
                   ProjectStatusPipe,
                   ProjectClientNamePipe,
                   LinkButtonComponent,
                   DownloadButtonComponent,
                   ResourceIconComponent,
                   StepperButtonsComponent,
                   ProjectCoordinatorPipe
               ]
           } )
export class SharedModule {
}
