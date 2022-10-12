import { CompanyPosition } from '@company/models/position/company-position';
import { LoginWithCredentialsCommand } from '@security/commands/impl/auth/login-with-credentials.command';
import { InvalidLoginCredentialsException } from '@security/exceptions/auth.exceptions';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { OptionalDate } from '@shared/models/date/optional-date';
import { Result } from '@shared/models/generics/result';
import { ActivateUserCommand } from '@users/commands/impl/activate-user.command';
import { ConfirmUserCommand } from '@users/commands/impl/confirm-user.command';
import { CreateUserCommand } from '@users/commands/impl/create-user.command';
import { InviteUserCommand } from '@users/commands/impl/invite-user.command';
import { UpdateUserEmployeeInfoCommand } from '@users/commands/impl/update-user-employee-info.command';
import { UpdateUserPersonalInfoCommand } from '@users/commands/impl/update-user-personal-info.command';
import { UserEntity } from '@users/entities/user.entity';
import { IncompatibleUserStatusException } from '@users/exceptions/user.exceptions';
import { IUser } from '@users/interfaces/user.interface';
import { EmployeeId } from '@users/models/employee-id';
import { EmployeeInfo } from '@users/models/employee-info';
import { Password } from '@users/models/password';
import { PersonalInfo } from '@users/models/personal-info';
import { UserId } from '@users/models/user-id';
import { UserStatus } from '@users/models/user-status';
import { Username } from '@users/models/username';

export class User implements IDomainModel<User, UserEntity> {
    id: UserId;
    username: Username;
    password: Password;
    lastLoginAt: OptionalDate;
    status: UserStatus;
    isAdmin: boolean;
    personalInfo: PersonalInfo;
    employeeInfo: EmployeeInfo;
    audit: Audit;

    private constructor(data: IUser) {
        this.id = data.id ?? UserId.generate();
        this.username = data.username ?? Username.fromEmail( data.personalInfo.email );
        this.password = data.password;
        this.lastLoginAt = data.lastLoginAt ?? OptionalDate.empty();
        this.status = data.status ?? UserStatus.created();
        this.isAdmin = data.isAdmin;
        this.personalInfo = data.personalInfo;
        this.employeeInfo = data.employeeInfo;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateUserCommand, companyPosition: CompanyPosition, employeeId: EmployeeId): Result<User> {
        const { payload: { personalInfo, employeeInfo, password, isAdmin }, context } = command.data;
        const data = Result.aggregateObjects<Omit<IUser, 'id' | 'username'>>(
            { password: Password.hash( password ) },
            { isAdmin },
            { personalInfo: PersonalInfo.create( personalInfo ) },
            { employeeInfo: EmployeeInfo.create( employeeInfo, companyPosition, employeeId ) },
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
            { username: Username.create( entity.username ) },
            { password: Password.fromHash( entity.password ) },
            { lastLoginAt: OptionalDate.create( entity.lastLoginAt, 'lastLoginAt' ) },
            { status: UserStatus.create( entity.status ) },
            { personalInfo: PersonalInfo.fromEntity( entity.personalInfo ) },
            { employeeInfo: EmployeeInfo.fromEntity( entity.employeeInfo ) },
            { isAdmin: entity.isAdmin },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new User( data.value! ) );
    }

    updateAsInvited(command: InviteUserCommand): Result<User> {
        const { context } = command.data;
        const invitedStatus = UserStatus.invited();

        if( this.status.equals( invitedStatus ) ) {
            return Success( this );
        }

        if( this.status.isNotCompatibleWith( invitedStatus ) ) {
            return Failed( new IncompatibleUserStatusException( this.status, invitedStatus ) );
        }

        return Success(
            new User( {
                          ...this,
                          status: invitedStatus,
                          audit : this.audit.update( context.user?.id )
                      } )
        );
    }

    updateAsConfirmed(command: ConfirmUserCommand): Result<User> {
        const { context, payload } = command.data;
        const updateData = Result.aggregateObjects<Pick<IUser, 'password'>>(
            { password: Password.hash( payload.newPassword, 'newPassword' ) }
        );

        if( updateData.isFailed ) {
            return Failed( ...updateData.errors );
        }

        const confirmedStatus = UserStatus.confirmed();

        if( this.status.equals( confirmedStatus ) ) {
            return Success( this );
        }

        if( this.status.isNotCompatibleWith( confirmedStatus ) ) {
            return Failed( new IncompatibleUserStatusException( this.status, confirmedStatus ) );
        }
        return Success(
            new User( {
                          ...this,
                          ...updateData.value!,
                          status: UserStatus.confirmed(),
                          audit : this.audit.update( context.user?.id )
                      } )
        );

    }

    updateAsActive(command: ActivateUserCommand): Result<User> {
        const { context } = command.data;
        const activatedStatus = UserStatus.active();

        if( this.status.equals( activatedStatus ) ) {
            return Success( this );
        }

        if( this.status.isNotCompatibleWith( activatedStatus ) ) {
            return Failed( new IncompatibleUserStatusException( this.status, activatedStatus ) );
        }

        return Success(
            new User( {
                          ...this,
                          status: activatedStatus,
                          audit : this.audit.update( context.user?.id )
                      } )
        );
    }

    login(command: LoginWithCredentialsCommand): Result<User> {
        const { payload } = command.data;
        const passwordIsValid = this.password.matches( payload.password );

        if( !passwordIsValid ) {
            return Failed( new InvalidLoginCredentialsException() );
        }

        return Success(
            new User( {
                          ...this,
                          lastLoginAt: this.lastLoginAt.updateToNow(),
                          audit      : this.audit.update()
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

    updateEmployeeInfo(command: UpdateUserEmployeeInfoCommand, companyPosition?: CompanyPosition): Result<User> {
        const { context, payload } = command.data;
        const updatedEmployeeInfo = this.employeeInfo.update( payload, companyPosition );

        if( updatedEmployeeInfo.isFailed ) {
            return Failed( ...updatedEmployeeInfo.errors );
        }

        return Success(
            new User( {
                          ...this,
                          employeeInfo: updatedEmployeeInfo.value,
                          audit       : this.audit.update( context.user.id )
                      } )
        );
    }

    isActive(): boolean {
        return this.status.equals( UserStatus.active() );
    }

    isNotActive(): boolean {
        return !this.isActive();
    }

    isInvited(): boolean {
        return this.status.equals( UserStatus.invited() );
    }

    equals(to: User): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): UserEntity {
        return entityFactory( UserEntity, {
            id          : this.id.getValue(),
            username    : this.username.getValue(),
            password    : this.password.getValue(),
            lastLoginAt : this.lastLoginAt.getValue(),
            status      : this.status.getValue(),
            isAdmin     : this.isAdmin,
            personalInfo: this.personalInfo.toEntity(),
            employeeInfo: this.employeeInfo.toEntity(),
            audit       : this.audit.toEntity()
        } );
    }
}
