import { FormControl } from '@angular/forms';
import { CreateProjectTimelineDto } from '@dtos/create-project-timeline.dto';
import { AppFormData } from '@shared/interfaces/form.interface';

export class CreateProjectTimelineFormData implements AppFormData<CreateProjectTimelineDto> {
    startDate: FormControl<Date | null>;
    endDate: FormControl<Date | null>;
    deadline: FormControl<Date | null>;

    constructor(timeline: CreateProjectTimelineDto | null) {
        this.startDate = new FormControl<Date | null>( timeline?.startDate ?? null );
        this.endDate = new FormControl<Date | null>( timeline?.endDate ?? null );
        this.deadline = new FormControl<Date | null>( timeline?.deadline ?? null );
    }
}
