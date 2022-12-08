import { Pipe, PipeTransform } from '@angular/core';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { UserDto } from '@dtos/user-dto';
import { map, Observable } from 'rxjs';

@Pipe( { name: 'hasAccess', pure: true } )
export class UserHasAccessPipe implements PipeTransform {
    constructor(
        private readonly authSelectors: AuthSelectors
    ) {
    }

    transform(value: UserDto): Observable<boolean> {
        return this.authSelectors.selectLoggedUser()
                   .pipe(
                       map( loggedUser => this.valueIsLoggedUser( value, loggedUser ) || this.loggedUserIsAdmin( loggedUser ) )
                   );
    }

    private valueIsLoggedUser(value: UserDto, loggedUser: UserDto | null): boolean {
        return value.id === loggedUser?.id;
    }

    private loggedUserIsAdmin(loggedUser: UserDto | null): boolean {
        return loggedUser?.account.isAdmin ?? false;
    }
}
