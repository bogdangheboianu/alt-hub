import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UserDto } from '@dtos/user-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { ButtonModule } from '@shared/ui/button/button.module';
import { SaveButtonComponent } from '@shared/ui/button/save-button.component';
import { AutocompleteMultiselectInputComponent } from '@shared/ui/input/autocomplete-multiselect-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { userFullName } from '@users/config/user.functions';
import { UntilDestroy } from 'ngx-reactivetoolkit';

type SelectUsersFormData = { users: UserDto[] };

@Component( {
                standalone     : true,
                selector       : 'app-users-select-form',
                template       : `
                    <form *ngIf="form"
                          [formGroup]="form"
                          (ngSubmit)="submit()">
                        <app-autocomplete-multiselect-input appInput
                                                            label="Add project members"
                                                            formControlName="users"
                                                            placeholder="Search employees"
                                                            [objects]="users"
                                                            [idKey]="'id'"
                                                            [displayFn]="userFullNameFn"
                                                            [success]="success"></app-autocomplete-multiselect-input>
                        <app-save-button appButton
                                         *ngIf="form!.controls.users.getRawValue().length > 0"
                                         [disabled]="loading"
                                         [fullWidth]="true"></app-save-button>
                    </form>
                `,
                imports        : [
                    CommonModule,
                    MatFormFieldModule,
                    MatChipsModule,
                    MatIconModule,
                    ReactiveFormsModule,
                    MatAutocompleteModule,
                    AutocompleteMultiselectInputComponent,
                    InputModule,
                    SaveButtonComponent,
                    ButtonModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UsersSelectFormComponent extends AbstractForm<SelectUsersFormData> implements OnInit {
    @Input()
    users!: UserDto[];

    @Input()
    override loading!: boolean;

    @Input()
    set usersLoading(value: boolean) {
        const input = this.form?.controls.users;
        value
        ? input?.disable()
        : input?.enable();
    }

    @Input()
    success!: boolean;

    @Output()
    override onSubmit = new EventEmitter<SelectUsersFormData>();

    override initialValues = null;
    userFullNameFn = userFullName;

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.init();
    }

    protected override formFields(): FormFields<SelectUsersFormData> {
        return { users: [ { value: [], disabled: true } ] };
    }
}
