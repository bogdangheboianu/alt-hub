import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER } from '@shared/constants/pagination/pagination.constants';
import { Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { PaginatedResult } from '@shared/models/generics/paginated-result';
import { Result } from '@shared/models/generics/result';

export function paginatedResult<T>(result: T[] | null, totalRecords: number, currentPageNumber?: number, recordsPerPage?: number): Result<PaginatedResult<T>> {
    currentPageNumber = currentPageNumber ?? DEFAULT_PAGE_NUMBER;
    recordsPerPage = recordsPerPage ?? DEFAULT_ITEMS_PER_PAGE;
    const data = valueIsEmpty( result )
                 ? []
                 : result!;
    const hasPrevious = valueIsEmpty( result )
                        ? false
                        : currentPageNumber > 0;
    const totalPages = Math.ceil( totalRecords / recordsPerPage );
    const hasNext = valueIsEmpty( result )
                    ? false
                    : Number( currentPageNumber ) + 1 < totalPages;

    return Success( new PaginatedResult( { data, hasPrevious, hasNext, totalPages, totalRecords } ) );
}
