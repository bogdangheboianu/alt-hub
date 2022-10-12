import { FormControl, Validators } from '@angular/forms';
import { ClientDto } from '@dtos/client.dto';
import { UpdateClientDto } from '@dtos/update-client.dto';
import { AppFormData } from '@shared/interfaces/form.interface';

export class UpdateClientFormData implements AppFormData<UpdateClientDto> {
    name: FormControl<string | null>;

    constructor(client: ClientDto) {
        this.name = new FormControl<string | null>( client.name, Validators.required );
    }
}
