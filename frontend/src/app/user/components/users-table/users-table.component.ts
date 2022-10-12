import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppR } from '@shared/constants/routes';
import { PaginatedResultDto } from '@dtos/paginated-result.dto';
import { UserDto } from '@dtos/user.dto';
import { BasePaginatedTable } from '@shared/directives/base-paginated-table.directive';
import { TableColumns } from '@shared/directives/base-table.directive';
import { UserSelectors } from '@user/store/user.selectors';
import { UserState } from '@user/store/user.store';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable, of } from 'rxjs';

@Component( {
                selector   : 'app-users-table',
                templateUrl: './users-table.component.html',
                styleUrls  : [ './users-table.component.scss' ]
            } )
@UntilDestroy()
export class UsersTableComponent extends BasePaginatedTable<UserDto, UserState> implements OnInit {
    @Input() showStatus: boolean = false;

    override columns: TableColumns<UserDto> = [];
    override pagination$: Observable<PaginatedResultDto | null> = of( null );

    constructor(
        private readonly userSelectors: UserSelectors,
        private readonly router: Router
    ) {
        super( userSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.setColumns();
    }

    async goToUserPage(user: UserDto): Promise<void> {
        await this.router.navigateByUrl( `${ AppR.user.list.full }/${ user.id }` );
    }

    private setColumns(): void {
        this.columns = [
            'profilePicture',
            'name',
            'email',
            'companyPosition',
            'employeeId',
            'employmentPeriod'
        ];

        if( this.showStatus ) {
            this.columns.push( 'status' );
        }
    }
}
