import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ClientDto } from '@dtos/client-dto';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-client-list-table',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <table mat-table [dataSource]="clients">
                        <ng-container matColumnDef="name">
                            <th mat-header-cell *matHeaderCellDef> Name</th>
                            <td mat-cell *matCellDef="let client"> {{ client.name }} </td>
                        </ng-container>
                        <ng-container matColumnDef="createdAt">
                            <th mat-header-cell *matHeaderCellDef> Created on</th>
                            <td mat-cell *matCellDef="let client"> {{ client | createdAt }} </td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="columns"></tr>
                        <tr mat-row *matRowDef="let client; columns: columns;" (click)="rowClicked(client)"></tr>
                    </table>
                `,
                imports        : [
                    CommonModule,
                    MatTableModule,
                    LoadingBarComponent,
                    SharedPipesModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles         : [ 'table {width: 100%}' ]
            } )
@UntilDestroy()
export class ClientListTableComponent {
    @Input() clients!: ClientDto[];
    @Input() loading!: boolean;

    @Output() onRowClick = new EventEmitter<ClientDto>();

    get columns(): string[] {
        return [ 'name', 'createdAt' ];
    }

    rowClicked(client: ClientDto): void {
        this.onRowClick.emit( client );
    }
}
