import { ModuleMetadata } from '@nestjs/common';

export interface IConfigurationModuleOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: () => string;
    inject?: any;
}
