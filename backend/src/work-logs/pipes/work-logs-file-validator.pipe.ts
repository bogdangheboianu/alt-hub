import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class WorkLogsFileValidatorPipe implements PipeTransform {
    transform(value: Express.Multer.File, metadata: ArgumentMetadata): boolean {
        const oneKb = 1000;
        const oneMb = oneKb * 1000;
        const fileSize = value.size;
        const fileType = value.mimetype;

        return fileSize < oneMb && fileType === 'text/csv';
    }
}
