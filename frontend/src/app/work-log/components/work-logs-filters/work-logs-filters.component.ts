import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params.dto';
import { ProjectDto } from '@dtos/project.dto';
import { UserDto } from '@dtos/user.dto';
import { ProjectActions } from '@project/store/project.actions';
import { ProjectSelectors } from '@project/store/project.selectors';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { userFullName } from '@user/functions/user-full-name.function';
import { UserActions } from '@user/store/user.actions';
import { UserSelectors } from '@user/store/user.selectors';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { map, Observable, of, startWith } from 'rxjs';

@Component( {
                selector   : 'app-work-logs-filters',
                templateUrl: './work-logs-filters.component.html',
                styleUrls  : [ './work-logs-filters.component.scss' ]
            } )
@UntilDestroy()
export class WorkLogsFiltersComponent implements OnInit {
    filters: GetPaginatedWorkLogsParamsDto = {};
    users: UserDto[] = [];
    projects: ProjectDto[] = [];
    filteredUserOptions$: Observable<UserDto[]> = of( [] );
    filteredProjectOptions$: Observable<ProjectDto[]> = of( [] );
    userControl = new FormControl<string | UserDto>( '' );
    projectControl = new FormControl<string | ProjectDto>( '' );
    @Output() onFiltersChange = new EventEmitter<GetPaginatedWorkLogsParamsDto>();

    get hasFiltersApplied(): boolean {
        return valueIsNotEmpty( this.filters );
    }

    constructor(
        private userActions: UserActions,
        private userSelectors: UserSelectors,
        private projectActions: ProjectActions,
        private projectSelectors: ProjectSelectors
    ) {
    }

    ngOnInit(): void {
        this.loadAllUsers();
        this.loadAllProjects();
        this.filteredUserOptions$ = this.getFilteredUserOptions();
        this.filteredProjectOptions$ = this.getFilteredProjectOptions();
    }

    onFromDateFilterChanged(value: Date): void {
        this.filters = { ...this.filters, fromDate: value };
        this.emitAppliedFilters();
    }

    onToDateFilterChanged(value: Date): void {
        this.filters = { ...this.filters, toDate: value };
        this.emitAppliedFilters();
    }

    onUserOptionSelected(event: MatAutocompleteSelectedEvent): void {
        this.filters = { ...this.filters, userId: event.option.value.id };
        this.emitAppliedFilters();
    }

    onProjectOptionSelected(event: MatAutocompleteSelectedEvent): void {
        this.filters = { ...this.filters, projectId: event.option.value.id };
        this.emitAppliedFilters();
    }

    clearAllFilters(): void {
        this.filters = {};
        this.userControl.reset();
        this.projectControl.reset();
        this.emitAppliedFilters();
    }

    displayUserFn(user: UserDto): string {
        return userFullName( user );
    }

    displayProjectFn(project: ProjectDto): string {
        return project?.info?.name ?? '';
    }

    private emitAppliedFilters(): void {
        this.onFiltersChange.emit( this.filters );
    }

    private loadAllUsers(): void {
        this.userActions.loadAllUsers();
        this.userSelectors.selectAll()
            .pipe( takeUntilDestroy( this ) )
            .subscribe( users => this.users = users );
    }

    private loadAllProjects(): void {
        this.projectActions.loadAllProjects();
        this.projectSelectors.selectAll()
            .pipe( takeUntilDestroy( this ) )
            .subscribe( projects => this.projects = projects );
    }

    private getFilteredUserOptions(): Observable<UserDto[]> {
        return this.userControl.valueChanges.pipe(
            startWith( '' ),
            map( option => valueIsEmpty( option )
                           ? this.users.slice()
                           : this.filterUserOptions( option ) )
        );
    }

    private getFilteredProjectOptions(): Observable<ProjectDto[]> {
        return this.projectControl.valueChanges.pipe(
            startWith( '' ),
            map( option => valueIsEmpty( option )
                           ? this.projects.slice()
                           : this.filterProjectOptions( option ) )
        );
    }

    private filterUserOptions(filterValue: string | UserDto): UserDto[] {
        return this.users.filter( user => userFullName( user )
            .toLowerCase()
            .includes( typeof filterValue === 'string'
                       ? filterValue.toLowerCase()
                       : userFullName( filterValue ) ) );
    }

    private filterProjectOptions(filterValue: string | ProjectDto): ProjectDto[] {
        return this.projects.filter( project => project.info.name.toLowerCase()
                                                       .includes( typeof filterValue === 'string'
                                                                  ? filterValue.toLowerCase()
                                                                  : filterValue.info.name ) );
    }
}
