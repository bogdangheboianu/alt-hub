export const AppR = {
    auth     : {
        login: {
            full  : '/login',
            simple: 'login'
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
        details: {
            simple: ':id'
        },
        confirm: {
            full  : '/confirm-account',
            simple: 'confirm-account'
        }
    },
    client   : {
        list   : {
            full  : '/clients',
            simple: 'clients'
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
    }
};
