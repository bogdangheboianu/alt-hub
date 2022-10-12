import { ProjectDto } from '@dtos/project.dto';
import { ISelectInputOption, SelectInputOptions } from '@shared/interfaces/select-input-option.interface';

export const projectToSelectInputOption = (project: ProjectDto): ISelectInputOption => (
    { id: project.id, name: project.info.name }
);

export const projectsToSelectInputOptions = (projects: ProjectDto[]): SelectInputOptions => projects.map( projectToSelectInputOption );
