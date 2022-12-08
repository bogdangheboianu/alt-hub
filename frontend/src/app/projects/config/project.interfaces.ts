import { CreateProjectMemberDto } from '@dtos/create-project-member-dto';
import { ProjectInfoDto } from '@dtos/project-info-dto';
import { ProjectMemberDto } from '@dtos/project-member-dto';
import { ProjectPricingDto } from '@dtos/project-pricing-dto';
import { ProjectTimelineDto } from '@dtos/project-timeline-dto';
import { UpdateProjectInfoDto } from '@dtos/update-project-info-dto';
import { UpdateProjectMemberDto } from '@dtos/update-project-member-dto';
import { UpdateProjectPricingDto } from '@dtos/update-project-pricing-dto';
import { UpdateProjectTimelineDto } from '@dtos/update-project-timeline-dto';
import { ProjectTimelineField } from '@projects/config/project.types';
import { IFormModalData } from '@shared/config/constants/shared.interfaces';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { Observable } from 'rxjs';

export interface ProjectInfoUpdateFormModalData extends IFormModalData<UpdateProjectInfoDto> {
    initialValues: ProjectInfoDto;
    clientOptions$: Observable<SelectInputOptions>;
    clientOptionsLoading$: Observable<boolean>;
}

export interface ProjectTimelineUpdateFormModalData extends IFormModalData<UpdateProjectTimelineDto> {
    initialValues: ProjectTimelineDto;
    focusOnInput: ProjectTimelineField;
}

export interface ProjectPricingUpdateFormModalData extends IFormModalData<UpdateProjectPricingDto> {
    initialValues: ProjectPricingDto | null;
}

export interface ProjectMemberCreateFormModalData extends IFormModalData<CreateProjectMemberDto> {
    userOptions$: Observable<SelectInputOptions>;
    userOptionsLoading$: Observable<boolean>;
    pricingProfileOptions$: Observable<SelectInputOptions>;
    pricingProfileOptionsLoading$: Observable<boolean>;
    showAllocatedHoursInput: boolean;
}

export interface ProjectMemberUpdateFormModalData extends IFormModalData<UpdateProjectMemberDto> {
    initialValues: ProjectMemberDto;
    userOptions$: Observable<SelectInputOptions>;
    userOptionsLoading$: Observable<boolean>;
    pricingProfileOptions$: Observable<SelectInputOptions>;
    pricingProfileOptionsLoading$: Observable<boolean>;
    onDelete: () => void;
    showAllocatedHoursInput: boolean;
}
