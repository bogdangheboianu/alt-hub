import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { UserDataModule } from '@users/data/user-data.module';
import { UserDetailsRoutingModule } from '@users/features/user-details/user-details-routing.module';
import { UserDetailsComponent } from '@users/features/user-details/user-details.component';
import { UserInfoComponent } from '@users/features/user-info/user-info.component';
import { UserOnboardingStepsComponent } from '@users/features/user-onboarding-steps/user-onboarding-steps.component';
import { UserDetailsHeaderComponent } from '@users/ui/user-details-header.component';
import { UserDetailsTabsComponent } from '@users/ui/user-details-tabs.component';

@NgModule( {
               imports     : [
                   UserDetailsRoutingModule,
                   UserDataModule,
                   LoadingBarComponent,
                   CommonModule,
                   UserDetailsHeaderComponent,
                   UserOnboardingStepsComponent,
                   UserInfoComponent,
                   UserDetailsTabsComponent
               ],
               declarations: [ UserDetailsComponent ]
           } )
export class UserDetailsModule {
}
