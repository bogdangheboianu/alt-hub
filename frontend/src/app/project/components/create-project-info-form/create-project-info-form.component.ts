import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { clientsToSelectInputOptions } from '@client/mappers/client.mappers';
import { ClientActions } from '@client/store/client.actions';
import { ClientSelectors } from '@client/store/client.selectors';
import { CreateProjectInfoDto } from '@dtos/create-project-info.dto';
import { ProjectSelectors } from '@project/store/project.selectors';
import { ProjectStore } from '@project/store/project.store';
import { BaseForm } from '@shared/directives/base-form.directive';
import { ISelectInputOption, SelectInputOptions } from '@shared/interfaces/select-input-option.interface';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { map } from 'rxjs';

@Component( {
                selector   : 'app-create-project-info-form',
                templateUrl: './create-project-info-form.component.html',
                styleUrls  : [ './create-project-info-form.component.scss' ]
            } )
@UntilDestroy()
export class CreateProjectInfoFormComponent extends BaseForm<CreateProjectInfoDto> implements OnInit {
    form!: FormGroupTyped<CreateProjectInfoDto>;
    clientOptions: SelectInputOptions = [];

    constructor(
        private formBuilder: FormBuilder,
        private projectStore: ProjectStore,
        private projectSelectors: ProjectSelectors,
        private clientActions: ClientActions,
        private clientSelectors: ClientSelectors
    ) {
        super( projectSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.loadClientInputOptions();
        this.form = this.buildForm();
    }

    clientOptionDisplay(client: ISelectInputOption): string {
        return client.name;
    }

    protected buildForm(): FormGroupTyped<CreateProjectInfoDto> {
        const fields: FormFields<CreateProjectInfoDto> = {
            name       : [ this.initialValues?.name ?? '', Validators.required ],
            clientId   : [ this.initialValues?.clientId ?? '' ],
            description: [ this.initialValues?.description ?? '' ]
        };
        return this.formBuilder.nonNullable.group<CreateProjectInfoDto>( fields );
    }

    protected override onSubmit(): void {
        this.projectStore.setNewProjectInfo( this.form.getRawValue() );
    }

    private loadClientInputOptions(): void {
        this.clientActions.loadAllClients();
        this.clientSelectors.selectAll()
            .pipe(
                takeUntilDestroy( this ),
                map( clientsToSelectInputOptions )
            )
            .subscribe( options => this.clientOptions = options );
    }
}
