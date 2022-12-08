import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateWorkLogsDto } from '@dtos/create-work-logs-dto';
import { CsvWorkLogDto } from '@dtos/csv-work-log-dto';
import { DeletedEntityResponseDto } from '@dtos/deleted-entity-response-dto';
import { GetAllCsvWorkLogsParamsDto } from '@dtos/get-all-csv-work-logs-params-dto';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { PaginatedWorkLogsDto } from '@dtos/paginated-work-logs-dto';
import { UpdateWorkLogDto } from '@dtos/update-work-log-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { WorkLogsFileImportResultDto } from '@dtos/work-logs-file-import-result-dto';
import { ApiResult } from '@shared/api/api-result';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiService } from '@shared/api/api.service';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER } from '@shared/config/constants/shared.constants';
import { WorkLogStore } from '@work-logs/data/work-log.store';
import { Observable } from 'rxjs';

@Injectable()
export class WorkLogApiService extends ApiService {
    constructor(private workLogStore: WorkLogStore) {
        super( workLogStore );
    }

    getPaginatedWorkLogs(params: GetPaginatedWorkLogsParamsDto): Observable<ApiResult<PaginatedWorkLogsDto>> {
        const httpParams = params
                           ? this.buildWorkLogsHttpParams( params )
                           : new HttpParams();
        return this.getWithParams( apiRoutes.workLogs.base, httpParams, this.workLogStore.onPaginatedWorkLogsLoaded.bind( this.workLogStore ) );
    }

    getAllCsvWorkLogs(params?: GetAllCsvWorkLogsParamsDto): Observable<ApiResult<CsvWorkLogDto[]>> {
        const httpParams = params
                           ? this.buildWorkLogsHttpParams( params, false )
                           : new HttpParams();
        return this.getWithParams( apiRoutes.workLogs.csvWorkLogs, httpParams, this.workLogStore.onCsvWorkLogsLoaded.bind( this.workLogStore ) );
    }

    createWorkLogs(data: CreateWorkLogsDto): Observable<ApiResult<WorkLogDto[]>> {
        return this.post( apiRoutes.workLogs.base, data );
    }

    updateWorkLog(id: string, data: UpdateWorkLogDto): Observable<ApiResult<WorkLogDto>> {
        return this.put( `${ apiRoutes.workLogs.base }/${ id }`, data );
    }

    deleteWorkLog(id: string): Observable<ApiResult<DeletedEntityResponseDto>> {
        return this.delete( `${ apiRoutes.workLogs.base }/${ id }` );
    }

    importWorkLogsFromFile(file: File): Observable<ApiResult<WorkLogsFileImportResultDto>> {
        const formData = new FormData();
        formData.append( 'file', file );

        return this.postWithFormData( apiRoutes.workLogs.workLogsImport, formData, this.workLogStore.onWorkLogsImportedFromFile.bind( this.workLogStore ) );
    }

    private buildWorkLogsHttpParams(params: GetPaginatedWorkLogsParamsDto | GetAllCsvWorkLogsParamsDto, withPagination = true): HttpParams {
        let queryParams = new HttpParams();

        if( withPagination ) {
            queryParams = queryParams.append( 'pageNumber',
                                              (
                                                  params as GetPaginatedWorkLogsParamsDto
                                              ).pageNumber ?? DEFAULT_PAGE_NUMBER );
            queryParams = queryParams.append( 'itemsPerPage',
                                              (
                                                  params as GetPaginatedWorkLogsParamsDto
                                              ).itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE );
        }

        if( params?.userId ) {
            queryParams = queryParams.append( 'userId', params.userId );
        }

        if( params?.projectId ) {
            queryParams = queryParams.append( 'projectId', params.projectId );
        }

        if( params?.clientId ) {
            queryParams = queryParams.append( 'clientId', params.clientId );
        }

        if( params?.fromDate ) {
            queryParams = queryParams.append( 'fromDate', params.fromDate );
        }

        if( params?.toDate ) {
            queryParams = queryParams.append( 'toDate', params.toDate );
        }

        return queryParams;
    }
}
