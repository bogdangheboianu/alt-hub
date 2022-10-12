import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateUserDto } from '@dtos/create-user.dto';
import { UserDto } from '@dtos/user.dto';

@Component( {
                selector   : 'app-user-card',
                templateUrl: './user-card.component.html',
                styleUrls  : [ './user-card.component.scss' ]
            } )
export class UserCardComponent {
    @Input() user!: UserDto | CreateUserDto;

    @Output() onCardClick = new EventEmitter<UserDto>();

    get isClickable(): boolean {
        return this.user instanceof UserDto;
    }

    cardClicked(): void {
        if( this.isClickable ) {
            this.onCardClick.emit( this.user as UserDto );
        }
    }
}
