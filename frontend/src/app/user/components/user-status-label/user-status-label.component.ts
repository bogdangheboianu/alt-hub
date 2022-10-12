import { Component, Input, OnInit } from '@angular/core';
import { UserStatusEnum } from '@dtos/user-status.enum';

@Component( {
                selector   : 'app-user-status-label',
                templateUrl: './user-status-label.component.html',
                styleUrls  : [ './user-status-label.component.scss' ]
            } )
export class UserStatusLabelComponent implements OnInit {
    @Input()
    get status(): UserStatusEnum {
        return this._status;
    }

    set status(value: UserStatusEnum) {
        this._status = value;
        this.ngOnInit();
    }

    active = true;
    inactive = false;
    onboarding = false;
    text = '';

    private _status!: UserStatusEnum;

    ngOnInit(): void {
        this.active = this.isActive();
        this.inactive = this.isInactive();
        this.onboarding = this.isOnboarding();
        this.text = this.getText();
    }

    private isActive(): boolean {
        return this._status === UserStatusEnum.Active;
    }

    private isInactive(): boolean {
        return this._status === UserStatusEnum.Inactive;
    }

    private isOnboarding(): boolean {
        return !this.isActive() && !this.isInactive();
    }

    private getText(): string {
        return this._status.replace( this.status[0], this.status[0].toUpperCase() );
    }
}
