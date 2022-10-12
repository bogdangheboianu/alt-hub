import { Component, Input } from '@angular/core';
import { UserDto } from '@dtos/user.dto';

type Size = 'large' | 'small' | 'medium'

@Component( {
                selector   : 'app-user-icon',
                templateUrl: './user-icon.component.html',
                styleUrls  : [ './user-icon.component.scss' ]
            } )
export class UserIconComponent {
    @Input() user!: UserDto;
    @Input() size: Size = 'medium';

    get src(): string {
        return 'https://xsgames.co/randomusers/avatar.php?g=pixel';
    }

    get alt(): string {
        return `${ this.user.username }-profile-picture`;
    }

    get isLarge(): boolean {
        return this.size === 'large';
    }

    get isSmall(): boolean {
        return this.size === 'small';
    }

    get isMedium(): boolean {
        return this.size === 'medium';
    }
}
