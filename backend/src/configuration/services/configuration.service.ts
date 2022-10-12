import { ENV_CONFIG_FILE_NAME } from '@configuration/constants/providers.constants';
import { EnvVariableNamesEnum } from '@configuration/enums/env-variable-names.enum';
import { IConfigurationValidation } from '@configuration/interfaces/configuration-validation.interface';
import { EnvConfig } from '@configuration/types/env-config.type';
import { Inject, Injectable } from '@nestjs/common';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
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
        return Boolean( this.getValueFromConfiguration( EnvVariableNamesEnum.DbSync ) );
    }

    get migrationsTable(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.MigrationsTable );
    }

    get jwtSecret(): string {
        return this.getValueFromConfiguration( EnvVariableNamesEnum.JwtSecret );
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

    private validateConfiguration(configuration: EnvConfig): IConfigurationValidation {
        const validationSchema: Joi.ObjectSchema = Joi.object(
            {
                APP_NAME        : Joi.string()
                                     .required(),
                NODE_ENV        : Joi.string()
                                     .required(),
                DB_HOST         : Joi.string()
                                     .required(),
                DB_PORT         : Joi.number()
                                     .required(),
                DB_USER         : Joi.string()
                                     .required(),
                DB_PASSWORD     : Joi.string()
                                     .required(),
                DB_NAME         : Joi.string()
                                     .required(),
                DB_SCHEMA       : Joi.string()
                                     .required(),
                DB_SYNC         : Joi.boolean()
                                     .required(),
                MIGRATIONS_TABLE: Joi.string()
                                     .required(),
                JWT_SECRET      : Joi.string()
                                     .required()
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

    private getValueFromConfiguration(variableName: string): string {
        // @ts-ignore
        const value = this.configuration[variableName] ?? process[variableName];

        if( valueIsEmpty( value ) ) {
            throw new Error( `Could not find any env value for [${ variableName }]` );
        }

        return value;
    }
}
