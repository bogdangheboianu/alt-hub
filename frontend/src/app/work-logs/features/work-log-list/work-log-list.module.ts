import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ClientDataModule } from '@clients/data/client-data.module';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { FileManagerModule } from '@shared/features/file-manager/file-manager.module';
import { ButtonModule } from '@shared/ui/button/button.module';
import { DownloadButtonComponent } from '@shared/ui/button/download-button.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { FileUploadComponent } from '@shared/ui/file-upload.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';
import { UserDataModule } from '@users/data/user-data.module';
import { VacationDataModule } from '@vacations/data/vacation-data.module';
import { WorkLogDataModule } from '@work-logs/data/work-log-data.module';
import { WorkLogListRoutingModule } from '@work-logs/features/work-log-list/work-log-list-routing.module';
import { WorkLogListComponent } from '@work-logs/features/work-log-list/work-log-list.component';
import { WorkLogListFiltersComponent } from '@work-logs/ui/work-log-list-filters.component';
import { WorkLogListTableComponent } from '@work-logs/ui/work-log-list-table.component';
import { WorkLogListTimesheetComponent } from '@work-logs/ui/work-log-list-timesheet.component';

@NgModule( {
               imports     : [
                   WorkLogListRoutingModule,
                   CommonModule,
                   WorkLogDataModule,
                   HeaderComponent,
                   TitleComponent,
                   FileUploadComponent,
                   DownloadButtonComponent,
                   ButtonModule,
                   WorkLogListFiltersComponent,
                   UserDataModule,
                   ProjectDataModule,
                   ClientDataModule,
                   WorkLogListTableComponent,
                   FileManagerModule,
                   ContainerComponent,
                   MatButtonToggleModule,
                   FormsModule,
                   WorkLogListTimesheetComponent,
                   VacationDataModule
               ],
               declarations: [ WorkLogListComponent ]
           } )
export class WorkLogListModule {
}
