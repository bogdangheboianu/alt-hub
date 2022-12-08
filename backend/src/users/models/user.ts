import { CompanyPosition } from '@company/models/company-position';
import { LoginWithCredentialsCommand } from '@security/commands/impl/auth/login-with-credentials.command';
import { InvalidLoginCredentialsException } from '@security/exceptions/auth.exceptions';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { ActivateUserCommand } from '@users/commands/impl/activate-user.command';
import { CreateUserCommand } from '@users/commands/impl/create-user.command';
import { DeactivateUserCommand } from '@users/commands/impl/deactivate-user.command';
import { InviteUserCommand } from '@users/commands/impl/invite-user.command';
import { ReactivateUserCommand } from '@users/commands/impl/reactivate-user.command';
import { UpdateUserEmploymentInfoCommand } from '@users/commands/impl/update-user-employment-info.command';
import { UpdateUserPersonalInfoCommand } from '@users/commands/impl/update-user-personal-info.command';
import { UserEntity } from '@users/entities/user.entity';
import { IUser } from '@users/interfaces/user.interface';
import { Account } from '@users/models/account';
import { EmployeeId } from '@users/models/employee-id';
import { EmploymentInfo } from '@users/models/employement-info';
import { PersonalInfo } from '@users/models/personal-info';
import { UserId } from '@users/models/user-id';
import { UserStatus } from '@users/models/user-status';

export class User implements IDomainModel<User, UserEntity> {
    id: UserId;
    account: Account;
    personalInfo: PersonalInfo;
    employmentInfo: EmploymentInfo;
    audit: Audit;

    private constructor(data: IUser) {
        this.id = data.id ?? UserId.generate();
        this.account = data.account;
        this.personalInfo = data.personalInfo;
        this.employmentInfo = data.employmentInfo;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateUserCommand, companyPosition: CompanyPosition, employeeId: EmployeeId): Result<User> {
        const { payload: { personalInfo, employmentInfo, account }, context } = command.data;
        const data = Result.aggregateObjects<Omit<IUser, 'id' | 'username'>>(
            { account: Account.create( account ) },
            { personalInfo: PersonalInfo.create( personalInfo ) },
            { employmentInfo: EmploymentInfo.create( employmentInfo, companyPosition, employeeId ) },
            { audit: Audit.initial( context.user?.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new User( data.value! ) );
    }

    static fromEntity(entity: UserEntity): Result<User> {
        const data = Result.aggregateObjects<IUser>(
            { id: UserId.create( entity.id ) },
            { account: Account.fromEntity( entity.account ) },
            { personalInfo: PersonalInfo.fromEntity( entity.personalInfo ) },
            { employmentInfo: EmploymentInfo.fromEntity( entity.employmentInfo ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new User( data.value! ) );
    }

    invite(command: InviteUserCommand): Result<User> {
        const { context } = command.data;
        const invitedStatus = UserStatus.invited();
        const updatedAccount = this.account.updateStatus( invitedStatus );

        if( updatedAccount.isFailed ) {
            return Failed( ...updatedAccount.errors );
        }

        return Success(
            new User( {
                          ...this,
                          account: updatedAccount.value!,
                          audit  : this.audit.update( context.user?.id )
                      } )
        );
    }

    activate(command: ActivateUserCommand): Result<User> {
        const { context, payload } = command.data;
        const activatedStatus = UserStatus.active();
        const updatedAccountWithStatus = this.account.updateStatus( activatedStatus );

        if( updatedAccountWithStatus.isFailed ) {
            return Failed( ...updatedAccountWithStatus.errors );
        }

        const updatedAccountWithPassword = updatedAccountWithStatus.value!.updatePassword( payload.newPassword );

        if( updatedAccountWithPassword.isFailed ) {
            return Failed( ...updatedAccountWithPassword.errors );
        }

        return Success(
            new User( {
                          ...this,
                          account: updatedAccountWithPassword.value!,
                          audit  : this.audit.update( context.user?.id )
                      } )
        );
    }

    deactivate(command: DeactivateUserCommand): Result<User> {
        const { context } = command.data;
        const invitedStatus = UserStatus.inactive();
        const updatedAccount = this.account.updateStatus( invitedStatus );

        if( updatedAccount.isFailed ) {
            return Failed( ...updatedAccount.errors );
        }

        return Success(
            new User( {
                          ...this,
                          account: updatedAccount.value!,
                          audit  : this.audit.update( context.user?.id )
                      } )
        );
    }

    reactivate(command: ReactivateUserCommand): Result<User> {
        const { context } = command.data;
        const activatedStatus = UserStatus.active();
        const updatedAccount = this.account.updateStatus( activatedStatus );

        if( updatedAccount.isFailed ) {
            return Failed( ...updatedAccount.errors );
        }

        return Success(
            new User( {
                          ...this,
                          account: updatedAccount.value!,
                          audit  : this.audit.update( context.user?.id )
                      } )
        );
    }

    login(command: LoginWithCredentialsCommand): Result<User> {
        const { payload } = command.data;
        const passwordIsValid = this.account.password.matches( payload.password );

        if( !passwordIsValid ) {
            return Failed( new InvalidLoginCredentialsException() );
        }

        const updatedAccount = this.account.updateLastLoginToNow();

        if( updatedAccount.isFailed ) {
            return Failed( ...updatedAccount.errors );
        }

        return Success(
            new User( {
                          ...this,
                          account: updatedAccount.value!,
                          audit  : this.audit.update()
                      } )
        );
    }

    updatePersonalInfo(command: UpdateUserPersonalInfoCommand): Result<User> {
        const { context, payload } = command.data;
        const updatedPersonalInfo = this.personalInfo.update( payload );

        if( updatedPersonalInfo.isFailed ) {
            return Failed( ...updatedPersonalInfo.errors );
        }

        return Success(
            new User( {
                          ...this,
                          personalInfo: updatedPersonalInfo.value,
                          audit       : this.audit.update( context.user.id )
                      } )
        );
    }

    updateEmploymentInfo(command: UpdateUserEmploymentInfoCommand, companyPosition?: CompanyPosition): Result<User> {
        const { context, payload } = command.data;
        const updatedEmploymentInfo = this.employmentInfo.update( payload, companyPosition );

        if( updatedEmploymentInfo.isFailed ) {
            return Failed( ...updatedEmploymentInfo.errors );
        }

        return Success(
            new User( {
                          ...this,
                          employmentInfo: updatedEmploymentInfo.value,
                          audit         : this.audit.update( context.user.id )
                      } )
        );
    }

    isActive(): boolean {
        return this.account.status.equals( UserStatus.active() );
    }

    isInactive() {
        return this.account.status.equals( UserStatus.inactive() );
    }

    isNotActive(): boolean {
        return !this.isActive();
    }

    isInvited(): boolean {
        return this.account.status.equals( UserStatus.invited() );
    }

    equals(to: User): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): UserEntity {
        return entityFactory( UserEntity, {
            id            : this.id.getValue(),
            account       : this.account.toEntity(),
            personalInfo  : this.personalInfo.toEntity(),
            employmentInfo: this.employmentInfo.toEntity(),
            audit         : this.audit.toEntity()
        } );
    }
}
