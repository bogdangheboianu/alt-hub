export interface IPaginationResult<T> {
    data: T[];
    totalRecords: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
