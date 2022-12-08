import { FileController } from '@files/controllers/file.controller';
import { FileEntity } from '@files/entities/file.entity';
import { GetFileByIdHandler } from '@files/queries/handlers/get-file-by-id.handler';
import { FileRepository } from '@files/repositories/file.repository';
import { FileService } from '@files/services/file.service';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

const Entities = [
    FileEntity
];

const Controllers = [
    FileController
];

const Repositories = [
    FileRepository
];

const Services = [
    FileService
];

const QueryHandlers = [
    GetFileByIdHandler
];

@Module( {
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule
             ],
             controllers: Controllers,
             providers  : [
                 ...Repositories,
                 ...Services,
                 ...QueryHandlers
             ]
         } )
export class FilesModule {
}
