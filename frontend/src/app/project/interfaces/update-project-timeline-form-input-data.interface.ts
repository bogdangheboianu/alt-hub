import { ProjectTimelineDto } from '@dtos/project-timeline.dto';

export interface IUpdateProjectTimelineFormInputData {
    projectId: string;
    initialValues: ProjectTimelineDto;
}
