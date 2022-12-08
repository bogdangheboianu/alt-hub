import { ClientModule } from '@clients/client.module';
import { CompanyModule } from '@company/company.module';
import { ConfigurationModule } from '@configuration/configuration.module';
import { POSTGRES_DATABASE } from '@configuration/constants/database.constants';
import { ConfigurationService } from '@configuration/services/configuration.service';
import { DocumentsModule } from '@documents/documents.module';
import { EmailModule } from '@email/email.module';
import { FilesModule } from '@files/files.module';
import { FiscalModule } from '@fiscal/fiscal.module';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { ProjectModule } from '@projects/project.module';
import { SearchModule } from '@search/search.module';
import { SecurityModule } from '@security/security.module';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';
import { HttpHeadersInterceptor } from '@shared/interceptors/http-headers.interceptor';
import { InternalContext } from '@shared/models/context/internal-context';
import { SharedModule } from '@shared/shared.module';
import { UserModule } from '@users/user.module';
import { HolidayService } from '@vacations/services/holiday.service';
import { VacationsModule } from '@vacations/vacations.module';
import { WorkLogModule } from '@work-logs/work-log.module';
import dayjs from 'dayjs';
//@ts-ignore
import dayjsBusinessDays from 'dayjs-business-days';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module( {
             imports  : [
                 ConfigurationModule.forRootAsync( {
                                                       useFactory: () => `${ process.env.NODE_ENV }.env`
                                                   } ),
                 TypeOrmCoreModule.forRootAsync( {
                                                     useFactory: (configurationService: ConfigurationService) => (
                                                         {
                                                             verboseRetryLog    : true,
                                                             logging            : [ 'info', 'migration' ],
                                                             logNotifications   : true,
                                                             applicationName    : configurationService.appName,
                                                             type               : POSTGRES_DATABASE,
                                                             host               : configurationService.dbHost,
                                                             port               : configurationService.dbPort,
                                                             username           : configurationService.dbUser,
                                                             password           : configurationService.dbPassword,
                                                             database           : configurationService.dbName,
                                                             schema             : configurationService.dbSchema,
                                                             synchronize        : configurationService.dbSync,
                                                             entities           : [ `${ __dirname }/**/*.entity{.ts,.js}` ],
                                                             migrations         : [ `${ __dirname }/migrations/*.{js, ts}` ],
                                                             migrationsTableName: configurationService.migrationsTable,
                                                             autoLoadEntities   : true,
                                                             cache              : true,
                                                             namingStrategy     : new SnakeNamingStrategy(),
                                                             ssl                : configurationService.dbEnableSSL
                                                                                  ? {
                                                                     checkServerIdentity: (servername: any, cert: any) => {
                                                                         if( cert.subject.CN.indexOf( 'altamira-hub-db' ) >= 0 || cert.subject.CN === 'pg-server' ) {
                                                                             return undefined;
                                                                         }

                                                                         return new Error( `checkServerIdentity failed. CN: ${ cert.subject.CN } is not expected` );
                                                                     },
                                                                     // rejectUnauthorized: false,
                                                                     ca  : configurationService.dbServerCA,
                                                                     cert: configurationService?.dbClientCert,
                                                                     key : configurationService?.dbClientKey
                                                                 }
                                                                                  : undefined
                                                         }
                                                     ),
                                                     imports   : [ ConfigurationModule ],
                                                     inject    : [ ConfigurationService ]
                                                 } ),
                 ScheduleModule.forRoot(),
                 SharedModule,
                 UserModule,
                 SecurityModule,
                 CompanyModule,
                 EmailModule,
                 ProjectModule,
                 ClientModule,
                 WorkLogModule,
                 SearchModule,
                 VacationsModule,
                 FiscalModule,
                 DocumentsModule,
                 FilesModule
             ],
             providers: [
                 {
                     provide : APP_FILTER,
                     useClass: GlobalExceptionFilter
                 },
                 {
                     provide : APP_INTERCEPTOR,
                     useClass: HttpHeadersInterceptor
                 }
             ]
         } )
export class AppModule implements OnModuleInit {
    private readonly logger = new Logger( AppModule.name );

    constructor(
        private readonly dataSource: DataSource,
        private readonly configurationService: ConfigurationService,
        private readonly holidayService: HolidayService
    ) {
    }

    async onModuleInit(): Promise<any> {
        await this.dataSource.runMigrations();

        if( this.configurationService.refreshHolidaysOnStartup ) {
            setTimeout( async () => {
                const holidays = await this.holidayService.refreshHolidays( new InternalContext() );
                this.logger.log( `${ holidays.length } holidays refreshed` );
            }, 3000 );
        }

        dayjs.extend( dayjsBusinessDays );
    }
}
