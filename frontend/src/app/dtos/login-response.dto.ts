import { UserDto } from '@dtos/user.dto';

export class LoginResponseDto {
    accessToken!: string;
    refreshToken?: string;
    user!: UserDto;
}
