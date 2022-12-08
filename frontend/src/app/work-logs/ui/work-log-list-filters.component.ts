import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientDto } from '@dtos/client-dto';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { ProjectDto } from '@dtos/project-dto';
import { UserDto } from '@dtos/user-dto';
import { atLeastOneValueDefined, valueIsEmpty, valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { ButtonModule } from '@shared/ui/button/button.module';
import { LinkButtonComponent } from '@shared/ui/button/link-button.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { userFullName } from '@users/config/user.functions';
import { map, Observable, of, startWith } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-work-log-list-filters',
                template       : `
                    <div [class.mb-3]="withMarginBottom">
                        <app-container [noBackground]="noBackground">
                            <div class="d-flex align-items-center justify-content-between w-100 mb-3">
                                <h5 *ngIf="showTitle" class="mat-subheading-2 m-0 p-0">Filters</h5>
                                <app-link-button
                                    appButton
                                    *ngIf="hasFiltersApplied"
                                    label="Clear all"
                                    icon="highlight_off"
                                    (onClick)="clearAllFilters()"></app-link-button>
                            </div>
                            <div class="d-flex align-items-center justify-content-between gap-1">
                                <mat-form-field appearance="outline">
                                    <mat-label>Period</mat-label>
                                    <mat-date-range-input [rangePicker]="picker">
                                        <input matStartDate
                                               [formControl]="fromDateControl"
                                               placeholder="From date"
                                               (dateChange)="onFromDateFilterChanged($any($event.target).value)">
                                        <input matEndDate
                                               [formControl]="toDateControl"
                                               placeholder="To date"
                                               (dateChange)="onToDateFilterChanged($any($event.target).value)">
                                    </mat-date-range-input>
                                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                                    <mat-date-range-picker #picker></mat-date-range-picker>
                                </mat-form-field>
                                <form *ngIf="showUsersFilter">
                                    <mat-form-field appearance="outline">
                                        <mat-label>Employee</mat-label>
                                        <input matInput
                                               type="text"
                                               placeholder="Type employee name..."
                                               [formControl]="userControl"
                                               [matAutocomplete]="userAutocomplete"
                                               (focus)="userInputFocused()">
                                        <mat-autocomplete #userAutocomplete="matAutocomplete"
                                                          autoActiveFirstOption
                                                          [displayWith]="displayUserFn"
                                                          (optionSelected)="onUserOptionSelected($event)">
                                            <mat-option *ngFor="let option of filteredUserOptions$ | async"
                                                        [value]="option">{{ displayUserFn(option) }}</mat-option>
                                        </mat-autocomplete>
                                    </mat-form-field>
                                </form>
                                <form *ngIf="showProjectsFilter">
                                    <mat-form-field appearance="outline">
                                        <mat-label>Project</mat-label>
                                        <input matInput
                                               type="text"
                                               placeholder="Type project name..."
                                               [formControl]="projectControl"
                                               [matAutocomplete]="projectAutocomplete"
                                               (focus)="projectInputFocused()">
                                        <mat-autocomplete #projectAutocomplete="matAutocomplete"
                                                          autoActiveFirstOption
                                                          [displayWith]="displayProjectFn"
                                                          (optionSelected)="onProjectOptionSelected($event)">
                                            <mat-option *ngFor="let option of filteredProjectOptions$ | async"
                                                        [value]="option">{{ displayProjectFn(option) }}</mat-option>
                                        </mat-autocomplete>
                                    </mat-form-field>
                                </form>
                                <form *ngIf="showClientsFilter">
                                    <mat-form-field appearance="outline">
                                        <mat-label>Client</mat-label>
                                        <input matInput
                                               type="text"
                                               placeholder="Type client name..."
                                               [formControl]="clientControl"
                                               [matAutocomplete]="clientAutocomplete"
                                               (focus)="clientInputFocused()">
                                        <mat-autocomplete #clientAutocomplete="matAutocomplete"
                                                          autoActiveFirstOption
                                                          [displayWith]="displayClientFn"
                                                          (optionSelected)="onClientOptionSelected($event)">
                                            <mat-option *ngFor="let option of filteredClientOptions$ | async"
                                                        [value]="option">{{ displayClientFn(option) }}</mat-option>
                                        </mat-autocomplete>
                                    </mat-form-field>
                                </form>
                            </div>
                        </app-container>
                    </div>
                `,
                imports        : [
                    ContainerComponent,
                    LinkButtonComponent,
                    ButtonModule,
                    CommonModule,
                    MatFormFieldModule,
                    MatInputModule,
                    FormsModule,
                    MatDatepickerModule,
                    ReactiveFormsModule,
                    MatAutocompleteModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class WorkLogListFiltersComponent implements OnInit {
    @Input()
    users: UserDto[] = [];

    @Input()
    projects: ProjectDto[] = [];

    @Input()
    clients: ClientDto[] = [];

    @Input()
    showUsersFilter = true;

    @Input()
    showProjectsFilter = true;

    @Input()
    showClientsFilter = true;

    @Input()
    noBackground = false;

    @Input()
    showTitle = true;

    @Input()
    withMarginBottom = true;

    @Input()
    set initialValues(value: GetPaginatedWorkLogsParamsDto | undefined) {
        if( valueIsNotEmpty( value ) ) {
            this.filters = value;
        }

        this.setData();
    }

    @Output()
    onFiltersChange = new EventEmitter<GetPaginatedWorkLogsParamsDto>();

    @Output()
    onProjectInputFocus = new EventEmitter();

    @Output()
    onUserInputFocus = new EventEmitter();

    @Output()
    onClientInputFocus = new EventEmitter();

    filters: GetPaginatedWorkLogsParamsDto = {};
    filteredUserOptions$: Observable<UserDto[]> = of( [] );
    filteredProjectOptions$: Observable<ProjectDto[]> = of( [] );
    filteredClientOptions$: Observable<ClientDto[]> = of( [] );
    fromDateControl = new FormControl<Date | string>( '' );
    toDateControl = new FormControl<Date | string>( '' );
    userControl = new FormControl<string | UserDto>( '' );
    projectControl = new FormControl<string | ProjectDto>( '' );
    clientControl = new FormControl<string | ClientDto>( '' );

    get hasFiltersApplied(): boolean {
        const { fromDate, toDate, userId, clientId, projectId } = this.filters;
        return atLeastOneValueDefined( fromDate, toDate, userId, clientId, projectId );
    }

    ngOnInit(): void {
        this.setData();
    }

    onFromDateFilterChanged(value: Date | null): void {
        this.filters = { ...this.filters, fromDate: value?.toISOString(), toDate: undefined };

        if( valueIsNotEmpty( this.filters.fromDate ) && valueIsNotEmpty( this.filters.toDate ) ) {
            this.emitAppliedFilters();
        }
    }

    onToDateFilterChanged(value: Date | null): void {
        this.filters = { ...this.filters, toDate: value?.toISOString() };

        if( valueIsNotEmpty( this.filters.fromDate ) && valueIsNotEmpty( this.filters.toDate ) ) {
            this.emitAppliedFilters();
        }
    }

    onUserOptionSelected(event: MatAutocompleteSelectedEvent): void {
        this.filters = { ...this.filters, userId: event.option.value.id };
        this.emitAppliedFilters();
    }

    onProjectOptionSelected(event: MatAutocompleteSelectedEvent): void {
        this.filters = { ...this.filters, projectId: event.option.value.id };
        this.emitAppliedFilters();
    }

    onClientOptionSelected(event: MatAutocompleteSelectedEvent): void {
        this.filters = { ...this.filters, clientId: event.option.value.id };
        this.emitAppliedFilters();
    }

    clearAllFilters(): void {
        this.filters = {};
        this.fromDateControl.reset();
        this.toDateControl.reset();
        this.userControl.reset();
        this.projectControl.reset();
        this.clientControl.reset();
        this.emitAppliedFilters();
    }

    displayUserFn(user?: UserDto): string {
        return userFullName( user );
    }

    displayProjectFn(project: ProjectDto): string {
        return project?.info?.name ?? '';
    }

    displayClientFn(client?: ClientDto): string {
        return client?.name ?? '';
    }

    projectInputFocused(): void {
        this.onProjectInputFocus.emit();
    }

    userInputFocused(): void {
        this.onUserInputFocus.emit();
    }

    clientInputFocused(): void {
        this.onClientInputFocus.emit();
    }

    private setData(): void {
        this.filteredUserOptions$ = this.getFilteredUserOptions();
        this.filteredProjectOptions$ = this.getFilteredProjectOptions();
        this.filteredClientOptions$ = this.getFilteredClientOptions();
        this.fromDateControl.setValue( this.filters?.fromDate ?? null );
        this.toDateControl.setValue( this.filters?.toDate ?? null );
    }

    private emitAppliedFilters(): void {
        this.onFiltersChange.emit( this.filters );
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

    private getFilteredClientOptions(): Observable<ClientDto[]> {
        return this.clientControl.valueChanges.pipe(
            startWith( '' ),
            map( option => valueIsEmpty( option )
                           ? this.clients.slice()
                           : this.filterClientOptions( option ) )
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

    private filterClientOptions(filterValue: string | ClientDto): ClientDto[] {
        return this.clients.filter( client => client.name.toLowerCase()
                                                    .includes( typeof filterValue === 'string'
                                                               ? filterValue.toLowerCase()
                                                               : filterValue.name ) );
    }
}
