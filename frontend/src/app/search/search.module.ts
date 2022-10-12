import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SearchAllComponent } from '@search/components/search-all/search-all.component';
import { SharedModule } from '@shared/shared.module';

@NgModule( {
               declarations: [
                   SearchAllComponent
               ],
               imports: [
                   CommonModule,
                   SharedModule,
                   MatIconModule,
                   MatFormFieldModule,
                   MatInputModule
               ],
               exports     : [
                   SearchAllComponent
               ]
           } )
export class SearchModule {
}
