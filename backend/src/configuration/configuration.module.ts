import { ENV_CONFIG_FILE_NAME } from '@configuration/constants/providers.constants';
import { IConfigurationModuleOptions } from '@configuration/interfaces/configuration-module-options.interface';
import { ConfigurationService } from '@configuration/services/configuration.service';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

@Global()
@Module( {} )
export class ConfigurationModule {
    static forRootAsync(options: IConfigurationModuleOptions): DynamicModule {
        return {
            module   : ConfigurationModule,
            providers: [ ConfigurationService, ...this.createProviders( options ) ],
            exports  : [ ConfigurationService ]
        };
    }

    private static createProviders(options: IConfigurationModuleOptions): Provider[] {
        return [
            {
                provide   : ENV_CONFIG_FILE_NAME,
                useFactory: options.useFactory,
                inject    : options?.inject || []
            }
        ];
    }
}
