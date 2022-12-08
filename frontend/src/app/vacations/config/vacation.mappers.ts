import { VacationTypeEnum } from '@dtos/vacation-type-enum';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { startCase } from 'lodash-es';

export const vacationTypesToSelectInputOptions = (): SelectInputOptions => {
    return Object.values( VacationTypeEnum )
                 .map( v => (
                     { id: v, name: startCase( v.replace( '_', ' ' ) ) }
                 ) );
};
