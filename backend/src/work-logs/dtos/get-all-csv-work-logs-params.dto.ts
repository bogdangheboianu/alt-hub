import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class GetAllCsvWorkLogsParamsDto {
    fromDate?: Date;
    toDate?: Date;
    userId?: string;
    projectId?: string;
    clientId?: string;
}
