import { getWeekDay } from '@shared/functions/get-week-day.function';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';
import { CreateHolidayDto } from '@vacations/dtos/create-holiday.dto';
import { HolidayApiObjDto } from '@vacations/dtos/holiday-api-obj.dto';
import { HolidayDto } from '@vacations/dtos/holiday.dto';
import { Holiday } from '@vacations/models/holiday';
import dayjs from 'dayjs';

export const holidayApiObjToCreateHolidayDto = (holidayApiObj: HolidayApiObjDto): CreateHolidayDto => (
    {
        name   : holidayApiObj.name,
        date   : dayjs( holidayApiObj.date )
            .toDate(),
        weekDay: getWeekDay( holidayApiObj.date )
    }
);

export const holidayApiObjsToCreateHolidayDtoList = (holidayApiObjs: HolidayApiObjDto[]): CreateHolidayDto[] => holidayApiObjs.map( holidayApiObjToCreateHolidayDto );

export const modelToHolidayDto = (model: Holiday): HolidayDto => (
    {
        id     : model.id.getValue(),
        name   : model.name.getValue(),
        date   : model.date.getValue(),
        weekDay: model.weekDay.getValue(),
        audit  : modelToAuditDto( model.audit )
    }
);

export const modelsToHolidayDtoList = (models: Holiday[]): HolidayDto[] => models.map( modelToHolidayDto );
