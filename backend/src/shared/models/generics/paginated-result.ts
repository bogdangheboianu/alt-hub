import { IPaginationResult } from '@shared/interfaces/pagination/pagination-result.interface';

export class PaginatedResult<T> {
    data: T[];
    totalRecords: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;

    constructor(result: IPaginationResult<T>) {
        this.data = result.data;
        this.totalRecords = result.totalRecords;
        this.totalPages = result.totalPages;
        this.hasNext = result.hasNext;
        this.hasPrevious = result.hasPrevious;
    }
}
