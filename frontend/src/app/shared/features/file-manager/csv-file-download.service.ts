import { Injectable } from '@angular/core';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
import { IFileDownloadService } from '@shared/features/file-manager/file-manager.interfaces';
import { saveAs } from 'file-saver';

const CSV_FILE_TYPE = 'text/csv';
const CSV_FILE_EXT = '.csv';

@Injectable()
export class CsvFileDownloadService implements IFileDownloadService {
    download(data: any[], fileName?: string): void {
        const csvArray = this.buildCsv( data );
        const blob = new Blob( [ csvArray ], { type: CSV_FILE_TYPE } );
        fileName = fileName
                   ? this.cleanUpFileName( fileName )
                   : this.generateFileName();
        saveAs( blob, fileName );
    }

    private buildCsv(data: any[]): string {
        const replacer = (key: string, value: any) => valueIsEmpty( value )
                                                      ? ''
                                                      : value;
        const header = Object.keys( data[0] );
        const csv = data.map( row => header.map( fieldName => JSON.stringify( row[fieldName], replacer ) ) );
        csv.unshift( [ header.join( ',' ) ] );

        return csv.join( '\r\n' );
    }

    private cleanUpFileName(fileName: string): string {
        if( fileName.includes( '.' ) ) {
            const [ name ] = fileName.split( '.' );
            return `${ name.trim() }${ CSV_FILE_EXT }`;
        }

        return `${ fileName.trim() }${ CSV_FILE_EXT }`;
    }

    private generateFileName(): string {
        return `alt-hub-${ Date.now() }${ CSV_FILE_EXT }`;
    }
}
