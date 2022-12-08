import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { NoAuth } from '@security/decorators/no-auth.decorator';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';
import { ActivateUserDto } from '@users/dtos/activate-user.dto';
import { CreateUserDto } from '@users/dtos/create-user.dto';
import { GetAllUsersParamsDto } from '@users/dtos/get-all-users-params.dto';
import { UpdateUserEmploymentInfoDto } from '@users/dtos/update-user-employment-info.dto';
import { UpdateAccountDto } from '@users/dtos/update-account.dto';
import { UpdateUserPersonalInfoDto } from '@users/dtos/update-user-personal-info.dto';
import { UserDto } from '@users/dtos/user.dto';
import { UserService } from '@users/services/user.service';

@Controller( 'users' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.Users )
export class UserController extends BaseController {
    constructor(private readonly userService: UserService) {
        super();
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async getAllUsers(@Headers() headers: any, @Request() request: any, @Query( new ValidationPipe( { transform: true } ) ) params: GetAllUsersParamsDto): Promise<UserDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.userService.getAllUsers( context, params );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    async getUserById(@Headers() headers: any, @Request() request: any, @Param( 'id' ) id: string): Promise<UserDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.userService.getUserById( context, id );
    }

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseAdminGuard()
    async createUser(@Headers() headers: any, @Request() request: any, @Body() data: CreateUserDto): Promise<UserDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.userService.createUser( context, data );
    }

    @Patch( ':id/invite' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async inviteUser(@Headers() headers: any, @Request() request: any, @Param( 'id' ) userId: string): Promise<UserDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.userService.inviteUser( context, userId );
    }

    @Patch( ':id/deactivate' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async deactivateUser(@Headers() headers: any, @Request() request: any, @Param( 'id' ) userId: string): Promise<UserDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.userService.deactivateUser( context, userId );
    }

    @NoAuth()
    @Patch( 'activate' )
    @HttpCode( HttpStatus.OK )
    async activateUser(@Headers() headers: any, @Request() request: any, @Body() data: ActivateUserDto): Promise<void> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.userService.activateUser( context, data );
    }

    @Patch( ':id/reactivate' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async reactivateUser(@Headers() headers: any, @Request() request: any, @Param( 'id' ) userId: string): Promise<UserDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.userService.reactivateUser( context, userId );
    }

    @Patch( ':id/account' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async updateUserAccount(@Headers() headers: any, @Request() request: any, @Body() data: UpdateAccountDto, @Param( 'id' ) userId: string): Promise<null> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return null;
    }

    @Patch( ':id/personal-info' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async updateUserPersonalInfo(@Headers() headers: any, @Request() request: any, @Body() data: UpdateUserPersonalInfoDto, @Param( 'id' ) userId: string): Promise<UserDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.userService.updateUserPersonalInfo( context, data, userId );
    }

    @Patch( ':id/employment-info' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async updateUserEmploymentInfo(@Headers() headers: any, @Request() request: any, @Body() data: UpdateUserEmploymentInfoDto, @Param( 'id' ) userId: string): Promise<UserDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.userService.updateUserEmploymentInfo( context, data, userId );
    }
}
