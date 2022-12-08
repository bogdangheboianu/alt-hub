import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { UpdateUserPersonalInfoCommand } from '@users/commands/impl/update-user-personal-info.command';
import { FailedToUpdateUserPersonalInfoEvent } from '@users/events/impl/failed-to-update-user-personal-info.event';
import { UserPersonalInfoUpdatedEvent } from '@users/events/impl/user-personal-info-updated.event';
import { DuplicatePhoneNumberException, DuplicateSocialSecurityNumberException, UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( UpdateUserPersonalInfoCommand )
export class UpdateUserPersonalInfoHandler extends BaseSyncCommandHandler<UpdateUserPersonalInfoCommand, User> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly userRepository: UserRepository
    ) {
        super();
    }

    async execute(command: UpdateUserPersonalInfoCommand): Promise<Result<User>> {
        const user = await this.getUserById( command );

        if( user.isFailed ) {
            return this.failed( command, ...user.errors );
        }

        const updatedUser = user.value!.updatePersonalInfo( command );

        if( updatedUser.isFailed ) {
            return this.failed( command, ...updatedUser.errors );
        }

        const uniquenessChecks = await this.makeUniquenessChecks( user.value!, updatedUser.value! );

        if( uniquenessChecks.isFailed ) {
            return this.failed( command, ...uniquenessChecks.errors );
        }

        const savedUser = await this.saveUserToDb( updatedUser.value! );

        return this.successful( command, savedUser );
    }

    protected successful(command: UpdateUserPersonalInfoCommand, user: User): Result<User> {
        const { context } = command.data;
        const event = new UserPersonalInfoUpdatedEvent( { context, payload: user } );

        this.eventBus.publish( event );

        return Success( user );
    }

    protected failed(command: UpdateUserPersonalInfoCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToUpdateUserPersonalInfoEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getUserById(command: UpdateUserPersonalInfoCommand): Promise<Result<User>> {
        const { payload: { userId } } = command.data;
        const id = UserId.create( userId, 'userId' );

        if( id.isFailed ) {
            return Failed( ...id.errors );
        }

        const user = await this.userRepository.findById( id.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new UserNotFoundException() );
        }

        return user;
    }

    private async makeUniquenessChecks(initialUser: User, updatedUser: User): Promise<Result<any>> {
        const phoneNumberUniquenessCheck = this.checkForPhoneNumberUniqueness( initialUser, updatedUser );
        const socialSecurityNumberUniquenessCheck = this.checkForSocialSecurityNumberUniqueness( initialUser, updatedUser );

        const phoneNumberUniquenessCheckResult = await phoneNumberUniquenessCheck;
        const socialSecurityNumberUniquenessCheckResult = await socialSecurityNumberUniquenessCheck;

        if( phoneNumberUniquenessCheckResult.isFailed ) {
            return Failed( ...phoneNumberUniquenessCheckResult.errors );
        }

        if( socialSecurityNumberUniquenessCheckResult.isFailed ) {
            return Failed( ...socialSecurityNumberUniquenessCheckResult.errors );
        }

        return Success();
    }

    private async checkForPhoneNumberUniqueness(initialUser: User, updatedUser: User): Promise<Result<any>> {
        const updatedPhone = updatedUser.personalInfo.phone;
        const phoneHasNotChanged = initialUser.personalInfo.phone.equals( updatedPhone );

        if( phoneHasNotChanged ) {
            return Success();
        }

        const user = await this.userRepository.findByPhoneNumber( updatedPhone, updatedUser.id );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Success();
        }

        return Failed( new DuplicatePhoneNumberException() );
    }

    private async checkForSocialSecurityNumberUniqueness(initialUser: User, updatedUser: User): Promise<Result<any>> {
        const updatedSsn = updatedUser.personalInfo.ssn;
        const ssnHasNotChanged = initialUser.personalInfo.ssn.equals( updatedSsn );

        if( ssnHasNotChanged ) {
            return Success();
        }

        const user = await this.userRepository.findBySocialSecurityNumber( updatedSsn, updatedUser.id );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Success();
        }

        return Failed( new DuplicateSocialSecurityNumberException() );
    }

    private async saveUserToDb(user: User): Promise<User> {
        const savedUser = await this.userRepository.save( user );

        if( savedUser.isFailed ) {
            throw new Exception( savedUser.errors );
        }

        return savedUser.value!;
    }
}
