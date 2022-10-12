import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthModule } from '@auth/auth.module';
import { CompanyModule } from '@company/company.module';
import { SharedModule } from '@shared/shared.module';
import { ChangeUserStatusButtonComponent } from '@user/components/change-user-status-button/change-user-status-button.component';
import { CreateEmployeeInfoFormComponent } from '@user/components/create-employee-info-form/create-employee-info-form.component';
import { CreatePersonalInfoFormComponent } from '@user/components/create-personal-info-form/create-personal-info-form.component';
import { CreateUserAccountFormComponent } from '@user/components/create-user-account-form/create-user-account-form.component';
import { CreateUserStepperComponent } from '@user/components/create-user-stepper/create-user-stepper.component';
import { UpdateEmployeeInfoFormComponent } from '@user/components/update-employee-info-form/update-employee-info-form.component';
import { UpdatePersonalInfoFormComponent } from '@user/components/update-personal-info-form/update-personal-info-form.component';
import { UpdateUserAccountFormComponent } from '@user/components/update-user-account-form/update-user-account-form.component';
import { UserCardComponent } from '@user/components/user-card/user-card.component';
import { UserExpansionPanelWrapperComponent } from '@user/components/user-expansion-panel-wrapper/user-expansion-panel-wrapper.component';
import { UserIconComponent } from '@user/components/user-icon/user-icon.component';
import { UserStatusLabelComponent } from '@user/components/user-status-label/user-status-label.component';
import { UserStatusStepsComponent } from '@user/components/user-status-steps/user-status-steps.component';
import { UsersTableComponent } from '@user/components/users-table/users-table.component';
import { UserListPageComponent } from '@user/pages/user-list-page/user-list-page.component';
import { UserPageComponent } from '@user/pages/user-page/user-page.component';
import { UserService } from '@user/services/user.service';
import { UserUiEvents } from '@user/store/user-ui.events';
import { UserActions } from '@user/store/user.actions';
import { UserSelectors } from '@user/store/user.selectors';
import { UserStore } from '@user/store/user.store';
import { UserRoutingModule } from '@user/user-routing.module';
import { WorkLogModule } from '@work-log/work-log.module';
import { ConfirmUserFormComponent } from './components/confirm-user-form/confirm-user-form.component';
import { CreateUserAccountStepComponent } from './components/create-user-stepper/steps/create-user-account-step/create-user-account-step.component';
import { CreateUserEmployeeInfoStepComponent } from './components/create-user-stepper/steps/create-user-employee-info-step/create-user-employee-info-step.component';
import { CreateUserPersonalInfoStepComponent } from './components/create-user-stepper/steps/create-user-personal-info-step/create-user-personal-info-step.component';
import { CreateUserSaveStepComponent } from './components/create-user-stepper/steps/create-user-save-step/create-user-save-step.component';
import { UserConfirmPageComponent } from './pages/user-confirm-page/user-confirm-page.component';

@NgModule( {
               declarations: [
                   UserListPageComponent,
                   UserPageComponent,
                   CreateUserStepperComponent,
                   UsersTableComponent,
                   CreatePersonalInfoFormComponent,
                   CreateUserAccountFormComponent,
                   CreateEmployeeInfoFormComponent,
                   UserCardComponent,
                   UserExpansionPanelWrapperComponent,
                   UpdateEmployeeInfoFormComponent,
                   UpdatePersonalInfoFormComponent,
                   UserIconComponent,
                   UpdateUserAccountFormComponent,
                   UserStatusStepsComponent,
                   ChangeUserStatusButtonComponent,
                   UserStatusLabelComponent,
                   ConfirmUserFormComponent,
                   UserConfirmPageComponent,
                   CreateUserAccountStepComponent,
                   CreateUserPersonalInfoStepComponent,
                   CreateUserEmployeeInfoStepComponent,
                   CreateUserSaveStepComponent
               ],
               imports     : [
                   CommonModule,
                   UserRoutingModule,
                   MatTableModule,
                   MatPaginatorModule,
                   MatCardModule,
                   MatGridListModule,
                   FlexModule,
                   MatButtonModule,
                   MatStepperModule,
                   ReactiveFormsModule,
                   MatFormFieldModule,
                   MatInputModule,
                   SharedModule,
                   WorkLogModule,
                   MatTabsModule,
                   MatIconModule,
                   MatTooltipModule,
                   CompanyModule,
                   MatExpansionModule,
                   MatDividerModule,
                   MatSlideToggleModule,
                   FormsModule,
                   MatButtonToggleModule,
                   AuthModule
               ],
               exports     : [
                   UserIconComponent
               ],
               providers   : [
                   UserService,
                   UserStore,
                   UserSelectors,
                   UserActions,
                   UserUiEvents
               ]
           } )
export class UserModule {
}
