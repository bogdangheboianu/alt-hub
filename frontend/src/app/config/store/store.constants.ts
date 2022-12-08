export enum StoreNameEnum {
    Auth               = 'auth',
    Company            = 'company',
    Users              = 'users',
    Clients            = 'clients',
    Projects           = 'projects',
    WorkLogs           = 'work-logs',
    WorkLogRecurrences = 'work-log-recurrences',
    Fiscal             = 'fiscal',
    Vacations          = 'vacations',
    Documents          = 'documents',
    Files              = 'files',
    Holidays           = 'holidays'
}

export const Stores: StoreNameEnum[] = Object.values( StoreNameEnum );

export const PERSIST_STORAGE = 'persistStorage';
