import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientActions } from '@client/store/client.actions';
import { ClientSelectors } from '@client/store/client.selectors';
import { ClientDto } from '@dtos/client.dto';
import { getParamFromRoute } from '@shared/functions/get-from-route.function';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                selector   : 'app-client-page',
                templateUrl: './client-page.component.html',
                styleUrls  : [ './client-page.component.scss' ]
            } )
@UntilDestroy()
export class ClientPageComponent implements OnInit {
    client$!: Observable<ClientDto | undefined>;

    constructor(
        private route: ActivatedRoute,
        private clientActions: ClientActions,
        private clientSelectors: ClientSelectors
    ) {
    }

    ngOnInit(): void {
        this.loadClient();
        this.client$ = this.clientSelectors.selectActive();
    }

    private loadClient(): void {
        getParamFromRoute( 'id', this.route )
            .pipe( takeUntilDestroy( this ) )
            .subscribe( id => this.clientActions.loadClientById( id ) );
    }
}
