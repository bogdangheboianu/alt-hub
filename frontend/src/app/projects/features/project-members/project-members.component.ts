import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { IsAdminModule } from '@auth/directives/is-admin/is-admin.module';
import { CompanyDataModule } from '@company/data/company-data.module';
import { CreateProjectMemberDto } from '@dtos/create-project-member-dto';
import { ProjectMemberDto } from '@dtos/project-member-dto';
import { ProjectPricingDtoTypeEnum } from '@dtos/project-pricing-dto';
import { UpdateProjectMemberDto } from '@dtos/update-project-member-dto';
import { ProjectSuccessMessage } from '@projects/config/project.constants';
import { ProjectMemberCreateFormModalData, ProjectMemberUpdateFormModalData } from '@projects/config/project.interfaces';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { ProjectMembersDataService } from '@projects/features/project-members/project-members-data.service';
import { ProjectMemberCreateFormComponent } from '@projects/ui/project-member-create-form.component';
import { ProjectMemberUpdateFormComponent } from '@projects/ui/project-member-update-form.component';
import { takeIfDefined } from '@shared/config/functions/custom-rxjs.operators';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ModalService } from '@shared/features/modal/modal.service';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { AvatarComponent } from '@shared/ui/avatar.component';
import { ButtonModule } from '@shared/ui/button/button.module';
import { CreateButtonComponent } from '@shared/ui/button/create-button.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { DropdownMenuComponent, DropdownMenuItems } from '@shared/ui/dropdown-menu.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { userProfilePictureUrl } from '@users/config/user.constants';
import { userFullName } from '@users/config/user.functions';
import { UserDataModule } from '@users/data/user-data.module';
import { UserPipesModule } from '@users/pipes/user-pipes.module';
import { UsersSelectFormComponent } from '@users/ui/users-select-form.component';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { map } from 'rxjs';

type ProjectStaffMenuItems = { [memberId: string]: DropdownMenuItems };

