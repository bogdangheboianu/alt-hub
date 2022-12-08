import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FiscalDataModule } from '@fiscal/data/fiscal-data.module';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';
import { VacationDataModule } from '@vacations/data/vacation-data.module';
import { VacationListRoutingModule } from '@vacations/features/vacation-list/vacation-list-routing.module';
import { VacationListComponent } from '@vacations/features/vacation-list/vacation-list.component';
import { VacationsGanttChartComponent } from '@vacations/ui/vacations-gantt-chart.component';

@NgModule( {
               imports     : [
                   VacationListRoutingModule,
                   VacationDataModule,
                   FiscalDataModule,
                   HeaderComponent,
                   TitleComponent,
                   VacationsGanttChartComponent,
                   CommonModule,
                   ContainerComponent
               ],
               declarations: [ VacationListComponent ]
           } )
export class VacationListModule {
}
