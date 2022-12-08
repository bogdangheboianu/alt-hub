import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserStatusEnum } from '@dtos/user-status-enum';

@Component( {
                standalone     : true,
                selector       : 'app-user-status-label',
                template       : `
                    <div class="user-status-label"
                         [class.active]="active"
                         [class.inactive]="inactive"
                         [class.onboarding]="onboarding">{{ text }}</div>
                `,
                styles         : [
                    `.user-status-label {
                        padding: 2px 10px;
                        margin: 0;
                        text-align: center;
                        border-radius: 4px;
                    }

                    .user-status-label.active {
                        background: #d1f8ef;
                        color: #00bd97;
                        opacity: 1;
                    }

                    .user-status-label.inactive {
                        background: #f4c8c6;
                        color: #f44336;
                        opacity: 1;
                    }

                    .user-status-label.onboarding {
                        background: none;
                        border: 0.5px solid gray;
                    }
                    `
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class UserStatusLabelComponent {
    @Input()
    set status(value: UserStatusEnum) {
        this._status = value;
        this.setData();
    }

    active = true;
    inactive = false;
    onboarding = false;
    text = '';
    private _status!: UserStatusEnum;

    private setData(): void {
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
        return this._status.replace( this._status[0], this._status[0].toUpperCase() );
    }
}
