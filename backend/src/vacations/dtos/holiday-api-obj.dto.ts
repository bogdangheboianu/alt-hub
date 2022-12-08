export enum HolidayApiObjTypeEnum {
    Public  = 'Public',
    Private = 'Private'
}

export class HolidayApiObjDto {
    date!: string;
    localName!: string;
    name!: string;
    countryCode!: string;
    fixed!: boolean;
    global!: boolean;
    counties!: string[] | null;
    launchYear!: number | null;
    type!: HolidayApiObjTypeEnum;
}
