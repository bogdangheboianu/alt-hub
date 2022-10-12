import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from '@dashboard/dashboard-routing.module';
import { DashboardPageComponent } from '@dashboard/pages/dashboard-page/dashboard-page.component';
import { SharedModule } from '@shared/shared.module';
import { QuickActionCardsComponent } from './components/quick-action-cards/quick-action-cards.component';

@NgModule( {
               declarations: [
                   DashboardPageComponent,
                   QuickActionCardsComponent
               ],
               imports: [
                   CommonModule,
                   DashboardRoutingModule,
                   MatDividerModule,
                   SharedModule,
                   MatIconModule
               ],
               exports     : [
                   RouterModule
               ]
           } )
export class DashboardModule {
}
