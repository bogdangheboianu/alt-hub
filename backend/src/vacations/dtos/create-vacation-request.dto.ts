import { ApiProperty } from '@nestjs/swagger';
import { VacationTypeEnum } from '@vacations/enums/vacation-type.enum';

export class CreateVacationRequestDto {
    @ApiProperty( { enum: VacationTypeEnum, enumName: 'VacationTypeEnum' } )
    type!: VacationTypeEnum;
    reason?: string | null;
    fromDate!: Date;
    toDate!: Date;
}
