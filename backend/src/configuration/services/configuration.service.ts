import { ENV_CONFIG_FILE_NAME } from '@configuration/constants/providers.constants';
import { EnvVariableNamesEnum } from '@configuration/enums/env-variable-names.enum';
import { IConfigurationValidation } from '@configuration/interfaces/configuration-validation.interface';
import { EnvConfig } from '@configuration/types/env-config.type';
import { Inject, Injectable } from '@nestjs/common';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { valueIsTrue } from '@shared/functions/value-is-true.function';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

@Injectable()
export class ConfigurationService {
    private readonly configuration: EnvConfig;
    private readonly envConfigFileName: string;

    constructor(@Inject( ENV_CONFIG_FILE_NAME ) envConfigFileName: string) {
        this.envConfigFileName = envConfigFileName;
        this.configuration = this.envConfigFileToConfiguration();
    }

    get appName(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.AppName );
    }

    get nodeEnv(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.NodeEnv );
    }

    get frontendBaseUrl(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.FrontendBaseUrl );
    }

    get dbHost(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.DbHost );
    }

    get dbPort(): number {
        return Number( this.getValueFromConfiguration( EnvVariableNamesEnum.DbPort ) );
    }

    get dbUser(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.DbUser );
    }

    get dbPassword(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.DbPassword );
    }

    get dbName(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.DbName );
    }

    get dbSchema(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.DbSchema );
    }

    get dbSync(): boolean {
        return valueIsTrue( this.getValueFromConfiguration( EnvVariableNamesEnum.DbSync ) );
    }

    get dbEnableSSL(): boolean {
        return valueIsTrue( this.getValueFromConfiguration( EnvVariableNamesEnum.DbEnableSSL ) );
    }

    get dbServerCA(): string | undefined {
        return this.getFileContentFromEnvVar( EnvVariableNamesEnum.DbServerCA, true );
    }

    get dbClientCert(): string | undefined {
        return this.getFileContentFromEnvVar( EnvVariableNamesEnum.DbClientCertificate, true );
    }

    get dbClientKey(): string | undefined {
        return this.getFileContentFromEnvVar( EnvVariableNamesEnum.DbClientPrivateKey, true );
    }

    get migrationsTable(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.MigrationsTable );
    }

    get jwtSecret(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.JwtSecret );
    }

    get emailServiceActive(): boolean {
        return valueIsTrue( this.getValueFromConfiguration( EnvVariableNamesEnum.EmailServiceActive ) );
    }

    get emailServerHost(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.EmailServerHost );
    }

    get emailServerPort(): number {
        return Number( this.getValueFromConfiguration( EnvVariableNamesEnum.EmailServerPort ) );
    }

    get emailServerSecure(): boolean {
        return valueIsTrue( this.getValueFromConfiguration( EnvVariableNamesEnum.EmailServerSecure ) );
    }

    get emailServerUser(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.EmailServerUser );
    }

    get emailServerPassword(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.EmailServerPassword );
    }

    get defaultEmailFrom(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.DefaultEmailFrom );
    }

    get holidaysApiUrl(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.HolidaysApiUrl );
    }

    get holidaysApiHost(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.HolidaysApiHost );
    }

    get holidaysApiKey(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.HolidaysApiKey );
    }

    get holidaysApiCountryCode(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.HolidaysApiCountryCode );
    }

    get refreshHolidaysOnStartup(): boolean {
        return valueIsTrue( this.getValueFromConfiguration( EnvVariableNamesEnum.RefreshHolidaysOnStartup ) );
    }

    get companyAdministrationEmails(): string[] {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.CompanyAdministrationEmails )
                   .split( ',' );
    }

    private envConfigFileToConfiguration(): EnvConfig {
        const configuration = this.readAndParseEnvConfigFile();
        const validation = this.validateConfiguration( configuration );

        if( !validation.isValid ) {
            throw new Error( validation.errorMessage );
        }

        return configuration;
    }

    private readAndParseEnvConfigFile(): EnvConfig {
        const file = fs.readFileSync( this.envConfigFileName );
        return dotenv.parse( file );
    }

    private getFileContentFromEnvVar(variableName: string, allowEmpty: boolean = false) {

        if( valueIsEmpty( variableName ) ) {
            throw new Error( 'variableName is null' );
        }

        const bufferData = this.getValueFromConfiguration( variableName, allowEmpty );

        if( valueIsEmpty( bufferData ) && allowEmpty ) {
            return;
        }

        if( !valueIsEmpty( bufferData ) ) {
            const buffer = Buffer.from( bufferData, 'base64' );
            return buffer.toString( 'utf8' );
        }

        if( allowEmpty ) {
            return undefined;
        }

        throw new Error( `Data not found for ${ variableName }` );
    }

    private validateConfiguration(configuration: EnvConfig): IConfigurationValidation {
        const validationSchema: Joi.ObjectSchema = Joi.object(
            {
                APP_NAME                     : Joi.string()
                                                  .required(),
                NODE_ENV                     : Joi.string()
                                                  .required(),
                FRONTEND_BASE_URL            : Joi.string()
                                                  .optional(),
                DB_HOST                      : Joi.string()
                                                  .optional(),
                DB_PORT                      : Joi.number()
                                                  .optional(),
                DB_USER                      : Joi.string()
                                                  .optional(),
                DB_PASSWORD                  : Joi.string()
                                                  .optional(),
                DB_NAME                      : Joi.string()
                                                  .optional(),
                DB_SCHEMA                    : Joi.string()
                                                  .optional(),
                DB_SYNC                      : Joi.boolean()
                                                  .required(),
                DB_ENABLE_SSL                : Joi.boolean()
                                                  .required(),
                DB_SERVER_CA                 : Joi.string()
                                                  .optional(),
                DB_CLIENT_CERTIFICATE        : Joi.string()
                                                  .optional(),
                DB_CLIENT_PRIVATE_KEY        : Joi.string()
                                                  .optional(),
                MIGRATIONS_TABLE             : Joi.string()
                                                  .required(),
                JWT_SECRET                   : Joi.string()
                                                  .optional(),
                EMAIL_SERVICE_ACTIVE         : Joi.boolean()
                                                  .optional(),
                EMAIL_SERVER_HOST            : Joi.string()
                                                  .optional(),
                EMAIL_SERVER_PORT            : Joi.number()
                                                  .optional(),
                EMAIL_SERVER_SECURE          : Joi.boolean()
                                                  .optional(),
                EMAIL_SERVER_USER            : Joi.string()
                                                  .optional(),
                EMAIL_SERVER_PASSWORD        : Joi.string()
                                                  .optional(),
                DEFAULT_EMAIL_FROM           : Joi.string()
                                                  .optional(),
                HOLIDAYS_API_URL             : Joi.string()
                                                  .optional(),
                HOLIDAYS_API_HOST            : Joi.string()
                                                  .optional(),
                HOLIDAYS_API_KEY             : Joi.string()
                                                  .optional(),
                HOLIDAYS_API_COUNTRY_CODE    : Joi.string()
                                                  .optional()
                                                  .default( 'RO' ),
                REFRESH_HOLIDAYS_ON_STARTUP  : Joi.boolean()
                                                  .optional()
                                                  .default( false ),
                COMPANY_ADMINISTRATION_EMAILS: Joi.string()
                                                  .optional()
            } );
        const { error } = validationSchema.validate( configuration, {
            allowUnknown: false,
            abortEarly  : true
        } );

        if( valueIsNotEmpty( error ) ) {
            return { isValid: false, errorMessage: error?.message };
        }

        return { isValid: true };
    }

    private getValueFromConfiguration(variableName: string, allowEmpty = false): string {
        // @ts-ignore
        const value = process.env[variableName] ?? this.configuration[variableName];

        if( valueIsEmpty( value ) && !allowEmpty ) {
            throw new Error( `Could not find any env value for [${ variableName }]` );
        }

        return value;
    }
}
