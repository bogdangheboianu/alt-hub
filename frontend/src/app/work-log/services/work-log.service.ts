import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateWorkLogDto } from '@dtos/create-work-log.dto';
import { CsvWorkLogDto } from '@dtos/csv-work-log.dto';
import { GetAllCsvWorkLogsParamsDto } from '@dtos/get-all-csv-work-logs-params.dto';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params.dto';
import { PaginatedWorkLogsDto } from '@dtos/paginated-work-logs.dto';
import { UpdateWorkLogDto } from '@dtos/update-work-log.dto';
import { WorkLogDto } from '@dtos/work-log.dto';
import { apiRoutes } from '@shared/constants/api.routes';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER } from '@shared/constants/pagination.constants';
import { ApiResult } from '@shared/models/api-result';
import { ApiService } from '@shared/services/api.service';
import { WorkLogStore } from '@work-log/store/work-log/work-log.store';
import { Observable } from 'rxjs';

@Injectable()
export class WorkLogService extends ApiService {
    constructor(private workLogStore: WorkLogStore) {
        super( workLogStore );
    }

    getPaginatedWorkLogs(params: GetPaginatedWorkLogsParamsDto): Observable<ApiResult<PaginatedWorkLogsDto>> {
        const httpParams = params
                           ? this.buildWorkLogsHttpParams( params )
                           : new HttpParams();
        return this.getWithParams( apiRoutes.workLogs, httpParams, this.workLogStore.onPaginatedWorkLogsLoaded.bind( this.workLogStore ) );
    }

    getAllCsvWorkLogs(params?: GetAllCsvWorkLogsParamsDto): Observable<ApiResult<CsvWorkLogDto[]>> {
        const httpParams = params
                           ? this.buildWorkLogsHttpParams( params, false )
                           : new HttpParams();
        return this.getWithParams( apiRoutes.csvWorkLogs, httpParams, this.workLogStore.onCsvWorkLogsLoaded.bind( this.workLogStore ) );
    }

    createWorkLog(data: CreateWorkLogDto): Observable<ApiResult<WorkLogDto>> {
        return this.post( apiRoutes.workLogs, data, this.workLogStore.onWorkLogCreated.bind( this.workLogStore ) );
    }

    updateWorkLog(id: string, data: UpdateWorkLogDto): Observable<ApiResult<WorkLogDto>> {
        return this.put( `${ apiRoutes.workLogs }/${ id }`, data, this.workLogStore.onWorkLogUpdated.bind( this.workLogStore ) );
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

        if( params?.fromDate ) {
            queryParams = queryParams.append( 'fromDate', params.fromDate.toDateString() );
        }

        if( params?.toDate ) {
            queryParams = queryParams.append( 'toDate', params.toDate.toDateString() );
        }

        return queryParams;
    }
}
