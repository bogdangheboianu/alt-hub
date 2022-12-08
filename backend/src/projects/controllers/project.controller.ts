import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CreateProjectMemberDto } from '@projects/dtos/create-project-member.dto';
import { CreateProjectDto } from '@projects/dtos/create-project.dto';
import { GetAllProjectsParamsDto } from '@projects/dtos/get-all-projects-params.dto';
import { ProjectDto } from '@projects/dtos/project.dto';
import { UpdateProjectInfoDto } from '@projects/dtos/update-project-info.dto';
import { UpdateProjectMemberDto } from '@projects/dtos/update-project-member.dto';
import { UpdateProjectPricingDto } from '@projects/dtos/update-project-pricing.dto';
import { UpdateProjectTimelineDto } from '@projects/dtos/update-project-timeline.dto';
import { ProjectService } from '@projects/services/project.service';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { DeletedEntityResponseDto } from '@shared/dtos/deleted-entity-response.dto';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';

@Controller( 'projects' )
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
@ApiTags( SwaggerTagsEnum.Projects )
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

    @Get( ':id' )
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

    @Patch( ':id/info' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async updateProjectInfo(@Headers() headers: any, @Request() request: any, @Param( 'id' ) projectId: string, @Body() data: UpdateProjectInfoDto): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.updateProjectInfo( context, data, projectId );
    }

    @Patch( ':id/timeline' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async updateProjectTimeline(@Headers() headers: any, @Request() request: any, @Param( 'id' ) projectId: string, @Body() data: UpdateProjectTimelineDto): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.updateProjectTimeline( context, data, projectId );
    }

    @Patch( ':id/pricing' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async updateProjectPricing(@Headers() headers: any, @Request() request: any, @Param( 'id' ) projectId: string, @Body() data: UpdateProjectPricingDto): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.updateProjectPricing( context, data, projectId );
    }

    @Post( ':id/members' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async createProjectMember(@Headers() headers: any, @Request() request: any, @Param( 'id' ) projectId: string, @Body() data: CreateProjectMemberDto): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.createProjectMember( context, data, projectId );
    }

    @Patch( ':id/members/:memberId' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async updateProjectMember(@Headers() headers: any, @Request() request: any, @Param( 'id' ) projectId: string, @Param( 'memberId' ) memberId: string, @Body() data: UpdateProjectMemberDto): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.updateProjectMember( context, data, projectId, memberId );
    }

    @Delete( ':id/members/:memberId' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async deleteProjectMember(@Headers() headers: any, @Request() request: any, @Param( 'id' ) projectId: string, @Param( 'memberId' ) memberId: string): Promise<ProjectDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.deleteProjectMember( context, projectId, memberId );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseAdminGuard()
    async deleteProject(@Headers() headers: any, @Request() request: any, @Param( 'id' ) projectId: string): Promise<DeletedEntityResponseDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.projectService.deleteProject( context, projectId );
    }
}
