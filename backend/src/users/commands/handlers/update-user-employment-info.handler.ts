import { CompanyPositionNotFoundException } from '@company/exceptions/company-position.exceptions';
import { CompanyPosition } from '@company/models/company-position';
import { CompanyPositionId } from '@company/models/company-position-id';
import { CompanyPositionRepository } from '@company/repositories/company-position.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { UpdateUserEmploymentInfoCommand } from '@users/commands/impl/update-user-employment-info.command';
import { FailedToUpdateUserEmploymentInfoEvent } from '@users/events/impl/failed-to-update-user-employment-info.event';
import { UserEmploymentInfoUpdatedEvent } from '@users/events/impl/user-employment-info-updated.event';
import { UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( UpdateUserEmploymentInfoCommand )
export class UpdateUserEmploymentInfoHandler extends BaseSyncCommandHandler<UpdateUserEmploymentInfoCommand, User> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly userRepository: UserRepository,
        private readonly companyPositionRepository: CompanyPositionRepository
    ) {
        super();
    }

    async execute(command: UpdateUserEmploymentInfoCommand): Promise<Result<User>> {
        const user = await this.getUserById( command );

        if( user.isFailed ) {
            return this.failed( command, ...user.errors );
        }

        const companyPosition = await this.getCompanyPositionById( command, user.value! );

        if( companyPosition.isFailed ) {
            return this.failed( command, ...companyPosition.errors );
        }

        const updatedUser = user.value!.updateEmploymentInfo( command, companyPosition.value! );

        if( updatedUser.isFailed ) {
            return this.failed( command, ...updatedUser.errors );
        }

        const savedUser = await this.saveUserToDb( updatedUser.value! );

        return this.successful( command, savedUser );
    }

    protected successful(command: UpdateUserEmploymentInfoCommand, user: User): Result<User> {
        const { context } = command.data;
        const event = new UserEmploymentInfoUpdatedEvent( { context, payload: user } );

        this.eventBus.publish( event );

        return Success( user );
    }

    protected failed(command: UpdateUserEmploymentInfoCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToUpdateUserEmploymentInfoEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getUserById(command: UpdateUserEmploymentInfoCommand): Promise<Result<User>> {
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

    private async getCompanyPositionById(command: UpdateUserEmploymentInfoCommand, initialUser: User): Promise<Result<CompanyPosition>> {
        const { companyPositionId } = command.data.payload;
        const id = CompanyPositionId.create( companyPositionId, 'companyPositionId' );

        if( id.isFailed ) {
            return Failed( ...id.errors );
        }

        if( initialUser.employmentInfo.companyPosition.id.equals( id.value! ) ) {
            return Success( initialUser.employmentInfo.companyPosition );
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
}
