import { CsvWorkLogDto } from '@work-logs/dtos/csv-work-log.dto';
import { CsvWorkLog } from '@work-logs/models/csv-work-log';

export const modelToCsvWorkLogDto = (model: CsvWorkLog): CsvWorkLogDto => (
    {
        date        : model.getValue()
                           .date
                           .toString(),
        projectName : model.getValue()
                           .projectName
                           .getValue(),
        hoursLogged : model.getValue()
                           .hoursLogged
                           .getValue(),
        userFullName: model.getValue().userFullName.joined,
        description: model.getValue()
                          .description
                          ?.getValue() ?? null
    }
);

export const modelsToCsvWorkLogDtoList = (models: CsvWorkLog[]): CsvWorkLogDto[] => models.map( modelToCsvWorkLogDto );
