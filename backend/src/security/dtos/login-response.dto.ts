import { UserDto } from '@users/dtos/user.dto';

export class LoginResponseDto {
    accessToken!: string;
    refreshToken?: string;
    user!: UserDto;
}
