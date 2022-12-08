import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IsAdminModule } from '@auth/directives/is-admin/is-admin.module';
import { UserDto } from '@dtos/user-dto';
import { AvatarComponent } from '@shared/ui/avatar.component';
import { DropdownMenuComponent, DropdownMenuItems } from '@shared/ui/dropdown-menu.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';
import { userProfilePictureUrl } from '@users/config/user.constants';
import { UserOnboardingStepsComponent } from '@users/features/user-onboarding-steps/user-onboarding-steps.component';
import { UserPipesModule } from '@users/pipes/user-pipes.module';
import { UserStatusLabelComponent } from '@users/ui/user-status-label.component';

@Component( {
                standalone     : true,
                selector       : 'app-user-details-header',
                template       : `
                    <app-header [loading]="loading">
                        <app-title *ngIf="user" headerLeft [title]="user | userFullName" [subtitle]="user | userCompanyPosition">
                            <app-avatar titleLeft size="large" imgAlt="profile picture" type="image" [imgSrc]="userProfilePicture"></app-avatar>
                            <app-user-status-label titleRight [status]="user | userStatus"></app-user-status-label>
                        </app-title>
                        <app-dropdown-menu *isAdmin headerRight [menuItems]="menuItems"></app-dropdown-menu>
                    </app-header>
                `,
                imports        : [
                    HeaderComponent,
                    TitleComponent,
                    NgIf,
                    UserPipesModule,
                    AvatarComponent,
                    UserStatusLabelComponent,
                    UserOnboardingStepsComponent,
                    DropdownMenuComponent,
                    IsAdminModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class UserDetailsHeaderComponent {
    @Input()
    user!: UserDto;

    @Input()
    loading!: boolean;

    @Input()
    menuItems!: DropdownMenuItems;

    userProfilePicture = userProfilePictureUrl;
}
