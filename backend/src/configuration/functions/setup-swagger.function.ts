import { ClientModule } from '@clients/client.module';
import { CompanyModule } from '@company/company.module';
import { SwaggerTagsEnum } from '@configuration/enums/swagger-tags.enum';
import { DocumentsModule } from '@documents/documents.module';
import { GetAllDocumentsParamsDto } from '@documents/dtos/get-all-documents-params.dto';
import { FilesModule } from '@files/files.module';
import { GetCurrentAnnualEmployeeSheetParamsDto } from '@fiscal/dtos/get-current-annual-employee-sheet-params.dto';
import { FiscalModule } from '@fiscal/fiscal.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GetAllProjectsParamsDto } from '@projects/dtos/get-all-projects-params.dto';
import { ProjectModule } from '@projects/project.module';
import { SecurityModule } from '@security/security.module';
import { HttpErrorResponseDto } from '@shared/dtos/http-error-response.dto';
import { PaginatedResultDto } from '@shared/dtos/paginated-result.dto';
import { PaginationParamsDto } from '@shared/dtos/pagination-params.dto';
import { GetAllUsersParamsDto } from '@users/dtos/get-all-users-params.dto';
import { UserModule } from '@users/user.module';
import { GetAllVacationsParamsDto } from '@vacations/dtos/get-all-vacations-params.dto';
import { VacationsModule } from '@vacations/vacations.module';
import { GetAllCsvWorkLogsParamsDto } from '@work-logs/dtos/get-all-csv-work-logs-params.dto';
import { GetPaginatedWorkLogsParamsDto } from '@work-logs/dtos/get-paginated-work-logs-params.dto';
import { WorkLogModule } from '@work-logs/work-log.module';

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle( 'Altamira Hub' )
        .setVersion( '1.0' )
        .addBearerAuth()
        .addTag( SwaggerTagsEnum.Auth )
        .addTag( SwaggerTagsEnum.Company )
        .addTag( SwaggerTagsEnum.Users )
        .addTag( SwaggerTagsEnum.Clients )
        .addTag( SwaggerTagsEnum.Projects )
        .addTag( SwaggerTagsEnum.WorkLogs )
        .addTag( SwaggerTagsEnum.Vacations )
        .addTag( SwaggerTagsEnum.Holidays )
        .addTag( SwaggerTagsEnum.Fiscal )
        .addTag( SwaggerTagsEnum.Documents )
        .addTag( SwaggerTagsEnum.Files )
        .build();

    const document = SwaggerModule.createDocument( app, config, {
        include    : [
            SecurityModule,
            CompanyModule,
            UserModule,
            ClientModule,
            ProjectModule,
            WorkLogModule,
            VacationsModule,
            FiscalModule,
            DocumentsModule,
            FilesModule
        ],
        extraModels: [
            GetAllVacationsParamsDto,
            GetAllCsvWorkLogsParamsDto,
            GetPaginatedWorkLogsParamsDto,
            GetAllUsersParamsDto,
            GetAllProjectsParamsDto,
            GetCurrentAnnualEmployeeSheetParamsDto,
            HttpErrorResponseDto,
            PaginatedResultDto,
            PaginationParamsDto,
            GetAllDocumentsParamsDto
        ]
    } );

    SwaggerModule.setup( 'swagger', app, document );
}
