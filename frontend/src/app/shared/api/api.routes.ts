import { environment } from '@environments/environment';

const apiUrl = environment.apiUrl;

export const apiRoutes = {
    auth     : {
        base : `${ apiUrl }/auth`,
        login: `${ apiUrl }/auth/login`
    },
    users    : {
        base        : `${ apiUrl }/users`,
        activateUser: `${ apiUrl }/users/activate`
    },
    clients  : {
        base: `${ apiUrl }/clients`
    },
    projects : {
        base: `${ apiUrl }/projects`
    },
    workLogs : {
        base          : `${ apiUrl }/work-logs`,
        workLogsImport: `${ apiUrl }/work-logs/import`,
        csvWorkLogs   : `${ apiUrl }/work-logs/csv`,
        recurrences   : `${ apiUrl }/work-logs/recurrences`
    },
    company  : {
        base           : `${ apiUrl }/company`,
        positions      : `${ apiUrl }/company/positions`,
        pricingProfiles: `${ apiUrl }/company/pricing-profiles`
    },
    fiscal   : {
        base                           : `${ apiUrl }/fiscal`,
        years                          : `${ apiUrl }/fiscal/years`,
        currentYear                    : `${ apiUrl }/fiscal/years/current`,
        currentYearAnnualEmployeeSheets: `${ apiUrl }/fiscal/years/current/annual-employee-sheets`,
        currentAnnualEmployeeSheet     : `${ apiUrl }/fiscal/current-annual-employee-sheet`
    },
    vacations: {
        base: `${ apiUrl }/vacations`
    },
    holidays: {
        base: `${ apiUrl }/holidays`
    },
    documents: {
        base: `${ apiUrl }/documents`
    },
    files    : {
        base: `${ apiUrl }/files`
    }
};
