import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Host, Input, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { arrayMinusArray } from '@shared/config/functions/array.functions';
import { valueIsEmpty, valueIsNotEmpty, valueIsString } from '@shared/config/functions/value.functions';
import { InputDirective } from '@shared/ui/input/input.directive';
import { filter, map, Observable, of, startWith } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-autocomplete-multiselect-input',
                template       : `
                    <mat-form-field appearance="outline">
                        <mat-label>{{ input.label }}</mat-label>
                        <mat-chip-list #chipList aria-label="Objects selection">
                            <mat-chip *ngFor="let obj of selected" (removed)="removeObj(obj)">
                                {{ displayFn(obj) }}
                                <button matChipRemove>
                                    <mat-icon>cancel</mat-icon>
                                </button>
                            </mat-chip>
                            <input #searchInput
                                   [formControl]="searchControl"
                                   [placeholder]="input.placeholder"
                                   [required]="input.required"
                                   [class.disabled]="input.disabled"
                                   [matAutocomplete]="auto"
                                   [matChipInputFor]="chipList"
                                   [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                                   (blur)="input.onTouch()">
                        </mat-chip-list>
                        <mat-autocomplete #auto="matAutocomplete"
                                          [autoActiveFirstOption]="true"
                                          (optionSelected)="objSelected($event)">
                            <mat-option *ngFor="let obj of filtered$ | async" [value]="obj">{{ displayFn(obj)}}</mat-option>
                        </mat-autocomplete>
                    </mat-form-field>
                `,
                styles         : [
                    `
                        :host ::ng-deep {
                            .mat-form-field-appearance-outline .mat-form-field-wrapper {
                                margin: 7px 0 !important;
                            }

                            .mat-form-field-wrapper {
                                padding: 0 !important;
                            }
                        }

                    `
                ],
                imports        : [
                    MatFormFieldModule,
                    MatChipsModule,
                    CommonModule,
                    MatIconModule,
                    FormsModule,
                    MatAutocompleteModule,
                    ReactiveFormsModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class AutocompleteMultiselectInputComponent<T extends object> implements AfterViewInit {
    @Input()
    set objects(value: T[]) {
        this._objects = value;
        this.filtered$ = this.filterObjects();
    }

    @Input()
    set success(value: boolean) {
        if( value ) {
            this.resetSearchInput( true );
        }
    }

    @Input()
    idKey!: keyof T;

    @Input()
    searchKey?: keyof T;

    @Input()
    displayFn!: (obj: T) => string;

    @ViewChild( MatInput )
    matInput!: MatInput;

    @ViewChild( 'searchInput' )
    searchInput!: ElementRef<HTMLInputElement>;

    set selected(value: T[]) {
        this._selected = value;
        this.input.onChange( value );
    }

    get selected(): T[] {
        return this._selected;
    }

    filtered$: Observable<T[]> = of( [] );
    searchControl = new FormControl( '' );
    separatorKeysCodes: number[] = [ ENTER, COMMA ];
    private _objects: T[] = [];
    private _selected: T[] = [];

    constructor(@Host() public readonly input: InputDirective<T[]>) {
    }

    ngAfterViewInit(): void {
        this.input.inputElement = this.matInput;
    }

    objSelected(event: MatAutocompleteSelectedEvent): void {
        this.selected = [ ...this.selected, event.option.value ];
        this.resetSearchInput();
    }

    removeObj(objToRemove: T): void {
        this.selected = this.selected.filter( obj => obj[this.idKey] !== objToRemove[this.idKey] );
    }

    private filterObjects(): Observable<T[]> {
        return this.searchControl.valueChanges.pipe(
            startWith( null ),
            filter( searchValue => valueIsNotEmpty( searchValue ) && valueIsString( searchValue ) ),
            map( this.filterObjectsBySearchKey.bind( this ) )
        );
    }

    private filterObjectsBySearchKey(searchValue: string | null): T[] {
        if( valueIsEmpty( searchValue ) ) {
            return this._objects;
        }

        searchValue = searchValue.toLowerCase()
                                 .trim();
        const filtered = this._objects.filter( obj => valueIsEmpty( this.searchKey )
                                                      ? this.displayFn( obj )
                                                            .toLowerCase()
                                                            .includes( searchValue! )
                                                      : (
                                                          obj[this.searchKey] as any
                                                      ).toString()
                                                       .toLowerCase()
                                                       .includes( searchValue! ) );

        return arrayMinusArray( filtered, this._selected, this.idKey );
    }

    private resetSearchInput(clearSelected: boolean = false): void {
        if( valueIsNotEmpty( this.searchControl ) && valueIsNotEmpty( this.searchInput ) ) {
            this.searchControl.setValue( '' );
            this.searchInput.nativeElement.value = '';
        }

        if( clearSelected ) {
            this.selected = [];
        }
    }
}