@Component( {
                standalone     : true,
                selector       : 'app-project-members',
                template       : `
                    <app-container *ngIf="(dataService.data$ | async)! as data">
                        <app-section-title
                            containerHeaderLeft
                            title="Members"
                            icon="group"
                            [withMarginBottom]="false"></app-section-title>
                        <app-create-button
                            *isAdmin
                            containerHeaderRight
                            appButton
                            [iconOnly]="true"
                            (onClick)="openProjectMemberCreateFormModal()"></app-create-button>
                        <mat-list *ngIf="data.entity.members && projectStaffMenuItems; else noMembers" style="width: 100%">
                            <mat-list-item *ngFor="let member of data.entity.members; let i = index">
                                <div class="w-100 d-flex align-items-center justify-content-between py-2">
                                    <div class="d-flex align-items-center justify-content-start">
                                        <app-avatar type="image"
                                                    imgAlt="profile picture"
                                                    size="medium"
                                                    [imgSrc]="userProfilePictureUrl"
                                                    [tooltip]="member.isCoordinator ? 'Coordinator' : ''"
                                                    [highlight]="member.isCoordinator"></app-avatar>
                                        <div class="d-flex flex-column" style="margin-left: 5px">
                                            <span>{{ member.user | userFullName }}</span>
                                            <span style="font-size: 12px; color: gray">{{ member.user | userEmail }} | {{ member.user | userPhone }}</span>
                                            <span *isAdmin style="font-size: 12px; color: gray">
                                                <strong style="color: #a930c7">{{ member.pricingProfile!.name }}</strong> | 
                                                <strong>{{ member.pricingProfile!.hourlyRate | moneyAmount }} {{ member.pricingProfile!.hourlyRate.currency }}/hr</strong>
                                                <span *ngIf="member.allocatedHours"> | {{ member.allocatedHours }} allocated hours</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-end">
                                        <app-dropdown-menu *isAdmin
                                                           [menuItems]="projectStaffMenuItems[member.id]"></app-dropdown-menu>
                                    </div>
                                </div>
                                <mat-divider *ngIf="i !== data.entity.members.length - 1"></mat-divider>
                            </mat-list-item>
                        </mat-list>
                        <ng-template #noMembers>
                            <em class="fw-lighter">No members added to project yet</em>
                        </ng-template>
                    </app-container>
                `,
                styles         : [
                    `table {
                        width: 100%;
                    }

                    .mat-list-base .mat-list-item, .mat-list-base .mat-list-option {
                        height: auto !important;
                    }
                    `
                ],
                providers      : [ ProjectMembersDataService ],
                imports        : [
                    CommonModule,
                    ProjectDataModule,
                    UsersSelectFormComponent,
                    IsAdminModule,
                    MatDividerModule,
                    MatListModule,
                    DropdownMenuComponent,
                    AvatarComponent,
                    UserPipesModule,
                    UserDataModule,
                    CompanyDataModule,
                    ProjectMemberCreateFormComponent,
                    ProjectMemberUpdateFormComponent,
                    ContainerComponent,
                    SectionTitleComponent,
                    CreateButtonComponent,
                    ButtonModule,
                    SharedPipesModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectMembersComponent implements OnInit {
    projectStaffMenuItems: ProjectStaffMenuItems = {};
    userProfilePictureUrl = userProfilePictureUrl;

    constructor(
        public readonly dataService: ProjectMembersDataService,
        private readonly messageService: MessageService,
        private readonly modalService: ModalService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
        this.setProjectMembersMenuItems();
    }

    openProjectMemberCreateFormModal(): void {
        this.dataService.entity.then( project => {
            this.modalService.openSmModal<ProjectMemberCreateFormModalData>( ProjectMemberCreateFormComponent, this, {
                userOptions$                 : this.dataService.source!.usersSelectInputOptions,
                userOptionsLoading$          : this.dataService.source!.usersSelectInputOptionsLoading,
                pricingProfileOptions$       : this.dataService.source!.pricingProfilesSelectInputOptions,
                pricingProfileOptionsLoading$: this.dataService.source!.pricingProfilesSelectInputOptionsLoading,
                loading$                     : this.dataService.source!.loading,
                onSubmit                     : this.createProjectMember.bind( this ),
                onCancel                     : this.closeProjectMemberCreateFormModal.bind( this ),
                showAllocatedHoursInput      : project.pricing?.type === ProjectPricingDtoTypeEnum.FixedPrice
            } );
        } );
    }

    openProjectMemberUpdateFormModal(projectMember: ProjectMemberDto): void {
        this.dataService.entity.then( project => {
            this.modalService.openSmModal<ProjectMemberUpdateFormModalData>( ProjectMemberUpdateFormComponent, this, {
                initialValues                : projectMember,
                userOptions$                 : this.dataService.source!.usersSelectInputOptions.pipe(
                    map( options => [ ...options, { id: projectMember.user.id, name: userFullName( projectMember.user ) } ] )
                ),
                userOptionsLoading$          : this.dataService.source!.usersSelectInputOptionsLoading,
                pricingProfileOptions$       : this.dataService.source!.pricingProfilesSelectInputOptions,
                pricingProfileOptionsLoading$: this.dataService.source!.pricingProfilesSelectInputOptionsLoading,
                loading$                     : this.dataService.source!.loading,
                onSubmit                     : (data: UpdateProjectMemberDto) => this.updateProjectMember( projectMember.id, data ),
                onCancel                     : this.closeProjectMemberUpdateFormModal.bind( this ),
                onDelete                     : () => this.deleteProjectMember( projectMember.id ),
                showAllocatedHoursInput      : project.pricing?.type === ProjectPricingDtoTypeEnum.FixedPrice
            } );
        } );
    }

    closeProjectMemberCreateFormModal(): void {
        this.modalService.close( ProjectMemberCreateFormComponent );
    }

    closeProjectMemberUpdateFormModal(): void {
        this.modalService.close( ProjectMemberUpdateFormComponent );
    }

    createProjectMember(data: CreateProjectMemberDto): void {
        this.dataService.createProjectMember( data );
        this.onProjectMemberCreateSuccess();
    }

    updateProjectMember(memberId: string, data: UpdateProjectMemberDto): void {
        this.dataService.updateProjectMember( memberId, data );
        this.onProjectMemberUpdateSuccess();
    }

    deleteProjectMember(memberId: string): void {
        this.dataService.deleteProjectMember( memberId );
        this.onProjectMemberDeleteSuccess();
    }

    private onProjectMemberCreateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( ProjectSuccessMessage.MembersUpdated );
            this.closeProjectMemberCreateFormModal();
        } );
    }

    private onProjectMemberUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( ProjectSuccessMessage.MembersUpdated );
            this.closeProjectMemberUpdateFormModal();
        } );
    }

    private onProjectMemberDeleteSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( ProjectSuccessMessage.MembersUpdated );
            this.closeProjectMemberUpdateFormModal();
        } );
    }

    private setProjectMembersMenuItems(): void {
        this.dataService.isLoggedUserAdmin()
            .subscribe( isAdmin => {
                if( isAdmin ) {
                    this.dataService.entity$
                        .pipe( takeUntilDestroy( this ), takeIfDefined )
                        .subscribe( project => project.members.forEach( member => {
                            const menuItems: DropdownMenuItems = [];

                            if( !member.isCoordinator ) {
                                menuItems.push( {
                                                    text   : 'Make coordinator',
                                                    icon   : 'admin_panel_settings',
                                                    color  : 'default',
                                                    command: () => this.updateProjectMember( member.id, {
                                                        userId          : member.user.id,
                                                        pricingProfileId: member.pricingProfile!.id,
                                                        allocatedHours  : member.allocatedHours,
                                                        isCoordinator   : true
                                                    } )
                                                } );
                            }

                            menuItems.push( {
                                                text   : 'Edit',
                                                icon   : 'edit',
                                                color  : 'default',
                                                command: () => this.openProjectMemberUpdateFormModal( member )
                                            } );

                            menuItems.push( {
                                                text   : 'Remove',
                                                icon   : 'delete_outline',
                                                color  : 'warn',
                                                command: () => this.deleteProjectMember( member.id )
                                            } );

                            this.projectStaffMenuItems[member.id] = menuItems;
                        } ) );
                }
            } );
    }
}
