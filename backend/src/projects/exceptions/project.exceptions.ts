import { BaseException } from '@shared/models/base-exception/base-exception';

export class DuplicateProjectNameException extends BaseException {
    name = 'duplicate_project_name';
    message = 'A project with this name already exists';
    field = 'name';
}

export class ProjectNotFoundException extends BaseException {
    name = 'project_not_found';
    message = 'No project was found with the given input';
}

export class InactiveProjectException extends BaseException {
    name = 'inactive_project';
    message = 'The project does not have an active status';
}

export class ProjectMemberNotFoundException extends BaseException {
    name = 'project_member_not_found';
    message = 'No project member was found with the given input';
    field = 'memberId';
}

export class InvalidProjectPricingException extends BaseException {
    name = 'invalid_project_pricing';
    message = 'Invalid project pricing';
}
