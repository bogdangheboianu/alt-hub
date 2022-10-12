import { ClientModule } from '@clients/client.module';
import { CompanyModule } from '@company/company.module';
import { ConfigurationModule } from '@configuration/configuration.module';
import { POSTGRES_DATABASE } from '@configuration/constants/database.constants';
import { ConfigurationService } from '@configuration/services/configuration.service';
import { EmailModule } from '@email/email.module';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { ProjectModule } from '@projects/project.module';
import { SearchModule } from '@search/search.module';
import { SecurityModule } from '@security/security.module';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';
import { HttpHeadersInterceptor } from '@shared/interceptors/http-headers.interceptor';
import { SharedModule } from '@shared/shared.module';
import { UserModule } from '@users/user.module';
import { WorkLogModule } from '@work-logs/work-log.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module( {
             imports  : [
                 ConfigurationModule.forRootAsync( {
                                                       useFactory: () => `${ process.env.NODE_ENV }.env`
                                                   } ),
                 TypeOrmCoreModule.forRootAsync( {
                                                     useFactory: (configurationService: ConfigurationService) => (
                                                         {
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
                                                             migrations         : [ `${ __dirname }/migrations/*{.ts,.js}` ],
                                                             migrationsTableName: configurationService.migrationsTable,
                                                             autoLoadEntities   : true,
                                                             cache              : true,
                                                             namingStrategy     : new SnakeNamingStrategy()
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
                 SearchModule
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
export class AppModule {
}
