import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { UserDto } from '@dtos/user-dto';
import { AvatarComponent } from '@shared/ui/avatar.component';
import { userProfilePictureUrl } from '@users/config/user.constants';
import { UserPipesModule } from '@users/pipes/user-pipes.module';

type ExpandIcon = 'expand_more' | 'expand_less'

@Component( {
                standalone: true,
                selector  : 'app-user-top-bar-menu',
                template  : `
                    <div class="d-flex align-items-center justify-content-around navbar-logged-user"
                         *ngIf="user"
                         [matMenuTriggerFor]="userMenu"
                         (click)="openDropdownMenu()">
                        <div style="margin-right: 0.3rem">
                            <app-avatar [imgSrc]="userProfilePicture" type="image"></app-avatar>
                        </div>
                        <p class="m-0 p-0" style="font-size: 13px; color: #5b5b5b">{{ user | userFullName }}</p>
                        <mat-icon>{{ expandIcon }}</mat-icon>
                    </div>
                    <mat-menu #userMenu="matMenu" (closed)="onDropdownMenuClosed()">
                        <button mat-menu-item (click)="profileButtonClicked()" style="font-size: 13px; color: #5b5b5b">
                            <mat-icon>account_box</mat-icon>
                            <span>Profile</span>
                        </button>
                        <button mat-menu-item (click)="logoutButtonClicked()" style="font-size: 13px; color: #5b5b5b">
                            <mat-icon>logout</mat-icon>
                            <span>Sign out</span>
                        </button>
                    </mat-menu>

                `,
                styles    : [
                    `.navbar-logged-user {
                        height: 100%;
                        cursor: pointer;
                        padding: 5px 10px;
                    }
                    `
                ],
                imports   : [
                    CommonModule,
                    MatMenuModule,
                    UserPipesModule,
                    MatIconModule,
                    AvatarComponent
                ]
            } )
export class UserTopBarMenuComponent {
    @Input()
    user!: UserDto;

    @Output()
    onProfileClick = new EventEmitter();

    @Output()
    onLogoutButtonClick = new EventEmitter();

    @ViewChild( MatMenuTrigger )
    dropdownMenuTrigger!: MatMenuTrigger;

    dropdownMenuOpened = false;
    userProfilePicture = userProfilePictureUrl;

    get expandIcon(): ExpandIcon {
        return this.dropdownMenuOpened
               ? 'expand_less'
               : 'expand_more';
    }

    openDropdownMenu(): void {
        this.dropdownMenuTrigger.openMenu();
        this.dropdownMenuOpened = true;
    }

    onDropdownMenuClosed(): void {
        this.dropdownMenuOpened = false;
    }

    profileButtonClicked(): void {
        this.onProfileClick.emit();
    }

    logoutButtonClicked(): void {
        this.onLogoutButtonClick.emit();
    }
}
