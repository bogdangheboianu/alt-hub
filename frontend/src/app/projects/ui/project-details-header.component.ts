import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IsAdminModule } from '@auth/directives/is-admin/is-admin.module';
import { ProjectDto } from '@dtos/project-dto';
import { ProjectMemberDto } from '@dtos/project-member-dto';
import { ProjectPipesModule } from '@projects/pipes/project-pipes.module';
import { ProjectStatusLabelComponent } from '@projects/ui/project-status-label.component';
import { AvatarComponent } from '@shared/ui/avatar.component';
import { ButtonModule } from '@shared/ui/button/button.module';
import { LinkButtonComponent } from '@shared/ui/button/link-button.component';
import { DropdownMenuComponent, DropdownMenuItems } from '@shared/ui/dropdown-menu.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';

@Component( {
                standalone     : true,
                selector       : 'app-project-details-header',
                template       : `
                    <app-header [loading]="loading">
                        <app-title *ngIf="project" headerLeft [title]="project | projectName">
                            <app-avatar titleLeft size="large" [name]="project | projectName"></app-avatar>
                            <app-project-status-label titleRight [status]="project | projectStatus"></app-project-status-label>
                            <ng-container customSubtitle>
                                <div *ngIf="project | projectClient; else noClient" class="flex align-items-center justify-content-start">
                                    <span class="fw-light">Beneficiary:</span>
                                    <app-link-button appButton
                                                     [label]="project | projectClientName"
                                                     [disabled]="disableClientLink"
                                                     (onClick)="onClientClick.emit(project.info.client!.id)"></app-link-button>
                                </div>
                                <ng-template #noClient>
                                    <em><span class="fw-light">Internal project</span></em>
                                </ng-template>
                                <div *ngIf="coordinator" class="flex align-items-center justify-content-start">
                                    <span class="fw-light">Coordinator:</span>
                                    <app-link-button appButton
                                                     [label]="project | projectCoordinatorFullName"
                                                     [disabled]="disableCoordinatorLink"
                                                     (onClick)="onCoordinatorUserClick.emit(coordinator.id)"></app-link-button>
                                </div>
                            </ng-container>
                        </app-title>
                        <app-dropdown-menu headerRight
                                           *isAdmin
                                           [menuItems]="menuItems"></app-dropdown-menu>
                        <p headerBottom *ngIf="project && project.info.description as description" class="m-0 mt-3 project-description">{{ description }}</p>
                    </app-header>
                `,
                styles         : [
                    `
                        .project-description {
                            border: 0.5px solid lightgray;
                            border-radius: 5px;
                            background: #f4f4f4;
                            padding: 15px;
                            color: #4d4d4d;
                        }
                    `
                ],
                imports        : [
                    HeaderComponent,
                    TitleComponent,
                    ProjectPipesModule,
                    DropdownMenuComponent,
                    IsAdminModule,
                    AvatarComponent,
                    ProjectStatusLabelComponent,
                    NgIf,
                    LinkButtonComponent,
                    ButtonModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ProjectDetailsHeaderComponent {
    @Input()
    set project(value: ProjectDto) {
        this._project = value;
        this.coordinator = value.members.find( m => m.isCoordinator );
    }

    get project(): ProjectDto {
        return this._project;
    }

    @Input()
    menuItems!: DropdownMenuItems;

    @Input()
    loading!: boolean;

    @Input()
    disableClientLink!: boolean;

    @Input()
    disableCoordinatorLink!: boolean;

    @Output()
    onClientClick = new EventEmitter<string>();

    @Output()
    onCoordinatorUserClick = new EventEmitter<string>();

    coordinator?: ProjectMemberDto;
    private _project!: ProjectDto;
}
