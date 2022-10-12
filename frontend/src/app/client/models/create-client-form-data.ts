import { FormControl, Validators } from '@angular/forms';
import { CreateClientDto } from '@dtos/create-client.dto';
import { AppFormData } from '@shared/interfaces/form.interface';

export class CreateClientFormData implements AppFormData<CreateClientDto> {
    name = new FormControl<string | null>( '', Validators.required );
}
