import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { ActivateUserCommand } from '@users/commands/impl/activate-user.command';
import { CreateUserCommand } from '@users/commands/impl/create-user.command';
import { DeactivateUserCommand } from '@users/commands/impl/deactivate-user.command';
import { InviteUserCommand } from '@users/commands/impl/invite-user.command';
import { ReactivateUserCommand } from '@users/commands/impl/reactivate-user.command';
import { UpdateUserEmploymentInfoCommand } from '@users/commands/impl/update-user-employment-info.command';
import { UpdateUserPersonalInfoCommand } from '@users/commands/impl/update-user-personal-info.command';
import { ActivateUserDto } from '@users/dtos/activate-user.dto';
import { CreateUserDto } from '@users/dtos/create-user.dto';
import { GetAllUsersParamsDto } from '@users/dtos/get-all-users-params.dto';
import { UpdateUserEmploymentInfoDto } from '@users/dtos/update-user-employment-info.dto';
import { UpdateUserPersonalInfoDto } from '@users/dtos/update-user-personal-info.dto';
import { UserDto } from '@users/dtos/user.dto';
import { UserStatusEnum } from '@users/enums/user-status.enum';
import { modelsToUserDtoList, modelToUserDto } from '@users/mappers/user.mappers';
import { User } from '@users/models/user';
import { GetAllUsersQuery } from '@users/queries/impl/get-all-users.query';
import { GetUserByIdQuery } from '@users/queries/impl/get-user-by-id.query';

@Injectable()
export class UserService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {
    }

    async createUser(context: AuthenticatedContext, data: CreateUserDto): Promise<UserDto> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( data.account, 'account' )
                                          .isNotEmpty( data.account?.email, 'email' )
                                          .isNotEmpty( data.account?.password, 'password' )
                                          .isNotEmpty( data.account?.isAdmin, 'isAdmin' )
                                          .isNotEmpty( data.personalInfo, 'personalInfo' )
                                          .isNotEmpty( data.employmentInfo, 'employeeInfo' )
                                          .isNotEmpty( data.personalInfo?.firstName, 'firstName' )
                                          .isNotEmpty( data.personalInfo?.lastName, 'lastName' )
                                          .isNotEmpty( data.personalInfo?.phone, 'phone' )
                                          .isNotEmpty( data.personalInfo?.ssn, 'ssn' )
                                          .isNotEmpty( data.personalInfo?.address, 'address' )
                                          .isNotEmpty( data.personalInfo?.dateOfBirth, 'dateOfBirth' )
                                          .isNotEmpty( data.employmentInfo?.companyPositionId, 'companyPositionId' )
                                          .isNotEmpty( data.employmentInfo?.hiredOn, 'hiredOn' )
                                          .isNotEmpty( data.employmentInfo?.paidLeaveDays, 'paidLeaveDays' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateUserCommand( { context, payload: data } );
        const result: Result<User> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToUserDto( result.value! );
    }

    async inviteUser(context: AuthenticatedContext, userId: string): Promise<UserDto> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( userId, 'userId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new InviteUserCommand( { context, payload: { userId } } );
        const result: Result<User> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToUserDto( result.value! );
    }

    async activateUser(context: AuthenticatedContext, data: ActivateUserDto): Promise<void> {
        const validation = ValidationChain.validate<typeof data>()
                                          .isNotEmpty( data.token, 'token' )
                                          .isNotEmpty( data.newPassword, 'newPassword' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new ActivateUserCommand( { context, payload: { ...data } } );
        const result: Result<User> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }
    }

    async reactivateUser(context: AuthenticatedContext, userId: string): Promise<UserDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( userId, 'userId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new ReactivateUserCommand( { context, payload: { userId } } );
        const result: Result<User> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToUserDto( result.value! );
    }

    async updateUserPersonalInfo(context: AuthenticatedContext, data: UpdateUserPersonalInfoDto, userId: string): Promise<UserDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( userId, 'userId' )
                                          .isNotEmpty( data.firstName, 'firstName' )
                                          .isNotEmpty( data.lastName, 'lastName' )
                                          .isNotEmpty( data.phone, 'phone' )
                                          .isNotEmpty( data.ssn, 'ssn' )
                                          .isNotEmpty( data.address, 'address' )
                                          .isNotEmpty( data.dateOfBirth, 'dateOfBirth' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateUserPersonalInfoCommand( { context, payload: { ...data, userId } } );
        const result: Result<User> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToUserDto( result.value! );
    }

    async updateUserEmploymentInfo(context: AuthenticatedContext, data: UpdateUserEmploymentInfoDto, userId: string): Promise<UserDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( userId, 'userId' )
                                          .isUUIDv4( data.companyPositionId, 'companyPositionId' )
                                          .isNotEmpty( data.hiredOn, 'hiredOn' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateUserEmploymentInfoCommand( { context, payload: { ...data, userId } } );
        const result: Result<User> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToUserDto( result.value! );
    }

    async getAllUsers(context: AuthenticatedContext, params: GetAllUsersParamsDto): Promise<UserDto[]> {
        const validation = ValidationChain.validate<typeof params>()
                                          .isEnumList( params.statuses, UserStatusEnum, 'statuses', true )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetAllUsersQuery( { context, params } );
        const result: Result<User[]> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelsToUserDtoList( result.value! );
    }

    async getUserById(context: AuthenticatedContext, id: string): Promise<UserDto> {
        const { user: authenticatedUser } = context;

        if( authenticatedUser.id.getValue() !== id.trim() && !authenticatedUser.account.isAdmin ) {
            throw new ForbiddenException();
        }

        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( id, 'id' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetUserByIdQuery( { context, params: { id } } );
        const result: Result<User> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToUserDto( result.value! );
    }

    async deactivateUser(context: AuthenticatedContext, userId: string): Promise<UserDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( userId, 'userId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }
        const command = new DeactivateUserCommand( { context, payload: { userId } } );
        const result: Result<User> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToUserDto( result.value! );
    }
}
