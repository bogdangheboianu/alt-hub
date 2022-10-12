import { ClientDto } from '@clients/dtos/client.dto';
import { CreateClientDto } from '@clients/dtos/create-client.dto';
import { UpdateClientDto } from '@clients/dtos/update-client.dto';
import { ClientService } from '@clients/services/client.service';
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UseAdminGuard } from '@security/guards/is-admin.guard';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseController } from '@shared/models/generics/base-controller';

@Controller( 'clients' )
@UseAdminGuard()
@ApiBearerAuth()
@ApiHeader( { name: CustomHttpHeaders.CorrelationId.header } )
export class ClientController extends BaseController {
    constructor(private readonly clientService: ClientService) {
        super();
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    async getAllClients(@Headers() headers: any, @Request() request: any): Promise<ClientDto[]> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.clientService.getAllClients( context );
    }

    @Get( '/:id' )
    @HttpCode( HttpStatus.OK )
    async getClientById(@Headers() headers: any, @Request() request: any, @Param( 'id' ) id: string): Promise<ClientDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.clientService.getClientById( context, id );
    }

    @Post()
    @HttpCode( HttpStatus.CREATED )
    async createClient(@Headers() headers: any, @Request() request: any, @Body() data: CreateClientDto): Promise<ClientDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.clientService.createClient( context, data );
    }

    @Put( '/:id' )
    @HttpCode( HttpStatus.OK )
    async updateClient(@Headers() headers: any, @Request() request: any, @Body() data: UpdateClientDto, @Param( 'id' ) id: string): Promise<ClientDto> {
        const context = this.getContext<AuthenticatedContext>( headers, request );
        return await this.clientService.updateClient( context, data, id );
    }
}
