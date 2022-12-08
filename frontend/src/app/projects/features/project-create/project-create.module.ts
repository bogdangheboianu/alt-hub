import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClientDataModule } from '@clients/data/client-data.module';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { ProjectCreateRoutingModule } from '@projects/features/project-create/project-create-routing.module';
import { ProjectCreateComponent } from '@projects/features/project-create/project-create.component';
import { ProjectCreateFormComponent } from '@projects/ui/project-create-form.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';

@NgModule( {
               imports     : [
                   CommonModule,
                   ProjectCreateRoutingModule,
                   ContainerComponent,
                   TitleComponent,
                   ProjectDataModule,
                   ProjectCreateFormComponent,
                   ClientDataModule,
                   HeaderComponent
               ],
               declarations: [ ProjectCreateComponent ]
           } )
export class ProjectCreateModule {
}
