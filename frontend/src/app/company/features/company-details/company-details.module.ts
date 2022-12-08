import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CompanyDataModule } from '@company/data/company-data.module';
import { CompanyDetailsRoutingModule } from '@company/features/company-details/company-details-routing.module';
import { CompanyDetailsComponent } from '@company/features/company-details/company-details.component';
import { CompanyDocumentsComponent } from '@company/features/company-documents/company-documents.component';
import { CompanyPositionsComponent } from '@company/features/company-positions/company-positions.component';
import { CompanyPricingProfilesComponent } from '@company/features/company-pricing-profiles/company-pricing-profiles.component';
import { CompanyStatsCardsComponent } from '@company/ui/company-stats-cards.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { TitleComponent } from '@shared/ui/title.component';

@NgModule( {
               imports     : [
                   CommonModule,
                   CompanyDetailsRoutingModule,
                   ContainerComponent,
                   TitleComponent,
                   MatDividerModule,
                   CompanyPositionsComponent,
                   CompanyDataModule,
                   CompanyStatsCardsComponent,
                   LoadingBarComponent,
                   CompanyPricingProfilesComponent,
                   CompanyDocumentsComponent
               ],
               declarations: [ CompanyDetailsComponent ]
           } )
export class CompanyDetailsModule {
}
