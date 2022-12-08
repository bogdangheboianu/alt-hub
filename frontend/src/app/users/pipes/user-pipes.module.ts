import { NgModule } from '@angular/core';
import { UserCompanyPositionPipe } from '@users/pipes/user-company-position.pipe';
import { UserEmailPipe } from '@users/pipes/user-email.pipe';
import { UserEmployeeIdPipe } from '@users/pipes/user-employee-id.pipe';
import { UserEmploymentPeriodPipe } from '@users/pipes/user-employment-period.pipe';
import { UserFullNamePipe } from '@users/pipes/user-full-name.pipe';
import { UserHasAccessPipe } from '@users/pipes/user-has-access.pipe';
import { UserIsActivePipe } from '@users/pipes/user-is-active.pipe';
import { UserIsAdminPipe } from '@users/pipes/user-is-admin.pipe';
import { UserPhonePipe } from '@users/pipes/user-phone.pipe';
import { UserStatusPipe } from '@users/pipes/user-status.pipe';

const Pipes = [
    UserCompanyPositionPipe,
    UserEmailPipe,
    UserEmployeeIdPipe,
    UserEmploymentPeriodPipe,
    UserFullNamePipe,
    UserHasAccessPipe,
    UserIsActivePipe,
    UserIsAdminPipe,
    UserPhonePipe,
    UserStatusPipe
];

@NgModule( {
               declarations: Pipes,
               exports     : Pipes
           } )
export class UserPipesModule {
}
