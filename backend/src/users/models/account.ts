import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { OptionalDate } from '@shared/models/date/optional-date';
import { Result } from '@shared/models/generics/result';
import { CreateAccountDto } from '@users/dtos/create-account.dto';
import { AccountEntity } from '@users/entities/account.entity';
import { IncompatibleUserStatusException } from '@users/exceptions/user.exceptions';
import { IAccount } from '@users/interfaces/account.interface';
import { EmailAddress } from '@users/models/email-address';
import { Password } from '@users/models/password';
import { UserStatus } from '@users/models/user-status';
import { Username } from '@users/models/username';

export class Account implements IDomainModel<Account, AccountEntity> {
    email: EmailAddress;
    username: Username;
    password: Password;
    lastLoginAt: OptionalDate;
    status: UserStatus;
    isAdmin: boolean;

    private constructor(data: IAccount) {
        this.email = data.email;
        this.username = data.username ?? Username.fromEmail( data.email );
        this.password = data.password;
        this.lastLoginAt = data.lastLoginAt ?? OptionalDate.empty();
        this.status = data.status ?? UserStatus.created();
        this.isAdmin = data.isAdmin;
    }

    static create(data: CreateAccountDto): Result<Account> {
        const buildData = Result.aggregateObjects<Pick<IAccount, 'email' | 'password' | 'isAdmin'>>(
            { email: EmailAddress.create( data.email ) },
            { password: Password.hash( data.password ) },
            { isAdmin: data.isAdmin }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new Account( buildData.value! ) );
    }

    static fromEntity(entity: AccountEntity): Result<Account> {
        const data = Result.aggregateObjects<IAccount>(
            { email: EmailAddress.create( entity.email ) },
            { username: Username.create( entity.username ) },
            { password: Password.fromHash( entity.password ) },
            { lastLoginAt: OptionalDate.create( entity.lastLoginAt, 'lastLoginAt' ) },
            { status: UserStatus.create( entity.status ) },
            { isAdmin: entity.isAdmin }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new Account( data.value! ) );
    }

    updateStatus(status: UserStatus): Result<Account> {
        if( this.status.equals( status ) ) {
            return Success( this );
        }

        if( this.status.isNotCompatibleWith( status ) ) {
            return Failed( new IncompatibleUserStatusException( this.status, status ) );
        }

        return Success( new Account( { ...this, status } ) );
    }

    updatePassword(password: string): Result<Account> {
        const updatedPassword = this.password.update( password );

        if( updatedPassword.isFailed ) {
            return Failed( ...updatedPassword.errors );
        }

        return Success( new Account( { ...this, password: updatedPassword.value! } ) );
    }

    updateLastLoginToNow(): Result<Account> {
        return Success( new Account( { ...this, lastLoginAt: this.lastLoginAt.updateToNow() } ) );
    }

    equals(to: Account): boolean {
        return this.email.equals( to.email ) || this.username.equals( to.username );
    }

    toEntity(): AccountEntity {
        return entityFactory( AccountEntity, {
            email      : this.email.getValue(),
            username   : this.username.getValue(),
            password   : this.password.getValue(),
            lastLoginAt: this.lastLoginAt.getValue(),
            status     : this.status.getValue(),
            isAdmin    : this.isAdmin
        } );
    }
}
