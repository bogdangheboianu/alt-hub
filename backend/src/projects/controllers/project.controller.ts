import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AssignCoordinatorToProjectDto } from '@projects/dtos/assign-coordinator-to-project.dto';
import { AssignUsersToProjectDto } from '@projects/dtos/assign-users-to-project.dto';
import { CreateProjectDto } from '@projects/dtos/create-project.dto';
import { GetAllProjectsParamsDto } from '@projects/dtos/get-all-projects-params.dto';
import { ProjectDto } from '@projects/dtos/project.dto';
import { ProjectService } from '@projects/services/project.service';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';

@Controller( 'projects' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
export class ProjectController extends BaseController {
    constructor(
        private readonly projectService: ProjectService
    ) {
        super();
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    async getAllProjects(@Headers() headers: any, @Request() request: any, @Query() params: GetAllProjectsParamsDto): Promise<ProjectDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.getAllProjects( context, params );
    }

    @Get( '/:id' )
    @HttpCode( HttpStatus.OK )
    async getProjectById(@Headers() headers: any, @Request() request: any, @Param( 'id' ) id: string): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.getProjectById( context, id );
    }

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseAdminGuard()
    async createProject(@Headers() headers: any, @Request() request: any, @Body() data: CreateProjectDto): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.createProject( context, data );
    }

    @Patch( '/:id/users' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async assignEmployeesToProject(@Headers() headers: any, @Request() request: any, @Param( 'id' ) projectId: string, @Body() data: AssignUsersToProjectDto): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.assignUsersToProject( context, data, projectId );
    }

    @Patch( '/:id/coordinator' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async assignCoordinatorToProject(@Headers() headers: any, @Request() request: any, @Param( 'id' ) projectId: string, @Body() data: AssignCoordinatorToProjectDto): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.assignCoordinatorToProject( context, data, projectId );
    }
}
