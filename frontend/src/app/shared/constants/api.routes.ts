const apiUrl = 'http://localhost:3000';

export const apiRoutes = {
    auth              : {
        login: `${ apiUrl }/auth/login`
    },
    users             : `${ apiUrl }/users`,
    confirmUser       : `${ apiUrl }/users/confirm`,
    clients           : `${ apiUrl }/clients`,
    projects          : `${ apiUrl }/projects`,
    workLogs          : `${ apiUrl }/work-logs`,
    csvWorkLogs       : `${ apiUrl }/work-logs/csv`,
    workLogRecurrences: `${ apiUrl }/work-logs/recurrences`,
    company           : `${ apiUrl }/company`
};
