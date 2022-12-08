import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthDataModule } from '@auth/data/auth-data.module';
import { IsAdminModule } from '@auth/directives/is-admin/is-admin.module';
import { ClientDataModule } from '@clients/data/client-data.module';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { ProjectDetailsRoutingModule } from '@projects/features/project-details/project-details-routing.module';
import { ProjectDetailsComponent } from '@projects/features/project-details/project-details.component';
import { ProjectPricingComponent } from '@projects/features/project-pricing/project-pricing.component';
import { ProjectTimelineComponent } from '@projects/features/project-timeline/project-timeline.component';
import { ProjectPipesModule } from '@projects/pipes/project-pipes.module';
import { ProjectDetailsHeaderComponent } from '@projects/ui/project-details-header.component';
import { ProjectDetailsTabsComponent } from '@projects/ui/project-details-tabs.component';
import { ProjectInfoUpdateFormComponent } from '@projects/ui/project-info-update-form.component';
import { ModalModule } from '@shared/features/modal/modal.module';
import { ContainerComponent } from '@shared/ui/container.component';
import { DropdownMenuComponent } from '@shared/ui/dropdown-menu.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { TitleComponent } from '@shared/ui/title.component';
import { WorkLogDataModule } from '@work-logs/data/work-log-data.module';

@NgModule( {
               imports     : [
                   CommonModule,
                   ProjectDataModule,
                   ProjectDetailsRoutingModule,
                   ClientDataModule,
                   HeaderComponent,
                   TitleComponent,
                   ProjectPipesModule,
                   DropdownMenuComponent,
                   IsAdminModule,
                   ProjectInfoUpdateFormComponent,
                   ProjectDetailsHeaderComponent,
                   ContainerComponent,
                   ProjectTimelineComponent,
                   MatTabsModule,
                   WorkLogDataModule,
                   LoadingBarComponent,
                   ModalModule,
                   AuthDataModule,
                   ProjectPricingComponent,
                   ProjectDetailsTabsComponent
               ],
               declarations: [ ProjectDetailsComponent ]
           } )
export class ProjectDetailsModule {
}
