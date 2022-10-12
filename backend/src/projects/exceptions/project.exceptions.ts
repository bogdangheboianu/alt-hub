import { BaseException } from '@shared/models/base-exception/base-exception';

export class DuplicateProjectNameException extends BaseException {
    name = 'duplicate_project_name';
    message = 'A project with this name already exists';

    constructor() {
        super( 'name' );

    }
}

export class ProjectNotFoundException extends BaseException {
    name = 'project_not_found';
    message = 'No project was found with the given input';
}

export class InactiveProjectException extends BaseException {
    name = 'inactive_project';
    message = 'The project does not have an active status';
}

export class NotOngoingProjectException extends BaseException {
    name = 'not_ongoing_project';
    message = 'The project does not have an ongoing status';
}

export class ForbiddenAccessToProjectException extends BaseException {
    name = 'forbidden_access_to_project';
    message = 'Forbidden access to project';
}
