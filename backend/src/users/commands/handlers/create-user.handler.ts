import { CompanyPositionNotFoundException } from '@company/exceptions/company-position.exceptions';
import { CompanyPosition } from '@company/models/company-position';
import { CompanyPositionId } from '@company/models/company-position-id';
import { CompanyPositionRepository } from '@company/repositories/company-position.repository';
import { FiscalService } from '@fiscal/services/fiscal.service';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { CreateUserCommand } from '@users/commands/impl/create-user.command';
import { FailedToCreateUserEvent } from '@users/events/impl/failed-to-create-user.event';
import { UserCreatedEvent } from '@users/events/impl/user-created.event';
import { DuplicateEmailAddressException, DuplicateEmployeeIdException, DuplicatePhoneNumberException, DuplicateSocialSecurityNumberException } from '@users/exceptions/user.exceptions';
import { EmployeeId } from '@users/models/employee-id';
import { User } from '@users/models/user';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( CreateUserCommand )
export class CreateUserHandler extends BaseSyncCommandHandler<CreateUserCommand, User> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly userRepository: UserRepository,
        private readonly companyPositionRepository: CompanyPositionRepository,
        private readonly fiscalService: FiscalService
    ) {
        super();
    }

    async execute(command: CreateUserCommand): Promise<Result<User>> {
        const companyPosition = await this.getCompanyPositionById( command );

        if( companyPosition.isFailed ) {
            return this.failed( command, ...companyPosition.errors );
        }

        const employeeId = await this.createEmployeeId();
        const user = User.create( command, companyPosition.value!, employeeId );

        if( user.isFailed ) {
            return this.failed( command, ...user.errors );
        }

        const uniquenessChecks = await this.makeUniquenessChecks( user.value! );

        if( uniquenessChecks.isFailed ) {
            return this.failed( command, ...uniquenessChecks.errors );
        }

        const savedUser = await this.saveUserToDb( user.value! );

        await this.createAnnualEmployeeSheet( command, savedUser );

        return this.successful( command, savedUser );
    }

    protected successful(command: CreateUserCommand, user: User): Result<User> {
        const { context } = command.data;
        const event = new UserCreatedEvent( { context, payload: user } );

        this.eventBus.publish( event );

        return Success( user );
    }

    protected failed(command: CreateUserCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateUserEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async createEmployeeId(): Promise<EmployeeId> {
        let employeeId = EmployeeId.generate();
        let isNotUnique = true;
        do {
            const employeeIdUniquenessCheck = await this.checkForEmployeeIdUniqueness( employeeId );
            isNotUnique = employeeIdUniquenessCheck.isFailed;
            if( employeeIdUniquenessCheck.isFailed ) {
                employeeId = EmployeeId.generate();
            }
        } while( isNotUnique );

        return employeeId;
    }

    private async makeUniquenessChecks(user: User): Promise<Result<any>> {
        const emailAddressUniquenessCheck = this.checkForEmailAddressUniqueness( user );
        const phoneNumberUniquenessCheck = this.checkForPhoneNumberUniqueness( user );
        const socialSecurityNumberUniquenessCheck = this.checkForSocialSecurityNumberUniqueness( user );

        const emailAddressUniquenessCheckResult = await emailAddressUniquenessCheck;
        const phoneNumberUniquenessCheckResult = await phoneNumberUniquenessCheck;
        const socialSecurityNumberUniquenessCheckResult = await socialSecurityNumberUniquenessCheck;

        if( emailAddressUniquenessCheckResult.isFailed ) {
            return Failed( ...emailAddressUniquenessCheckResult.errors );
        }

        if( phoneNumberUniquenessCheckResult.isFailed ) {
            return Failed( ...phoneNumberUniquenessCheckResult.errors );
        }

        if( socialSecurityNumberUniquenessCheckResult.isFailed ) {
            return Failed( ...socialSecurityNumberUniquenessCheckResult.errors );
        }

        return Success();
    }

    private async checkForEmailAddressUniqueness(user: User): Promise<Result<any>> {
        const userByEmail = await this.userRepository.findByEmail( user.account.email );

        if( userByEmail.isFailed ) {
            throw new Exception( userByEmail.errors );
        }

        if( userByEmail.isNotFound ) {
            return Success();
        }

        return Failed( new DuplicateEmailAddressException() );
    }

    private async checkForPhoneNumberUniqueness(user: User): Promise<Result<any>> {
        const userByPhone = await this.userRepository.findByPhoneNumber( user.personalInfo.phone );

        if( userByPhone.isFailed ) {
            throw new Exception( userByPhone.errors );
        }

        if( userByPhone.isNotFound ) {
            return Success();
        }

        return Failed( new DuplicatePhoneNumberException() );
    }

    private async checkForSocialSecurityNumberUniqueness(user: User): Promise<Result<any>> {
        const userBySsn = await this.userRepository.findBySocialSecurityNumber( user.personalInfo.ssn );

        if( userBySsn.isFailed ) {
            throw new Exception( userBySsn.errors );
        }

        if( userBySsn.isNotFound ) {
            return Success();
        }

        return Failed( new DuplicateSocialSecurityNumberException() );
    }

    private async checkForEmployeeIdUniqueness(employeeId: EmployeeId): Promise<Result<any>> {
        const user = await this.userRepository.findByEmployeeId( employeeId );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Success();
        }

        return Failed( new DuplicateEmployeeIdException() );
    }

    private async getCompanyPositionById(command: CreateUserCommand): Promise<Result<CompanyPosition>> {
        const { employmentInfo: { companyPositionId } } = command.data.payload;
        const id = CompanyPositionId.create( companyPositionId, 'companyPositionId' );

        if( id.isFailed ) {
            return Failed( ...id.errors );
        }

        const companyPosition = await this.companyPositionRepository.findById( id.value! );

        if( companyPosition.isFailed ) {
            throw new Exception( companyPosition.errors );
        }

        if( companyPosition.isNotFound ) {
            return Failed( new CompanyPositionNotFoundException() );
        }

        return companyPosition;
    }

    private async saveUserToDb(user: User): Promise<User> {
        const savedUser = await this.userRepository.save( user );

        if( savedUser.isFailed ) {
            throw new Exception( savedUser.errors );
        }

        return savedUser.value!;
    }

    private async createAnnualEmployeeSheet(command: CreateUserCommand, user: User): Promise<void> {
        const { context, payload: { employmentInfo: { paidLeaveDays } } } = command.data;
        await this.fiscalService.createAnnualEmployeeSheet( context, { userId: user.id.getValue(), paidLeaveDays } );
    }
}
