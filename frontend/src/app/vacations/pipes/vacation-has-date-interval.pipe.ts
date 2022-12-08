import { Pipe, PipeTransform } from '@angular/core';
import { VacationDto } from '@dtos/vacation-dto';

@Pipe( { name: 'vacationHasDateInterval', pure: true } )
export class VacationHasDateIntervalPipe implements PipeTransform {
    transform(value: VacationDto): boolean {
        return value.fromDate !== value.toDate;
    }

}
