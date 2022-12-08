import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProjectDto } from '@dtos/project-dto';
import { UpdateProjectInfoDto } from '@dtos/update-project-info-dto';
import { ProjectSuccessMessage } from '@projects/config/project.constants';
import { ProjectInfoUpdateFormModalData } from '@projects/config/project.interfaces';
import { ProjectDetailsDataService } from '@projects/features/project-details/project-details-data.service';
import { ProjectInfoUpdateFormComponent } from '@projects/ui/project-info-update-form.component';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { DropdownMenuItems } from '@shared/ui/dropdown-menu.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-project-details',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-loading-bar [visible]="data.loading"></app-loading-bar>
                        <ng-container *ngIf="data.entity as project">
                            <app-project-details-header [project]="project"
                                                        [menuItems]="projectMenuItems"
                                                        [disableClientLink]="!data.isAdmin"
                                                        [disableCoordinatorLink]="!data.isAdmin"
                                                        (onClientClick)="navigationService.clientDetails($event)"
                                                        (onCoordinatorUserClick)="navigationService.userDetails($event)"></app-project-details-header>
                            <div class="row" style="row-gap: 1.3rem">
                                <section class="col-6">
                                    <app-project-timeline></app-project-timeline>
                                </section>
                                <section class="col-6">
                                    <app-project-pricing *isAdmin></app-project-pricing>
                                </section>
                                <section class="col-12">
                                    <app-project-details-tabs></app-project-details-tabs>
                                </section>
                            </div>
                        </ng-container>
                    </ng-container>
                `,
                styles         : [
                    `:host ::ng-deep {
                        .mat-list-item-content {
                            padding: 0 !important;
                        }
                    }
                    `
                ],
                providers      : [ ProjectDetailsDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectDetailsComponent implements OnInit {
    projectMenuItems: DropdownMenuItems;

    constructor(
        public readonly dataService: ProjectDetailsDataService,
        public readonly navigationService: NavigationService,
        private readonly modalService: ModalService,
        private readonly messageService: MessageService
    ) {
        this.projectMenuItems = this.getProjectMenuItems();
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    updateProjectInfo(data: UpdateProjectInfoDto): void {
        this.dataService.updateProjectInfo( data );
        this.onProjectInfoUpdateSuccess();
    }

    deleteProject(): void {
        this.dataService.deleteProject();
        this.onProjectDeleteSuccess();
    }

    openProjectInfoUpdateModal(): void {
        this.dataService.loadClients();
        this.dataService.entity
            .then( (project: ProjectDto) =>
                       this.modalService.openSmModal<ProjectInfoUpdateFormModalData>( ProjectInfoUpdateFormComponent, this, {
                           initialValues        : project.info,
                           clientOptions$       : this.dataService.source!.clientOptions,
                           clientOptionsLoading$: this.dataService.source!.clientOptionsLoading,
                           loading$             : this.dataService.source!.loading,
                           onSubmit             : this.updateProjectInfo.bind( this ),
                           onCancel             : this.closeProjectInfoUpdateModal.bind( this )
                       } ) );
    }

    private onProjectInfoUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( ProjectSuccessMessage.InfoUpdated );
            this.closeProjectInfoUpdateModal();
        } );
    }

    private onProjectDeleteSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, async () => {
            this.messageService.success( ProjectSuccessMessage.Deleted );
            this.navigationService.projectList();
        } );
    }

    private closeProjectInfoUpdateModal(): void {
        this.modalService.close( ProjectInfoUpdateFormComponent );
    }

    private getProjectMenuItems(): DropdownMenuItems {
        return [
            {
                text   : 'Edit',
                icon   : 'edit',
                color  : 'default',
                command: () => this.openProjectInfoUpdateModal()
            },
            {
                text   : 'Delete',
                icon   : 'delete_outline',
                color  : 'warn',
                command: () => this.deleteProject()
            }
        ];
    }
}
