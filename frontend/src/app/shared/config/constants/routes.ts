export const AppR = {
    root     : '/',
    auth     : {
        login      : {
            full  : '/login',
            simple: 'login'
        },
        setPassword: {
            full  : '/activate-account',
            simple: 'activate-account'
        }
    },
    dashboard: {
        full  : '/dashboard',
        simple: 'dashboard'
    },
    user     : {
        list   : {
            full  : '/employees',
            simple: 'employees'
        },
        create : {
            full  : '/employees/create',
            simple: 'create'
        },
        details: {
            simple: ':id'
        }
    },
    client   : {
        list   : {
            full  : '/clients',
            simple: 'clients'
        },
        create : {
            full  : '/clients/create',
            simple: 'create'
        },
        details: {
            simple: ':id'
        }
    },
    project  : {
        list   : {
            full  : '/projects',
            simple: 'projects'
        },
        create : {
            full  : '/projects/create',
            simple: 'create'
        },
        details: {
            simple: ':id'
        }
    },
    company  : {
        full  : '/company',
        simple: 'company'
    },
    workLog  : {
        list: {
            full  : '/work-logs',
            simple: 'work-logs'
        }
    },
    vacation : {
        list: {
            full  : '/vacations',
            simple: 'vacations'
        }
    }
};
