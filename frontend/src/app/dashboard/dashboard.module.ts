import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { AuthDataModule } from '@auth/data/auth-data.module';
import { DashboardRoutingModule } from '@dashboard/dashboard-routing.module';
import { DashboardComponent } from '@dashboard/dashboard.component';
import { QuickActionCardComponent } from '@shared/ui/quick-action-card.component';
import { WorkLogDataModule } from '@work-logs/data/work-log-data.module';

@NgModule( {
               imports     : [
                   CommonModule,
                   DashboardRoutingModule,
                   MatDividerModule,
                   QuickActionCardComponent,
                   AuthDataModule,
                   WorkLogDataModule
               ],
               declarations: [
                   DashboardComponent
               ]
           } )
export class DashboardModule {
}
