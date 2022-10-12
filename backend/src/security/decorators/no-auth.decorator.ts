import { SetMetadata } from '@nestjs/common';
import { PUBLIC_ROUTE_KEY } from '@security/constants/auth.constants';

export const NoAuth = () => SetMetadata( PUBLIC_ROUTE_KEY, true );
