import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { BaseEntitySelector } from '@config/store/store.models';
import { map, Observable, of } from 'rxjs';

// TODO: create errors store and inject here
export function ServerValidator(selectors?: BaseEntitySelector<any, any>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return selectors?.selectErrors()
                        .pipe(
                            map( errors => {
                                const validationErrors: ValidationErrors = {};
                                errors.filter( err => err.field !== undefined )
                                      .forEach( err => {
                                          if( control.get( err.field! ) ) {
                                              validationErrors[err.field!] = err.message;
                                          }
                                      } );
                                return validationErrors;
                            } )
                        ) ?? of( null );
    };
}
