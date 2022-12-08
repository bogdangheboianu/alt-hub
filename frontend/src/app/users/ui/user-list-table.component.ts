import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserDto } from '@dtos/user-dto';
import { AvatarComponent } from '@shared/ui/avatar.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { userProfilePictureUrl } from '@users/config/user.constants';
import { UserPipesModule } from '@users/pipes/user-pipes.module';
import { UserStatusLabelComponent } from '@users/ui/user-status-label.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-user-list-table',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <table mat-table [dataSource]="users" class="darker-header">
                        <ng-container matColumnDef="profilePicture">
                            <th mat-header-cell *matHeaderCellDef></th>
                            <td mat-cell *matCellDef="let user">
                                <div class="d-flex align-items-center justify-content-start">
                                    <app-avatar type="image"
                                                size="medium"
                                                imgAlt="profile picture"
                                                [imgSrc]="profilePictureUrl"></app-avatar>
                                </div>
                            </td>
                        </ng-container>
                        <ng-container matColumnDef="name">
                            <th mat-header-cell *matHeaderCellDef> Name</th>
                            <td mat-cell *matCellDef="let user"> {{ user | userFullName }} </td>
                        </ng-container>
                        <ng-container matColumnDef="email">
                            <th mat-header-cell *matHeaderCellDef> Email</th>
                            <td mat-cell *matCellDef="let user"> {{ user | userEmail }} </td>
                        </ng-container>
                        <ng-container matColumnDef="companyPosition">
                            <th mat-header-cell *matHeaderCellDef> Position</th>
                            <td mat-cell *matCellDef="let user"> {{ user | userCompanyPosition }} </td>
                        </ng-container>
                        <ng-container matColumnDef="employeeId">
                            <th mat-header-cell *matHeaderCellDef> Employee ID</th>
                            <td mat-cell *matCellDef="let user"> {{ user | userEmployeeId }} </td>
                        </ng-container>
                        <ng-container matColumnDef="employmentPeriod">
                            <th mat-header-cell *matHeaderCellDef> Employment period</th>
                            <td mat-cell *matCellDef="let user"> {{ user | userEmploymentPeriod }} </td>
                        </ng-container>
                        <ng-container *ngIf="showStatus" matColumnDef="status">
                            <th mat-header-cell *matHeaderCellDef> Status</th>
                            <td mat-cell *matCellDef="let user">
                                <app-user-status-label [status]="user | userStatus"></app-user-status-label>
                            </td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="columns"></tr>
                        <tr mat-row
                            *matRowDef="let user; columns: columns;"
                            (click)="rowClicked(user)"></tr>
                    </table>
                `,
                styles         : [ 'table {width: 100%}' ],
                imports        : [
                    CommonModule,
                    MatTableModule,
                    LoadingBarComponent,
                    UserPipesModule,
                    AvatarComponent,
                    UserStatusLabelComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserListTableComponent {
    @Input()
    users!: UserDto[];

    @Input()
    loading!: boolean;

    @Input()
    showStatus = false;

    @Output() onRowClick = new EventEmitter<UserDto>();

    profilePictureUrl = userProfilePictureUrl;

    get columns(): string[] {
        const columns = [
            'profilePicture',
            'name',
            'email',
            'companyPosition',
            'employeeId',
            'employmentPeriod'
        ];

        if( this.showStatus ) {
            columns.push( 'status' );
        }

        return columns;
    }

    rowClicked(user: UserDto): void {
        this.onRowClick.emit( user );
    }
}
