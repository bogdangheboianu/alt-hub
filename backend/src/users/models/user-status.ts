import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { UserStatusEnum } from '@users/enums/user-status.enum';

export class UserStatus implements IValueObject<UserStatus, UserStatusEnum> {
    private readonly value: UserStatusEnum;

    private constructor(value: UserStatusEnum) {
        this.value = value;
    }

    static created(): UserStatus {
        return new UserStatus( UserStatusEnum.Created );
    }

    static invited(): UserStatus {
        return new UserStatus( UserStatusEnum.Invited );
    }

    static active(): UserStatus {
        return new UserStatus( UserStatusEnum.Active );
    }

    static inactive(): UserStatus {
        return new UserStatus( UserStatusEnum.Inactive );
    }

    static suspended(): UserStatus {
        return new UserStatus( UserStatusEnum.Suspended );
    }

    static create(value: string | UserStatusEnum): Result<UserStatus> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, UserStatusEnum, 'status' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new UserStatus( value as UserStatusEnum ) );
    }

    getValue(): UserStatusEnum {
        return this.value;
    }

    equals(to: UserStatus): boolean {
        return this.value === to.getValue();
    }

    isNotCompatibleWith(otherStatus: UserStatus): boolean {
        return this.equals( otherStatus ) || !this.getCompatibleValues()
                                                  .some( s => s.equals( otherStatus ) );
    }

    getCompatibleValues(): UserStatus[] {
        switch( this.value ) {
            case UserStatusEnum.Created:
                return [ UserStatus.invited() ];
            case UserStatusEnum.Invited:
                return [ UserStatus.active() ];
            case UserStatusEnum.Active:
                return [
                    UserStatus.inactive(),
                    UserStatus.suspended()
                ];
            case UserStatusEnum.Inactive:
                return [ UserStatus.active() ];
            case UserStatusEnum.Suspended:
                return [
                    UserStatus.inactive(),
                    UserStatus.active()
                ];
        }
    }
}
