import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { isDefined } from '@datorama/akita';
import { PaginationParamsDto } from '@dtos/pagination-params.dto';
import { UserStatusEnum } from '@dtos/user-status.enum';
import { UserDto } from '@dtos/user.dto';
import { takeIfDefined } from '@shared/custom-rxjs-operators';
import { getParamFromRoute } from '@shared/functions/get-from-route.function';
import { UserActions } from '@user/store/user.actions';
import { UserSelectors } from '@user/store/user.selectors';
import { CreateWorkLogFormComponent } from '@work-log/components/create-work-log-form/create-work-log-form.component';
import { CreateWorkLogRecurrenceFormComponent } from '@work-log/components/create-work-log-recurrence-form/create-work-log-recurrence-form.component';
import { WorkLogRecurrenceActions } from '@work-log/store/work-log-recurrence/work-log-recurrence.actions';
import { WorkLogActions } from '@work-log/store/work-log/work-log.actions';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { firstValueFrom, Observable, take, tap } from 'rxjs';

type Panel = 'personalInfo' | 'employeeInfo' | 'accountInfo';
type PanelExpandedStates = { [K in Panel]: boolean };
type VisibleWorkLogTable = 'workLogs' | 'workLogRecurrences'

@Component( {
                selector   : 'app-user-page',
                templateUrl: './user-page.component.html',
                styleUrls  : [ './user-page.component.scss' ]
            } )
@UntilDestroy()
export class UserPageComponent implements OnInit {
    user$!: Observable<UserDto | undefined>;
    userPanelExpandedStates: PanelExpandedStates = {
        'personalInfo': true,
        'employeeInfo': false,
        'accountInfo' : false
    };
    visibleWorkLogTable: VisibleWorkLogTable = 'workLogs';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userActions: UserActions,
        private userSelectors: UserSelectors,
        private workLogActions: WorkLogActions,
        private workLogRecurrenceActions: WorkLogRecurrenceActions,
        private authSelectors: AuthSelectors,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.user$ = this.userSelectors.selectActive();
        this.loadUser();
        this.loadPaginatedUserWorkLogs();
        this.loadAllUserWorkLogRecurrences();
        this.handleRouteParams();
    }

    panelOpened(panel: Panel): void {
        Object.keys( this.userPanelExpandedStates )
              .forEach( key => {
                  this.userPanelExpandedStates[key as Panel] = key === panel;
              } );
    }

    panelClosed(panel: Panel): void {
        this.userPanelExpandedStates[panel] = false;
    }

    openCreateWorkLogDialog(user: UserDto): void {
        this.dialog.open( CreateWorkLogFormComponent,
                          {
                              width: '600px',
                              data : {
                                  userId: user.id
                              }
                          } );
    }

    openCreateWorkLogRecurrenceDialog(user: UserDto): void {
        this.dialog.open( CreateWorkLogRecurrenceFormComponent,
                          {
                              width: '600px',
                              data : {
                                  userId: user.id
                              }
                          } );
    }

    onWorkLogsPageChange(pagination: PaginationParamsDto): void {
        this.loadPaginatedUserWorkLogs( pagination );
    }

    showUserStatusSteps(user: UserDto): boolean {
        return user.status !== UserStatusEnum.Active && user.status !== UserStatusEnum.Inactive;
    }

    userIsActive(user: UserDto): boolean {
        return user.status === UserStatusEnum.Active;
    }

    private loadUser(): void {
        getParamFromRoute( 'id', this.route )
            .pipe( takeIfDefined )
            .subscribe( id => this.userActions.loadUserById( id ) );
    }

    private loadPaginatedUserWorkLogs(pagination?: PaginationParamsDto): void {
        this.user$.pipe(
                takeUntilDestroy( this ),
                takeIfDefined,
                tap( user => this.workLogActions.loadPaginatedWorkLogs( { userId: user.id, ...pagination } ) )
            )
            .subscribe();
    }

    private loadAllUserWorkLogRecurrences(): void {
        this.workLogRecurrenceActions.loadAllUserWorkLogRecurrences();
    }

    private handleRouteParams(): void {
        this.route.queryParams
            .pipe( take( 1 ) )
            .subscribe( async (params: Params) => {
                if( isDefined( params['log-work'] ) ) {
                    const loggedUser = await firstValueFrom( this.authSelectors.selectLoggedUser() );
                    this.openCreateWorkLogDialog( loggedUser! );
                }
            } );
    }
}
