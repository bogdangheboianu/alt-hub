import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ClientDto } from '@dtos/client-dto';
import { ProjectDto } from '@dtos/project-dto';
import { UserDto } from '@dtos/user-dto';
import { ProjectPipesModule } from '@projects/pipes/project-pipes.module';
import { ProjectStatusLabelComponent } from '@projects/ui/project-status-label.component';
import { ButtonModule } from '@shared/ui/button/button.module';
import { LinkButtonComponent } from '@shared/ui/button/link-button.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { UserPipesModule } from '@users/pipes/user-pipes.module';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-project-list-table',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <table mat-table [dataSource]="projects">
                        <ng-container matColumnDef="name">
                            <th mat-header-cell *matHeaderCellDef> Name</th>
                            <td mat-cell *matCellDef="let project">{{ project | projectName }}</td>
                        </ng-container>
                        <ng-container matColumnDef="clientName">
                            <th mat-header-cell *matHeaderCellDef> Beneficiary</th>
                            <td mat-cell *matCellDef="let project">
                                <app-link-button appButton
                                                 *ngIf="project.info['client']; else clientName"
                                                 [label]="project | projectClientName"
                                                 [disabled]="disableClientLinks"
                                                 (onClick)="clientClicked(project.info['client'])"></app-link-button>
                                <ng-template #clientName><span style="text-decoration: line-through">{{ project | projectClientName }}</span></ng-template>
                            </td>
                        </ng-container>
                        <ng-container matColumnDef="status">
                            <th mat-header-cell *matHeaderCellDef> Status</th>
                            <td mat-cell *matCellDef="let project">
                                <div style="width: 90%">
                                    <app-project-status-label [status]="project | projectStatus"></app-project-status-label>
                                </div>
                            </td>
                        </ng-container>
                        <ng-container matColumnDef="coordinator">
                            <th mat-header-cell *matHeaderCellDef> Coordinator</th>
                            <td mat-cell *matCellDef="let project">
                                <app-link-button appButton
                                                 *ngIf="(project | projectCoordinator) as coordinator; else noCoordinator"
                                                 [label]="coordinator | userFullName"
                                                 [disabled]="disableUserLinks"
                                                 (onClick)="userClicked(coordinator)"></app-link-button>
                                <ng-template #noCoordinator><em>No coordinator set</em></ng-template>
                            </td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="columns"></tr>
                        <tr mat-row
                            *matRowDef="let project; columns: columns;"
                            (click)="rowClicked(project)"></tr>
                    </table>
                `,
                styles         : [
                    `table {
                        width: 100%;
                    }

                    :host ::ng-deep {
                        .mat-column-name {
                            flex: 0 0 40% !important;
                            word-wrap: break-word !important;
                            white-space: unset !important;
                            width: 40% !important;
                        }
                    }
                    `
                ],
                imports        : [
                    MatTableModule,
                    CommonModule,
                    LinkButtonComponent,
                    LoadingBarComponent,
                    ProjectStatusLabelComponent,
                    ProjectPipesModule,
                    ButtonModule,
                    UserPipesModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectListTableComponent implements OnInit {
    @Input()
    projects!: ProjectDto[];

    @Input()
    loading!: boolean;

    @Input()
    disableClientLinks: boolean = false;

    @Input()
    disableUserLinks: boolean = false;

    @Input()
    showClientColumn = true;

    @Output()
    onRowClick = new EventEmitter<ProjectDto>();

    @Output()
    onClientClick = new EventEmitter<ClientDto>();

    @Output()
    onUserClick = new EventEmitter<UserDto>();

    columns: string[] = [];

    ngOnInit(): void {
        this.setColumns();
    }

    rowClicked(project: ProjectDto): void {
        this.onRowClick.emit( project );
    }

    clientClicked(client: ClientDto): void {
        this.onClientClick.emit( client );
    }

    userClicked(user: UserDto): void {
        this.onUserClick.emit( user );
    }

    private setColumns(): void {
        this.columns = [ 'name', 'status', 'coordinator' ];

        if( this.showClientColumn ) {
            this.columns.splice( 1, 0, 'clientName' );
        }
    }
}
