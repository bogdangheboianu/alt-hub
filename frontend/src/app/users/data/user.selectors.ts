import { Injectable } from '@angular/core';
import { UserDto } from '@dtos/user-dto';
import { BaseEntitySelector } from '@config/store/store.models';
import { UserState, UserStore } from '@users/data/user.store';

@Injectable()
export class UserSelectors extends BaseEntitySelector<UserDto, UserState> {
    constructor(protected readonly userStore: UserStore) {
        super( userStore );
    }
}
